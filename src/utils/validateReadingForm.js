import todayString from './todayString';

/**
 * Client-side checks only. Duplicate-slot and max-4-per-day rules
 * belong to the server, so those messages come from the API.
 */
export default function validateReadingForm({ date, value }) {
  if (date && date > todayString()) {
    return 'Date cannot be in the future.';
  }

  const rawValue = value === null || value === undefined ? '' : String(value).trim();

  if (rawValue === '') {
    return 'Please enter a glucose value.';
  }

  const amount = Number(rawValue);

  if (!Number.isInteger(amount) || amount < 40 || amount > 600) {
    return 'Value must be between 40 and 600 mg/dl.';
  }

  return '';
}
