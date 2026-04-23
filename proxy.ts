import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define public routes
  const isPublicRoute = pathname === '/login' || pathname === '/register' || pathname === '/';
  const isInstructorRoute = pathname.startsWith('/instructor');
  const isStudentRoute = pathname.startsWith('/student');

  if (!token) {
    if (isInstructorRoute || isStudentRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    if (isInstructorRoute || isStudentRoute) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.next();
  }

  const role = payload.role as string;

  // If logged in, prevent access to login/register (except root)
  if (isPublicRoute && pathname !== '/') {
    const dashboard = role === 'INSTRUCTOR' ? '/instructor' : '/student/practice';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Role-based authorization
  if (isInstructorRoute && role !== 'INSTRUCTOR') {
    return NextResponse.redirect(new URL('/student/practice', request.url));
  }

  if (isStudentRoute && role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/instructor', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

