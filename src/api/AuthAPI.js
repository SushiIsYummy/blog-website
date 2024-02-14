import axios from './config/axiosConfig';

const AuthAPI = {
  // Fetch all blogs
  signIn: async (postData) => {
    try {
      const response = await axios.post('/auth/login', postData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  checkStatus: async () => {
    try {
      const response = await axios.get('/auth/status');
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
};

export default AuthAPI;
