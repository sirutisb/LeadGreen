import axiosInstance from "../Context/axiosInstance";

// Service for user-related API calls
const userService = {
  // Get user profile by ID
  getUserProfile: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Get user's posts with pagination
  getUserPosts: async (userId, page = 1) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/posts/?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await axiosInstance.patch(`/api/users/${userId}/`, profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    try {
      const response = await axiosInstance.post('/users/picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  }
};

export default userService;
