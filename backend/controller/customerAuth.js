import customer from "../models/customer.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signin = async(req, res) => {
    const { phone, password } = req.body;
    try {
        const existingcustomer = await customer.findOne({ phone });
        if (!existingcustomer)
            return res.status(404).json({ message: "customer doesn't exist." });
        const isPasswordCorrect = await bcrypt.compare(password, existingcustomer.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials." });
        const token = jwt.sign({ fullname: existingcustomer.fullname, email: existingcustomer.email, id: existingcustomer._id, phone: existingcustomer.phone, shopName: existingcustomer.shopName, shopAddress: existingcustomer.shopAddress }, 'test', { expiresIn: "30d" });
        res.status(200).json({ result: existingcustomer, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export const signup = async(req, res) => {
    const { email, password, confirmPassword, fullname, phone, shopName, shopAddress } = req.body;
    try {
        const existingcustomer = await customer.findOne({ phone });
        if (existingcustomer) {
            return res.status(400).json({ message: "customer already exist." });
        }
        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." });
        const encryptedPassword = await bcrypt.hash(password, 12);
        const result = await customer.create({ email, password: encryptedPassword, fullname, phone, shopName, shopAddress });
        const token = jwt.sign({ fullname: result.fullname, email: result.email, id: result._id, phone: result.phone, shopName: result.shopName, shopAddress: result.shopAddress }, 'test', { expiresIn: "30d" });
        res.status(200).json({ result: result, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}