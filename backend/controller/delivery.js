import deliverer from "../models/deliverer.js";
import order from "../models/order.js";

export const getAssignedOrders = async(req, res) => {
    order.find({ deliverer: req.user.id }).exec().then(orders => {
        res.status(200).json({
            count: orders.length,
            orders: orders
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

export const getProfile = async(req, res) => {
    deliverer.findOne({ _id: req.user.id }).exec().then(profile => {
        res.status(200).json({
            profile
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

export var getBuyer = async(req, res) => {
    const buyerId = req.params.id;
    const buyerProf = await buyer.findOne({ _id: buyerId });
    if (buyerProf) {
        res.status(200).json(buyerProf);
    } else {
        res.status(404).json("Buyer Not Found");
    }
};


export const updateStatus = async(req, res) => {
    const { orderId, status } = req.body;
    order.updateOne({ _id: orderId }, { $set: { status: status } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Status Updated',
                order: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};