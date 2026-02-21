import jwt from 'jsonwebtoken';
import { SiweMessage } from 'siwe';
import prisma from '../config/database.js';
import { AuthError, QuotaExceededError } from '../utils/errors.js';
import { JWT_SECRET } from '../config/index.js';
import { AuthPayload, QuotaInfo } from '../types/index.js';

class AuthService {
  verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('Token expired', 'AUTH_EXPIRED_TOKEN');
      }
      throw new AuthError('Invalid token', 'AUTH_INVALID_TOKEN');
    }
  }

  generateToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  async verifySignature(message: string, signature: string, address: string): Promise<boolean> {
    try {
      const siweMessage = new SiweMessage(message);
      const { data: fields } = await siweMessage.verify({ signature });
      return fields.address.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  async checkQuota(userId: string): Promise<QuotaInfo> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsage = await prisma.usage.aggregate({
      where: {
        userId,
        date: today,
      },
      _sum: {
        requests: true,
      },
    });

    const used = todayUsage._sum.requests || 0;
    const resetAt = new Date(today);
    resetAt.setDate(resetAt.getDate() + 1);

    if (used >= user.quota) {
      throw new QuotaExceededError('Daily quota exceeded');
    }

    return {
      limit: user.quota,
      used,
      remaining: user.quota - used,
      resetAt,
    };
  }
}

export default new AuthService();
