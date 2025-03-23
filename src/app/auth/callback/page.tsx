'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the auth code from the URL
        const code = searchParams.get('code');
        const next = searchParams.get('next') || '/';
        
        if (!code) {
          throw new Error('No code found in URL');
        }

        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          throw error;
        }

        if (!data.session) {
          throw new Error('No session returned from code exchange');
        }

        // Once the session is established, redirect to the destination
        // No need to manually set the session as exchangeCodeForSession already does that
        router.push(next);

      } catch (error) {
        console.error('Auth callback error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to verify email';
        router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleCallback();

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
            Verifying your email...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we complete the verification process.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
            Loading...
          </h2>
        </div>
      </div>
    </div>}>
      <AuthCallbackContent />
    </Suspense>
  );
} 