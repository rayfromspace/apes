import { db } from '@/lib/db';
import { hash, compare } from 'bcryptjs';
import crypto from 'crypto';

export class UserService {
  static async createUser(data: {
    email: string;
    password: string;
    full_name: string;
    role: 'investor' | 'founder' | 'both';
  }) {
    const hashedPassword = await hash(data.password, 10);

    return db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        full_name: data.full_name,
        role: data.role,
      },
    });
  }

  static async findUserByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }

  static async updateUser(id: string, data: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    company?: string;
    position?: string;
    location?: string;
    skills?: string[];
    interests?: string[];
  }) {
    return db.user.update({
      where: { id },
      data,
    });
  }

  static async verifyPassword(userId: string, password: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user?.password) return false;
    return compare(password, user.password);
  }

  static async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await hash(newPassword, 10);
    return db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  static async createPasswordResetToken(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await db.user.update({
      where: { email },
      data: {
        reset_token: token,
        reset_token_expires: expires,
      },
    });

    return { token, expires };
  }

  static async verifyResetToken(token: string) {
    const user = await db.user.findUnique({
      where: { reset_token: token },
    });

    if (!user) return null;
    if (!user.reset_token_expires) return null;
    if (user.reset_token_expires < new Date()) return null;

    return user;
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await this.verifyResetToken(token);
    if (!user) throw new Error('Invalid or expired reset token');

    const hashedPassword = await hash(newPassword, 10);

    return db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      },
    });
  }

  static async createSession(userId: string) {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    return db.session.create({
      data: {
        user_id: userId,
        expires,
      },
    });
  }

  static async getSession(sessionId: string) {
    return db.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
  }

  static async deleteSession(sessionId: string) {
    return db.session.delete({
      where: { id: sessionId },
    });
  }

  static async deleteExpiredSessions() {
    return db.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  }
}
