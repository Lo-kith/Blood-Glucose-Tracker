import axiosInstance from '../axiosInstance';

export default async function loginUser({ email, password }) {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data;
}
