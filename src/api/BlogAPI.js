import axios from './config/axiosConfig';

const BlogAPI = {
  // Fetch all blogs
  getAllBlogs: async (queryParams = {}) => {
    try {
      const response = await axios.get('/blogs', { params: queryParams });
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  // Fetch a specific blog by ID
  getBlogById: async (blogId) => {
    try {
      const response = await axios.get(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  getBlogsByUser: async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}/blogs`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  // Add a new blog
  createBlog: async (blogData) => {
    try {
      const response = await axios.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  // Update an existing blog
  updateBlog: async (blogId, blogData) => {
    try {
      const response = await axios.put(`/blogs/${blogId}`, blogData);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  // Delete an blog
  deleteBlog: async (blogId) => {
    try {
      const response = await axios.delete(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
};

export default BlogAPI;
