import axios from './config/axiosConfig';

const AuthAPI = {
  signIn: async (postData) => {
    const response = await axios.post('/auth/login', postData);
    return response.data;
  },

  signOut: async (postData) => {
    const response = await axios.post('/auth/logout', postData);
    return response.data;
  },

  checkStatus: async () => {
    const response = await axios.get('/auth/status');
    return response.data;
  },
};

export default AuthAPI;
