import { FastifyInstance, FastifyRequest } from 'fastify';
import { authenticateRequest } from '../middleware/auth.js';
import { AuthPayload } from '../types/index.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthPayload;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<AuthPayload>;
  }
}

export default async function authPlugin(app: FastifyInstance) {
  app.decorate('authenticate', authenticateRequest);
}
