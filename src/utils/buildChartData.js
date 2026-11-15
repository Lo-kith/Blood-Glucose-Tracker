import { MONTHS, parseIsoDate } from './formatDate';
import SLOTS from './slots';

/**
 * One row per calendar day from the 1st of the selected month to the
 * selected date. Missing slots become null so the lines can connect gaps.
 */
export default function buildChartData(readings = [], selectedDate) {
  if (!selectedDate) return [];

  const { year, month, day: lastDay } = parseIsoDate(selectedDate);
  const monthKey = String(month).padStart(2, '0');

  const valueByDateAndSlot = new Map(
    readings.map((reading) => [`${reading.date}|${reading.slot}`, reading.value]),
  );

  return Array.from({ length: lastDay }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${monthKey}-${String(day).padStart(2, '0')}`;
    const row = { day, label: `${day} ${MONTHS[month - 1]}` };

    for (const slot of SLOTS) {
      row[slot.key] = valueByDateAndSlot.get(`${date}|${slot.key}`) ?? null;
    }

    return row;
  });
}
