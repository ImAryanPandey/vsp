import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.video?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload?.url) {
        throw new ApiError(500, "Video upload failed, please try again");
    }
    if (!thumbnailUpload?.url) {
        throw new ApiError(500, "Thumbnail upload failed, please try again");
    }

    const video = await Video.create({
        title,
        description,
        videoUrl: videoUpload.url,
        thumbnailUrl: thumbnailUpload.url,
        duration: videoUpload.duration || 0,
        owner: req.user?._id,
        isPublished: true,
    });

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Increment views
    video.views += 1;
    await video.save({ validateBeforeSave: false });

    // Add to watch history
    if (req.user) {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { watchHistory: videoId },
        });
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    // Handle thumbnail update
    if (thumbnailLocalPath) {
        const oldThumbnailUrl = video.thumbnailUrl;
        const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnailUpload?.url) {
            throw new ApiError(500, "Error uploading new thumbnail");
        }
        video.thumbnailUrl = thumbnailUpload.url;
        // Delete the old thumbnail from Cloudinary
        if (oldThumbnailUrl) {
            await deleteFromCloudinary(oldThumbnailUrl, "image");
        }
    }

    // Update title and description if provided
    video.title = title || video.title;
    video.description = description || video.description;
    
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    // Delete assets from Cloudinary
    await deleteFromCloudinary(video.videoUrl, "video");
    await deleteFromCloudinary(video.thumbnailUrl, "image");

    // Delete video document from DB
    await Video.findByIdAndDelete(videoId);

    // Clean up associated data
    await Like.deleteMany({ video: videoId });
    await Comment.deleteMany({ video: videoId });
    // Also consider removing from playlists if necessary

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action");
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { isPublished: video.isPublished }, "Publish status toggled successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const pipeline = [];

    // Match stage for filtering
    const matchStage = {};
    matchStage.isPublished = true;
    if (query) {
        // Assuming you have a text index on title and description in your Video model
        matchStage.$text = { $search: query };
    }
    if (userId) {
        if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID");
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }
    pipeline.push({ $match: matchStage });

    // Sort stage
    const sortStage = {};
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === 'asc' ? 1 : -1;
    } else {
        sortStage.createdAt = -1; // Default sort
    }
    pipeline.push({ $sort: sortStage });

    // Lookup owner details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
            pipeline: [{ $project: { username: 1, avatar: 1 } }]
        }
    });
    pipeline.push({ $unwind: "$ownerDetails" });
    
    const videoAggregate = Video.aggregate(pipeline);

    const options = { 
        page: parseInt(page, 10), 
        limit: parseInt(limit, 10) 
    };

    const videos = await Video.aggregatePaginate(videoAggregate, options);

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos
};