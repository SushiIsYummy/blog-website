import axios from './config/axiosConfig';

const PostAPI = {
  // Fetch all posts
  getAllPosts: async (queryParams = {}) => {
    try {
      const response = await axios.get('/posts', { params: queryParams });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  },

  // Fetch a specific post by ID
  getPostById: async (postId) => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch post: ${error.message}`);
    }
  },

  // Add a new post
  addPost: async (postData) => {
    try {
      const response = await axios.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add post: ${error.message}`);
    }
  },

  // Update an existing post
  updatePost: async (postId, postData) => {
    try {
      const response = await axios.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  },

  // Delete an post
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  },
};

export default PostAPI;
