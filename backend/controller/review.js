import reviews from "../models/reviews.js";
import buyer from "../models/buyer.js";

export var createModifyReview = async(req, res) => {
    const buyer_id = req.user.id;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    const { productId, review, rating, img } = req.body;
    try {
        let reviewForProduct = await reviews.findOne({ productId: productId });
        if (!reviewForProduct) {
            var totalRating = [0, 0, 0, 0, 0];
            const newReview = await reviews.create({
                productId: productId,
                totalRating: totalRating[rating - 1] + 1,
                reviews: [{ buyerId: buyer_id, buyer: req.user.fullname, rating: rating, review: review, img: img }]
            });
            console.log(totalRating);
            return res.status(201).send(newReview);
        };

        //review exists
        let itemIndex = reviewForProduct.reviews.findIndex(p => p.buyerId == buyer_id);

        if (itemIndex > -1) {
            //product review exists, update the review
            reviewForProduct.totalRating[reviewForProduct.rating - 1] = reviewForProduct.totalRating[reviewForProduct.rating - 1] - 1
            let productReview = reviewForProduct.reviews[itemIndex];
            productReview.rating = rating;
            productReview.review = review;
            productReview.img = img;
            reviewForProduct.reviews[itemIndex] = productReview;
        } else {
            reviewForProduct.reviews.push({ buyerId: buyer_id, buyer: req.user.fullname, rating: rating, review: review, img: img });
        }
        reviewForProduct.totalRating[rating - 1] = reviewForProduct.totalRating[rating - 1] + 1
        await reviewForProduct.save();
        console.log(totalRating);
        return res.status(201).send(reviewForProduct);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var deleteReview = async(req, res) => {
    const buyer_id = req.user.id;
    const productId = req.params.productId;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    try {
        let reviewForProduct = await reviews.findOne({ productId: productId });
        if (reviewForProduct) {
            reviewForProduct.reviews = reviewForProduct.reviews.filter(obj => {
                // console.log(JSON.stringify(obj.buyerId) !== buyer_id, JSON.stringify(obj.buyerId));
                return JSON.stringify(obj.buyerId) !== JSON.stringify(buyer_id);
            });
            await reviewForProduct.save();
            if (reviewForProduct.reviews.length == 0) {
                await reviews.deleteOne({ _id: reviewForProduct._id });
            }
            // console.log(reviewForProduct, reviewForProduct._id)
            return res.status(201).send("Deleted Review!");
        } else {
            return res.status(201).json("Review already deleted!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var allReviews = async(req, res) => {
    try {
        let allReviews = await reviews.find({});
        if (allReviews.length) {
            return res.status(201).send(allReviews);
        } else {
            return res.status(300).json("No reviews found!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var allReviewsOfProduct = async(req, res) => {
    const productId = req.params.productId;
    try {
        let allReviews = await reviews.find({ productId: productId });
        if (allReviews.length) {
            return res.status(201).send(allReviews);
        } else {
            return res.status(201).json("No reviews found!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

export var myReview = async(req, res) => {
    const buyer_id = req.user.id;
    const productId = req.params.productId;
    const buyerExist = await buyer.findOne({ _id: buyer_id });
    if (buyerExist === null) {
        return res.status(403).send("Unauthorised User");
    }
    try {
        let reviewForProduct = await reviews.findOne({ productId: productId });
        if (reviewForProduct && reviewForProduct.reviews.length > 0) {
            reviewForProduct.reviews = reviewForProduct.reviews.filter(obj => {
                // console.log(JSON.stringify(obj.buyerId) === JSON.stringify(buyer_id));
                return JSON.stringify(obj.buyerId) === JSON.stringify(buyer_id);
            });
            if (reviewForProduct.reviews.length > 0) {
                return res.status(201).send(reviewForProduct);
            } else {
                return res.status(201).json("You don't have review for this product!");
            }
        } else {
            return res.status(201).json("You don't have review for this product!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};