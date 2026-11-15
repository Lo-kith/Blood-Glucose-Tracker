import axiosInstance from '../axiosInstance';

export default async function updateReading(id, { date, slot, value }) {
  const { data } = await axiosInstance.put(`/readings/${id}`, { date, slot, value });
  return data.reading;
}
