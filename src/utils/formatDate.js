export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Splits 'YYYY-MM-DD' by hand. Never pass the string to Date(),
 * because that parses as UTC and can shift the day in local time.
 */
export function parseIsoDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

// 2026-10-01 -> "1 Oct 2026"
export default function formatDate(value) {
  if (!value) return '';

  const { year, month, day } = parseIsoDate(value);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
