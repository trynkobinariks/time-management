'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { signUpAction } from '@/lib/supabase/auth-actions';
import { Form, FormField, FormLabel, Input, Button } from '@/components/ui';
import PasswordToggle from '@/components/PasswordToggle';

const SignUpPage = () => {
  const { t } = useClientTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('auth.signup.backToLogin')}
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
            {t('auth.signup.alreadyHaveAccount')}{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('auth.login.signIn')}
            </Link>
          </p>
        </div>
        <Form className="mt-6 space-y-6" action={signUpAction}>
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

          <FormField name="password">
            <FormLabel htmlFor="password" className="sr-only">
              {t('auth.login.password')}
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
                placeholder={t('auth.login.password')}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <PasswordToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
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

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {t('auth.signup.createAccount')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;
