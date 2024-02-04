const baseUrl = 'http://localhost:3000/api';
import axios from 'axios';

export async function getTopPosts(limit) {
  const response = await axios(
    `${baseUrl}/posts?${limit ? `limit=${limit}` : ''}`,
  );
  return response;
}
