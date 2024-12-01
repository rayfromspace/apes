import { toast } from 'react-hot-toast';

export type ApiError = {
  error: string;
  status?: number;
};

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};

const DEFAULT_ERROR = 'Something went wrong. Please try again.';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        error: data.error || DEFAULT_ERROR,
        status: response.status,
      };
    }

    return { data };
  } catch (error) {
    const apiError = error as ApiError;
    return { error: apiError };
  }
}

export async function uploadFile(
  endpoint: string,
  formData: FormData,
  options: Omit<RequestInit, 'body'> = {}
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      body: formData,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        error: data.error || DEFAULT_ERROR,
        status: response.status,
      };
    }

    return { data };
  } catch (error) {
    const apiError = error as ApiError;
    return { error: apiError };
  }
}

export const handleApiError = (error: ApiError) => {
  toast.error(error.error || DEFAULT_ERROR);
  return null;
};
