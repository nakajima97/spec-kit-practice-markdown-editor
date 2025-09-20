import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseDebouncedResult<T> {
  debouncedValue: T;
  isPending: boolean;
  forceUpdate: () => void;
}

export function useDebounced<T>(
  value: T,
  delay: number,
): UseDebouncedResult<T> {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentValueRef = useRef<T>(value);

  // Update current value ref
  currentValueRef.current = value;

  const forceUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDebouncedValue(currentValueRef.current);
    setIsPending(false);
  }, []);

  useEffect(() => {
    // If value hasn't changed, don't start new timeout
    if (value === debouncedValue) {
      setIsPending(false);
      return;
    }

    setIsPending(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsPending(false);
      timeoutRef.current = null;
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay, debouncedValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedValue,
    isPending,
    forceUpdate,
  };
}
