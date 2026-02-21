import { FastifyInstance, FastifyRequest } from 'fastify';
import prisma from '../../config/database.js';
import authService from '../../services/AuthService.js';
import usageTracker from '../../services/UsageTracker.js';
import { AuthPayload } from '../../types/index.js';

interface AuthenticatedRequest extends FastifyRequest {
  user?: AuthPayload;
}

export default async function userRoutes(app: FastifyInstance) {
  app.get('/v1/user', {
    preHandler: async (request: AuthenticatedRequest, reply) => {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.code(401).send({ error: { code: 'AUTH_MISSING_TOKEN' } });
      }
      const token = authHeader.slice(7);
      try {
        request.user = authService.verifyToken(token);
      } catch {
        return reply.code(401).send({ error: { code: 'AUTH_INVALID_TOKEN' } });
      }
    },
  }, async (request: AuthenticatedRequest) => {
    const userId = request.user!.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return { error: { code: 'USER_NOT_FOUND' } };
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
      quota: quota,
      usage: todayUsage,
    };
  });
}
