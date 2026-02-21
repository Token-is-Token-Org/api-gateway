import { Provider } from '../../types/index.js';
import { SelectionStrategy } from './SelectionStrategy.js';

export class SuccessRateStrategy implements SelectionStrategy {
  score(provider: Provider): number {
    return (provider.successRate ?? 0) * 100;
  }
}
