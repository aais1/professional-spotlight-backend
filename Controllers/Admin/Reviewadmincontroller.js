import Biography from "../../Models/Biogrphies/biography.js";
import Review from "../../Models/Biogrphies/review.js";

const createReview = async (req, res) => {
    try {
        console.log(req.body);
        const { review,reviewer, rating, title } = req.body;
        // Fetch the biography to get the slug
        const biography = await Biography.findOne({ title: title });
        console.log(biography);
        if (!biography) {
            return res.status(404).json({ message: "Biography not found" });
        }

        // Create a new review
        const newReview = new Review({
            review,
            rating,
            reviewer,
            approved: true,
            biographySlug: biography.slug,
        });

        await newReview.save();
        return res.status(201).json({ message: "Review created successfully", review: newReview });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { reviewId, review, rating, title } = req.body;
        console.log(req.body);
        // Fetch the biography to get the slug
        const biography = await Biography.findOne({ slug: title });
        if (!biography) {
            return res.status(404).json({ message: "Biography not found" });
        }

        // Update the review
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            {
                review,
                rating,
                biographySlug: biography.slug,
            },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body;

        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Approve review
const approveReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const approvedReview = await Review.findByIdAndUpdate(
            reviewId,
            { approved: true },
            { new: true }
        );

        if (!approvedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json({ message: "Review approved successfully", review: approvedReview });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Reject review
const rejectReview = async (req, res) => {
    try {
        console.log('parrams are');
        const { reviewId } = req.params;
  console.log('parrams are',req.params);
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
};

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        return res.status(200).json({ reviews });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// get all approved reviews
 const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ approved: true });
        return res.status(200).json({ reviews });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default { createReview, updateReview, deleteReview, approveReview, rejectReview, getAllReviews, getApprovedReviews };