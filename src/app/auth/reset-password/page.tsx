'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';
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

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
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
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
              We&apos;ve sent you an email with a link to reset your password.
              Please check your inbox and click the link to continue.
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
            >
              Return to login
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
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-[var(--card-border)] bg-[var(--card-background)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email address"
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

          <div className="flex items-center justify-between">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Back to login
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-[var(--card-border)]'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
