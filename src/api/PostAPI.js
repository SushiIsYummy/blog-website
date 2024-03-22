import axios from './config/axiosConfig';

const PostAPI = {
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

  getPostById: async (postId) => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  createPost: async (blogId, postData) => {
    try {
      const response = await axios.post(`/blogs/${blogId}/posts`, postData);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  updatePost: async (postId, postData) => {
    try {
      const response = await axios.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  },

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

  getCommentsOnPost: async (postId) => {
    try {
      const response = await axios.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  getSingleCommentOnPost: async (postId, commentId) => {
    try {
      const response = await axios.get(
        `/posts/${postId}/comments/${commentId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  createCommentOnPost: async (postId, commentData) => {
    try {
      const response = await axios.post(
        `/posts/${postId}/comments`,
        commentData,
      );
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  updateCommentVoteOnPost: async (postId, commentId, commentData) => {
    try {
      const response = await axios.put(
        `/posts/${postId}/comments/${commentId}/votes/vote`,
        commentData,
      );
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  deleteCommentVoteOnPost: async (postId, commentId, commentData) => {
    try {
      const response = await axios.delete(
        `/posts/${postId}/comments/${commentId}/votes/vote`,
        commentData,
      );
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  getRepliesOnPostComment: async (postId, commentId, queryParams) => {
    try {
      const response = await axios.get(
        `/posts/${postId}/comments/${commentId}/replies`,
        { params: queryParams },
      );
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },

  getAllPostCommentsByBlog: async (blogId, queryParams) => {
    try {
      const response = await axios.get(`/blogs/${blogId}/posts/comments`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
};

export default PostAPI;
