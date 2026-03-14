import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/whistleblower'];
const adminRoutes = ['/ml-status'];
const investigatorRoutes = ['/investigations'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('auth_token')?.value;
  const userRoleCookie = request.cookies.get('user_role')?.value ?? '';
  const userRoles = userRoleCookie.split(',').filter(Boolean); // ["admin", "investigator"]
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // If authenticated user tries to access login, redirect to dashboard
    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // role checks
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!userRoles.includes('admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  if (investigatorRoutes.some(route => pathname.startsWith(route))) {
    if (!userRoles.includes('investigator') && !userRoles.includes('admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
