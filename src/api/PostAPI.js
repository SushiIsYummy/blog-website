import axios from './config/axiosConfig';

const PostAPI = {
  getAllPosts: async (queryParams = {}) => {
    const response = await axios.get('/posts', {
      params: queryParams,
    });
    return response.data;
  },

  getPostsByBlog: async (blogId, queryParams) => {
    const response = await axios.get(`/blogs/${blogId}/posts`, {
      params: queryParams,
    });
    return response.data;
  },

  getPostById: async (postId) => {
    const response = await axios.get(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (blogId, postData) => {
    const response = await axios.post(`/blogs/${blogId}/posts`, postData);
    return response.data;
  },

  updatePostContent: async (postId, postData) => {
    const response = await axios.put(`/posts/${postId}`, postData);
    return response.data;
  },

  updatePostPublishStatus: async (postId, postData) => {
    const response = await axios.put(
      `/posts/${postId}/publish-status`,
      postData,
    );
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await axios.delete(`/posts/${postId}`);
    return response.data;
  },

  getVotesOnPost: async (postId) => {
    const response = await axios.get(`/posts/${postId}/votes`);
    return response.data;
  },

  updateVoteOnPost: async (postId, voteData) => {
    const response = await axios.put(`/posts/${postId}/votes/vote`, voteData);
    return response.data;
  },

  deleteVoteOnPost: async (postId) => {
    const response = await axios.delete(`/posts/${postId}/votes/vote`);
    return response.data;
  },

  getCommentsOnPost: async (postId, params) => {
    const response = await axios.get(`/posts/${postId}/comments`, {
      params,
    });
    return response.data;
  },

  getSingleCommentOnPost: async (postId, commentId) => {
    const response = await axios.get(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },

  deleteAllCommentsOnPost: async (postId) => {
    const response = await axios.delete(`/posts/${postId}/comments`);
    return response.data;
  },

  createCommentOnPost: async (postId, commentData) => {
    const response = await axios.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  updateCommentVoteOnPost: async (postId, commentId, commentData) => {
    const response = await axios.put(
      `/posts/${postId}/comments/${commentId}/votes/vote`,
      commentData,
    );
    return response.data;
  },

  deleteCommentVoteOnPost: async (postId, commentId, commentData) => {
    const response = await axios.delete(
      `/posts/${postId}/comments/${commentId}/votes/vote`,
      commentData,
    );
    return response.data;
  },

  getRepliesOnPostComment: async (postId, commentId, queryParams) => {
    const response = await axios.get(
      `/posts/${postId}/comments/${commentId}/replies`,
      { params: queryParams },
    );
    return response.data;
  },

  getAllPostCommentsByBlog: async (blogId, queryParams) => {
    const response = await axios.get(`/blogs/${blogId}/posts/comments`, {
      params: queryParams,
    });
    return response.data;
  },

  movePostToTrash: async (postId) => {
    const response = await axios.put(`/posts/${postId}/trash`);
    return response.data;
  },

  restorePostFromTrash: async (postId, data) => {
    const response = await axios.put(`/posts/${postId}/restore`, data);
    return response.data;
  },
};

export default PostAPI;
