import { Provider } from '../../types/index.js';
import { SelectionStrategy } from './SelectionStrategy.js';

export class PriceStrategy implements SelectionStrategy {
  score(provider: Provider): number {
    const price = provider.pricePerToken ?? 1;
    return (1 / (price + 0.000001)) * 100;
  }
}
