import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    totalRating: [0, 0, 0, 0, 0],
    reviews: [{
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "buyer"
        },
        buyer: String,
        rating: {
            type: Number,
            min: [1, 'rating can not be less than 1.'],
            max: [5, 'rating can not be more than 5.'],
            default: 5
        },
        review: String,
        img: String
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const reviews = mongoose.model('reviews', reviewSchema);
export default reviews;