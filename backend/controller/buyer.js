import buyer from "../models/buyer.js";
import cart from "../models/cart.js";
import product from "../models/product.js";
import order from "../models/order.js";
import seller from "../models/seller.js";
import shortid from "shortid";
import razorpay from "razorpay";
import crypto from "crypto";

export var getProductsByName = async(req, res) => {
    const productName = req.params.name;
    try {
        if (!productName) {
            return res.status(201).json(seller);
        }
        const products = await product.find({ name: { '$regex': productName, '$options': 'i' } });
        if (products.length == 0) {
            res.status(200).json({
                message: "No Products found "
            });
        } else {
            var sellersL = []
            for (var i = 0; i < products.length; i++) {
                // console.log(products[i].sellerId);
                const sellerDetails = await seller.find({ _id: products[i].sellerId });
                // console.log(sellerDetails);
                sellersL.push(sellerDetails[0]);
                console.log(sellersL);
            };
            console.log(sellersL);
            return res.status(200).json(sellersL);
            // return res.status(200).json(products);
            // seller.findOne({ _id: products.sellerId }).exec().then(sellerDetails => {
            //     return res.status(200).json(sellerDetails);
            // });
            // res.status(500).json(sellersL);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }

};

export var getBuyer = async(req, res) => {
    const buyerId = req.user.id;
    const buyerProf = await buyer.findOne({ _id: buyerId });
    if (buyerProf) {
        res.status(200).json(buyerProf);
    } else {
        res.status(404).json("Buyer Not Found");
    }
}

export var getBuyerCart = async(req, res) => {
    const buyer_id = req.user.id;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (!buyerExist) {
        return res.status(403).send("Unauthorised User");
    }
    try {
        let buyerCart = await cart.findOne({ buyerId: buyer_id });
        if (buyerCart && buyerCart.products.length > 0) {
            res.send(buyerCart);
        } else {
            res.send("Cart is Empty!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var modifyProductCart = async(req, res) => {
    const buyer_id = req.user.id;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    const { productId, quantity } = req.body;
    try {
        let buyerCart = await cart.findOne({ buyerId: buyer_id });
        let productToAdd = await product.findOne({ _id: productId });

        if (!productToAdd) {
            res.status(404).send('Item not found!');
        }

        const price = productToAdd.price;
        const name = productToAdd.name;
        const img = productToAdd.img;
        if (buyerCart) {

            if (buyerCart.products.length == 0) {
                await cart.deleteOne({ _id: buyerCart._id });
                const newCart = await cart.create({
                    buyerId: buyer_id,
                    products: [{ productId, quantity, name, price, img }],
                    bill: quantity * price
                });
                return res.status(201).send(newCart);
            }

            const productExistingCart = await product.findOne({ _id: buyerCart.products[0].productId });
            if (JSON.stringify(productToAdd.sellerId) !== JSON.stringify(productExistingCart.sellerId)) {
                return res.status(300).json({ msg: "Delete existing cart to add products from another shop!" });
            };
            //cart exists
            let itemIndex = buyerCart.products.findIndex(p => p.productId == productId);

            if (itemIndex > -1) {
                //product exists, update the quantity
                let productItem = buyerCart.products[itemIndex];
                productItem.quantity += quantity;
                buyerCart.products[itemIndex] = productItem;
            } else {
                //product does not exists, add new item
                buyerCart.products.push({ productId, quantity, name, price, img });
            }
            buyerCart.bill += quantity * price;
            buyerCart = await buyerCart.save();
            return res.status(201).send(buyerCart);
        } else {
            //no cart, create new cart
            const newCart = await cart.create({
                buyerId: buyer_id,
                products: [{ productId, quantity, name, price, img }],
                bill: quantity * price
            });
            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var deleteProductCart = async(req, res) => {
    const buyer_id = req.user.id;
    const productId = req.params.productId;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    try {
        let buyerCart = await cart.findOne({ buyerId: buyer_id });
        if (buyerCart) {
            buyerCart.products = buyerCart.products.filter(obj => {
                return obj.productId !== productId;
            });
            buyerCart.save();
            return res.status(201).send("Updated Cart");
        } else {
            return res.status(201).json("Cart is already empty!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var getBuyerOrders = async(req, res) => {
    const buyer_id = req.user.id;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    order.find({ buyerId: buyer_id }).sort({ date: -1 }).exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

var instance = new razorpay({ key_id: 'rzp_test_5AmHwMVymTPMzT', key_secret: 'IZTbBH1k3gPDfhMCgQWgYxwA' });

export var checkout = async(req, res) => {
    try {
        const buyerId = req.user.id;
        let buyerCart = await cart.findOne({ buyerId: buyerId });
        let user = await buyer.findOne({ _id: buyerId });
        if (user === null) {
            return res.status(403).send("Unauthorised User");
        }

        if (buyerCart) {
            var options = {
                amount: (buyerCart.bill * 100), // amount in the smallest currency unit
                currency: "INR",
                receipt: shortid.generate()
            };
            const response = await instance.orders.create(options);

            if (!response) {
                return res.status(500).send("Sorry! Couldn't create receipt!");
            }
            if (response) {
                return res.status(201).json({
                    id: response.id,
                    currency: response.currency,
                    amount: response.amount,
                });
            }
        } else {
            res.status(500).send("You do not have items in cart");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong", err);
    };
};

export var CODPayment = async(req, res) => {
    try {
        const buyerId = req.user.id;
        let user = await buyer.findOne({ _id: buyerId });
        if (user === null) {
            return res.status(403).send("Unauthorised User");
        }
        let buyerCart = await cart.findOne({ buyerId: buyerId });

        const productDetails = await product.findOne({ _id: buyerCart.products[0].productId });
        const sellerDetails = await seller.findOne({ _id: productDetails.sellerId });

        var sum = 0;
        for (let i = 0; i < buyerCart.products.length; i++) {
            sum += buyerCart.products[i].quantity;
        }

        await order.create({
            buyerId,
            products: buyerCart.products,
            bill: buyerCart.bill,
            sellerId: productDetails.sellerId,
            status: "Order Placed",
            shopName: sellerDetails.shopName,
            quantity: sum,
            orderDetails: [{ "OrderId": shortid.generate(), "Payment Mode": "COD" }, ],
            buyer: user
        });
        await cart.deleteOne({ _id: buyerCart._id });
        res.status(201).json({ "message": "Order Placed!" });

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong", err);
    };
};

export var paymentVerify = async(req, res) => {
    try {
        const buyerId = req.user.id;
        let user = await buyer.findOne({ _id: buyerId });
        if (user === null) {
            return res.status(403).send("Unauthorised User");
        }

        let buyerCart = await cart.findOne({ buyerId: buyerId });

        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

        var expectedSignature = crypto.createHmac('sha256', 'IZTbBH1k3gPDfhMCgQWgYxwA')
            .update(body.toString())
            .digest('hex');

        var response = { "signatureIsValid": "false" }

        const productDetails = await product.findOne({ _id: buyerCart.products[0].productId });
        const sellerDetails = await seller.findOne({ _id: productDetails.sellerId });

        var sum = 0;
        for (let i = 0; i < buyerCart.products.length; i++) {
            sum += buyerCart.products[i].quantity;
        }

        if (expectedSignature === req.body.razorpay_signature)
            response = { "signatureIsValid": "true", "message": "Order Created!" };
        await order.create({
            buyerId,
            products: buyerCart.products,
            bill: buyerCart.bill,
            sellerId: productDetails.sellerId,
            status: "Order Placed",
            shopName: sellerDetails.shopName,
            quantity: sum,
            orderDetails: [{ "OrderId": req.body.razorpay_order_id, "paymentId": req.body.razorpay_payment_id, "Signature": req.body.razorpay_signature, "Payment Mode": "Online" }],
            buyer: user
        });
        await cart.deleteOne({ _id: buyerCart._id });
        res.status(201).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong", err);
    };
};

export var deleteCart = async(req, res) => {
    const buyerId = req.user.id;
    let user = await buyer.findOne({ _id: buyerId });
    if (user === null) {
        return res.status(403).send("Unauthorised User");
    }
    let buyerCart = await cart.findOne({ buyerId: buyerId });
    try {
        await cart.deleteOne({ _id: buyerCart._id });
        res.status(200).send("Cart deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    };

};

export var createOrder = async(req, res) => {
    const cartId = req.params.id;
    const buyer_id = req.user.id;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    } else {
        return res.status(201).send("not working", cartId);
    };
};

export var getSellers = (req, res) => {
    seller.find({})
        .then(sellers => {
            res.status(200).json(sellers)
        }).catch(err => {
            res.status(404).json({ message: err })
        });
};

export var getOrderById = (req, res) => {
    order.findById(req.params.orderId)
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

export var deleteOrder = (req, res) => {
    const buyer_id = req.user.id;
    const buyerExist = buyer.findOne({ _id: buyer_id }).exec();
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    body: { result }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

export var sellerProducts = (req, res) => {
    const sellerId = req.params.id;
    product.find({ sellerId: sellerId })
        .then(products => {
            res.status(200).json(products);
        }).catch(err => {
            res.status(404).json({ message: "No Products of Seller Found" })
        });
};

export var getProduct = (req, res) => {
    const productId = req.params.id;
    product.findOne({ _id: productId })
        .then(products => {
            res.status(200).json(products)
        }).catch(err => {
            res.status(404).json({ message: "Product not Found" })
        });
};

export var getProducts = (req, res) => {
    product.find({})
        .then(products => {
            res.status(200).json(products)
        }).catch(err => {
            res.status(404).json({ message: "Products not Found" })
        });
};