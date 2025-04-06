import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LogoutIcon from '@/components/icons/LogoutIcon';

export default function LogoutButton() {
  const router = useRouter();

  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      onClick={() => signOut()}
      className="p-2 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-border)] cursor-pointer"
      aria-label="Sign out"
    >
      <LogoutIcon />
    </button>
  );
}
