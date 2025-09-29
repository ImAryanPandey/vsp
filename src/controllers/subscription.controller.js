import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const channelId = req.params;
    const subscriberId = req.user?._id;

    if (!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    const existingSubcription = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId,
    });

    if(existingSubcription){
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(
            new ApiResponse(200, { isSubscribed: false }, "Unsubscribed successfully")
        );
    }else{
        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId,
        });

        return res.status(200).json(
            new ApiResponse(200, { isSubscribed: true }, "Subscribed successfully")
        )
    }
})

const getUserChannelSubscribers = asyncHandler(async(req, res) => {
    const channelId = req.params;

    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(480, "Invalid channel ID");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: { channel: new mongoose.Types.ObjectId(channelId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            },
        },
        {
            $unwind: "$subscriberDetails"
        },
        {
            $project: {
                _id: "$subscriberDetails._id",
                username: "$subscriberDetails.username",
                avatar: "$subscriberDetails.avatar",
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Channel subscribers retrieved successfully")
    )
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.params;

    if (!mongoose.isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) }
        },
        {
            from: "users",
            localField: "channels",
            foreignField: "_id",
            as: "channelDetails"
        },
        {
            $unwind: "$channelDetails"
        },
        {
            $project: {
                _id: "$channelDetails._id",
                username: "$channelDetails.username",
                avatar: "$channelDetails.avatar"
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels retrieved successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}