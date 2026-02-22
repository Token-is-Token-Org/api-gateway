import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { providerRegistry } from '../../services/ProviderRegistry.js';
import { AuthPayload } from '../../types/index.js';
import authService from '../../services/AuthService.js';
import usageTracker from '../../services/UsageTracker.js';

interface AuthenticatedRequest extends FastifyRequest {
  user?: AuthPayload;
}

interface ChatCompletionRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export default async function chatRoutes(app: FastifyInstance) {
  app.post<{ Body: ChatCompletionRequest }>('/completions', {
    preHandler: async (request: AuthenticatedRequest, reply) => {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.code(401).send({ error: { code: 1002, message: 'Invalid signature' } });
      }
      const token = authHeader.slice(7);
      try {
        request.user = authService.verifyToken(token);
      } catch {
        return reply.code(401).send({ error: { code: 1002, message: 'Invalid signature' } });
      }
    },
  }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    const { model, messages, temperature, max_tokens, stream } = request.body;
    const userId = request.user!.userId;

    if (!model || !messages || messages.length === 0) {
      return reply.code(400).send({ error: { code: 1001, message: 'Invalid request format' } });
    }

    const quota = await authService.checkQuota(userId);
    if (quota.remaining <= 0) {
      return reply.code(402).send({ error: { code: 1003, message: 'Insufficient balance' } });
    }

    const providers = await providerRegistry.getAvailableProviders(model);
    if (providers.length === 0) {
      return reply.code(404).send({ error: { code: 1004, message: 'Model not found' } });
    }

    const selectedProvider = providers[0];

    try {
      const response = await fetch(`${selectedProvider.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PROVIDER_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: temperature ?? 0.7,
          max_tokens: max_tokens ?? 2048,
          stream: stream ?? false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return reply.code(response.status).send({
          error: {
            code: 3001,
            message: 'LLM API error',
            details: errorData,
          },
        });
      }

      if (stream) {
        reply.raw.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        });

        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            reply.raw.write(decoder.decode(value));
          }
        }
        reply.raw.end();
        return;
      }

      const data = await response.json();
      
      await usageTracker.trackUsage({
        userId,
        providerId: selectedProvider.id,
        model,
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0,
      });

      return data;
    } catch (error) {
      return reply.code(500).send({
        error: {
          code: 2004,
          message: 'Provider internal error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  });
}
