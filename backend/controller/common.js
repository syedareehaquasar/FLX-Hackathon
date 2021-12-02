import order from "../models/order.js";

export var getOrderById = (req, res) => {
    order.findById(req.params.id)
        .exec()
        .then(orders => {
            if (!orders) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                order: orders
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};