import { Provider } from '../../types/index.js';
import { SelectionStrategy } from './SelectionStrategy.js';

export class ResponseTimeStrategy implements SelectionStrategy {
  score(provider: Provider): number {
    const avgResponseTime = provider.avgResponseTime ?? 1000;
    return (1 / (avgResponseTime + 1)) * 1000;
  }
}
