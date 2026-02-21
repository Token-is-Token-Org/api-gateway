import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export const pubsub = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on('error', (err: Error) => {
  console.error('Redis Client Error:', err);
});

pubsub.on('error', (err: Error) => {
  console.error('Redis Pub/Sub Error:', err);
});

redis.on('connect', () => {
  console.log('Redis Client Connected');
});

pubsub.on('connect', () => {
  console.log('Redis Pub/Sub Connected');
});

export const cache = {
  get: async (key: string) => redis.get(key),
  set: async (key: string, value: string, ttlSeconds?: number) => {
    if (ttlSeconds) {
      return redis.set(key, value, 'EX', ttlSeconds);
    }
    return redis.set(key, value);
  },
  del: async (key: string) => redis.del(key),
};

export const messenger = {
  publish: async (channel: string, message: string) => redis.publish(channel, message),
  subscribe: async (channel: string, callback: (message: string) => void) => {
    await pubsub.subscribe(channel);
    pubsub.on('message', (chan: string, msg: string) => {
      if (chan === channel) {
        callback(msg);
      }
    });
  },
};
