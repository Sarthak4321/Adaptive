import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all users with INSTRUCTOR role
    // In a real multi-tenant app, we'd find the specific instructor linked to this student
    const instructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      select: { id: true, name: true, email: true }
    });

    if (instructors.length === 0) {
      return NextResponse.json({ error: 'No instructor found' }, { status: 404 });
    }

    // For now, return the first one as the primary contact
    return NextResponse.json(instructors[0]);
  } catch (error) {
    console.error('Failed to fetch instructor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
