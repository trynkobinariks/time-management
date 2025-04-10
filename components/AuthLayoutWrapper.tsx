'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer/Footer';
import { HelpButton } from './InfoHelp';
import { isAuthPage } from '@/lib/utils/route-utils';

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
}

const AuthLayoutWrapper: React.FC<AuthLayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthPage(pathname));

    // Apply overflow hidden to body for auth pages
    if (isAuth) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [pathname, isAuth]);

  return (
    <>
      <main className="flex-grow">{children}</main>
      {!isAuth && (
        <>
          <Footer appName="Voice Tracker" />
          <HelpButton />
        </>
      )}
    </>
  );
};

export default AuthLayoutWrapper;
