'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    danger: string;
    dangerHover: string;
  };
}

const lightColors = {
  background: 'bg-gray-50',
  surface: 'bg-white',
  text: 'text-gray-900',
  textSecondary: 'text-gray-500',
  border: 'border-gray-200',
  primary: 'bg-gray-900',
  primaryHover: 'hover:bg-gray-800',
  secondary: 'bg-gray-100',
  secondaryHover: 'hover:bg-gray-200',
  danger: 'text-red-600',
  dangerHover: 'hover:text-red-700',
};

const darkColors = {
  background: 'bg-gray-900',
  surface: 'bg-gray-800',
  text: 'text-gray-100',
  textSecondary: 'text-gray-400',
  border: 'border-gray-700',
  primary: 'bg-gray-100',
  primaryHover: 'hover:bg-gray-200',
  secondary: 'bg-gray-700',
  secondaryHover: 'hover:bg-gray-600',
  danger: 'text-red-400',
  dangerHover: 'hover:text-red-300',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(savedTheme || systemTheme);
  }, []);

  useEffect(() => {
    // Update document class and save theme preference
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 