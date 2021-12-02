import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"]
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        required: [true, "Please enter product Quantity"]
    },
    img: {
        type: String
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    date_added: {
        type: Date,
        default: Date.now
    }
});

const product = mongoose.model('product', productSchema);
export default product;