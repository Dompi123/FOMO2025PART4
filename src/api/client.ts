import { API_CONFIG, type ApiErrorType, type ApiResponse } from './config';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.headers = { ...API_CONFIG.headers };
    this.timeout = API_CONFIG.timeout;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    if (!response.ok) {
      let error: ApiError;
      if (isJson) {
        const data = await response.json();
        error = {
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || 'An unknown error occurred',
          status: response.status,
          details: data.details,
          name: 'ApiError'
        };
      } else {
        error = {
          code: 'NETWORK_ERROR',
          message: response.statusText || 'Network error occurred',
          status: response.status,
          name: 'ApiError'
        };
      }
      throw new ApiError(error.code, error.message, error.status, error.details);
    }

    if (isJson) {
      return response.json();
    }
    
    return {
      data: null as T,
      meta: {}
    };
  }

  private getRequestInit(options: RequestInit = {}): RequestInit {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    return {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      },
      signal: controller.signal,
      credentials: 'include'
    };
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(
      `${this.baseUrl}${endpoint}`,
      this.getRequestInit({ ...options, method: 'GET' })
    );
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(
      `${this.baseUrl}${endpoint}`,
      this.getRequestInit({
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      })
    );
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(
      `${this.baseUrl}${endpoint}`,
      this.getRequestInit({
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
      })
    );
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(
      `${this.baseUrl}${endpoint}`,
      this.getRequestInit({ ...options, method: 'DELETE' })
    );
    return this.handleResponse<T>(response);
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.headers['Authorization'];
  }
} 