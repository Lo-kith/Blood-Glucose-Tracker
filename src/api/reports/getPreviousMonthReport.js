import axiosInstance from '../axiosInstance';

// The backend returns the whole PREVIOUS month for the given date.
export default async function getPreviousMonthReport(date) {
  const { data } = await axiosInstance.get('/reports/monthly', { params: { date } });
  return data.report;
}
