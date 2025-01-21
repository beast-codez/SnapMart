import mongoose from 'mongoose'
const order = mongoose.Schema({
    email : {
        type : String,
        require : true
    },
    order : {
        type : Array ,
        require : true
    }
})
const Order = mongoose.model('order', order);
export default Order;