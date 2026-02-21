import pino from 'pino';

/**
 * 结构化日志工具
 * 开发环境使用 pino-pretty 格式化输出
 * 生产环境输出 JSON 格式
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});
