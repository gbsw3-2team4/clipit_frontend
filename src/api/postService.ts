import axios from "axios";

export const fetchPosts = async (page: number, pageSize: number = 10) => {
  const res = await axios.get(`/posts/page?page=${page}&pageSize=${pageSize}`);
  return res.data.posts;
};
