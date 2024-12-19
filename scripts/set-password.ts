const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setPassword() {
  try {
    const hashedPassword = await bcrypt.hash('Godisgood#1', 10);
    
    const updatedUser = await prisma.user.update({
      where: { email: 'blackwoodroen@gmail.com' },
      data: { password: hashedPassword },
    });
    
    console.log('Successfully set password for user:', updatedUser.email);
  } catch (error) {
    console.error('Failed to set password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setPassword();
