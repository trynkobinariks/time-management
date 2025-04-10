'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import PasswordInput from '@/components/PasswordInput';
import { updatePasswordAction } from '@/lib/supabase/auth-actions';
import { useClientTranslation } from '@/hooks/useClientTranslation';

const UpdatePasswordPage = () => {
  const { t } = useClientTranslation();
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
        setError(t('auth.updatePassword.passwordMismatch'));
        setFormValid(false);
      } else if (password.length < 6) {
        setError(t('auth.updatePassword.passwordTooShort'));
        setFormValid(false);
      } else {
        setFormValid(true);
      }
    } else {
      setFormValid(false);
    }
  }, [password, confirmPassword, t]);

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="w-full relative z-10 py-6">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-center text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
            {t('auth.updatePassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {t('auth.updatePassword.instructions')}
          </p>
        </div>
        <form className="mt-6 space-y-6" action={updatePasswordAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <PasswordInput
              id="password"
              label={t('auth.updatePassword.newPassword')}
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={t('auth.updatePassword.newPassword')}
              rounded="top"
              className="appearance-none rounded-none relative block w-full px-3 py-3 border border-[var(--card-border)] bg-[var(--card-background)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <PasswordInput
              id="confirm-password"
              label={t('auth.updatePassword.confirmPassword')}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={t('auth.updatePassword.confirmPassword')}
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
              disabled={!formValid}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                !formValid ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {t('auth.updatePassword.updateButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
