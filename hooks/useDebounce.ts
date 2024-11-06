import { useState, useEffect } from 'react';
import _, { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useDebouncedQuery = ({ queryKey, queryFn, delay = 500 }: { queryKey: string[]; queryFn: () => any; delay?: number }) => {
  const debouncedQueryFn = debounce(queryFn, delay);
  return useQuery({ queryKey, queryFn: debouncedQueryFn });
};
