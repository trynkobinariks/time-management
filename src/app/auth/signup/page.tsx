'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Logo from '@/components/Logo';
import PasswordInput from '@/components/PasswordInput';
import { useClientTranslation } from '@/hooks/useClientTranslation';

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

export default function SignUpPage() {
  const { t } = useClientTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(
          error.message || 'Failed to create account. Please try again.',
        );
        return;
      }

      // Check if the user already exists (Supabase returns a user with identities=[] for existing emails)
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        setError(
          'An account with this email already exists. Please sign in instead.',
        );
        return;
      }

      if (!data.user) {
        setError('Failed to create account. Please try again.');
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-env(safe-area-inset-top))] flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8 pb-env(safe-area-inset-bottom) auth-background">
        <AuthBackground />
        <div className="max-w-md w-full space-y-6">
          <div className="flex flex-col items-center">
            <Logo size="lg" className="mb-4" />
            <h2 className="text-center text-3xl font-medium text-[var(--text-primary)]">
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
    <div className="min-h-[calc(100vh-env(safe-area-inset-top))] flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8 pb-env(safe-area-inset-bottom) auth-background">
      <AuthBackground />
      <div className="max-w-md w-full space-y-6">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h2 className="text-center text-3xl font-medium text-[var(--text-primary)]">
            {t('auth.signup.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            <Link
              href="/auth/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              {t('auth.login.signIn')}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--card-border)] bg-[var(--card-background)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.login.email')}
              />
            </div>
            <PasswordInput
              id="password"
              label={t('auth.login.password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={t('auth.login.password')}
              disabled={loading}
              rounded="bottom"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--card-border)] bg-[var(--card-background)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white cursor-pointer ${
                loading
                  ? 'bg-[var(--card-border)]'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? t('auth.loading') : t('auth.signup.createAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
