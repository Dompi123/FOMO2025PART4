export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  version: 'v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

export type ApiErrorType = {
  code: string;
  message: string;
  status: number;
  details?: Record<string, any>;
  name: string;
};

export type ApiResponse<T> = {
  data: T;
  error?: ApiErrorType;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}; 