import axios from './config/axiosConfig';

const UserAPI = {
  getAllUsers: async (queryParams = {}) => {
    const response = await axios.get('/users', { params: queryParams });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axios.post('/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axios.put(`/users/${userId}`, userData);
    return response.data;
  },

  updateUserAbout: async (userId, userData) => {
    const response = await axios.put(`/users/${userId}/about`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(`/users/${userId}`);
    return response.data;
  },
};

export default UserAPI;
