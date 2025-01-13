export type AuthMethod = 'phone' | 'email' | 'apple';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  level: 'basic' | 'vip';
  points: number;
}

export interface SignupCredentials {
  email?: string;
  phone?: string;
  verificationCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 