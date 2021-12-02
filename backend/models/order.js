import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    products: [{
        productId: String,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less then 1.'],
            default: 1
        },
        name: String,
        price: Number,
        img: String,
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    orderDetails: {
        type: Array
    },
    status: {
        type: String
    },
    quantity: {
        type: Number
    },
    orderType: String,
});

const order = mongoose.model('order', ordersSchema);
export default order;