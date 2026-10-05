import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // 1. Admin path handling
  if (pathname.toLowerCase().includes('admin')) {
    // Allow exact valid admin path, subpages (/admin/products), and API routes (/api/admin/...)
    if (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/api/')
    ) {
      return NextResponse.next();
    }

    // Redirect any other admin alias (e.g., /admin dashboard, /admin-dashboard) to /admin
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 2. Protect /dashboard route: If token cookie exists and has unverified status, or if no session
  // Note: Client-side pages also enforce full verification state with AuthContext and backend APIs
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    const token = request.cookies.get('token')?.value;
    const isVerified = request.cookies.get('emailVerified')?.value;

    if (token && isVerified === 'false') {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
