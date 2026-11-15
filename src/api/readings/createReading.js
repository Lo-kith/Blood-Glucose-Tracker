import axiosInstance from '../axiosInstance';

export default async function createReading({ date, slot, value }) {
  const { data } = await axiosInstance.post('/readings', { date, slot, value });
  return data.reading;
}
