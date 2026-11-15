import formatDateRange from '../utils/formatDateRange';
import { getSlotLabel } from '../utils/slots';
import EmptyState from './EmptyState';
import ErrorBox from './ErrorBox';
import Loader from './Loader';

const buildStats = (report) => [
  ['Highest', `${report.highest} mg/dl`],
  ['Lowest', `${report.lowest} mg/dl`],
  ['Average', report.average === null ? '—' : `${Number(report.average).toFixed(1)} mg/dl`],
  ['Count', report.count],
];

export default function ReportCard({ title, report, loading, error, showReadings = false }) {
  return (
    <section className="card report-card">
      <h2>{title}</h2>

      {!loading && report && (
        <p className="report-range">{formatDateRange(report.from, report.to)}</p>
      )}

      <ErrorBox message={error} />
      {loading && <Loader label="Loading report…" />}

      {!loading && report && report.count === 0 && (
        <EmptyState message="No readings for this period yet." />
      )}

      {!loading && report && report.count > 0 && (
        <>
          <dl className="report-stats">
            {buildStats(report).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {showReadings && (
            <ul className="report-readings">
              {report.readings.map((reading) => (
                <li key={reading.id}>
                  <span>{getSlotLabel(reading.slot)}</span>
                  <strong>{reading.value} mg/dl</strong>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
