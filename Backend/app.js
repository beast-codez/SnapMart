import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import User from "./userSchema.js";
import Cart from './CartSchema.js';
const app = express();
const PORT = 5000;
const SECRET_KEY = "iamlalith";

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

// mongoose
//   .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Failed to connect to MongoDB", err));

app.get('/', (req,res)=>{
  res.send("Welcome to backend , the hidden world beneath a website");
})
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // const user = await User.findOne({ email });
    // if (!user ) {
    //   return res.json({ message: "No user registered with this email" });
    // }
    // if(user.password !== password){
    //   return res.json({ message: "wrong passsword" });
    // }
    const token = jwt.sign({ email: email //user.email 
    }, SECRET_KEY, {
      expiresIn: "1d",
    });

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
  const { id } = req.body; 
  const token = req.headers.authorization.split(" ")[1]; 

  try {
    const { email } = jwt.verify(token, SECRET_KEY);

    const updatedUser = await Cart.findOneAndUpdate(
      { email }, 
      { $addToSet: { cart: id } }, 
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Item added to cart", cart: updatedUser.cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/fetchcart", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; 
  const { email } = jwt.verify(token, SECRET_KEY);
  const cart = Cart.find({email : email }).cart;
  if(!cart){
    return res.json({message : 'no items in cart' , cart : null});
  }
  res.json({message : 'response sent ' , cart: cart});

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
