import EmptyState from './EmptyState';
import Loader from './Loader';
import ReadingItem from './ReadingItem';

export default function ReadingList({ readings, loading, onEdit, onDelete }) {
  return (
    <section className="card">
      <h2>Readings</h2>

      {loading && <Loader label="Loading readings…" />}

      {!loading && readings.length === 0 && (
        <EmptyState message="No readings for this day yet. Add your first one." />
      )}

      {!loading && readings.length > 0 && (
        <ul className="reading-list">
          {readings.map((reading) => (
            <ReadingItem
              key={reading.id}
              reading={reading}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
