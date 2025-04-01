import React from 'react';
import MenuIcon from '../../../icons/MenuIcon';
import CloseIcon from '../../../icons/CloseIcon';

interface BurgerMenuButtonProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

export default function BurgerMenuButton({ isMenuOpen, onClick }: BurgerMenuButtonProps) {
  return (
    <button
      className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-[var(--text-primary)] bg-[var(--card-background)] hover:bg-[var(--card-border)] md:hidden"
      onClick={onClick}
      aria-expanded={isMenuOpen}
    >
      <span className="sr-only">Open main menu</span>
      {!isMenuOpen ? (
        <MenuIcon />
      ) : (
        <CloseIcon />
      )}
    </button>
  );
} 