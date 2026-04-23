import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const totalQuestions = await prisma.question.count();
    const totalStudents = await prisma.user.count({
      where: { role: 'STUDENT' }
    });

    const attempts = await prisma.attempt.findMany({
      select: { isCorrect: true }
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a: any) => a.isCorrect).length;
    const avgAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    // Get latest activity
    const latestAttempts = await prisma.attempt.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        question: { select: { text: true } }
      }
    });

    return NextResponse.json({
      stats: {
        totalQuestions,
        totalStudents,
        avgAccuracy: avgAccuracy.toFixed(1),
        activeToday: Math.floor(totalStudents * 0.4) // Simulated active today for now
      },
      latestActivity: latestAttempts.map(a => ({
        name: a.user.name || 'Student',
        action: 'Completed Quiz',
        score: a.isCorrect ? 'Correct' : 'Incorrect',
        time: 'Just now' // Simplified for now
      }))
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
