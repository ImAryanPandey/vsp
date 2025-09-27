import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
            },
        },
    ]);

    const subscriberCount = await Subscription.countDocuments({
        channel: userId,
    });

    const totalLikes = await Like.countDocuments({ "video.owner": userId });

    const stats = {
        totalSubscribers: subscriberCount,
        totalLikes: totalLikes,
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Channel statistics retrieved successfully"
            )
        );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const videoAggregate = await Video.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                likeCount: { $size: "$likes" },
            },
        },
        {
            $project: {
                thumbnail: 1,
                title: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                isPublished: 1,
                likeCount: 1,
            },
        },
    ]);
    const options = {
        page: parseInt(page, 30),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
    };

    const videos = await Video.aggregatePaginate(videoAggregate, options);

    if (!videos || videos.docs.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No videos found for this channel"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Channel videos retrieved successfully"
            )
        );
});

export { getChannelStats, getChannelVideos };
