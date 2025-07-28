import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: ['/wallet/:path*'],
};
