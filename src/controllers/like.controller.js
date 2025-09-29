import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        user: userId,
    });

    let likeStatus;

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        likeStatus = { isLiked: false };
    } else {
        await Like.create({
            video: videoId,
            likedBy: userId,
        });
        likeStatus = { isLiked: true };
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, likeStatus, "Like status toggled successfully")
        );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isLiked: false },
                    "Comment like removed successfully"
                )
            );
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user._id,
        });
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isLiked: true },
                    "Comment liked successfully"
                )
            );
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isLiked: false },
                    "Tweet like removed successfully"
                )
            );
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
        });
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isLiked: true },
                    "Tweet liked successfully"
                )
            );
    }
});

// const toggleLike = asyncHandler(async (req, res) => {
//     const { contentId } = req.params;
//     const { contentType } = req.body;
//     const userId = req.user._id;

//     if(!['video', 'comment', 'tweet'].includes(contentType)){
//         throw new ApiError(400, "Invalid content type");
//     }

//     if(!mongoose.isValidObjectId(contentId)){
//         throw new ApiError(400, "Invalid content ID");
//     }

//     const conditions = { [contentType]: contentId, likedBy: userId };
//     const existingLike = await Like.findOne(conditions);

//     let likeStatus;

//     if(existingLike){
//         await Like.findByIdAndDelete(existingLike._id);
//         likeStatus = { isLiked: false };
//     } else {
//         await Like.create({ ...conditions });
//         likeStatus = { isLiked: true };
//     }

//     return res.status(200).json(
//         new ApiResponse(200, likeStatus, `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} like status toggled successfully`)
//     );
// })

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const likedVideosAggregate = Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
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
                ],
            },
        },
        {
            $unwind: "$videoDetails",
        },
        {
            $project: {
                _id: "$videoDetails._id",
                title: "$videoDetails.title",
                thumbnail: "$videoDetails.thumbnail",
                duration: "$videoDetails.duration",
                views: "$videoDetails.views",
                owner: {
                    username: "$videoDetails.ownerDetails.username",
                    avatar: "$videoDetails.ownerDetails.avatar",
                },
            },
        },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const likedVideos = await Like.aggregatePaginate(
        likedVideosAggregate,
        options
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "Liked videos fetched successfully"
            )
        );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
