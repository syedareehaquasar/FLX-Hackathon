import validator from 'validator';
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: {
            args: true,
            msg: 'Email address already in use!'
        }
    },
    phone: {
        type: String,
        validate: [validator.isMobilePhone, "Please enter a phone"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"]
    }
});

const customer = mongoose.model('Customer', customerSchema);
export default customer;