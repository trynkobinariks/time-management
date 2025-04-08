import React from 'react';
import LogoutIcon from '../../../icons/LogoutIcon';
import { signOutAction } from '@/lib/supabase/auth-actions';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOutAction()}
      className="p-2 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-border)] cursor-pointer"
      aria-label="Sign out"
    >
      <LogoutIcon />
    </button>
  );
}
