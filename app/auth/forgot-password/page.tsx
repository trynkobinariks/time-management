'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { resetPasswordAction } from '@/lib/supabase/auth-actions';
import { Form, FormField, FormLabel, Input, Button } from '@/components/ui';

const ForgotPasswordPage = () => {
  const { t } = useClientTranslation();
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
              {t('auth.forgotPassword.checkEmail')}
            </h2>
            <div className="mt-4 text-center text-sm text-[var(--text-secondary)] space-y-4">
              <p>{t('auth.forgotPassword.resetSent')}</p>
              <p className="text-xs">{t('auth.forgotPassword.spamNote')}</p>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('auth.forgotPassword.returnToLogin')}
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
            {t('auth.forgotPassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {t('auth.forgotPassword.instruction')}
          </p>
        </div>
        <Form className="mt-6 space-y-6" action={resetPasswordAction}>
          <FormField name="email">
            <FormLabel htmlFor="email-address" className="sr-only">
              {t('auth.login.email')}
            </FormLabel>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              size="lg"
              hideLabel
              placeholder={t('auth.login.email')}
            />
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

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {t('auth.forgotPassword.sendEmail')}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('auth.forgotPassword.returnToLogin')}
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
