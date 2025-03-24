import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedPaths = [
  '/wallet',
  '/wallet/transfer',
  '/wallet/cross_chain',
  '/wallet/validator',
  '/wallet/earn',
  '/wallet/activity',
  '/wallet/keys',
  '/wallet/advanced',
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  if (isProtectedPath) {
    // Check for auth token in cookies
    const authToken = request.cookies.get('isAuthenticated');
    const isAuthenticated = !!authToken;

    if (!isAuthenticated) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/wallet/:path*'],
}; 