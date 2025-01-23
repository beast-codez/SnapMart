import mongoose from 'mongoose'
const orderSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  order: [
    {
      id: {
        type: String,
        required: true,
      },
      orderDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: "pending",
      },
      address: {
        type: String,
        required: true,
      },
    },
      
  ],
});

const Order = mongoose.model('order', orderSchema);
export default Order; 