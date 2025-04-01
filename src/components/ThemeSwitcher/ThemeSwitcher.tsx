'use client';
import { SunIcon, MoonIcon } from '../icons/ThemeIcons';
import { useThemeSwitcher } from './useThemeSwitcher';

export default function ThemeSwitcher() {
  const { isDark, toggleTheme } = useThemeSwitcher();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-border)] transition-colors duration-200 cursor-pointer"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
} 