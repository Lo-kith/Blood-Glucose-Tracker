import { useState } from 'react';
import createReading from '../api/readings/createReading';
import updateReading from '../api/readings/updateReading';
import getErrorMessage from '../utils/getErrorMessage';
import SLOTS, { normalizeSlotKey } from '../utils/slots';
import todayString from '../utils/todayString';
import validateReadingForm from '../utils/validateReadingForm';
import ErrorBox from './ErrorBox';

export default function ReadingForm({ initial, defaultDate, onSaved, onCancel }) {
  const isEditing = Boolean(initial);
  const [date, setDate] = useState(initial?.date || defaultDate || todayString());
  const [slot, setSlot] = useState(normalizeSlotKey(initial?.slot) || SLOTS[0].key);
  const [value, setValue] = useState(initial ? String(initial.value) : '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clientError = validateReadingForm({ date, value });
    if (clientError) {
      setError(clientError);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = { date, slot, value: Number(value) };

      if (isEditing) {
        await updateReading(initial.id, payload);
      } else {
        await createReading(payload);
      }

      // A successful save leaves a clean form and no red box.
      setValue('');
      if (!isEditing) setSlot(SLOTS[0].key);
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card">
      <h2>{isEditing ? 'Edit reading' : 'Add a reading'}</h2>

      <form className="stack" onSubmit={handleSubmit} noValidate>
        <ErrorBox message={error} />

        <div className="field">
          <label htmlFor="reading-date">Date</label>
          <input
            id="reading-date"
            type="date"
            value={date}
            max={todayString()}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="reading-slot">Time slot</label>
          <select id="reading-slot" value={slot} onChange={(event) => setSlot(event.target.value)}>
            {SLOTS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="reading-value">Glucose value (mg/dl)</label>
          <input
            id="reading-value"
            type="number"
            inputMode="numeric"
            min="40"
            max="600"
            step="1"
            value={value}
            placeholder="e.g. 95"
            onChange={(event) => setValue(event.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Update reading' : 'Add reading'}
          </button>

          {isEditing && (
            <button type="button" className="button button-ghost" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
