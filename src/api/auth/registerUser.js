import axiosInstance from '../axiosInstance';

// Register returns the new user, but no token.
export default async function registerUser({ name, email, password }) {
  const { data } = await axiosInstance.post('/auth/register', { name, email, password });
  return data;
}
