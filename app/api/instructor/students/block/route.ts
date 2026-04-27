import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId, isBlocked } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Bypass Prisma stale client error by using raw MongoDB for this update
    const { MongoClient, ObjectId } = await import('mongodb');
    const client = new MongoClient(process.env.DATABASE_URL!);
    await client.connect();
    const db = client.db();
    
    const result = await db.collection('User').findOneAndUpdate(
      { _id: new ObjectId(studentId) },
      { $set: { isBlocked: Boolean(isBlocked) } },
      { returnDocument: 'after' }
    );
    
    await client.close();

    if (!result) {
       throw new Error('User not found or update failed');
    }

    return NextResponse.json({ 
      success: true, 
      isBlocked: (result as any).isBlocked,
      message: (result as any).isBlocked ? 'Student access blocked' : 'Student access restored'
    });
  } catch (error: any) {
    console.error('Block access error:', error);
    return NextResponse.json({ 
      error: 'Failed to update access status',
      details: error.message 
    }, { status: 500 });
  }
}
