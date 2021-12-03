import customer from '../models/customer.js';

const checkDuplicatePhoneOrEmail = (req, res, next) => {
    const email = req.body.email;
    const phone = req.body.phone;
    customer.findOne({ email }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            });
            return;
        }

        customer.findOne({ phone }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Phone is already in use!"
                });
                return;
            }

            next();
        });
    });
};


const verifySignUp = {
    checkDuplicatePhoneOrEmail
};

export default verifySignUp;