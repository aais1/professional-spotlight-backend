import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    review: {
        type: String,
        required: true,
    },
    reviewer: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    biographySlug: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
});

const Review = model("Review", reviewSchema);
export default Review;