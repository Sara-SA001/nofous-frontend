import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow public admin pages (login/register) to avoid redirect loops
    const publicAdminPaths = ['/admin/login', '/admin/register'];
    if (publicAdminPaths.includes(pathname)) return NextResponse.next();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Protect dashboard / user routes (main app routes)
  const dashboardPaths = ['/', '/documents', '/link-request', '/death-request', '/profile', '/my-requests'];
  const isDashboardPath = dashboardPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isDashboardPath) {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/', '/documents/:path*', '/link-request/:path*', '/death-request/:path*', '/profile/:path*', '/my-requests/:path*'],
};
