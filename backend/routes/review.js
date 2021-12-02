import express from 'express';
import { authJwt } from '../middleware/authJwt.js';
import { createModifyReview, deleteReview, allReviews, myReview, allReviewsOfProduct } from "../controller/review.js"

const router = express.Router();

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get(
    "/", [authJwt.verifyToken],
    allReviews
);

router.get(
    "/:productId", [authJwt.verifyToken],
    allReviewsOfProduct
);

router.get(
    "/myReview/:productId", [authJwt.verifyToken],
    myReview
);

router.patch(
    "/delete/:productId", [authJwt.verifyToken],
    deleteReview
);

router.patch(
    "/new", [authJwt.verifyToken],
    createModifyReview
);

export default router;