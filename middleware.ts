import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for RSC requests
  if (req.url.includes('_rsc') || req.url.includes('_next/data')) {
    return NextResponse.next();
  }

  // Initialize response object that we can modify
  const res = NextResponse.next();

  // Create supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  // Refresh session if expired & get user info
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  // Define auth pages that should be accessible without a session
  const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/auth/reset-password'];
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/');
  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);

  // Special handling for callback page
  if (req.nextUrl.pathname === '/auth/callback') {
    return res;
  }

  // If there's no user and trying to access a protected route
  if (!user && !isAuthPage && !isPublicRoute) {
    const redirectUrl = new URL('/auth/login', req.url);
    // Preserve the original URL as a "next" parameter
    redirectUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a user and trying to access auth pages
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
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
