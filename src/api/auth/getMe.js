import axiosInstance from '../axiosInstance';

export default async function getMe() {
  const { data } = await axiosInstance.get('/auth/me');
  return data.user;
}
