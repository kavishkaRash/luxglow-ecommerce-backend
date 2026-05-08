import Review from "../models/review.js";
import { isAdmin } from "./userController.js";

export async function addReview(req,res) {

    try {
        const review = new Review(req.body);
        await review.save();
        res.json({
            message : "Review Create Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Failed To Create Review"
        })
    }
    
}

export async function getReviews(req,res) {
    try {
        const reviews = await Review.find().sort({createdAt : -1});
        res.json(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Failed To Get Reviews"
        })
    }
}

export async function deleteReview(req,res) {

    if (!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to delete a review"
        });
        return;
    }

    try {
        const reviewID = req.params.reviewID;
        await Review.deleteOne({ID : reviewID});
        res.json({
            message : "Review Deleted Successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message : "Failed To Delete Review"
        })
    }
}

export async function updateReview(req,res) {
    if (!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to update a review"
        });
        return;
    }

    try {
        const reviewID = req.params.reviewID;
        const updateData = req.body;
        await Review.updateOne({ID : reviewID},updateData);
        res.json({
            message : "Review Updated Successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message : "Failed To Update Review"
        })
    }
}