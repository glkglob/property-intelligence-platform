import { useCallback, useEffect, useRef, useState } from 'react';
import {
  generateDesignImage,
  type GenerateDesignParams,
  type GenerateDesignResult,
} from '../lib/generateDesignImage';

interface UseDesignGeneratorReturn {
  generate: (params: GenerateDesignParams) => Promise<void>;
  cancel: () => void;
  isGenerating: boolean;
  progress: number;
  statusMessage: string;
  results: GenerateDesignResult[];
  error: string | null;
  reset: () => void;
}

export function useDesignGenerator(): UseDesignGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [results, setResults] = useState<GenerateDesignResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const generate = useCallback(async (params: GenerateDesignParams): Promise<void> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setStatusMessage('');
    setResults([]);

    try {
      const generated = await generateDesignImage(params, {
        onProgress: (pct, message) => {
          setProgress(pct);
          setStatusMessage(message);
        },
        signal: controller.signal,
      });
      setResults(generated);
      setProgress(100);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Request was cancelled') return;
      setError(err instanceof Error ? err.message : 'Failed to generate design');
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  }, []);

  const cancel = useCallback((): void => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback((): void => {
    abortRef.current?.abort();
    setIsGenerating(false);
    setProgress(0);
    setStatusMessage('');
    setResults([]);
    setError(null);
  }, []);

  return { generate, cancel, isGenerating, progress, statusMessage, results, error, reset };
}
