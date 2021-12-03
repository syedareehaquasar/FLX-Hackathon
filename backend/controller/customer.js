import customer from "../models/customer.js";
import cart from "../models/cart.js";
import product from "../models/product.js";
import order from "../models/order.js";
import shortid from "shortid";
import razorpay from "razorpay";
import crypto from "crypto";

export var getProductsByName = async(req, res) => {
    const productName = req.params.name;
    try {
        if (!productName) {
            return res.status(201).json("No Product found");
        }
        const products = await product.find({ name: { '$regex': productName, '$options': 'i' } });
        if (products.length == 0) {
            res.status(200).json({
                message: "No Products found "
            });
        } else {
            return res.status(200).json(products);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }

};

export var getCustomer = async(req, res) => {
    const customerId = req.user.id;
    const customerProf = await customer.findOne({ _id: customerId });
    if (customerProf) {
        res.status(200).json(customerProf);
    } else {
        res.status(404).json("Customer Not Found");
    }
}

export var getCustomers = async(req, res) => {
    const customers = await customer.find({});
    if (customers) {
        res.status(200).json(customers);
    } else {
        res.status(404).json("Customers Not Found");
    }
}

export var getCustomerCart = async(req, res) => {
    const customer_id = req.user.id;
    const customerExist = await customer.findOne({ _id: customer_id });
    if (!customerExist) {
        return res.status(403).send("Unauthorised User");
    }
    try {
        let customerCart = await cart.findOne({ customerId: customer_id });
        if (customerCart && customerCart.products.length > 0) {
            res.send(customerCart);
        } else {
            res.send("Cart is Empty!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var modifyProductCart = async(req, res) => {
    const customer_id = req.user.id;
    const customerExist = await customer.findOne({ _id: customer_id });
    if (customerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    const { productId, quantity } = req.body;
    try {
        let customerCart = await cart.findOne({ customerId: customer_id });
        let productToAdd = await product.findOne({ _id: productId });

        if (!productToAdd) {
            res.status(404).send('Item not found!');
        }

        const price = productToAdd.price;
        const name = productToAdd.name;
        const img = productToAdd.img;
        if (customerCart) {

            if (customerCart.products.length == 0) {
                await cart.deleteOne({ _id: customerCart._id });
                const newCart = await cart.create({
                    customerId: customer_id,
                    products: [{ productId, quantity, name, price, img }],
                    bill: quantity * price
                });
                return res.status(201).send(newCart);
            }

            const productExistingCart = await product.findOne({ _id: customerCart.products[0].productId });
            if (JSON.stringify(productToAdd.customerId) !== JSON.stringify(productExistingCart.customerId)) {
                return res.status(300).json({ msg: "Delete existing cart to add products from another shop!" });
            };
            //cart exists
            let itemIndex = customerCart.products.findIndex(p => p.productId == productId);

            if (itemIndex > -1) {
                //product exists, update the quantity
                let productItem = customerCart.products[itemIndex];
                productItem.quantity += quantity;
                customerCart.products[itemIndex] = productItem;
            } else {
                //product does not exists, add new item
                customerCart.products.push({ productId, quantity, name, price, img });
            }
            customerCart.bill += quantity * price;
            customerCart = await customerCart.save();
            return res.status(201).send(customerCart);
        } else {
            //no cart, create new cart
            const newCart = await cart.create({
                customerId: customer_id,
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
    const customer_id = req.user.id;
    const productId = req.params.productId;
    const customerExist = await customer.findOne({ _id: customer_id });
    if (customerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    try {
        let customerCart = await cart.findOne({ customerId: customer_id });
        if (customerCart) {
            customerCart.products = customerCart.products.filter(obj => {
                return obj.productId !== productId;
            });
            customerCart.save();
            return res.status(201).send("Updated Cart");
        } else {
            return res.status(201).json("Cart is already empty!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var getCustomerOrders = async(req, res) => {
    const customer_id = req.user.id;
    const customerExist = await customer.findOne({ _id: customer_id });
    if (customerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    order.find({ customerId: customer_id }).sort({ date: -1 }).exec().then(docs => {
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
        const customerId = req.user.id;
        let customerCart = await cart.findOne({ customerId: customerId });
        let user = await customer.findOne({ _id: customerId });
        if (user === null) {
            return res.status(403).send("Unauthorised User");
        }

        if (customerCart) {
            var options = {
                amount: (customerCart.bill * 100), // amount in the smallest currency unit
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
        const customerId = req.user.id;
        let user = await customer.findOne({ _id: customerId });
        if (user === null) {
            return res.status(403).send("Unauthorised User");
        }
        let customerCart = await cart.findOne({ customerId: customerId });

        const productDetails = await product.findOne({ _id: customerCart.products[0].productId });
        const customerDetails = await customer.findOne({ _id: productDetails.customerId });

        var sum = 0;
        for (let i = 0; i < customerCart.products.length; i++) {
            sum += customerCart.products[i].quantity;
        }

        await order.create({
            customerId,
            products: customerCart.products,
            bill: customerCart.bill,
            customerId: productDetails.customerId,
            status: "Order Placed",
            quantity: sum,
            orderDetails: [{ "OrderId": shortid.generate(), "Payment Mode": "COD" }, ],
            customer: user
        });
        await cart.deleteOne({ _id: customerCart._id });
        res.status(201).json({ "message": "Order Placed!" });

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong", err);
    };
};

export var paymentVerify = async(req, res) => {
    try {
        const customerId = req.user.id;
        let user = await customer.findOne({ _id: customerId });
        if (user === null) {
            return res.status(403).send("Unauthorised User");
        }

        let customerCart = await cart.findOne({ customerId: customerId });

        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

        var expectedSignature = crypto.createHmac('sha256', 'IZTbBH1k3gPDfhMCgQWgYxwA')
            .update(body.toString())
            .digest('hex');

        var response = { "signatureIsValid": "false" }

        const productDetails = await product.findOne({ _id: customerCart.products[0].productId });
        const customerDetails = await customer.findOne({ _id: productDetails.customerId });

        var sum = 0;
        for (let i = 0; i < customerCart.products.length; i++) {
            sum += customerCart.products[i].quantity;
        }

        if (expectedSignature === req.body.razorpay_signature)
            response = { "signatureIsValid": "true", "message": "Order Created!" };
        await order.create({
            customerId,
            products: customerCart.products,
            bill: customerCart.bill,
            customerId: productDetails.customerId,
            status: "Order Placed",
            quantity: sum,
            orderDetails: [{ "OrderId": req.body.razorpay_order_id, "paymentId": req.body.razorpay_payment_id, "Signature": req.body.razorpay_signature, "Payment Mode": "Online" }],
            customer: user
        });
        await cart.deleteOne({ _id: customerCart._id });
        res.status(201).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong", err);
    };
};

export var deleteCart = async(req, res) => {
    const customerId = req.user.id;
    let user = await customer.findOne({ _id: customerId });
    if (user === null) {
        return res.status(403).send("Unauthorised User");
    }
    let customerCart = await cart.findOne({ customerId: customerId });
    try {
        await cart.deleteOne({ _id: customerCart._id });
        res.status(200).send("Cart deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    };

};

export var createOrder = async(req, res) => {
    const cartId = req.params.id;
    const customer_id = req.user.id;
    const customerExist = await customer.findOne({ _id: customer_id });
    if (customerExist === null) {
        return res.status(403).send("Unauthorised User");
    } else {
        return res.status(201).send("not working", cartId);
    };
};

export var getUsers = (req, res) => {
    customer.find({})
        .then(customers => {
            res.status(200).json(customers)
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
    const customer_id = req.user.id;
    const customerExist = customer.findOne({ _id: customer_id }).exec();
    if (customerExist === null) {
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

export var customerProducts = (req, res) => {
    const customerId = req.params.id;
    product.find({ customerId: customerId })
        .then(products => {
            res.status(200).json(products);
        }).catch(err => {
            res.status(404).json({ message: "No Products of Customer Found" })
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

export var addProduct = async(req, res) => {
    const customerId = req.user.id;
    const Seller = await customer.findOne({ _id: customerId })
    if (!Seller) {
        res.status(401).json({ message: "Unauthorised User" })
    } else {
        const newProduct = new product({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            img: req.body.img,
            customerId: customerId
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

export var getOrders = async(req, res) => {
    const customerId = req.user.id;
    order.find({ customerId: customerId })
        .then(orders => {
            res.status(200).json(orders)
        }).catch(err => {
            res.status(404).json(err)
        })
};

export var searchProductById = async(req, res) => {
    const id = req.params.id;
    const product = await products.findOne({_id: id});
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json("Product Not Found");
    }
}