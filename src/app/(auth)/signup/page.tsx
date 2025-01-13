'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupScreen } from '@/components/features/auth/SignupScreen';
import { useAuthStore } from '@/store/auth.store';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/venues');
    }
  }, [isAuthenticated, router]);

  const handleComplete = () => {
    router.push('/venues');
  };

  return <SignupScreen onComplete={handleComplete} />;
} 