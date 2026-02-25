import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // O usarías localStorage vía header si prefieres
  const { pathname } = request.nextUrl;

  // Si intenta ir al dashboard sin token
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Si no hay token, redirige al login con el origen para volver después
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
