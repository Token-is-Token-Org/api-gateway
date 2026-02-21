import { FastifyInstance } from 'fastify';

export default async function chatRoutes(app: FastifyInstance) {
  app.post('/completions', async (request, reply) => {
    return { message: 'Chat completions endpoint' };
  });
}
