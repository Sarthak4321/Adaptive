const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    console.log('User fields:', Object.keys(user || {}));
    console.log('Is Blocked field present:', user && 'isBlocked' in user);
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    process.exit();
  }
}

test();
