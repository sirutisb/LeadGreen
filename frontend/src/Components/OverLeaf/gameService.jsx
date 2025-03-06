import axiosInstance from "../../Context/axiosInstance";

export const fetchGameData = async () => {
  try {
    const response = await axiosInstance.get("/game");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const performAction = async (action) => {
    try {
      const endpoint = `/game/tree/${action}/`;
      const response = await axiosInstance.post(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  };