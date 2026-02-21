import { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { SiweMessage } from 'siwe';
import { JWT_SECRET } from '../config/index.js';
import { AuthError } from '../utils/errors.js';
import { AuthPayload } from '../types/index.js';

export function verifyJWT(token: string): AuthPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError('Token has expired', 'AUTH_EXPIRED_TOKEN');
    }
    throw new AuthError('Invalid token', 'AUTH_INVALID_TOKEN');
  }
}

export async function verifyWalletSignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });
    
    if (!result.success) {
      return false;
    }

    if (result.data.address.toLowerCase() !== expectedAddress.toLowerCase()) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function authenticateRequest(request: FastifyRequest): Promise<AuthPayload> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AuthError('Authorization header is missing', 'AUTH_MISSING_TOKEN');
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new AuthError('Invalid authorization format. Use Bearer <token>', 'AUTH_INVALID_TOKEN');
  }

  return verifyJWT(token);
}
