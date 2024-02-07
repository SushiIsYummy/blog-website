import axios from './config/axiosConfig';

const UserAPI = {
  // Fetch all users
  getAllUsers: async (queryParams = {}) => {
    try {
      const response = await axios.get('/users', { params: queryParams });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  // Fetch a specific user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  },

  // Add a new user
  addUser: async (userData) => {
    try {
      const response = await axios.user('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add user: ${error.message}`);
    }
  },

  // Update an existing user
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  updateUserAbout: async (userId, userData) => {
    try {
      const response = await axios.put(`/users/${userId}/about`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  // Delete an user
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  },
};

export default UserAPI;
