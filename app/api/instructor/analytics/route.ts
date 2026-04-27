import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const days = range === '30d' ? 30 : 7;

    const questions = await prisma.question.findMany({
      select: { difficulty: true }
    });

    const attempts = await prisma.attempt.findMany({
      select: { 
        isCorrect: true, 
        createdAt: true,
        question: {
          select: { difficulty: true }
        }
      }
    });

    // Counts for breakdown
    const easyCount = questions.filter((q: any) => q.difficulty === 'EASY').length;
    const medCount = questions.filter((q: any) => q.difficulty === 'MEDIUM').length;
    const hardCount = questions.filter((q: any) => q.difficulty === 'HARD').length;

    // Difficulty breakdown with performance
    const easyAttempts = attempts.filter((a: any) => a.question?.difficulty === 'EASY');
    const medAttempts = attempts.filter((a: any) => a.question?.difficulty === 'MEDIUM');
    const hardAttempts = attempts.filter((a: any) => a.question?.difficulty === 'HARD');

    const getAccuracy = (atts: any[]) => atts.length > 0 ? Math.round((atts.filter(a => a.isCorrect).length / atts.length) * 100) : 0;

    const difficultyBreakdown = {
      easy: { pct: getAccuracy(easyAttempts), count: easyAttempts.length, totalQs: easyCount },
      medium: { pct: getAccuracy(medAttempts), count: medAttempts.length, totalQs: medCount },
      hard: { pct: getAccuracy(hardAttempts), count: hardAttempts.length, totalQs: hardCount }
    };

    // Accuracy over time
    const dailyAccuracy = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
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

    // Top Students
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true, attempts: { select: { isCorrect: true } } }
    });

    const topStudents = users.map(u => {
      const total = u.attempts.length;
      const correct = u.attempts.filter(a => a.isCorrect).length;
      return {
        name: u.name || u.email,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        total
      };
    }).sort((a, b) => b.accuracy - a.accuracy).slice(0, 5);

    return NextResponse.json({
      totalQuestions: questions.length,
      totalAttempts,
      overallAccuracy,
      difficultyBreakdown,
      dailyAccuracy,
      topStudents
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
