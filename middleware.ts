import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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
  const protectedRoutes = ['/app', '/settings', '/profile'];
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
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
