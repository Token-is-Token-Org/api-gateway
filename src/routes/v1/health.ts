import { FastifyInstance } from 'fastify';
import prisma from '../../config/database.js';
import { redis } from '../../config/redis.js';

export default async function healthRoutes(app: FastifyInstance) {
  app.get('/v1/health', async () => {
    const dbStatus = await checkDatabase();
    const redisStatus = await checkRedis();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      redis: redisStatus ? 'connected' : 'disconnected',
    };
  });
}

async function checkDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function checkRedis(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
