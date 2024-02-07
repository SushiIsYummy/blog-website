import axios from './config/axiosConfig';

const BlogAPI = {
  // Fetch all blogs
  getAllBlogs: async (queryParams = {}) => {
    try {
      const response = await axios.get('/blogs', { params: queryParams });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }
  },

  // Fetch a specific blog by ID
  getBlogById: async (blogId) => {
    try {
      const response = await axios.get(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  },

  getBlogsByUser: async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}/blogs`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  },

  // Add a new blog
  addBlog: async (blogData) => {
    try {
      const response = await axios.blog('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add blog: ${error.message}`);
    }
  },

  // Update an existing blog
  updateBlog: async (blogId, blogData) => {
    try {
      const response = await axios.put(`/blogs/${blogId}`, blogData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update blog: ${error.message}`);
    }
  },

  // Delete an blog
  deleteBlog: async (blogId) => {
    try {
      const response = await axios.delete(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete blog: ${error.message}`);
    }
  },
};

export default BlogAPI;
