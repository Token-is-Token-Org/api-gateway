/**
 * 基础应用错误类
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 认证错误 (401)
 */
export class AuthError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, 401, code);
  }
}

/**
 * 验证错误 (400)
 */
export class ValidationError extends AppError {
  constructor(message = 'Bad Request', code = 'VALIDATION_ERROR') {
    super(message, 400, code);
  }
}

/**
 * 未找到错误 (404)
 */
export class NotFoundError extends AppError {
  constructor(message = 'Not Found', code = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

/**
 * 限流错误 (429)
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too Many Requests', code = 'RATE_LIMIT_EXCEEDED') {
    super(message, 429, code);
  }
}

/**
 * Provider错误 (502/503)
 */
export class ProviderError extends AppError {
  constructor(message = 'Provider Error', statusCode = 502, code = 'PROVIDER_ERROR') {
    super(message, statusCode, code);
  }
}

/**
 * 配额超限错误 (403)
 */
export class QuotaExceededError extends AppError {
  constructor(message = 'Quota Exceeded', code = 'QUOTA_EXCEEDED') {
    super(message, 403, code);
  }
}
