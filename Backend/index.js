import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import User from "./userSchema.js";
import Cart from "./CartSchema.js";
import Order from "./OrderSchema.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.port || 5000;
const SECRET_KEY = process.env.SECRET_KEY;
app.use(bodyParser.json());
const url = process.env.url;

app.use(
  cors({
    // origin: "https://snap-mart.netlify.app",
    origin: "http://localhost:3000",
    methods: "GET,POST",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.get("/", (req, res) => {
  res.send("Welcome to backend , the hidden world beneath a website");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "No user registered with this email" });
    }

    if (user.password !== password) {
      return res.json({ message: "Wrong password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { email: email }, // Payload
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ No cookies, send token in response
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/home", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({
      authenticated: true,
      message: `Welcome ${decoded.email} to the Home page!`,
    });
  } catch (error) {
    res.status(401).json({
      authenticated: false,
      message: "Invalid token",
    });
  }
});

app.post("/signup", async (req, res) => {
  const { email, username, address, password } = req.body;

  if (!email || !username || !address || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user
    const newUser = await User.create({ email, username, address, password });
    console.log("New user added:", newUser);

    // Generate JWT token
    const token = jwt.sign({ email: newUser.email }, SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({ message: "Signup successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

app.get("/token", (req, res) => {
  const token = req.cookies.authToken; // Extract the token
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
    res.json({ authenticated: true, email: decoded.email });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.json({ authenticated: false });
  }
});

app.post("/cart", async (req, res) => {
  console.log("Request received at /cart"); 
  const { id } = req.body;
  const token = req.cookies.authToken;

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { email } = decoded;

    // Check if the cart document exists for the user
    let userCart = await Cart.findOne({ email });

    if (!userCart) {
      console.log("Cart not found, creating a new cart for the user");
      // Create a new cart document if it doesn't exist
      userCart = await Cart.create({
        email,
        cart: [id], // Initialize cart with the given item
      });
      return res.status(201).json({
        message: "Cart created and item added",
        cart: userCart.cart,
      });
    }

    // Update the user's cart with the new item
    const updatedUser = await Cart.findOneAndUpdate(
      { email },
      { $addToSet: { cart: id } }, // Add the product ID to the cart array
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Item added to cart",
      cart: updatedUser.cart,
    });
  } catch (error) {
    console.error("Error:", error);

    // Handle token-related errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/payment/order", async (req, res) => {
  console.log("order");
  const { amount } = req.body;

  try {
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: razorpay.key_id,
    });
  } catch (error) {
    console.log(error);
  }
});

// Verify payment
app.post("/api/payment/verify", (req, res) => {
  console.log("verify");
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const generatedSignature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});

// app.post("/addOrder", async (req, res) => {
//   try {
//     const token = req.cookies.authToken;

//     const decoded = jwt.verify(token, SECRET_KEY);
//     const { email } = decoded;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const address = user.address;

//     const {details} = req.body;
//     console.log(checkType(details));
//     console.log(details , "details");
//     const orderPromises = details.map(async (product) => {
//       const response = await fetch(
//         `https://dummyjson.com/products/${product.id}`
//       );
//       const prod = await response.json();

//       return Order.findOneAndUpdate(
//         { email },
//         {
//           $push: {
//             order: {
//               id: prod.id,
//               orderDate: new Date(),
//               status: "ordered",
//               address,
//             },
//           },
//         },
//         { new: true, upsert: true }
//       );
//     });

//     await Promise.all(orderPromises);

//     const updatedOrders = await Promise.all(orderPromises);

//     res
//       .status(200)
//       .json({ message: "Orders updated successfully", updatedOrders });
//   } catch (error) {
//     console.error("Error updating orders:", error);
//     res.status(500).json({ message: "Failed to update orders", error });
//   }
// });

app.get("/pastOrders", async (req, res) => {
  try {
    const token = req.cookies.authToken;

    // Check if the token exists
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { email } = decoded;

    // Fetch orders from the database
    const orders = await Order.find({ email });
    console.log(orders);
    if (!orders || orders.length === 0) {
      return res.json({ message: "No orders placed", orders: null });
    }

    // Respond with the fetched orders
    res.json({ message: "Items fetched successfully", orders: orders });
  } catch (error) {
    console.error("Error fetching past orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/fetchcart", async (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { email } = decoded;

    // Find the user's cart
    const userCart = await Cart.findOne({ email });

    if (!userCart || !userCart.cart || userCart.cart.length === 0) {
      return res.json({ message: "No items in cart", cart: [] });
    }

    res.json({ message: "Response sent", cart: userCart.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/removeFromCart", async (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { email } = decoded;

    const { id } = req.body; // Destructure 'id' from the request body
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find and update the cart
    const updatedUser = await Cart.findOneAndUpdate(
      { email },
      { $pull: { cart: id } }, // Remove the product ID from the cart array
      { new: true } // Return the updated document
    );

    if (!updatedUser || !updatedUser.cart) {
      return res
        .status(404)
        .json({ message: "User or cart not found", cart: [] });
    }

    res.json({ message: "success", cart: updatedUser.cart });
  } catch (error) {
    console.error("Error updating cart:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
