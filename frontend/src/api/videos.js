import api from "./axios";

export const getAllVideos = async (params) => {
  try {
    const response = await api.get("/videos", { params });
    return response.data.data; // The backend wraps data in a 'data' property
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};