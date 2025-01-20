import mongoose from 'mongoose'
const cartSchema = mongoose.Schema({
    email:{
        type: String,
        require: true
    },
    cart :{
        type: Array,
        require:true
    }
})
const Cart= mongoose.model('Cart', cartSchema);
export default Cart; 