# API Gateway Project - Learnings

## Project Overview
- **Purpose**: API Gateway for LLM Share Network
- **Tech Stack**: Node.js 20 + Fastify + TypeScript + PostgreSQL + Redis
- **Test Strategy**: TDD (Test-Driven Development)
- **ORM**: Prisma
- **Test Framework**: Vitest

## Technical Decisions
- Authentication: JWT + Wallet Signature (SIWE standard)
- Provider Storage: PostgreSQL database
- Rate Limiting: Redis-based sliding window algorithm
- Caching: Redis (models + health endpoints only)
- Provider Selection: Configurable weighted scoring (response time, success rate, price)

## Code Conventions
- Use strict TypeScript
- Separate plugins (Fastify registration) from middleware (pure functions)
- All services must have tests with ≥80% coverage
- Async operations for all I/O

## Timestamps
- 2026-02-20T17:55: Project started

## Documentation
- README.md and LICENSE (MIT) created.
- Documented core API endpoints: /v1/health, /v1/models, /v1/user, /v1/chat/completions.
- Included environment variable table and deployment instructions.
## Docker Configuration
- Implemented multi-stage build for API Gateway to minimize image size.
- Added health checks for all services (API, Postgres, Redis) to ensure proper startup sequence.
- Configured non-root user in Dockerfile for better security.
- Used Docker Compose for local development orchestration with persistent volumes.
## API Gateway 基础配置学习心得 (2026-02-21)

### 成功实践
- **ESM 支持**: 在 `package.json` 中设置 `"type": "module"` 并配合 `tsconfig.json` 的 `NodeNext` 配置，确保了现代 ESM 模块系统的兼容性。
- **严格 TypeScript**: 启用了 `strict` 模式和 `ES2022` target，为 Node.js 20 环境提供了良好的类型安全保障。
- **依赖选择**: 集成了 Fastify 生态（cors, rate-limit）和 Prisma，为高性能网关打下基础。

### 遇到的问题与解决
- **TS18003 错误**: TypeScript 编译器在没有源文件时会报错。通过创建 `src/index.ts` 解决了此问题。
- **.gitignore 冲突**: 初始尝试使用 `Write` 创建 `.gitignore` 失败，因为文件已存在。改用 `Edit` 工具成功追加了 Prisma 相关的排除规则。

### 后续建议
- 尽快初始化 Prisma schema 以生成客户端代码。
- 配置 ESLint 和 Prettier 以统一代码风格。
### Prisma Configuration Learnings
- Initialized Prisma with PostgreSQL provider.
- Implemented PrismaClient singleton pattern in  to prevent multiple instances in development.
- Configured conditional logging based on NODE_ENV.
- Verified schema using Prisma schema loaded from prisma/schema.prisma with a mock DATABASE_URL.
- Created  to ensure the directory is tracked by git.
### Prisma Configuration Learnings
- Initialized Prisma with PostgreSQL provider.
- Implemented PrismaClient singleton pattern in `src/config/database.ts` to prevent multiple instances in development.
- Configured conditional logging based on NODE_ENV.
- Verified schema using `npx prisma validate` with a mock DATABASE_URL.
- Created `prisma/migrations/.gitkeep` to ensure the directory is tracked by git.
Redis Configuration:
- Used ioredis for Redis connection.
- Implemented separate instances for general caching and Pub/Sub as required by ioredis.
- Added basic wrappers for cache (get/set/del) and messenger (publish/subscribe).
- Configured retry strategy and error handling.
- Verified TypeScript compilation.
Created core TypeScript types in src/types/index.ts including APIRequest, APIResponse, Provider, AuthPayload, UsageStats, ProviderStats, QuotaInfo, and ProviderStatus.
2026-02-21: Created Fastify app entry point. Configured pino logger, cors, rate-limit, and health check. Implemented graceful shutdown in server.ts. Fixed ESM import issues by adding .js extensions.
