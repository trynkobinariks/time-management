'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import PasswordInput from '@/components/PasswordInput';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { signUpAction } from '@/lib/supabase/auth-actions';

const SignUpPage = () => {
  const { t } = useClientTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }

    const successParam = searchParams.get('success');
    if (successParam) {
      setSuccess(true);
    }
  }, [searchParams]);

  if (success) {
    return (
      <div className="w-full px-4 sm:px-6">
        <div className="w-full space-y-6 relative z-10 py-6">
          <div className="flex flex-col items-center">
            <Logo size="lg" className="mb-6" />
            <h2 className="text-center text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
              {t('auth.signup.checkEmail')}
            </h2>
            <div className="mt-4 text-center text-sm text-[var(--text-secondary)] space-y-4">
              <p>{t('auth.signup.verificationSent')}</p>
              <p className="font-medium">{t('auth.signup.autoRedirect')}</p>
              <p className="text-xs">{t('auth.signup.spamNote')}</p>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
            >
              {t('auth.signup.returnToLogin')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="w-full space-y-6 relative z-10 py-6">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-center text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
            {t('auth.signup.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.login.signIn')}
            </Link>
          </p>
        </div>
        <form className="mt-6 space-y-6" action={signUpAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                {t('auth.login.email')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-[var(--card-border)] bg-[var(--card-background)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.login.email')}
              />
            </div>
            <PasswordInput
              id="password"
              label={t('auth.login.password')}
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={t('auth.login.password')}
              rounded="bottom"
              className="appearance-none rounded-none relative block w-full px-3 py-3 border border-[var(--card-border)] bg-[var(--card-background)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              {t('auth.signup.createAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
