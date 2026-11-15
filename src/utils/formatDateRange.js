import { MONTHS, parseIsoDate } from './formatDate';

// "1 Oct - 15 Oct 2026", or "28 Oct 2025 - 3 Nov 2026" across years.
export default function formatDateRange(from, to) {
  if (!from || !to) return '';

  const start = parseIsoDate(from);
  const end = parseIsoDate(to);
  const startLabel = `${start.day} ${MONTHS[start.month - 1]}`;
  const endLabel = `${end.day} ${MONTHS[end.month - 1]}`;

  if (start.year === end.year) {
    return `${startLabel} - ${endLabel} ${end.year}`;
  }

  return `${startLabel} ${start.year} - ${endLabel} ${end.year}`;
}
