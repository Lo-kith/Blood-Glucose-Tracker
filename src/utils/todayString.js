/**
 * Returns today's LOCAL date as YYYY-MM-DD.
 * Building the string by hand avoids the UTC shift of toISOString().
 */
export default function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
