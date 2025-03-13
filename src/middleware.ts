import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Skip middleware for RSC requests
  if (req.url.includes('_rsc') || req.url.includes('_next/data')) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          for (const { name, value } of cookiesToSet) {
            req.cookies.set(name, value);
          }
          response = NextResponse.next({
            request: req,
          });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Define auth pages that should be accessible without a session
  const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/auth/reset-password'];
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/');
  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);

  // Special handling for callback page
  if (req.nextUrl.pathname === '/auth/callback') {
    return response;
  }

  // If there's no user and trying to access a protected route
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/auth/login', req.url);
    // Preserve the original URL as a "next" parameter
    redirectUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a user and trying to access auth pages
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
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