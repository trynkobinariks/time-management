'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth';
import Logo from '@/components/Logo';
import PasswordInput from '@/components/PasswordInput';
import { useClientTranslation } from '../../../hooks/useClientTranslation';

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

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useClientTranslation();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setError(error);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn(email, password);
      if (!result.user) {
        setError('Failed to sign in. Please check your credentials.');
        return;
      }
      router.push('/');
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-53px-env(safe-area-inset-top))] flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 pb-env(safe-area-inset-bottom) auth-background">
      <AuthBackground />
      <div className="max-w-md w-full space-y-6 auth-card bg-gray-800 p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h2 className="text-center text-3xl font-medium text-white">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {t('auth.login.createAccount')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">{t('auth.login.error')}</h3>
                  <div className="mt-2 text-sm text-red-100">{error}</div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.login.email')}
                disabled={loading}
              />
            </div>
            <PasswordInput
              id="password"
              label={t('auth.login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder={t('auth.login.password')}
              disabled={loading}
              rounded="bottom"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/reset-password" className="font-medium text-blue-400 hover:text-blue-300">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? t('auth.login.signingIn') : t('auth.login.signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useClientTranslation();
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t('auth.loading')}</div>}>
      <LoginContent />
    </Suspense>
  );
} 
