import { Provider } from '../../types/index.js';

export interface SelectionStrategy {
  score(provider: Provider): number;
}
