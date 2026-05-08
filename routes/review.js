import express from "express";
import { addReview, deleteReview, getReviews, updateReview } from "../controller/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/", getReviews);
reviewRouter.delete("/:reviewID", deleteReview);
reviewRouter.put("/:reviewID", updateReview);

export default reviewRouter;