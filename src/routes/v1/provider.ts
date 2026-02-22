import { FastifyInstance, FastifyRequest } from 'fastify';
import { providerRegistry } from '../../services/ProviderRegistry.js';
import { Provider, ProviderStatus } from '../../types/index.js';

interface AuthenticatedRequest extends FastifyRequest {
  user?: { userId: string; role?: string };
}

interface RegisterProviderBody {
  name: string;
  endpoint: string;
  models: string[];
  pricePerToken?: number;
}

export default async function providerRoutes(app: FastifyInstance) {
  app.get('/v1/providers', async () => {
    const providers = await providerRegistry.getAvailableProviders('');
    return {
      providers: providers.map((p: Provider) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        models: p.models,
        avgResponseTime: p.avgResponseTime,
        successRate: p.successRate,
      })),
    };
  });

  app.get('/v1/providers/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const provider = await providerRegistry.getById(id);
    
    if (!provider) {
      return reply.code(404).send({ error: { code: 1004, message: 'Provider not found' } });
    }
    
    return provider;
  });

  app.post<{ Body: RegisterProviderBody }>('/v1/providers', {
    preHandler: async (request: AuthenticatedRequest, reply) => {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.code(401).send({ error: { code: 1002, message: 'Invalid signature' } });
      }
    },
  }, async (request, reply) => {
    const { name, endpoint, models, pricePerToken } = request.body;
    
    if (!name || !endpoint || !models || models.length === 0) {
      return reply.code(400).send({ error: { code: 1001, message: 'Invalid request format' } });
    }
    
    const provider = await providerRegistry.register({
      name,
      endpoint,
      models,
      pricePerToken,
    });
    
    return reply.code(201).send(provider);
  });

  app.put<{ Params: { id: string }; Body: { status: ProviderStatus } }>('/v1/providers/:id/status', {
    preHandler: async (request: AuthenticatedRequest, reply) => {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.code(401).send({ error: { code: 1002, message: 'Invalid signature' } });
      }
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body;
    
    if (!Object.values(ProviderStatus).includes(status)) {
      return reply.code(400).send({ error: { code: 1001, message: 'Invalid status' } });
    }
    
    const provider = await providerRegistry.updateStatus(id, status);
    return provider;
  });

  app.post<{ Params: { id: string } }>('/v1/providers/:id/heartbeat', async (request, reply) => {
    const { id } = request.params;
    
    try {
      await providerRegistry.heartbeat(id);
      return { success: true };
    } catch (error) {
      return reply.code(404).send({ error: { code: 1004, message: 'Provider not found' } });
    }
  });
}
