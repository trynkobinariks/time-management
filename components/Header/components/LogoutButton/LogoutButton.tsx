import React from 'react';
import LogoutIcon from '../../../icons/LogoutIcon';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const handleSignOut = async () => {
    try {
      // Sign out directly using the client-side Supabase client
      const supabase = createClient();
      await supabase.auth.signOut();

      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback redirect
      window.location.href = '/auth/login';
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="p-2 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-border)] cursor-pointer"
      aria-label="Sign out"
    >
      <LogoutIcon />
    </button>
  );
}
