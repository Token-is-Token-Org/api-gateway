import { FastifyInstance } from 'fastify';
import { checkUserRateLimit } from '../middleware/rateLimit.js';

export default async function rateLimitPlugin(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    const { remaining, resetAt } = await checkUserRateLimit(request);
    
    reply.header('X-RateLimit-Limit', 100);
    reply.header('X-RateLimit-Remaining', remaining);
    reply.header('X-RateLimit-Reset', Math.floor(resetAt.getTime() / 1000));
  });
}
