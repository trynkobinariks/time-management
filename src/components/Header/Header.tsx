'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import Logo from '../Logo';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from '../LanguageSwitcher';
import MenuIcon from '../icons/MenuIcon';
import CloseIcon from '../icons/CloseIcon';
import Backdrop from '../Backdrop/Backdrop';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import { supabase } from '@/lib/supabase';
import { navItems } from './config';
import MobileNavigation from './components/MobileNavigation/MobileNavigation';
import DesktopNavigation from './components/DesktopNavigation/DesktopNavigation';
import LogoutButton from './components/LogoutButton/LogoutButton';

export default function Header() {
  const pathname = usePathname();
  const { t } = useClientTranslation();
  const { language, setLanguage } = useLanguage();
  const [user, setUser] = React.useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--card-background)] border-b border-[var(--card-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo size="md" className="mr-2" />
              <span className="text-xl font-bold text-[var(--text-primary)] hidden sm:inline">
                {t('header.appName')}
              </span>
            </Link>
            {/* Desktop navigation */}
            {user && (
              <DesktopNavigation navItems={navItems} />
            )}
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher 
              language={language}
              setLanguage={setLanguage}
            />
            <ThemeSwitcher />
            {user && (
              <>
                <span className="text-sm text-[var(--text-secondary)] hidden md:inline">
                  {user.email}
                </span>
                <LogoutButton />
                
                {/* Mobile burger menu button */}
                <button
                  className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-[var(--text-primary)] bg-[var(--card-background)] hover:bg-[var(--card-border)] md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMenuOpen ? (
                    <MenuIcon />
                  ) : (
                    <CloseIcon />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {user && (
        <MobileNavigation user={user} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} pathname={pathname} />
      )}
      
      <Backdrop 
        isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        className="md:hidden"
      />
    </header>
  );
} 
