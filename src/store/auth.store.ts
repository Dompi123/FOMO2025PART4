import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, SignupCredentials } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthStore extends AuthState {
  signup: (method: 'phone' | 'email', value: string) => Promise<void>;
  verifyCode: (credentials: SignupCredentials) => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      signup: async (method, value) => {
        try {
          set({ loading: true, error: null });
          const response = method === 'phone' 
            ? await authService.signupWithPhone(value)
            : await authService.signupWithEmail(value);
          set({ user: response.user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to sign up' });
        } finally {
          set({ loading: false });
        }
      },

      verifyCode: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const response = await authService.verifyCode(credentials);
          set({ user: response.user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to verify code' });
        } finally {
          set({ loading: false });
        }
      },

      signInWithApple: async () => {
        try {
          set({ loading: true, error: null });
          const response = await authService.signInWithApple();
          set({ user: response.user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to sign in with Apple' });
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          set({ loading: true, error: null });
          await authService.logout();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to logout' });
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
); 