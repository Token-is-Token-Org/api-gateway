import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { NODE_ENV, CORS_ORIGINS, RATE_LIMIT_MAX } from './config/index.js';
import routes from './routes/index.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: NODE_ENV === 'development' ? 'debug' : 'info',
      transport: NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      } : undefined,
    },
  });

  await app.register(cors, {
    origin: CORS_ORIGINS,
  });

  await app.register(rateLimit, {
    max: RATE_LIMIT_MAX,
    timeWindow: '1 minute',
  });

  await app.register(routes);

  app.setErrorHandler((error: any, request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: error.name,
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  });

  return app;
}
