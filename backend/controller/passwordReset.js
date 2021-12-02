import customer from "../models/customer.js";
import bcrypt from 'bcryptjs';

export const reset = async(req, res) => {
    const { phone, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." });
        const existingCustomer = await customer.findOne({ phone: phone });
        if (!existingCustomer)
            return res.status(404).json({ message: "customer doesn't exist." });
        const encryptedPassword = await bcrypt.hash(password, 12);
        customer.updateOne({ _id: existingCustomer._id }, { $set: { password: encryptedPassword } })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Password Updated',
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
};