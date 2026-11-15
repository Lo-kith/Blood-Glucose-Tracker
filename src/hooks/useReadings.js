import { useEffect, useState } from 'react';
import getReadingsByDate from '../api/readings/getReadingsByDate';
import getErrorMessage from '../utils/getErrorMessage';

export default function useReadings(date, refreshKey) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true; // A newer request (or unmount) makes this one stale.

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const readings = await getReadingsByDate(date);
        if (active) setData(readings);
      } catch (err) {
        if (active) {
          setData([]);
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
  }, [date, refreshKey]);

  return { data, loading, error };
}
