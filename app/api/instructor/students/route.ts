import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        attempts: {
          select: {
            isCorrect: true,
            timeTaken: true,
            createdAt: true
          }
        }
      }
    });

    const formattedStudents = students.map(student => {
      const totalAttempts = student.attempts.length;
      const correctAttempts = student.attempts.filter((a: any) => a.isCorrect).length;
      const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
      const avgTime = totalAttempts > 0 
        ? Math.floor(student.attempts.reduce((acc: number, a: any) => acc + a.timeTaken, 0) / totalAttempts)
        : 0;

      // Determine status
      let status: 'Mastery' | 'Stable' | 'At Risk' = 'Stable';
      if (accuracy > 85 && totalAttempts > 10) status = 'Mastery';
      if (accuracy < 50 && totalAttempts > 5) status = 'At Risk';

      // Last 7 days history
      const history = student.attempts
        .slice(-7)
        .map((a: any) => a.isCorrect ? 100 : 0);
      
      while(history.length < 7) history.unshift(0); 

      return {
        id: student.id,
        name: student.name || student.email.split('@')[0],
        email: student.email,
        accuracy: Math.round(accuracy),
        totalAttempts,
        avgTime,
        status,
        lastActive: student.attempts[0] ? 'Recently' : 'Never',
        history,
        skills: [
          { name: 'Logic', level: Math.round(accuracy) },
          { name: 'Speed', level: Math.round(Math.max(0, 100 - avgTime)) }
        ]
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Students fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
