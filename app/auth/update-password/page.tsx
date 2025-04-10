'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import PasswordInput from '@/components/PasswordInput';
import { updatePasswordAction } from '@/lib/supabase/auth-actions';
import AuthBackground from '@/components/AuthBackground';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  // Client-side validation
  useEffect(() => {
    setError(null);
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setFormValid(false);
      } else if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setFormValid(false);
      } else {
        setFormValid(true);
      }
    } else {
      setFormValid(false);
    }
  }, [password, confirmPassword]);

  return (
    <div className="min-h-[calc(100vh-env(safe-area-inset-top))] flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pb-env(safe-area-inset-bottom) auth-background">
      <AuthBackground />
      <div className="max-w-md w-full space-y-6 auth-card relative z-10">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h2 className="text-center text-3xl font-medium text-white">
            Update your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Please enter your new password below.
          </p>
        </div>
        <form className="mt-8 space-y-6" action={updatePasswordAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <PasswordInput
              id="password"
              label="New password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="New password"
              rounded="top"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <PasswordInput
              id="confirm-password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Confirm new password"
              rounded="bottom"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              disabled={!formValid}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                !formValid ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
