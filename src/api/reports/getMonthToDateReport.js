import axiosInstance from '../axiosInstance';

export default async function getMonthToDateReport(date) {
  const { data } = await axiosInstance.get('/reports/month-to-date', { params: { date } });
  return data.report;
}
