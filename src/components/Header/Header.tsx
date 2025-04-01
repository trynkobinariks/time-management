'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import Logo from '../Logo';
import ThemeSwitcher from '../ThemeSwitcher';
import LanguageSwitcher from '../LanguageSwitcher';
import LogoutIcon from '../icons/LogoutIcon';
import MenuIcon from '../icons/MenuIcon';
import CloseIcon from '../icons/CloseIcon';
import Backdrop from '../Backdrop/Backdrop';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import { supabase } from '@/lib/supabase';
import { navItems } from './config';
export default function Header() {
  const pathname = usePathname();
  const { t } = useClientTranslation();
  const router = useRouter();
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

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };


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
              <nav className="ml-8 hidden md:flex">
                <div className="flex space-x-0">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-6 py-2 text-sm font-medium transition-all rounded-md ${
                        pathname === item.href
                          ? 'bg-[var(--card-border)] text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {t(item.name)}
                    </Link>
                  ))}
                </div>
              </nav>
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
                {/* Logout icon button */}
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-border)]"
                  aria-label="Sign out"
                >
                  <LogoutIcon />
                </button>
                
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
        <div className={`md:hidden fixed inset-y-0 right-0 w-64 bg-[var(--card-background)] shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}>
          <div className="h-full flex flex-col pt-16 pb-3 px-3 border-l border-[var(--card-border)]">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-border)]"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? 'bg-[var(--text-primary)] text-[var(--background)]'
                      : 'bg-[var(--card-background)] text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.name)}
                </Link>
              ))}
            </div>
            {user && (
              <div className="mt-auto pt-4 border-t border-[var(--card-border)]">
                <span className="block px-4 py-2 text-sm text-[var(--text-secondary)]">
                  {user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Backdrop 
        isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        className="md:hidden"
      />
    </header>
  );
} 
