import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required to create a post");
    }

    const post = await Post.create({
        content,
        owner: req.user?._id,
    })

    if (!post) {
        throw new ApiError(500, "Failed to create post");
    }

    return res.status(201).json(
        new ApiResponse(201, post, "Post created successfully")
    )
});


const getUserPosts = asyncHandler(async(req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const posts = await Post.find({ owner: userId}).sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, posts, "User posts retrieved successfully")
    );
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required to update a post");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this post");
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: { content } },
        { new: true, runValidators: true }
    );

    if (!updatedPost) {
        throw new ApiError(500, "Failed to update post");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedPost, "Post updated successfully")
    );
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this post");
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
        throw new ApiError(500, "Failed to delete post");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedPost, "Post deleted successfully")
    );
});

export {
    createPost,
    getUserPosts,
    updatePost,
    deletePost
}