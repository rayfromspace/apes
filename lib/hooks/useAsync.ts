import { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies: any[] = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const execute = useCallback(async () => {
    setState((prevState) => ({ ...prevState, isLoading: true }));

    try {
      const response = await asyncFunction();
      setState({ data: response, error: null, isLoading: false });
      return response;
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        isLoading: false,
      });
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({
        data: null,
        error: null,
        isLoading: false,
      });
    }, []),
  };
}
