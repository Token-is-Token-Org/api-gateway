import { FastifyInstance } from 'fastify';
import { providerRegistry } from '../../services/ProviderRegistry.js';
import cacheService from '../../services/CacheService.js';
import prisma from '../../config/database.js';

export default async function modelsRoutes(app: FastifyInstance) {
  app.get('/v1/models', async () => {
    const cacheKey = 'available-models';
    const cached = await cacheService.get<{data: any[]}>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const providers = await prisma.provider.findMany({
      where: { status: 'ACTIVE' },
      select: { models: true },
    });
    
    const modelSet = new Set<string>();
    providers.forEach((p: any) => {
      if (Array.isArray(p.models)) {
        p.models.forEach((m: any) => modelSet.add(m as string));
      }
    });
    
    const result = {
      object: 'list',
      data: Array.from(modelSet).map(model => ({
        id: model,
        object: 'model',
        created: Date.now(),
        owned_by: 'system',
      })),
    };
    
    await cacheService.set(cacheKey, result, 60);
    
    return result;
  });
}
