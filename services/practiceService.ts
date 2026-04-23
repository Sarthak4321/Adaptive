import { prisma } from "@/lib/prisma";

interface AttemptWithQuestion {
  isCorrect: boolean;
  question: {
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  };
}

export const practiceService = {
  calculateTargetDifficulty(lastAttempts: AttemptWithQuestion[]): 'EASY' | 'MEDIUM' | 'HARD' {
    if (lastAttempts.length === 0) return "MEDIUM";

    const correctCount = lastAttempts.filter(a => a.isCorrect).length;
    const accuracy = (correctCount / lastAttempts.length) * 100;

    // Default to the difficulty of the last attempt or MEDIUM
    const lastDifficulty = (lastAttempts[0]?.question?.difficulty as 'EASY' | 'MEDIUM' | 'HARD') || "MEDIUM";


    if (accuracy > 70) {
      if (lastDifficulty === "EASY") return "MEDIUM";
      if (lastDifficulty === "MEDIUM") return "HARD";
      return "HARD";
    }

    if (accuracy < 40) {
      if (lastDifficulty === "HARD") return "MEDIUM";
      if (lastDifficulty === "MEDIUM") return "EASY";
      return "EASY";
    }

    return lastDifficulty;
  },

  async getNextQuestion(userId: string) {
    // 1. Get last 5 attempts with question difficulty included
    const lastAttempts = await prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { question: { select: { difficulty: true } } }
    });

    const targetDifficulty = this.calculateTargetDifficulty(lastAttempts);

    // 2. Fetch a random question of the target difficulty that the user hasn't seen recently?
    // For simplicity, just get one random of target difficulty
    const count = await prisma.question.count({ where: { difficulty: targetDifficulty } });
    
    if (count === 0) {
      // Fallback if no questions of target difficulty exist
      return prisma.question.findFirst();
    }

    const skip = Math.floor(Math.random() * count);
    const questions = await prisma.question.findMany({
      where: { difficulty: targetDifficulty },
      skip: skip,
      take: 1,
    });

    return questions[0];
  },

  async recordAttempt(userId: string, questionId: string, userAnswer: string, timeTaken: number) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    
    if (!question) throw new Error("Question not found");

    const isCorrect = question.correctAnswer === userAnswer;

    const attempt = await prisma.attempt.create({
      data: {
        userId,
        questionId,
        userAnswer,
        isCorrect,
        timeTaken,
      }
    });

    return attempt;
  },

  async getStudentStats(userId: string) {
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 0,
        avgTime: 0,
        recentAttempts: []
      };
    }

    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const accuracy = (correctAttempts / attempts.length) * 100;
    const totalTime = attempts.reduce((acc, a) => acc + a.timeTaken, 0);
    const avgTime = totalTime / attempts.length;

    return {
      totalAttempts: attempts.length,
      correctAttempts,
      accuracy: Math.round(accuracy),
      avgTime: Math.round(avgTime),
      recentAttempts: attempts.slice(0, 5)
    };
  }
};
