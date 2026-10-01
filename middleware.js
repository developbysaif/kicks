import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Only run logic if the URL path contains 'admin'
  if (pathname.toLowerCase().includes('admin')) {
    // Allow exact valid admin path, subpages (/admin/products), and API routes (/api/admin/...)
    if (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/api/')
    ) {
      return NextResponse.next();
    }

    // Redirect any other admin alias (e.g., /admin dashboard, /admin%20dashboard, /admin-dashboard) to /admin
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
