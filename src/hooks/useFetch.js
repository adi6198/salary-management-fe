import { useState, useEffect, useCallback } from 'react';

export const useFetch = (apiFunc, immediate = true) => {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      // Depending on interceptor, response might be { success, data } or just response
      const responseData = response?.data !== undefined ? response.data : response;
      setData(responseData);
      if (response?.meta !== undefined) {
        setMeta(response.meta);
      }
      return { success: true, data: responseData, meta: response?.meta };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      execute();
    }
  }, [execute, immediate]);

  return { data, meta, loading, error, execute };
};
