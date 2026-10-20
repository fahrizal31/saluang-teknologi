import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Cek cookie session Better Auth
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isAuthenticated = !!sessionCookie?.value;

  // Jika membuka halaman /login
  if (pathname.startsWith('/login')) {
    // Jika diarahkan karena sesi timeout atau logout, hapus cookie dan biarkan tetap di halaman login
    if (searchParams.has('reason') || searchParams.has('logout')) {
      const response = NextResponse.next();
      response.cookies.delete('better-auth.session_token');
      response.cookies.delete('__Secure-better-auth.session_token');
      return response;
    }

    // Jika sudah login aktif tanpa alasan logout/timeout, arahkan langsung ke dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/leads', request.url));
    }

    return NextResponse.next();
  }

  // Proteksi rute admin: /admin/*
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
