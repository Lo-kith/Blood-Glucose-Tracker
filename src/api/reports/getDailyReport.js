import axiosInstance from '../axiosInstance';

export default async function getDailyReport(date) {
  const { data } = await axiosInstance.get('/reports/daily', { params: { date } });
  return data.report;
}
