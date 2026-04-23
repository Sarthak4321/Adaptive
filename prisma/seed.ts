import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Demo Instructor
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@demo.com' },
    update: {},
    create: {
      email: 'instructor@demo.com',
      name: 'Demo Instructor',
      password: hashedPassword,
      role: 'INSTRUCTOR',
    },
  });
  console.log('Instructor created:', instructor.email);

  // Create Demo Student
  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      name: 'Demo Student',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });
  console.log('Student created:', student.email);

  // Add some sample questions
  const questions = [
    {
      text: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: "Paris",
      difficulty: "EASY" as const,
      instructorId: instructor.id
    },
    {
      text: "Which programming language is known for its speed and safety in concurrent applications?",
      options: ["Python", "JavaScript", "Rust", "PHP"],
      correctAnswer: "Rust",
      difficulty: "MEDIUM" as const,
      instructorId: instructor.id
    },
    {
      text: "In complex analysis, what is the value of i^i?",
      options: ["e^(-π/2)", "e^(π/2)", "1", "-1"],
      correctAnswer: "e^(-π/2)",
      difficulty: "HARD" as const,
      instructorId: instructor.id
    }
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: q
    });
  }
  console.log('Sample questions created.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
