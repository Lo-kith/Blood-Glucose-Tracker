import { useEffect, useState } from 'react';
import getReadingsRange from '../api/readings/getReadingsRange';
import getErrorMessage from '../utils/getErrorMessage';

export default function useReadingsRange(from, to, refreshKey) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true; // A newer range (or unmount) makes this response stale.

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const readings = await getReadingsRange(from, to);
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
  }, [from, to, refreshKey]);

  return { data, loading, error };
}
