import { apiClient } from '@/lib/api-client';
import type { AuthResponse, SignupCredentials } from '@/types/auth';
import type { ApiSuccessResponse } from '@/types/api';

export const authService = {
  async signupWithPhone(phone: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/phone/signup', { phone });
    return response.data;
  },

  async signupWithEmail(email: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/email/signup', { email });
    return response.data;
  },

  async verifyCode(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/verify', credentials);
    return response.data;
  },

  async signInWithApple(): Promise<AuthResponse> {
    // Implement Apple Sign In
    const response = await apiClient.post<AuthResponse>('/auth/apple');
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}; 