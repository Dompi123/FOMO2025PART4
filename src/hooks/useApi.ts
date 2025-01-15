import { useState, useCallback } from 'react';
import { api, type ApiResponse, type ApiErrorClass } from '@/api';

interface UseApiState<T> {
  data: T | null;
  error: ApiErrorClass | null;
  isLoading: boolean;
}

interface UseApiActions<T> {
  execute: () => Promise<void>;
  reset: () => void;
  setData: (data: T) => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiErrorClass) => void;
  } = {}
): [UseApiState<T>, UseApiActions<T>] {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: options.immediate ?? false,
  });

  const execute = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const response = await apiCall();
      setState(s => ({ ...s, data: response.data, isLoading: false }));
      options.onSuccess?.(response.data);
    } catch (error) {
      const apiError = error as ApiErrorClass;
      setState(s => ({ ...s, error: apiError, isLoading: false }));
      options.onError?.(apiError);
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  const setData = useCallback((data: T) => {
    setState(s => ({ ...s, data }));
  }, []);

  return [
    state,
    { execute, reset, setData }
  ];
} 