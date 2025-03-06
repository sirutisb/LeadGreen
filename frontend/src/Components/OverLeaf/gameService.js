import axiosInstance from "../../Context/axiosInstance";

export const fetchGameData = async () => {
  try {
    const response = await axiosInstance.get("/game");
    return response.data;
  } catch (error) {
    throw error;
  }
};