import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    // Use raw MongoDB to bypass stale Prisma schema and get the isBlocked field
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.DATABASE_URL!);
    await client.connect();
    const db = client.db();
    
    // Get all students with their attempts
    const studentsRaw = await db.collection('User').aggregate([
      { $match: { role: 'STUDENT' } },
      {
        $lookup: {
          from: 'Attempt',
          localField: '_id',
          foreignField: 'userId',
          as: 'attempts',
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'Question',
                localField: 'questionId',
                foreignField: '_id',
                as: 'question'
              }
            },
            { $unwind: { path: '$question', preserveNullAndEmptyArrays: true } }
          ]
        }
      }
    ]).toArray();
    
    await client.close();

    const formattedStudents = studentsRaw.map(student => {
      // Map _id to id for compatibility
      student.id = student._id.toString();
      const attempts = (student.attempts || []).map((a: any) => ({
        ...a,
        id: a._id.toString(),
        createdAt: a.createdAt.toISOString(),
      }));
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((a: any) => a.isCorrect).length;
      const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
      const avgTime = totalAttempts > 0 
        ? Math.floor(attempts.reduce((acc: number, a: any) => acc + a.timeTaken, 0) / totalAttempts)
        : 0;

      // Determine status
      let status: 'Mastery' | 'Stable' | 'At Risk' = 'Stable';
      if (accuracy > 85 && totalAttempts > 10) status = 'Mastery';
      if (accuracy < 50 && totalAttempts > 5) status = 'At Risk';

      // Last 7 days daily accuracy for Drift
      const history = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayAttempts = attempts.filter((a: any) => {
          const d = new Date(a.createdAt);
          return d.toDateString() === date.toDateString();
        });
        const correct = dayAttempts.filter((a: any) => a.isCorrect).length;
        return dayAttempts.length > 0 ? Math.round((correct / dayAttempts.length) * 100) : 0;
      });

      // Format logs from real attempts
      const logs = attempts.map((a: any) => ({
        action: `Solved "${a.question?.text?.substring(0, 30)}..."`,
        difficulty: a.question?.difficulty,
        time: a.createdAt,
        isCorrect: a.isCorrect,
        timeTaken: a.timeTaken
      }));
      
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
        logs,
        isBlocked: (student as any).isBlocked,
        skills: [
          { name: 'Accuracy', level: Math.round(accuracy) },
          { name: 'Solve Speed', level: Math.max(10, Math.min(100, Math.round(100 - (avgTime / 2)))) },
          { name: 'Consistency', level: Math.round(Math.max(0, 100 - (history.filter(h => h === 0).length * 15))) }
        ]
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Students fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
