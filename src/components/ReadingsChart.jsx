import {
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SLOTS from '../utils/slots';
import buildChartData from '../utils/buildChartData';
import EmptyState from './EmptyState';
import ErrorBox from './ErrorBox';
import Loader from './Loader';

const COLORS = {
  morning_fasting: '#0f766e',
  after_breakfast: '#2563eb',
  after_lunch: '#d97706',
  after_dinner: '#7c3aed',
};

const formatValue = (value) => `${value} mg/dl`;

export default function ReadingsChart({
  readings = [],
  selectedDate,
  loading,
  error,
}) {
  const rows = buildChartData(readings, selectedDate);

  return (
    <section className="card">
      <h2>Readings this month</h2>

      <ErrorBox message={error} />
      {loading && <Loader label="Loading chart…" />}

      {!loading && !error && readings.length === 0 && (
        <EmptyState message="No readings for this period yet." />
      )}

      {!loading && !error && readings.length > 0 && (
        <div
          role="img"
          aria-label="Line chart of blood glucose readings for the selected month"
          style={{ width: '100%', height: 300 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rows}
              margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                domain={[40, 'auto']}
                tick={{ fontSize: 12 }}
                width={52}
                label={{
                  value: 'mg/dl',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12 },
                }}
              />
              {/* Healthy band: 70-180 mg/dl */}
              <ReferenceArea
                y1={70}
                y2={180}
                fill="#bbf7d0"
                fillOpacity={0.6}
              />
              <Tooltip formatter={formatValue} />
              <Legend wrapperStyle={{ fontSize: 12 }} />

              {SLOTS.map((slot) => (
                <Line
                  key={slot.key}
                  type="monotone"
                  dataKey={slot.key}
                  name={slot.label}
                  stroke={COLORS[slot.key]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
