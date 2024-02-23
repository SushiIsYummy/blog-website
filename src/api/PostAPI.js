import axios from './config/axiosConfig';

const PostAPI = {
  // Fetch all posts
  getAllPosts: async (queryParams = {}) => {
    try {
      const response = await axios.get('/posts', {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  getPostsByBlog: async (blogId) => {
    try {
      const response = await axios.get(`/blogs/${blogId}/posts`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
  // Fetch a specific post by ID
  getPostById: async (postId) => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  // Add a new post
  createPost: async (blogId, postData) => {
    try {
      const response = await axios.post(`/blogs/${blogId}/posts`, postData);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
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
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  getVotesOnPost: async (postId) => {
    try {
      const response = await axios.get(`/posts/${postId}/votes`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  updateVoteOnPost: async (postId, voteData) => {
    try {
      const response = await axios.put(`/posts/${postId}/votes/vote`, voteData);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  deleteVoteOnPost: async (postId) => {
    try {
      const response = await axios.delete(`/posts/${postId}/votes/vote`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
};

export default PostAPI;
