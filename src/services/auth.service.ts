import { apiClient } from '@/lib/api-client';
import type { AuthResponse, SignupCredentials } from '@/types/auth';

export const authService = {
  async signupWithPhone(phone: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/phone/signup', { phone });
  },

  async signupWithEmail(email: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/email/signup', { email });
  },

  async verifyCode(credentials: SignupCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/verify', credentials);
  },

  async signInWithApple(): Promise<AuthResponse> {
    // Implement Apple Sign In
    return apiClient.post<AuthResponse>('/auth/apple');
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}; 