import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // You can add auth tokens or other headers here
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        message: (error.response.data as any)?.message || 'An error occurred',
        status: error.response.status,
        code: (error.response.data as any)?.code,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response received from server',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something happened in setting up the request
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'REQUEST_SETUP_ERROR',
      };
    }
  }

  // Generic request method
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url,
        data,
        ...config,
      });
      return { data: response.data };
    } catch (error) {
      if (error instanceof Error) {
        return { error: this.handleError(error as AxiosError) };
      }
      return {
        error: {
          message: 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR',
        },
      };
    }
  }

  // HTTP method wrappers
  public async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  public async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }
}

export const apiClient = ApiClient.getInstance();
