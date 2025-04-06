import CloseIcon from '@/components/icons/CloseIcon';
import React from 'react';
import { navItems } from '../../config';
import { MobileNavigationProps } from './types';
import MobileNavigationTab from './MobileNavigationTab';

const MobileNavigation = ({
  isMenuOpen,
  setIsMenuOpen,
  user,
}: MobileNavigationProps) => {
  return (
    <div
      className={`md:hidden fixed inset-y-0 right-0 w-64 bg-[var(--card-background)] shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
        isMenuOpen
          ? 'translate-x-0 pointer-events-auto'
          : 'translate-x-full pointer-events-none'
      }`}
    >
      <div className="h-full flex flex-col pt-16 pb-3 px-3 border-l border-[var(--card-border)]">
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-border)]"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
        <div className="space-y-1">
          {navItems.map(item => (
            <MobileNavigationTab
              key={item.name}
              item={item}
              setIsMenuOpen={setIsMenuOpen}
            />
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
  );
};

export default MobileNavigation;
