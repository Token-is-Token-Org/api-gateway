import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/errors.js';

export async function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';

  request.log.error(error);

  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: any = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
  } 
  else if ((error as FastifyError).validation) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = (error as FastifyError).validation;
  }
  else if ((error as FastifyError).statusCode) {
    statusCode = (error as FastifyError).statusCode!;
    code = (error as FastifyError).code || 'FASTIFY_ERROR';
    message = error.message;
  }

  if (isProduction && statusCode === 500) {
    message = 'Internal Server Error';
  }

  const response = {
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(!isProduction ? { stack: error.stack } : {}),
    },
    statusCode,
  };

  await reply.status(statusCode).send(response);
}
