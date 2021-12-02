import seller from "../models/seller.js";
import deliverer from "../models/deliverer.js";
import product from "../models/product.js";
import order from "../models/order.js";
import buyer from "../models/buyer.js";

export var addProduct = async(req, res) => {
    const sellerId = req.user.id;
    const Seller = await seller.findOne({ _id: sellerId })
    if (!Seller) {
        res.status(401).json({ message: "Unauthorised User" })
    } else {
        const newProduct = new product({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            img: req.body.img,
            sellerId: sellerId
        });
        newProduct.save().then(result => {
            res.status(201).json({
                message: 'Product added',
                createProduct: {
                    _id: result._id,
                    name: result.name,
                    description: result.description,
                    price: result.price,
                    quantity: result.quantity,
                    img: result.img
                }
            });
        });
    };
};

export var getProducts = async(req, res) => {
    const sellerId = req.user.id;
    product.find({ sellerId: sellerId })
        .then(products => {
            res.status(200).json(products)
        }).catch(err => {
            res.status(404).json(err)
        })
};

export var getDeliverers = (req, res) => {
    deliverer.find({ sellerId: req.user.id }).select("fullname email phone")
        .then(deliverers => {
            res.status(200).json(deliverers)
        }).catch(err => {
            res.status(404).json({ message: err })
        });
};

export var getSeller = async(req, res) => {
    const sellerId = req.user.id;
    const sellerProf = await seller.findOne({ _id: sellerId });
    if (sellerProf) {
        res.status(200).json(sellerProf);
    } else {
        res.status(404).json("Seller Not Found");
    }
};

export var deleteProduct = async(req, res) => {
    const id = req.params.id;
    product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    product: doc,
                    status: "deleted"
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    await product.deleteOne({ _id: id });
};

export var searchProductById = async(req, res) => {
    const id = req.params.id;
    product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

export var searchProductByName = async(req, res) => {
    const name = req.params.name;
    product.find({ name: name })
        .select('name price quantity _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

export var updateProduct = async(req, res) => {
    const id = req.params.id;
    const updateOps = {};
    const { price, quantity, description } = req.body;
    updateOps["price"] = price;
    updateOps["quantity"] = quantity;
    updateOps["description"] = description;
    product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                product: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

export const assignOrders = async(req, res) => {
    const { orderId, delivererId } = req.body;
    order.updateOne({ _id: orderId }, { $set: { deliverer: delivererId, status: "Deliverer Assigned!" } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'deliverer assigned',
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

export var getOrders = async(req, res) => {
    const sellerId = req.user.id;
    order.find({ sellerId: sellerId })
        .then(orders => {
            res.status(200).json(orders)
        }).catch(err => {
            res.status(404).json(err)
        })
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