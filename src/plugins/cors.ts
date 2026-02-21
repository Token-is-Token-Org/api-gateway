import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { CORS_ORIGINS } from '../config/index.js';

export default async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });
}
