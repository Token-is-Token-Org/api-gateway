import prisma from '../config/database.js';
import { UsageStats, ProviderStats, APIRequest } from '../types/index.js';

class UsageTracker {
  async trackRequest(request: APIRequest): Promise<string> {
    const record = await prisma.request.create({
      data: {
        userId: request.userId,
        providerId: 'pending',
        model: request.model,
        inputTokens: 0,
        outputTokens: 0,
        status: 'pending',
      },
    });
    return record.id;
  }

  async trackResponse(
    requestId: string,
    response: { providerId: string; status: string; inputTokens: number; outputTokens: number; error?: string }
  ): Promise<void> {
    await prisma.request.update({
      where: { id: requestId },
      data: {
        providerId: response.providerId,
        status: response.status,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        error: response.error,
      },
    });

    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (request) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.usage.upsert({
        where: {
          userId_providerId_date: {
            userId: request.userId,
            providerId: response.providerId,
            date: today,
          },
        },
        update: {
          requests: { increment: 1 },
          tokens: { increment: response.inputTokens + response.outputTokens },
        },
        create: {
          userId: request.userId,
          providerId: response.providerId,
          date: today,
          requests: 1,
          tokens: response.inputTokens + response.outputTokens,
          cost: 0,
        },
      });
    }
  }

  async getUserUsage(userId: string, start: Date, end: Date): Promise<UsageStats> {
    const usage = await prisma.usage.aggregate({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        requests: true,
        tokens: true,
        cost: true,
      },
    });

    return {
      requests: usage._sum.requests || 0,
      totalTokens: usage._sum.tokens || 0,
      totalCost: usage._sum.cost || 0,
      period: `${start.toISOString()} - ${end.toISOString()}`,
    };
  }

  async getProviderStats(providerId: string): Promise<ProviderStats> {
    const requests = await prisma.request.findMany({
      where: { providerId },
      select: { status: true },
    });

    const total = requests.length;
    const completed = requests.filter((r: { status: string }) => r.status === 'completed').length;

    return {
      requests: total,
      successRate: total > 0 ? completed / total : 0,
      avgResponseTime: 0,
      totalCost: 0,
    };
  }
}

export default new UsageTracker();
