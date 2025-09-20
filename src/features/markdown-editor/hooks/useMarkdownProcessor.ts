import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { MarkdownParser } from '../utils/markdown-parser';
import { useDebounced } from './useDebounced';

export interface UseMarkdownProcessorOptions {
  debounceMs?: number;
  maxLength?: number;
  enableGFM?: boolean;
}

export interface UseMarkdownProcessorResult {
  processContent: (raw: string) => Promise<ReactNode>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
}

export function useMarkdownProcessor(
  options: UseMarkdownProcessorOptions = {},
): UseMarkdownProcessorResult {
  const { debounceMs = 300, maxLength = 100000, enableGFM = true } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const parserRef = useRef<MarkdownParser>(
    new MarkdownParser({ maxLength, enableGFM }),
  );
  const processingCounterRef = useRef(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const processContent = useCallback(
    async (raw: string): Promise<ReactNode> => {
      const processingId = ++processingCounterRef.current;

      try {
        setIsProcessing(true);
        setError(null);

        // Validate first
        const validation = parserRef.current.validate(raw);
        if (!validation.valid) {
          throw new Error(validation.error || 'Validation failed');
        }

        // Parse the content
        const result = await parserRef.current.parse(raw);

        // Only update state if this is the latest processing request
        if (processingId === processingCounterRef.current) {
          setIsProcessing(false);
        }

        return result;
      } catch (err) {
        // Only update state if this is the latest processing request
        if (processingId === processingCounterRef.current) {
          const errorMessage =
            err instanceof Error ? err.message : 'Processing failed';
          setError(errorMessage);
          setIsProcessing(false);
        }
        throw err;
      }
    },
    [],
  );

  return {
    processContent,
    isProcessing,
    error,
    clearError,
  };
}
