'use client';

import React, { useState } from 'react';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from '../LanguageSwitcher';
import Backdrop from '../Backdrop/Backdrop';
import { useLanguage } from '../../contexts/LanguageContext';
import { navItems } from './config';
import MobileNavigation from './components/MobileNavigation/MobileNavigation';
import DesktopNavigation from './components/DesktopNavigation/DesktopNavigation';
import LogoutButton from './components/LogoutButton/LogoutButton';
import BurgerMenuButton from './components/BurgerMenuButton/BurgerMenuButton';
import LogoLink from './components/LogoLink/LogoLink';
import { Session } from '@supabase/supabase-js';

export default function Header({ session }: { session: Session | null }) {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = session?.user;

  console.log('====================================');
  console.log(user);
  console.log('====================================');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--card-background)] border-b border-[var(--card-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <LogoLink />
            {user && <DesktopNavigation navItems={navItems} />}
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            <ThemeSwitcher />
            {user && (
              <>
                <span className="text-sm text-[var(--text-secondary)] hidden md:inline">
                  {user.email}
                </span>
                <LogoutButton />
                <BurgerMenuButton
                  isMenuOpen={isMenuOpen}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {user && (
        <MobileNavigation
          user={user}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      <Backdrop
        isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        className="md:hidden"
      />
    </header>
  );
}
