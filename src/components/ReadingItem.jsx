import { getSlotLabel } from '../utils/slots';

export default function ReadingItem({ reading, onEdit, onDelete }) {
  const slotLabel = getSlotLabel(reading.slot);

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete your ${slotLabel} reading?`);

    if (confirmed) onDelete(reading);
  };

  return (
    <li className="reading-item">
      <div>
        <p className="reading-slot">{slotLabel}</p>
        <p className="reading-value">
          {reading.value} <span>mg/dl</span>
        </p>
      </div>

      <div className="reading-actions">
        <button
          type="button"
          className="button button-small"
          onClick={() => onEdit(reading)}
          aria-label={`Edit ${slotLabel} reading`}
        >
          Edit
        </button>
        <button
          type="button"
          className="button button-small button-danger"
          onClick={handleDelete}
          aria-label={`Delete ${slotLabel} reading`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
