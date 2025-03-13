'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code);
          router.push('/');
        } catch (error) {
          console.error('Error exchanging code for session:', error);
          router.push('/auth/login?error=Unable to verify email');
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
            Verifying your email...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    </div>
  );
} 