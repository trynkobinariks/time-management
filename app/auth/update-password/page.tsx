'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { updatePasswordAction } from '@/lib/supabase/auth-actions';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { Form, FormField, FormLabel, Input, Button } from '@/components/ui';
import PasswordToggle from '@/components/PasswordToggle';

const UpdatePasswordPage = () => {
  const { t } = useClientTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <div className="w-full space-y-6 relative z-10 py-6">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-center text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
            {t('auth.updatePassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {t('auth.updatePassword.instructions')}
          </p>
        </div>
        <Form className="mt-6 space-y-6" action={updatePasswordAction}>
          <FormField name="password">
            <FormLabel htmlFor="password" className="sr-only">
              {t('auth.updatePassword.newPassword')}
            </FormLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                size="lg"
                hideLabel
                placeholder={t('auth.updatePassword.newPassword')}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <PasswordToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
          </FormField>

          <FormField name="confirm-password">
            <FormLabel htmlFor="confirm-password" className="sr-only">
              {t('auth.updatePassword.confirmPassword')}
            </FormLabel>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                size="lg"
                hideLabel
                placeholder={t('auth.updatePassword.confirmPassword')}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <PasswordToggle
                  showPassword={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>
          </FormField>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!formValid}
          >
            {t('auth.updatePassword.updateButton')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
