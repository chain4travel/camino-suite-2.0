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

// Auth routes that should redirect to wallet if authenticated
const authPaths = ['/login', '/create'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get('isAuthenticated');
  const isAuthenticated = !authToken?.value;
  console.log(
    'Auth Token:',
    authToken?.value,
    'Is Authenticated:',
    isAuthenticated
  );
  // Create absolute URLs for redirects
  const baseUrl = request.nextUrl.origin;
  const loginUrl = new URL('/login', baseUrl);
  const walletUrl = new URL('/wallet', baseUrl);

  // If accessing auth routes while authenticated
  if (
    authPaths.some((authPath) => path === authPath || path.startsWith(authPath))
  ) {
    if (isAuthenticated) {
      return NextResponse.redirect(walletUrl);
    }
    return NextResponse.next();
  }

  // If accessing protected routes while not authenticated
  if (
    protectedPaths.some(
      (protectedPath) =>
        path === protectedPath || path.startsWith(protectedPath)
    )
  ) {
    if (!isAuthenticated) {
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: ['/login', '/create', '/wallet/:path*'],
};
