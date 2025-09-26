import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Like } from "../models/like.model.js";
import { apiResponse } from "../utils/apiResponse.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const userId = req.user._id;

    if(!mongoose.isValidObjectId(videoId)){
        throw new apiError(400, "Invalid video ID");
    }
    
    const existingLike = await Like.findOne({
        video: videoId,
        user: userId
    })

    let likeStatus;

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        likeStatus = {isLiked: false};
    }else {
        await Like.create({
            video: videoId,
            likedBy: userId
        });
        likeStatus = {isLiked: true};
    }

    return res.status(200).json(
        new apiResponse(200, likeStatus, "Like status toggled successfully")
    )

});



export { toggleVideoLike };