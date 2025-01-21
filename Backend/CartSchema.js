import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  cart: { type: [String], default: [] }, // cart is an array of numbers (product IDs)
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
  