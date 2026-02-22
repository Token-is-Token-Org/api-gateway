import { FastifyInstance } from 'fastify';
import healthRoutes from './v1/health.js';
import modelsRoutes from './v1/models.js';
import userRoutes from './v1/user.js';
import chatRoutes from './v1/chat.js';
import providerRoutes from './v1/provider.js';

export default async function routes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(modelsRoutes);
  await app.register(userRoutes);
  await app.register(chatRoutes);
  await app.register(providerRoutes);
}
