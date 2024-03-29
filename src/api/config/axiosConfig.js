import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 5000, // Timeout for requests in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default instance;
