import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {

    const dbStatus = mongoose.connection.readyState;

    const isDbConnected = dbStatus === 1;

    const healthInfo = {
        dbStatus: isDbConnected,
        uptime: process.uptime(), // Node.js function to get server uptime in seconds
        message: "OK",
    };
    const statusCode = isDbConnected ? 200 : 503; 

    if (!isDbConnected) {
        throw new ApiError(503, "Database connection is unhealthy");
    }

    return res
        .status(statusCode)
        .json(
            new ApiResponse(statusCode, healthInfo, "Health check passed")
        );
});

export { healthcheck };