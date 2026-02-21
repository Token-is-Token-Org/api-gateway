import prisma from '../config/database.js';
import { Provider, ProviderStatus } from '../types/index.js';

export class ProviderRegistry {
  async register(provider: Omit<Provider, 'id' | 'status' | 'avgResponseTime' | 'successRate'>): Promise<Provider> {
    const result = await prisma.provider.create({
      data: {
        ...provider,
        status: ProviderStatus.ACTIVE,
      },
    });
    return result as unknown as Provider;
  }

  async updateStatus(providerId: string, status: ProviderStatus): Promise<Provider> {
    const result = await prisma.provider.update({
      where: { id: providerId },
      data: { status },
    });
    return result as unknown as Provider;
  }

  async getAvailableProviders(model: string): Promise<Provider[]> {
    const results = await prisma.provider.findMany({
      where: {
        status: ProviderStatus.ACTIVE,
        models: {
          has: model,
        },
      },
      orderBy: [
        { successRate: 'desc' },
        { avgResponseTime: 'asc' },
      ],
    });
    return results as unknown as Provider[];
  }

  async heartbeat(providerId: string): Promise<void> {
    await prisma.provider.update({
      where: { id: providerId },
      data: { updatedAt: new Date() },
    });
  }

  async getById(providerId: string): Promise<Provider | null> {
    const result = await prisma.provider.findUnique({
      where: { id: providerId },
    });
    return result as unknown as Provider | null;
  }
}

export const providerRegistry = new ProviderRegistry();
