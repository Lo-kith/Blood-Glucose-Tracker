import axiosInstance from '../axiosInstance';

export default async function getReadingsRange(from, to) {
  const { data } = await axiosInstance.get('/readings/range', {
    params: { from, to },
  });

  return data.readings;
}
