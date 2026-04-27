import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // The student ID

    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const messages = await (prisma as any).message.findMany({
      where: {
        OR: [
          { senderId: payload.id as string, receiverId: userId as string },
          { senderId: userId as string, receiverId: payload.id as string }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { receiverId, content } = await req.json();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const message = await (prisma as any).message.create({
      data: {
        content,
        senderId: payload.id as string,
        receiverId: receiverId as string
      },
      include: {
        sender: { select: { name: true, email: true } }
      }
    });

    // Note: Emitting the socket event here is tricky in App Router
    // We will rely on the client emitting the event after receiving the 200 OK
    // OR we use the global.io pattern if we can initialize it.

    return NextResponse.json(message);
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
