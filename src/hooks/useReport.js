import { useEffect, useState } from 'react';
import getErrorMessage from '../utils/getErrorMessage';

/**
 * Shared by all three report cards. fetchReport must be a stable
 * module-level function so the effect does not run on every render.
 */
export default function useReport(fetchReport, date, refreshKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true; // Ignore a slow response once the date changes.

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const report = await fetchReport(date);
        if (active) setData(report);
      } catch (err) {
        if (active) {
          setData(null);
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [fetchReport, date, refreshKey]);

  return { data, loading, error };
}
