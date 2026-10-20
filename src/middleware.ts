import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteksi rute admin: /admin/*
  // Memastikan hanya request yang memiliki token sesi yang dapat melanjutkan ke server
  if (pathname.startsWith('/admin')) {
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ||
      request.cookies.get('__Secure-better-auth.session_token');

    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
