import express from 'express';
import { authJwt } from '../middleware/authJwt.js';
import { CODPayment, getBuyer, getSellers, getProductsByName, getBuyerOrders, createOrder, getBuyerCart, modifyProductCart, deleteProductCart, sellerProducts, getProduct, getProducts, deleteCart, checkout, paymentVerify } from "../controller/buyer.js"
import { getProfile, getAssignedOrders, getBuyer, updateStatus } from '../controller/delivery.js';
import { getOrderById } from '../controller/common.js';
import { addProduct, getProducts, getDeliverers, getSeller, deleteProduct, searchProductById, searchProductByName, updateProduct, assignOrders, getOrders, getBuyer } from '../controller/seller.js';
import { getOrderById } from '../controller/common.js';

const router = express.Router();

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get(
    "/profile", [authJwt.verifyToken],
    getBuyer
);

router.get(
    "/sellers", [authJwt.verifyToken],
    getSellers
);

router.get(
    "/search/:name", [authJwt.verifyToken],
    getProductsByName
);

router.get(
    "/search", [authJwt.verifyToken],
    getProductsByName
);


router.get(
    "/products/idSearch/:id", [authJwt.verifyToken],
    getProduct
);

router.get(
    "/seller/products/:id", [authJwt.verifyToken],
    sellerProducts
);

router.get(
    "/order", [authJwt.verifyToken],
    getBuyerOrders
);

// router.post(
//     "/order/:id", [authJwt.verifyToken],
//     createOrder
// );

router.get(
    "/cart", [authJwt.verifyToken],
    getBuyerCart
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
    "/orders", [authJwt.verifyToken],
    getAssignedOrders
);

router.get(
    "/buyer/:id", [authJwt.verifyToken],
    getBuyer
);

router.patch(
    "/orderStatus", [authJwt.verifyToken],
    updateStatus
);

router.get(
    "/order/:id", [authJwt.verifyToken],
    getOrderById
);

router.post(
    "/products/add", [authJwt.verifyToken],
    addProduct
);

router.get(
    "/products", [authJwt.verifyToken],
    getProducts
);

router.get(
    "/deliverers", [authJwt.verifyToken],
    getDeliverers
);

router.post(
    "/deliverers/add", [authJwt.verifyToken],
    signup
);

router.get(
    "/profile", [authJwt.verifyToken],
    getSeller
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
    "/products/:name", [authJwt.verifyToken],
    searchProductByName
);

router.get(
    "/orders", [authJwt.verifyToken],
    getOrders
);

router.patch(
    "/assignOrder", [authJwt.verifyToken],
    assignOrders
);

router.get(
    "/buyer/:id", [authJwt.verifyToken],
    getBuyer
);

router.get(
    "/order/:id", [authJwt.verifyToken],
    getOrderById
);

export default router;