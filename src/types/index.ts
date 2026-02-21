export enum ProviderStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEGRADED = 'DEGRADED'
}

export interface APIRequest {
  id: string;
  userId: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  maxTokens?: number;
  temperature?: number;
}

export interface APIResponse {
  id: string;
  status: number;
  data?: any;
  error?: string;
}

export interface Provider {
  id: string;
  name: string;
  endpoint: string;
  models: string[];
  status: ProviderStatus;
  avgResponseTime?: number;
  successRate?: number;
  pricePerToken?: number;
}

export interface AuthPayload {
  userId: string;
  address?: string;
  iat: number;
  exp: number;
}

export interface UsageStats {
  requests: number;
  totalTokens: number;
  totalCost: number;
  period: string;
}

export interface ProviderStats {
  requests: number;
  successRate: number;
  avgResponseTime: number;
  totalCost: number;
}

export interface QuotaInfo {
  limit: number;
  used: number;
  remaining: number;
  resetAt: Date;
}
