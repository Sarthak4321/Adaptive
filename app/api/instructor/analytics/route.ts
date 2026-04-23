import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      select: { difficulty: true }
    });

    const attempts = await prisma.attempt.findMany({
      select: { isCorrect: true, createdAt: true }
    });

    // Difficulty breakdown
    const total = questions.length || 1;
    const easyCount = questions.filter((q: any) => q.difficulty === 'EASY').length;
    const medCount = questions.filter((q: any) => q.difficulty === 'MEDIUM').length;
    const hardCount = questions.filter((q: any) => q.difficulty === 'HARD').length;

    // Accuracy over time (last 7 days)
    const dailyAccuracy = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayAttempts = attempts.filter((a: any) => {
        const d = new Date(a.createdAt);
        return d.toDateString() === date.toDateString();
      });
      const correct = dayAttempts.filter((a: any) => a.isCorrect).length;
      return dayAttempts.length > 0 ? Math.round((correct / dayAttempts.length) * 100) : 0;
    });

    const totalAttempts = attempts.length;
    const totalCorrect = attempts.filter((a: any) => a.isCorrect).length;
    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return NextResponse.json({
      totalQuestions: questions.length,
      totalAttempts,
      overallAccuracy,
      difficultyBreakdown: {
        easy: Math.round((easyCount / total) * 100),
        medium: Math.round((medCount / total) * 100),
        hard: Math.round((hardCount / total) * 100)
      },
      dailyAccuracy
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
