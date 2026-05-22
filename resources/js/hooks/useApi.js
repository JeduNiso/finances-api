import { useState, useCallback } from 'react';

export function useApi(apiFn) {
  const [data,      setData]      = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (e) {
      setError(e.response?.data?.message ?? 'Error inesperado');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [apiFn]);

  return { data, isLoading, error, execute };
}
