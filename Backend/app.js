import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import User from "./userSchema.js";
import Cart from "./CartSchema.js";
import Order from "./OrderSchema.js";
import mongoose from "mongoose";
const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key";

const url =
  "mongodb+srv://test-user:Proml2006@webp.tnwerul.mongodb.net/snapmart";

app.use(
  cors({
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
      return res.json({ message: "wrong passsword" });
    }
    const token = jwt.sign(
      {
        email: email, //user.email
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("authToken", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/home", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: `Welcome ${decoded.email} to the Home page!` });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});
app.post("/signup", async (req, res) => {
  const { email, username, address, password } = req.body;

  if (!email || !username || !address || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({ email, username, address, password });
    console.log("New user added:", newUser);

    const token = jwt.sign({ email: newUser.email }, SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("authToken", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

app.post("/cart", async (req, res) => {
  console.log("Request received at /cart"); // Debug log
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

app.get("pastOrders", (req, res) => {
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, SECRET_KEY);
  const { email } = decoded;
  const orders = Order.findOne({ email: email }).orders;
  if (!orders) {
    return res.json({ message: "no orders placed", orders: null });
  }
  
  res.json({ message: "items fetched successfully ", orders: orders });
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
