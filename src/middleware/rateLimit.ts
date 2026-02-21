import { FastifyRequest } from 'fastify';
import { redis } from '../config/redis.js';
import { RateLimitError } from '../utils/errors.js';
import { RATE_LIMIT_MAX } from '../config/index.js';

interface RateLimitInfo {
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  key: string,
  maxRequests: number = RATE_LIMIT_MAX,
  windowMs: number = 60000
): Promise<RateLimitInfo> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const redisKey = `ratelimit:${key}`;

  const multi = redis.multi();

  multi.zremrangebyscore(redisKey, 0, windowStart);
  multi.zcard(redisKey);
  multi.zadd(redisKey, now, `${now}-${Math.random()}`);
  multi.expire(redisKey, Math.ceil(windowMs / 1000) + 1);

  const results = await multi.exec();
  if (!results) {
    throw new Error('Redis multi exec failed');
  }

  const currentCount = results[1][1] as number;

  if (currentCount >= maxRequests) {
    const oldestRequest = await redis.zrange(redisKey, 0, 0, 'WITHSCORES');
    const resetAt = oldestRequest.length > 1 
      ? new Date(parseInt(oldestRequest[1], 10) + windowMs)
      : new Date(now + windowMs);

    throw new RateLimitError(`Rate limit exceeded. Try again at ${resetAt.toISOString()}`);
  }

  return {
    remaining: Math.max(0, maxRequests - currentCount - 1),
    resetAt: new Date(now + windowMs),
  };
}

export async function checkUserRateLimit(
  request: FastifyRequest
): Promise<RateLimitInfo> {
  // @ts-ignore
  const userId = request.user?.id || request.ip;
  return checkRateLimit(userId);
}
