import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing connection...');
    const result = await prisma.$connect();
    console.log('Connected successfully!');
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
