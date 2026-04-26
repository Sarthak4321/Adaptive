import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Demo Instructor
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@demo.com' },
    update: {
      role: 'INSTRUCTOR',
      password: hashedPassword
    },
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
    update: {
      role: 'STUDENT',
      password: hashedPassword
    },
    create: {
      email: 'student@demo.com',
      name: 'Demo Student',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });
  console.log('Student created:', student.email);

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
