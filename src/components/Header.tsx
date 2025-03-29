'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import Logo from './Logo';
import { useTheme } from '@/lib/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  const [user, setUser] = React.useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { colors } = useTheme();

  React.useEffect(() => {
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
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  
  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Time Entries', href: '/time-entries' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <header className={`sticky top-0 z-50 ${colors.surface} ${colors.border} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo size="md" className="mr-2" />
              <span className={`text-xl font-bold ${colors.text} hidden sm:inline`}>
                Hours Tracker
              </span>
            </Link>
            {/* Desktop navigation */}
            <nav className="ml-8 hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === item.href
                      ? `${colors.primary} text-white shadow-md`
                      : `${colors.secondary} ${colors.text} ${colors.secondaryHover}`
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            {user && (
              <>
                <span className={`text-sm ${colors.textSecondary} hidden md:inline`}>
                  {user.email}
                </span>
                {/* Logout icon button */}
                <button
                  onClick={() => signOut()}
                  className={`p-2 rounded-full ${colors.secondary} ${colors.secondaryHover}`}
                  aria-label="Sign out"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${colors.text}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                </button>
                
                {/* Mobile burger menu button */}
                <button
                  className={`ml-2 inline-flex items-center justify-center p-2 rounded-md ${colors.text} ${colors.secondary} ${colors.secondaryHover} md:hidden`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      <div className={`md:hidden fixed inset-y-0 right-0 w-64 ${colors.surface} shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
        isMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
      }`}>
        <div className={`h-full flex flex-col pt-16 pb-3 px-3 ${colors.border} border-l`}>
          <button
            className={`absolute top-4 right-4 p-2 rounded-full ${colors.secondary} ${colors.secondaryHover}`}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${colors.text}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? `${colors.primary} text-white`
                    : `${colors.secondary} ${colors.text} ${colors.secondaryHover}`
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {user && (
            <div className={`mt-auto pt-4 ${colors.border} border-t`}>
              <span className={`block px-4 py-2 text-sm ${colors.textSecondary}`}>
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop overlay when menu is open */}
      <div 
        className={`md:hidden fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-25 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </header>
  );
} 
