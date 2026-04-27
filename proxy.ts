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
  console.log(`Middleware: Path ${pathname}, Role ${role}`);

  // If logged in, prevent access to login/register (except root)
  if (isPublicRoute && pathname !== '/') {
    const dashboard = role === 'INSTRUCTOR' ? '/instructor' : '/student';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Role-based authorization
  if (isInstructorRoute && role !== 'INSTRUCTOR') {
    console.warn(`Middleware: Unauthorized instructor access by ${role}`);
    return NextResponse.redirect(new URL('/student', request.url));
  }

  if (isStudentRoute && role !== 'STUDENT') {
    console.warn(`Middleware: Unauthorized student access by ${role}`);
    return NextResponse.redirect(new URL('/instructor', request.url));
  }

  // Blocked check for students
  if (role === 'STUDENT') {
    // Use raw MongoDB to bypass stale Prisma client errors in middleware
    const { MongoClient, ObjectId } = await import('mongodb');
    const client = new MongoClient(process.env.DATABASE_URL!);
    await client.connect();
    const db = client.db();
    
    const user = await db.collection('User').findOne(
      { _id: new ObjectId(payload.id as string) },
      { projection: { isBlocked: true } }
    );
    
    await client.close();

    if (user?.isBlocked) {
      console.warn(`Middleware: Blocked student access attempt by ${payload.email}`);
      const response = NextResponse.redirect(new URL('/login?error=blocked', request.url));
      response.cookies.delete('token');
      return response;
    }
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

