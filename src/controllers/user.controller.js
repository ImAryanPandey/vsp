import {asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    const {fullName, email, username, password} = req.body
    console.log("email: ", email);

    // if (fullName == "") {
    //     throw new apiError(400, "Full Name is required")
    // } 
    // You have to repeat this method again and again

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }

    const existingUser = User.findOne({
        $or: [{username}, {email}]
    })

    if (existingUser) {
        throw new apiError(400, "User already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if(!avatar) {
        throw new apiError(400, "Avatar upload failed")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser =await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User Registered Successfully")
    )




    // get user detail from frontend
    // validation - not empty
    // check if user already exist: Username and Email
    // files - avatar(req) & cover image
    // upload to cloudinary
    // create user object - createEntry in db
    // remove password and refresh token field 
    // check for user creation 
    // return response
});

export { registerUser }