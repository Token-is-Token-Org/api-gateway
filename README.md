# API Gateway for LLM Share Network

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/ai-rocoro/token-is-token/actions)
[![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen.svg)](https://github.com/ai-rocoro/token-is-token/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

LLM Share Network 的统一 API 入口，提供认证授权、请求路由、用量统计和响应缓存功能。

## 特性

- **认证与授权**: 支持 JWT 和 Web3 钱包签名 (SIWE 标准)。
- **智能调度**: 根据响应时间、成功率和价格自动选择最优的 LLM 提供商。
- **用量统计**: 实时跟踪用户和提供商的 Token 使用情况。
- **响应缓存**: 对 `/models` 和 `/health` 等端点进行高效缓存。
- **分布式限流**: 基于 Redis 的 sliding window 限流算法。
- **OpenAI 兼容**: 提供与 OpenAI 兼容的 API 接口。

## 技术栈

- **运行时**: Node.js 20
- **框架**: Fastify
- **语言**: TypeScript
- **数据库**: PostgreSQL (ORM: Prisma)
- **缓存/限流**: Redis
- **测试**: Vitest (TDD)

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境

复制 `.env.example` 并填写相关配置：

```bash
cp .env.example .env
```

### 运行数据库迁移

```bash
npx prisma migrate dev
```

### 启动开发服务器

```bash
npm run dev
```

### 运行测试

```bash
npm test
npm run test:coverage
```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
| :--- | :--- | :--- |
| `PORT` | 服务监听端口 | `3000` |
| `DATABASE_URL` | PostgreSQL 连接字符串 | - |
| `REDIS_URL` | Redis 连接字符串 | - |
| `JWT_SECRET` | JWT 签名密钥 | - |
| `CORS_ORIGIN` | 允许的 CORS 源 | `*` |
| `LOG_LEVEL` | 日志级别 (info, debug, error) | `info` |

## API 端点

| 方法 | 路径 | 说明 | 认证 |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/health` | 服务健康检查 | 否 |
| `GET` | `/v1/models` | 获取可用模型列表 | 否 |
| `GET` | `/v1/user` | 获取当前用户信息及配额 | 是 |
| `POST` | `/v1/chat/completions` | 聊天完成接口 (OpenAI 兼容) | 是 |

## 部署说明

### Docker

使用 Docker Compose 快速启动所有服务：

```bash
docker compose up -d
```

### Kubernetes

项目包含 K8s 部署配置，位于 `k8s/` 目录下（待实现）。

## 开发指南

- **代码风格**: 遵循 ESLint 配置，运行 `npm run lint` 检查。
- **测试驱动**: 推荐先编写测试用例，再实现功能逻辑。
- **提交规范**: 遵循 Conventional Commits 规范。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

