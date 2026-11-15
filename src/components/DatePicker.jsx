import todayString from '../utils/todayString';

export default function DatePicker({ date, onChange }) {
  const handleChange = (event) => {
    // Keep the last valid date if the native picker is cleared.
    if (event.target.value) onChange(event.target.value);
  };

  return (
    <div className="date-picker">
      <label htmlFor="selected-date">Date</label>
      <input
        id="selected-date"
        type="date"
        value={date}
        max={todayString()}
        onChange={handleChange}
      />
    </div>
  );
}
