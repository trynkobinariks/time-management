import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name) {
          request.cookies.delete(name);
          response.cookies.delete(name);
        },
      },
    },
  );

  // Check auth status
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define protected and public routes
  const protectedRoutes = [
    '/dashboard',
    // '/settings',
    // '/profile',
    '/projects',
    '/time-entries',
  ];
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route),
  );

  const authRoutes = ['/auth/login', '/auth/signup', '/auth/reset-password'];
  const isAuthRoute = authRoutes.some(
    route => request.nextUrl.pathname === route,
  );

  // Handle auth callback route specially
  if (request.nextUrl.pathname === '/auth/callback') {
    return response;
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (request.nextUrl.pathname === '' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Safe list of known routes to prevent redirect loops
  const knownRoutes = [
    '/',
    '/dashboard',
    '/projects',
    '/time-entries',
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password',
    '/auth/callback',
    // Add other known routes here
  ];

  // Check if the current path is a known route or starts with a known route prefix
  const isKnownRoute = knownRoutes.some(
    route =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`),
  );

  // If not a known route and user is not authenticated, redirect to login
  if (!isKnownRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return response;
};
