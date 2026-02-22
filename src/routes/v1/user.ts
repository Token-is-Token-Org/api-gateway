import { FastifyInstance, FastifyRequest } from 'fastify';
import prisma from '../../config/database.js';
import authService from '../../services/AuthService.js';
import usageTracker from '../../services/UsageTracker.js';
import { AuthPayload } from '../../types/index.js';

interface AuthenticatedRequest extends FastifyRequest {
  user?: AuthPayload;
}

export default async function userRoutes(app: FastifyInstance) {
  const authPreHandler = async (request: AuthenticatedRequest, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.code(401).send({ error: { code: 1002, message: 'Invalid signature' } });
    }
    const token = authHeader.slice(7);
    try {
      request.user = authService.verifyToken(token);
    } catch {
      return reply.code(401).send({ error: { code: 1002, message: 'Invalid signature' } });
    }
  };

  app.get('/v1/user', { preHandler: authPreHandler }, async (request: AuthenticatedRequest) => {
    const userId = request.user!.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return { error: { code: 1004, message: 'User not found' } };
    }
    
    const quota = await authService.checkQuota(userId);
    const todayUsage = await usageTracker.getUserUsage(
      userId,
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date()
    );
    
    return {
      id: user.id,
      address: user.address,
      quota,
      usage: todayUsage,
    };
  });

  app.get('/v1/user/balance', { preHandler: authPreHandler }, async (request: AuthenticatedRequest) => {
    const userId = request.user!.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, address: true },
    });
    
    if (!user) {
      return { error: { code: 1004, message: 'User not found' } };
    }

    const quota = await authService.checkQuota(userId);
    
    return {
      userId: user.id,
      address: user.address,
      balance: quota.used.toString(),
      limit: quota.limit.toString(),
      remaining: quota.remaining.toString(),
      resetAt: quota.resetAt?.toISOString() || null,
    };
  });

  app.get('/v1/user/usage', { preHandler: authPreHandler }, async (request: AuthenticatedRequest) => {
    const userId = request.user!.userId;
    const { startDate, endDate } = request.query as { startDate?: string; endDate?: string };
    
    const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
    const end = endDate ? new Date(endDate) : new Date();
    
    const usage = await usageTracker.getUserUsage(userId, start, end);
    
    return {
      userId,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      usage: {
        requests: usage.requests || 0,
        totalTokens: usage.totalTokens || 0,
        inputTokens: usage.inputTokens || 0,
        outputTokens: usage.outputTokens || 0,
        cost: usage.cost || '0',
      },
    };
  });
}
