import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for RSC requests
  if (req.url.includes('_rsc') || req.url.includes('_next/data')) {
    return NextResponse.next();
  }

  // Create a response to modify its headers
  const res = NextResponse.next();
  
  // Create the Supabase client
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh the session and get the user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define auth pages that should be accessible without a session
  const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/auth/reset-password'];
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/');
  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);
  
  // Special handling for callback page
  if (req.nextUrl.pathname === '/auth/callback') {
    return res;
  }

  // If there's no session and trying to access a protected route
  // if (!session && !isPublicRoute) {
  //   const redirectUrl = new URL('/auth/login', req.url);
  //   // Preserve the original URL as a "next" parameter
  //   redirectUrl.searchParams.set('next', req.nextUrl.pathname);
  //   return NextResponse.redirect(redirectUrl);
  // }

  // If there's a session and trying to access auth pages
  if (session && isAuthPage) {
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