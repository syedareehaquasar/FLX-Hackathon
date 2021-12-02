import buyer from '../models/buyer.js';
import seller from '../models/seller.js';

const checkDuplicatePhoneOrEmail = (req, res, next) => {
    const email = req.body.email;
    const phone = req.body.phone;
    buyer.findOne({ email }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            });
            return;
        } else {
            seller.findOne({ where: { email } }).then(user => {
                if (user) {
                    res.status(400).send({
                        message: "Failed! Email is already in use!"
                    });
                    return;
                }
            })
        }

        buyer.findOne({ phone }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Phone is already in use!"
                });
                return;
            } else {
                seller.findOne({ phone }).then(user => {
                    if (user) {
                        res.status(400).send({
                            message: "Failed! Phone is already in use!"
                        });
                        return;
                    }
                })
            }

            next();
        });
    });
};


const verifySignUp = {
    checkDuplicatePhoneOrEmail
};

export default verifySignUp;