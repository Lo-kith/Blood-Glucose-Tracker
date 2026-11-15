import { useState } from 'react';
import deleteReading from '../api/readings/deleteReading';
import getDailyReport from '../api/reports/getDailyReport';
import getMonthToDateReport from '../api/reports/getMonthToDateReport';
import getPreviousMonthReport from '../api/reports/getPreviousMonthReport';
import DatePicker from '../components/DatePicker';
import ErrorBox from '../components/ErrorBox';
import Header from '../components/Header';
import ReadingForm from '../components/ReadingForm';
import ReadingList from '../components/ReadingList';
import ReadingsChart from '../components/ReadingsChart';
import ReportCard from '../components/ReportCard';
import useReadings from '../hooks/useReadings';
import useReadingsRange from '../hooks/useReadingsRange';
import useReport from '../hooks/useReport';
import getErrorMessage from '../utils/getErrorMessage';
import todayString from '../utils/todayString';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(null); // The reading shown in the form, if any.
  const [actionError, setActionError] = useState('');

  const readings = useReadings(selectedDate, refreshKey);
  const daily = useReport(getDailyReport, selectedDate, refreshKey);
  const monthToDate = useReport(getMonthToDateReport, selectedDate, refreshKey);
  const previousMonth = useReport(getPreviousMonthReport, selectedDate, refreshKey);

  // Chart range: 1st of the selected month through the selected date.
  const chartFrom = `${selectedDate.slice(0, 7)}-01`;
  const chart = useReadingsRange(chartFrom, selectedDate, refreshKey);

  const refresh = () => setRefreshKey((key) => key + 1);

  const handleDateChange = (nextDate) => {
    setSelectedDate(nextDate);
    setEditing(null);
    setActionError('');
  };

  const handleSaved = () => {
    setEditing(null);
    setActionError('');
    refresh();
  };

  const handleDelete = async (reading) => {
    setActionError('');

    try {
      await deleteReading(reading.id);
      if (editing?.id === reading.id) setEditing(null);
      refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleEdit = (reading) => {
    setEditing(reading);
    setActionError('');
  };

  return (
    <div className="page">
      <Header />

      <main className="container dashboard">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">blood glucose tracker</p>
            <h1>Glucose care overview</h1>
            <p className="dashboard-subtitle">
              Your blood glucose readings and trends, clearly organized.
            </p>
          </div>
          <DatePicker date={selectedDate} onChange={handleDateChange} />
        </div>
        <ErrorBox message={actionError || readings.error} />

        <div className="dashboard-columns">
          <ReadingForm
            key={editing ? `edit-${editing.id}` : `new-${selectedDate}`}
            initial={editing}
            defaultDate={selectedDate}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
          <ReadingList
            readings={readings.data}
            loading={readings.loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <section className="reports">
          <ReportCard
            title="Daily"
            report={daily.data}
            loading={daily.loading}
            error={daily.error}
            showReadings
          />
          <ReportCard
            title="Month-to-date"
            report={monthToDate.data}
            loading={monthToDate.loading}
            error={monthToDate.error}
          />
          <ReportCard
            title="Previous month"
            report={previousMonth.data}
            loading={previousMonth.loading}
            error={previousMonth.error}
          />
        </section>

        <ReadingsChart
          readings={chart.data}
          selectedDate={selectedDate}
          loading={chart.loading}
          error={chart.error}
        />
      </main>
    </div>
  );
}
