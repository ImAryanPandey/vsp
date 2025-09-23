import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid Video Id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },
        {
            $unwind: "$ownerDetails",
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "ownerDetails.username": 1,
                "ownerDetails.avatar": 1,
            },
        },
    ]);
    return res
        .status(200)
        .json(new apiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new apiError(400, "Comment content is required");
    }

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid Video Id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id, // Coming from JWT middleware (auth Middleware I mean)
    });

    if (!comment) {
        throw new apiError(500, "Failed to add comment");
    }

    return res
        .status(201)
        .json(new apiResponse(201, comment, "Comment added Successfully"));
});

export { getVideoComments, addComment };
