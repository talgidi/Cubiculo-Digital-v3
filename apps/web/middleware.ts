import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // O usarías localStorage vía header si prefieres

  // Si intenta ir al dashboard sin token
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Si no hay token, redirige al login con el origen para volver después
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
