import axios from './config/axiosConfig';

const BlogAPI = {
  getAllBlogs: async (queryParams = {}) => {
    const response = await axios.get('/blogs', { params: queryParams });
    return response.data;
  },

  getBlogById: async (blogId) => {
    const response = await axios.get(`/blogs/${blogId}`);
    return response.data;
  },

  getBlogsByUser: async (userId) => {
    const response = await axios.get(`/users/${userId}/blogs`);
    return response.data;
  },

  createBlog: async (blogData) => {
    const response = await axios.post('/blogs', blogData);
    return response.data;
  },

  updateBlog: async (blogId, blogData) => {
    const response = await axios.put(`/blogs/${blogId}`, blogData);
    return response.data;
  },

  deleteBlog: async (blogId) => {
    const response = await axios.delete(`/blogs/${blogId}`);
    return response.data;
  },
};

export default BlogAPI;
