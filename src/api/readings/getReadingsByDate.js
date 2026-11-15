import axiosInstance from '../axiosInstance';

export default async function getReadingsByDate(date) {
  const { data } = await axiosInstance.get('/readings', { params: { date } });
  return data.readings;
}
