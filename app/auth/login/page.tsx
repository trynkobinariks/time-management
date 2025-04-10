'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { signInAction } from '@/lib/supabase/auth-actions';
import { Form, FormField, FormLabel, Input, Button } from '@/components/ui';
import PasswordToggle from '@/components/PasswordToggle';

const LoginPage = () => {
  const { t } = useClientTranslation();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="w-full space-y-6 relative z-10 py-6">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-center text-2xl sm:text-3xl font-medium text-[var(--text-primary)]">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {t('auth.login.noAccount')}{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('auth.login.signUp')}
            </Link>
          </p>
        </div>

        <Form className="mt-6 space-y-6" action={signInAction}>
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
                autoComplete="current-password"
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

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
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

          <input type="hidden" name="next" value={next} />

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {t('auth.login.signIn')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
