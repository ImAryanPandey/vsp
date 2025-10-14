import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Check if file exists before trying to upload
    if (!fs.existsSync(localFilePath)) {
      console.error(`File does not exist at path: ${localFilePath}`);
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // File has been uploaded successfully, now remove the locally saved temporary file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // If an upload operation fails, still remove the locally saved temporary file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

const deleteFromCloudinary = async (url, resource_type = "image") => {
    if (!url) return null;

    // Cloudinary URL format: http://res.cloudinary.com/<cloud_name>/<resource_type>/upload/<version>/<public_id>.<format>
    // We need to extract the public_id from the URL.
    const publicId = url.split("/").pop().split(".")[0];
    
    if (!publicId) {
        console.error("Could not extract public_id from URL:", url);
        return null;
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type });
        return result;
    } catch (error) {
        console.error("Failed to delete from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };