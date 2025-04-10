'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { signInAction } from '@/lib/supabase/auth-actions';
import { useClientTranslation } from '@/hooks/useClientTranslation';

const LoginContent = () => {
  const { t } = useClientTranslation();
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  React.useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="w-full relative z-10 py-6">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-center text-2xl sm:text-3xl font-medium text-gray-900 dark:text-[var(--text-primary)]">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-[var(--text-secondary)]">
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.login.createAccount')}
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-4 z-50" action={signInAction}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-3">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">
                    {t('auth.login.error')}
                  </h3>
                  <div className="mt-1 text-sm text-red-100">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('auth.login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-[var(--card-border)] bg-white dark:bg-[var(--card-background)] placeholder-gray-500 dark:placeholder-[var(--text-secondary)] text-gray-900 dark:text-[var(--text-primary)] rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.login.email')}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {t('auth.login.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-[var(--card-border)] bg-white dark:bg-[var(--card-background)] placeholder-gray-500 dark:placeholder-[var(--text-secondary)] text-gray-900 dark:text-[var(--text-primary)] rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.login.password')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/reset-password"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
          </div>

          <input type="hidden" name="next" value={next} />

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              {t('auth.login.signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { t } = useClientTranslation();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center text-[var(--text-primary)]">
          {t('auth.loading')}
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
