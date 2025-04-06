'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';

// Background component for auth pages
function AuthBackground() {
  return (
    <>
      <div className="auth-triangle auth-triangle-1"></div>
      <div className="auth-triangle auth-triangle-2"></div>
      <div className="auth-triangle auth-triangle-3"></div>
      <div className="auth-triangle auth-triangle-4"></div>
      <div className="auth-triangle auth-triangle-5"></div>
    </>
  );
}

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
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

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
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to verify email';
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
    <div className="min-h-[calc(100vh-env(safe-area-inset-top))] flex items-center justify-center bg-gray-900 pb-env(safe-area-inset-bottom) auth-background">
      <AuthBackground />
      <div className="p-4 max-w-md w-full auth-card">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h2 className="text-center text-3xl font-medium text-white">
            Verifying your email...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Please wait while we complete the verification process.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-env(safe-area-inset-top))] flex items-center justify-center bg-gray-900 pb-env(safe-area-inset-bottom) auth-background">
          <AuthBackground />
          <div className="p-4 max-w-md w-full auth-card">
            <div className="flex flex-col items-center">
              <Logo size="lg" className="mb-4" />
              <h2 className="text-center text-3xl font-medium text-white">
                Loading...
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
