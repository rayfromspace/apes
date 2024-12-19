import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdminRole() {
  try {
    const updatedUser = await prisma.user.update({
      where: { email: 'blackwoodroen@gmail.com' },
      data: { role: 'admin' },
    });
    
    console.log('Successfully updated user role to admin:', updatedUser);
  } catch (error) {
    console.error('Failed to update user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminRole();
