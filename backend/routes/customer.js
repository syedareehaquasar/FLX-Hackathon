import express from 'express';
import { authJwt } from '../middleware/authJwt.js';
import { addProduct, getCustomers, getProducts, deleteProduct, searchProductById, updateProduct, getOrders, getCustomer, CODPayment, getProductsByName, getCustomerOrders, getCustomerCart, modifyProductCart, deleteProductCart, customerProducts, getProduct, deleteCart, checkout, paymentVerify, updateStatus, getOrderById } from "../controller/customer.js";
const router = express.Router();

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get(
    "/profile", [authJwt.verifyToken],
    getCustomer
);

router.get(
    "/friends", [authJwt.verifyToken],
    getCustomers
);

router.get(
    "/search/:name", [authJwt.verifyToken],
    getProductsByName
);


router.get(
    "/products/idSearch/:id", [authJwt.verifyToken],
    getProduct
);

router.get(
    "/customer/products/:id", [authJwt.verifyToken],
    customerProducts
);

router.get(
    "/order", [authJwt.verifyToken],
    getCustomerOrders
);

router.get(
    "/cart", [authJwt.verifyToken],
    getCustomerCart
);

router.post(
    "/cart/add", [authJwt.verifyToken],
    modifyProductCart
);

router.delete(
    "/cart/remove/:productId", [authJwt.verifyToken],
    deleteProductCart
);

router.delete(
    "/cart/remove", [authJwt.verifyToken],
    deleteCart
);

router.get(
    "/products", [authJwt.verifyToken],
    getProducts
);

router.post(
    "/checkout", [authJwt.verifyToken],
    checkout
);

router.post(
    "/payment/verify", [authJwt.verifyToken],
    paymentVerify
);

router.get(
    "/COD", [authJwt.verifyToken],
    CODPayment
);

router.get(
    "/customer/:id", [authJwt.verifyToken],
    getCustomer
);

router.patch(
    "/orderStatus", [authJwt.verifyToken],
    updateStatus
);

router.post(
    "/products/add", [authJwt.verifyToken],
    addProduct
);

router.get(
    "/products", [authJwt.verifyToken],
    getProducts
);

router.delete(
    "/products/delete/:id", [authJwt.verifyToken],
    deleteProduct
);

router.patch(
    "/products/update/:id", [authJwt.verifyToken],
    updateProduct
);

router.get(
    "/products/:id", [authJwt.verifyToken],
    searchProductById
);

router.get(
    "/orders", [authJwt.verifyToken],
    getOrders
);

router.get(
    "/customer/:id", [authJwt.verifyToken],
    getCustomer
);

router.get(
    "/order/:id", [authJwt.verifyToken],
    getOrderById
);

export default router;