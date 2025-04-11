'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';
import { useClientTranslation } from '@/hooks/useClientTranslation';

function AuthCallbackContent() {
  const { t } = useClientTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.getUser();
      const hash = window.location.hash;

      // Get the code from the hash (e.g. #access_token=xxx)
      try {
        // If there's a hash, extract the session information from it
        if (hash) {
          await supabase.auth.getSession();
        }

        // If a session was successfully retrieved, navigate to the app
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (error) {
          // If there was an error, redirect to the sign-in page
          console.error('Error during auth callback:', error);
          window.location.replace(
            '/auth/login?error=' +
              encodeURIComponent(error.message || 'Authentication error'),
          );
          return;
        }

        // Successfully authenticated, redirect to intended destination
        if (user) {
          console.log('User authenticated, redirecting to:', next);

          // Store a flag in sessionStorage to indicate we need to scroll to top after redirect
          sessionStorage.setItem('scrollToTop', 'true');

          const nextUrl = next || '/dashboard';
          router.replace(nextUrl);
          router.refresh();
        } else {
          // No user found, redirect to login with error
          console.error('No user found after authentication');
          window.location.replace('/auth/login?error=Authentication+failed');
        }
      } catch (err) {
        console.error('Error handling callback:', err);
        window.location.replace('/auth/login?error=Authentication+error');
      }
    };

    // Handle the callback when the component mounts
    handleCallback();
  }, [router, next, searchParams]);

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="w-full relative z-10 py-6">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-center text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
            {t('auth.callback.verifying')}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {t('auth.callback.pleaseWait')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  const { t } = useClientTranslation();

  return (
    <Suspense
      fallback={
        <div className="w-full px-4 sm:px-6">
          <div className="w-full relative z-10 py-6">
            <div className="flex flex-col items-center">
              <Logo size="lg" className="mb-6" />
              <h2 className="text-center text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
                {t('auth.loading')}
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
