import axios from './config/axiosConfig';

const AuthAPI = {
  // Fetch all blogs
  signIn: async (postData) => {
    try {
      const response = await axios.post('/auth/login', postData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to sign in: ${error.message}`);
    }
  },

  checkStatus: async () => {
    try {
      const response = await axios.get('/auth/status');
      return response.data;
    } catch (error) {
      throw new Error(`Failed while checking login status: ${error.message}`);
    }
  },
};

export default AuthAPI;
