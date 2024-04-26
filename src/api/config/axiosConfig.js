import axios, { getAdapter } from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: enhancedStackTraceAdapter,
  withCredentials: true,
});

// Add better stack trace to show the line that called axios
// https://github.com/rafaelalmeidatk/TIL/issues/4
const defaultAdapters = axios.defaults.adapter;

async function enhancedStackTraceAdapter(config) {
  const { stack: stackTrace } = new Error();
  const adapter = getAdapter(defaultAdapters);
  try {
    return await adapter(config);
  } catch (error) {
    error.stack = `${error.stack}${stackTrace}`;
    throw error;
  }
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.message ?? error.message;
        if (status === 401) {
          console.error('Unauthorized:', errorMessage);
        } else if (status === 403) {
          console.error('Forbidden:', errorMessage);
        } else if (status === 404) {
          console.error('Not Found:', errorMessage);
        } else {
          console.error('Error:', errorMessage);
        }
        console.error(error.stack);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
    return Promise.reject(error.response.data);
  },
);

export default instance;
