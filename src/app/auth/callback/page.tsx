'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
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

        // Set the session in Supabase's internal storage
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        // Double check the session is set
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('Failed to retrieve session after code exchange');
        }

        // Give a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Use router.push first to update Next.js router state
        router.push(next);
        
        // Then force a full page refresh to ensure everything is in sync
        setTimeout(() => {
          window.location.href = next;
        }, 100);
      } catch (error) {
        console.error('Auth callback error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to verify email';
        router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleCallback();
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