import React from 'react';
import Link from 'next/link';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import Logo from '@/components/Logo';
export default function LogoLink() {
  const { t } = useClientTranslation();

  return (
    <Link href="/" className="flex items-center">
      <Logo size="md" className="mr-2" />
      <span className="text-xl font-bold text-[var(--text-primary)] hidden sm:inline">
        {t('header.appName')}
      </span>
    </Link>
  );
}
