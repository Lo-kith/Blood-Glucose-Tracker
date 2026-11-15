import axiosInstance from '../axiosInstance';

// The API answers 204 No Content, so there is nothing to return.
export default async function deleteReading(id) {
  await axiosInstance.delete(`/readings/${id}`);
}
