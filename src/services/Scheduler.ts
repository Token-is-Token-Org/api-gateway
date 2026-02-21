import { APIRequest, APIResponse, Provider, ProviderStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

class ProviderRegistryMock {
  private providers: Provider[] = [];

  async getProvidersByModel(model: string): Promise<Provider[]> {
    return this.providers.filter(p => p.models.includes(model) && p.status === ProviderStatus.ACTIVE);
  }

  setProviders(providers: Provider[]) {
    this.providers = providers;
  }
}

const providerRegistry = new ProviderRegistryMock();

export class Scheduler {
  private static instance: Scheduler;
  private maxRetries = 3;

  private constructor() {}

  public static getInstance(): Scheduler {
    if (!Scheduler.instance) {
      Scheduler.instance = new Scheduler();
    }
    return Scheduler.instance;
  }

  public async selectProvider(request: APIRequest): Promise<Provider | null> {
    const providers = await providerRegistry.getProvidersByModel(request.model);
    
    if (providers.length === 0) {
      return null;
    }

    return providers.sort((a, b) => {
      const timeA = a.avgResponseTime ?? Infinity;
      const timeB = b.avgResponseTime ?? Infinity;
      return timeA - timeB;
    })[0];
  }

  public async routeRequest(request: APIRequest): Promise<APIResponse> {
    const provider = await this.selectProvider(request);

    if (!provider) {
      return {
        id: request.id,
        status: 404,
        error: `No active provider found for model: ${request.model}`
      };
    }

    return this.retryRequest(request, provider);
  }

  private async retryRequest(
    request: APIRequest, 
    provider: Provider, 
    attempts: number = 0
  ): Promise<APIResponse> {
    try {
      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Provider returned status ${response.status}`);
      }

      const data = await response.json();
      return {
        id: request.id,
        status: 200,
        data
      };
    } catch (error: any) {
      if (attempts < this.maxRetries) {
        const delay = Math.pow(2, attempts) * 1000;
        logger.warn({
          requestId: request.id,
          providerId: provider.id,
          error: error.message
        }, `Request failed, retrying in ${delay}ms... (Attempt ${attempts + 1}/${this.maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(request, provider, attempts + 1);
      }

      logger.error({
        requestId: request.id,
        providerId: provider.id,
        error: error.message
      }, `Request failed after ${this.maxRetries} attempts`);

      return {
        id: request.id,
        status: 502,
        error: `Provider request failed: ${error.message}`
      };
    }
  }
}

export const scheduler = Scheduler.getInstance();
