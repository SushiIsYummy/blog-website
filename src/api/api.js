const BASE_URL = 'http://localhost:3000/api';
import axios from 'axios';

const api = axios.create({
  baseURL: BASE_URL,
});

export async function getTopPosts(params = {}) {
  const response = api.get('/posts', { params: params });
  return response;
}

export async function getUser(userId) {
  const response = await axios(`${BASE_URL}/users/${userId}`);
  return response;
}

export async function getBlogsByUser(userId) {
  const response = await axios(`${BASE_URL}/users/${userId}/blogs`);
  return response;
}
