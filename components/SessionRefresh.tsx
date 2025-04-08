'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

export default function SessionRefresh() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supabase = createClient();

    // List of routes that should be protected
    const protectedRoutes = [
      '/settings',
      '/profile',
      '/projects',
      '/time-entries',
    ];
    const isProtectedRoute = protectedRoutes.some(route =>
      pathname.startsWith(route),
    );

    // Check session status immediately
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      // For protected routes, redirect to login if no session
      if (!data.session && isProtectedRoute) {
        window.location.href = `/auth/login?next=${encodeURIComponent(pathname)}`;
        return;
      }
    };

    // Perform the initial check
    checkSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        // After sign-in, refresh the page to get the latest session
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        // If user signed out and on a protected route, redirect to login
        if (isProtectedRoute) {
          window.location.href = '/auth/login';
        } else {
          // Otherwise just refresh the current page
          router.refresh();
        }
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refresh doesn't need a full page refresh
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  return null;
}
