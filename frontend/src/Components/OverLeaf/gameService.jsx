import axiosInstance from "../../Context/axiosInstance";

export const fetchGameData = async () => {
  try {
    const response = await axiosInstance.get("/game");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchInventory = async () => {
  try {
    const response = await axiosInstance.get("/game/inventory/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const performAction = async (itemId) => {
    try {
      const endpoint = `/game/use-item/${itemId}/`;
      const response = await axiosInstance.post(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  };