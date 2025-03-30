'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth';
import Logo from '@/components/Logo';
import PasswordInput from '@/components/PasswordInput';

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

  useEffect(() => {
    const errorMessage = searchParams.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
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

      // Ensure we set the flag in session storage
      try {
        // Setting a session storage flag with a timestamp to make it unique
        sessionStorage.removeItem('justLoggedIn');
        sessionStorage.setItem('justLoggedIn', 'true');
        // Also set a local storage backup in case session storage doesn't persist
        localStorage.setItem('showWelcome', Date.now().toString());
        console.log('Set login flags in storage');
      } catch (err) {
        console.error('Failed to set storage:', err);
      }

      // Get the next path from search params or default to home
      const nextPath = searchParams.get('next') || '/';
      // Force a router refresh to update auth state
      router.refresh();
      
      // Use replace instead of push to avoid back button issues
      router.replace(nextPath);
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in. Please check your credentials.');
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
            Login to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{' '}
            <Link href="/auth/signup" className="font-medium text-blue-400 hover:text-blue-300">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-100">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
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
                placeholder="Email address"
                disabled={loading}
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Password"
              disabled={loading}
              rounded="bottom"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/reset-password" className="font-medium text-blue-400 hover:text-blue-300">
                Forgot your password?
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 
