# API Gateway 项目完整实现计划

## TL;DR

> **快速摘要**: 根据提示词文档完整实现API Gateway项目，包括项目结构初始化、核心服务开发、测试和部署配置。
>
> **交付物**:
> - 完整的项目结构（50+文件）
> - 5个核心服务（Scheduler, ProviderRegistry, UsageTracker, AuthService, CacheService）
> - 完整的测试覆盖（TDD）
> - Docker和K8s部署配置
> - CI/CD流水线
>
> **预估工作量**: XL (Extra Large)
> **并行执行**: YES - 5个Wave，每个Wave 4-8个任务
> **关键路径**: 配置文件 → 核心类型 → 核心服务 → 集成测试 → 最终验证

---

## Context

### 原始需求
根据 `.prompts/` 文件夹下的文档开发API Gateway项目：
- `01-init-repository.md` - 创建完整的目录结构和基础配置文件
- `02-core-services.md` - 实现五个核心服务

### 访谈摘要
**关键讨论**:
- **测试策略**: TDD（测试驱动开发）- 先写测试，再写实现
- **实现范围**: 完整实现 - Phase 1（初始化）+ Phase 2（核心服务）
- **Provider来源**: 数据库存储 - PostgreSQL存储Provider信息
- **认证方式**: JWT + 钱包签名 - 支持Web3钱包签名验证

**技术决策**:
- 运行时: Node.js 20
- 框架: Fastify
- 语言: TypeScript
- 数据库: PostgreSQL + Redis
- 测试: TDD（框架待定，默认使用Vitest）
- ORM: Prisma（默认选择）

### Metis审查
**识别的Gap** (已解决):
- API契约不明确 → 应用OpenAI兼容API作为默认实现
- 认证流程不明确 → 应用SIWE标准作为默认实现
- Provider数据模型不明确 → 定义最小字段集
- Scheduler语义不明确 → 定义选择策略和重试规则
- UsageTracker口径不明确 → 按Token计数，异步写入
- CacheService适用范围不明确 → 仅缓存`/models`和`/health`
- 限流规则不明确 → 按userId，滑动窗口算法
- 测试框架不明确 → 使用Vitest
- ORM选择不明确 → 使用Prisma
- plugins vs middleware重复 → 明确职责划分

**应用的护栏**:
- 严格遵循`.prompts/01-init-repository.md`的目录结构
- 未明确的行为采用最小可运行实现
- 禁止额外引入新服务/子系统
- 所有验收标准必须可执行

---

## Work Objectives

### 核心目标
创建一个生产就绪的API Gateway，作为LLM Share Network的统一API入口，提供认证授权、请求路由、用量统计和响应缓存功能。

### 具体交付物
- [ ] 完整的项目结构和配置文件
- [ ] 5个核心服务的完整实现（含测试）
- [ ] 数据库Schema和迁移脚本
- [ ] Docker和K8s部署配置
- [ ] CI/CD流水线配置
- [ ] 完整的测试覆盖

### 完成定义
- [ ] `npm run build` 成功
- [ ] `npm test` 全部通过
- [ ] `docker compose up` 服务健康
- [ ] 关键API可访问且响应正确
- [ ] 所有测试覆盖率 ≥80%

### 必须包含
- 严格按照`.prompts/01-init-repository.md`的目录结构
- 所有5个核心服务按`.prompts/02-core-services.md`的接口实现
- 完整的TypeScript类型定义
- 错误处理和日志记录
- TDD测试（先测试后实现）

### 必须不包含（护栏）
- 不实现OpenAPI文档生成（超出范围）
- 不实现管理后台界面（超出范围）
- 不实现复杂计费系统（超出范围）
- 不实现服务发现机制（超出范围）
- 不实现全链路追踪（超出范围）
- plugins和middleware不重复实现相同功能

---

## Verification Strategy (MANDATORY)

> **零人工干预** - 所有验证由agent执行。无例外。
> 需要"用户手动测试/确认"的验收标准是禁止的。

### 测试决策
- **基础设施存在**: NO（需要设置）
- **自动化测试**: YES (TDD)
- **框架**: Vitest（默认选择）
- **TDD流程**: RED（失败测试）→ GREEN（最小实现）→ REFACTOR

### QA政策
每个任务必须包含agent执行的QA场景（见TODO模板）。
证据保存到 `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`。

- **前端/UI**: 使用Playwright（playwright skill）— 导航、交互、断言DOM、截图
- **TUI/CLI**: 使用interactive_bash（tmux）— 运行命令、发送按键、验证输出
- **API/后端**: 使用Bash（curl）— 发送请求、断言状态码+响应字段
- **库/模块**: 使用Bash（bun/node REPL）— 导入、调用函数、比较输出

---

## Execution Strategy

### 并行执行Wave

> 最大化吞吐量，将独立任务分组为并行wave。
> 每个wave完成后开始下一个。
> 目标：每wave 5-8个任务。少于3个（除最终wave）= 拆分不足。

```
Wave 1 (立即开始 — 配置 + 类型定义):
├── Task 1: 基础配置文件（package.json, tsconfig.json, .gitignore）[quick]
├── Task 2: 项目文档（README.md, LICENSE）[quick]
├── Task 3: Docker配置（Dockerfile, docker-compose.yml）[quick]
├── Task 4: 数据库配置（Prisma schema + migrations）[quick]
├── Task 5: Redis配置 [quick]
├── Task 6: 核心类型定义 [quick]
└── Task 7: Fastify应用入口（server.ts, app.ts）[quick]

Wave 2 (Wave 1后 — 数据模型 + 工具):
├── Task 8: Prisma模型定义（User, Provider, Request, Usage）[quick]
├── Task 9: 工具函数（logger, validators, errors）[quick]
├── Task 10: 错误处理中间件 [quick]
├── Task 11: Auth中间件 + Plugin（明确职责）[quick]
├── Task 12: RateLimit中间件 + Plugin [quick]
├── Task 13: CORS插件 [quick]
└── Task 14: Logging插件 [quick]

Wave 3 (Wave 2后 — 核心服务，最大并行):
├── Task 15: CacheService测试 + 实现 [deep]
├── Task 16: AuthService测试 + 实现 [deep]
├── Task 17: UsageTracker测试 + 实现 [deep]
├── Task 18: ProviderRegistry测试 + 实现 [deep]
├── Task 19: Scheduler测试 + 实现 [ultrabrain]
└── Task 20: Provider选择策略（3种） [deep]

Wave 4 (Wave 3后 — API路由):
├── Task 21: Health路由 [quick]
├── Task 22: Models路由 [quick]
├── Task 23: User路由 [quick]
├── Task 24: Chat路由（核心） [deep]
├── Task 25: 路由注册和版本管理 [quick]
└── Task 26: API集成测试 [deep]

Wave 5 (Wave 4后 — 部署配置):
├── Task 27: Kubernetes Deployment [quick]
├── Task 28: Kubernetes Service [quick]
├── Task 29: Kubernetes Ingress [quick]
├── Task 30: Kubernetes ConfigMap [quick]
├── Task 31: GitHub Actions CI [quick]
└── Task 32: GitHub Actions Deploy [quick]

Wave FINAL (所有任务后 — 独立审查，4并行):
├── Task F1: 计划合规性审计 (oracle)
├── Task F2: 代码质量审查 (unspecified-high)
├── Task F3: 真实手动QA (unspecified-high)
└── Task F4: 范围保真度检查 (deep)

关键路径: Task 1 → Task 8 → Task 6 → Task 15-19 → Task 24 → Task 26 → F1-F4
并行加速: 比顺序快约65%
最大并发: 7 (Waves 1 & 2)
```

### 依赖矩阵（完整）

> Wave 1: 无依赖，可立即开始
- **1-7**: — — 8-14, 1

> Wave 2: 依赖Wave 1的配置和类型
- **8**: 1 — 15-20, 2
- **9**: 1 — 10-14, 1
- **10**: 9 — 11-14, 1
- **11-14**: 8, 9, 10 — 21-26, 2

> Wave 3: 依赖Wave 2的模型和工具
- **15**: 8, 9 — 16-20, 2
- **16**: 8, 9 — 17-20, 2
- **17**: 8, 9 — 18-20, 2
- **18**: 8, 9 — 19-20, 2
- **19**: 6, 8, 9, 18 — 20, 2
- **20**: 6, 9 — 19, 2

> Wave 4: 依赖Wave 3的核心服务
- **21**: 7, 14 — 25-26, 1
- **22**: 7, 15 — 25-26, 1
- **23**: 7, 11, 16 — 25-26, 1
- **24**: 7, 11, 15, 19 — 25-26, 2
- **25**: 21-24 — 26, 1
- **26**: 21-25 — F1-F4, 2

> Wave 5: 依赖Wave 4的完整应用
- **27-32**: 7, 26 — F1-F4, 1

> Wave FINAL: 依赖所有实现任务
- **F1-F4**: 26, 32 — — 1

### Agent分发摘要

- **Wave 1**: **7** — T1-T4 → `quick`, T5-T7 → `quick`
- **Wave 2**: **7** — T8-T10 → `quick`, T11-T14 → `quick`
- **Wave 3**: **6** — T15-T18 → `deep`, T19 → `ultrabrain`, T20 → `deep`
- **Wave 4**: **6** — T21-T23 → `quick`, T24 → `deep`, T25-T26 → `quick`
- **Wave 5**: **6** — T27-T32 → `quick`
- **FINAL**: **4** — F1 → `oracle`, F2-F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> 实现 + 测试 = 一个任务。永不分离。
> 每个任务必须有：推荐Agent Profile + 并行化信息 + QA场景。
> **没有QA场景的任务是不完整的。无例外。**

### Wave 1: 配置 + 类型定义（立即开始）

- [x] 1. 基础配置文件

  **What to do**:
  - 创建 `package.json` 包含Fastify、Prisma、Vitest等依赖
  - 创建 `tsconfig.json` 配置严格TypeScript
  - 更新 `.gitignore` 排除node_modules、dist、.env等
  - 创建 `.env.example` 列出所有必需的环境变量

  **Must NOT do**:
  - 不添加文档中未提及的额外依赖
  - 不配置过于复杂的TypeScript选项

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准的配置文件创建，无需复杂逻辑
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-7)
  - **Blocks**: Tasks 8-14 (需要配置文件)
  - **Blocked By**: None

  **References**:
  - `.prompts/01-init-repository.md:11-82` - 目录结构
  - `.prompts/01-init-repository.md:92-96` - package.json要求（Fastify依赖、数据库驱动、测试框架）

  **Acceptance Criteria**:
  - [ ] `package.json` 存在且包含所有必需依赖
  - [ ] `tsconfig.json` 启用strict mode
  - [ ] `.gitignore` 排除正确的文件
  - [ ] `npm install` 成功

  **QA Scenarios**:
  ```
  Scenario: 配置文件验证
    Tool: Bash
    Preconditions: 文件已创建
    Steps:
      1. test -f package.json && echo "package.json exists"
      2. test -f tsconfig.json && echo "tsconfig.json exists"
      3. test -f .gitignore && echo ".gitignore exists"
      4. npm install --dry-run 2>&1 | grep -q "would install" && echo "Dependencies valid"
    Expected Result: 所有文件存在，依赖列表有效
    Evidence: .sisyphus/evidence/task-01-config-validation.txt
  ```

  **Commit**: YES
  - Message: `chore: add base configuration files`
  - Files: `package.json, tsconfig.json, .gitignore, .env.example`

- [x] 2. 项目文档

  **What to do**:
  - 创建 `README.md` 包含项目介绍、API文档链接、部署说明、环境变量说明
  - 创建 `LICENSE` (MIT许可证)

  **Must NOT do**:
  - 不添加过时的或未实现功能的文档

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的文档创建
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-7)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `.prompts/01-init-repository.md:86-91` - README.md要求

  **Acceptance Criteria**:
  - [ ] `README.md` 存在且包含所有必需章节
  - [ ] `LICENSE` 存在且为MIT许可证

  **QA Scenarios**:
  ```
  Scenario: 文档完整性检查
    Tool: Bash
    Preconditions: 文件已创建
    Steps:
      1. test -f README.md && echo "README exists"
      2. test -f LICENSE && echo "LICENSE exists"
      3. grep -q "MIT" LICENSE && echo "MIT license confirmed"
      4. grep -q "API" README.md && echo "API section exists"
    Expected Result: 所有文档文件存在且内容正确
    Evidence: .sisyphus/evidence/task-02-docs-validation.txt
  ```

  **Commit**: YES
  - Message: `docs: add README and MIT license`
  - Files: `README.md, LICENSE`

- [x] 3. Docker配置

  **What to do**:
  - 创建 `Dockerfile` 使用Node.js 20基础镜像，多阶段构建，包含健康检查
  - 创建 `docker-compose.yml` 包含api-gateway、PostgreSQL、Redis服务

  **Must NOT do**:
  - 不添加生产环境特定配置（保持开发环境简单）
  - 不暴露不必要的端口

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准Docker配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-2, 4-7)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `.prompts/01-init-repository.md:97-100` - Dockerfile要求（Node.js 20、多阶段构建、健康检查）

  **Acceptance Criteria**:
  - [ ] `Dockerfile` 存在且使用多阶段构建
  - [ ] `docker-compose.yml` 包含3个服务
  - [ ] `docker compose config` 验证通过

  **QA Scenarios**:
  ```
  Scenario: Docker配置验证
    Tool: Bash
    Preconditions: 文件已创建
    Steps:
      1. test -f Dockerfile && echo "Dockerfile exists"
      2. test -f docker-compose.yml && echo "docker-compose.yml exists"
      3. docker compose config > /dev/null 2>&1 && echo "docker-compose.yml is valid"
      4. grep -q "HEALTHCHECK" Dockerfile && echo "Healthcheck configured"
    Expected Result: Docker配置文件存在且语法正确
    Evidence: .sisyphus/evidence/task-03-docker-validation.txt
  ```

  **Commit**: YES
  - Message: `feat: add Docker configuration`
  - Files: `Dockerfile, docker-compose.yml`

- [x] 4. 数据库配置（Prisma）

  **What to do**:
  - 创建 `prisma/schema.prisma` 定义基础模型
  - 创建初始migration脚本
  - 配置数据库连接（config/database.ts）

  **Must NOT do**:
  - 不添加文档中未提及的模型
  - 不配置生产数据库连接

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Prisma设置是标准流程
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-3, 5-7)
  - **Blocks**: Task 8 (需要Prisma设置)
  - **Blocked By**: Task 1 (需要package.json)

  **References**:
  - `.prompts/01-init-repository.md:27-29` - config/database.ts位置
  - `.prompts/02-core-services.md` - 隐含的Provider/User/Usage模型需求

  **Acceptance Criteria**:
  - [ ] `prisma/schema.prisma` 存在
  - [ ] `npx prisma validate` 通过
  - [ ] `config/database.ts` 导出PrismaClient

  **QA Scenarios**:
  ```
  Scenario: Prisma配置验证
    Tool: Bash
    Preconditions: package.json已创建，npm install已执行
    Steps:
      1. test -f prisma/schema.prisma && echo "Prisma schema exists"
      2. npx prisma validate && echo "Prisma schema is valid"
      3. test -f src/config/database.ts && echo "Database config exists"
    Expected Result: Prisma配置正确且schema有效
    Evidence: .sisyphus/evidence/task-04-prisma-validation.txt
  ```

  **Commit**: YES
  - Message: `feat: setup Prisma database configuration`
  - Files: `prisma/schema.prisma, src/config/database.ts`

- [x] 5. Redis配置

  **What to do**:
  - 创建 `src/config/redis.ts` 配置Redis连接
  - 配置Redis客户端用于缓存和Pub/Sub

  **Must NOT do**:
  - 不配置生产Redis集群
  - 不添加文档中未提及的Redis功能

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准Redis客户端配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4, 6-7)
  - **Blocks**: Task 15 (CacheService需要Redis)
  - **Blocked By**: Task 1 (需要package.json)

  **References**:
  - `.prompts/01-init-repository.md:30` - config/redis.ts位置
  - `.prompts/system-prompt.md:28` - Redis用于缓存和Pub/Sub

  **Acceptance Criteria**:
  - [ ] `src/config/redis.ts` 存在
  - [ ] 导出Redis客户端实例
  - [ ] 支持基本get/set操作

  **QA Scenarios**:
  ```
  Scenario: Redis配置验证
    Tool: Bash
    Preconditions: package.json已创建，npm install已执行
    Steps:
      1. test -f src/config/redis.ts && echo "Redis config exists"
      2. docker compose up -d redis
      3. npx ts-node -e "import redis from './src/config/redis'; redis.ping().then(() => console.log('Redis OK'))"
    Expected Result: Redis配置正确且可连接
    Evidence: .sisyphus/evidence/task-05-redis-validation.txt
  ```

  **Commit**: YES
  - Message: `feat: add Redis configuration`
  - Files: `src/config/redis.ts`

- [x] 6. 核心类型定义

  **What to do**:
  - 创建核心TypeScript类型/接口：
    - `Request` 类型（来自用户的API请求）
    - `Response` 类型（API响应）
    - `Provider` 类型（LLM服务提供商）
    - `AuthPayload` 类型（认证载荷）
    - `UsageStats` 类型（用量统计）
    - `ProviderStats` 类型（Provider统计）
    - `QuotaInfo` 类型（配额信息）

  **Must NOT do**:
  - 不添加文档中未提及的类型
  - 不过度设计类型层次结构

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 类型定义是基础工作
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-5, 7)
  - **Blocks**: Tasks 15-20 (核心服务需要这些类型)
  - **Blocked By**: Task 1 (需要tsconfig.json)

  **References**:
  - `.prompts/02-core-services.md:12-106` - 各服务的接口定义隐含了类型需求

  **Acceptance Criteria**:
  - [ ] 所有核心类型已定义
  - [ ] TypeScript编译无错误
  - [ ] 类型导出正确

  **QA Scenarios**:
  ```
  Scenario: 类型定义验证
    Tool: Bash
    Preconditions: tsconfig.json已创建
    Steps:
      1. test -f src/types/index.ts && echo "Types file exists"
      2. npx tsc --noEmit src/types/index.ts && echo "TypeScript compilation OK"
      3. grep -q "export interface Request" src/types/index.ts && echo "Request type defined"
      4. grep -q "export interface Provider" src/types/index.ts && echo "Provider type defined"
    Expected Result: 所有类型已定义且编译通过
    Evidence: .sisyphus/evidence/task-06-types-validation.txt
  ```

  **Commit**: YES
  - Message: `feat: add core type definitions`
  - Files: `src/types/index.ts`

- [x] 7. Fastify应用入口

  **What to do**:
  - 创建 `src/app.ts` 配置Fastify应用（注册插件、中间件、路由）
  - 创建 `src/server.ts` 作为入口文件，启动服务器
  - 创建 `src/config/index.ts` 导出所有配置

  **Must NOT do**:
  - 不启动服务器监听（由server.ts负责）
  - 不配置生产环境特定设置

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准Fastify应用设置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-6)
  - **Blocks**: Tasks 21-25 (路由需要app.ts)
  - **Blocked By**: Task 1 (需要package.json)

  **References**:
  - `.prompts/01-init-repository.md:23-24` - server.ts和app.ts位置

  **Acceptance Criteria**:
  - [ ] `src/app.ts` 存在且导出Fastify实例
  - [ ] `src/server.ts` 存在且启动服务器
  - [ ] `src/config/index.ts` 存在
  - [ ] `npm run dev` 可启动服务器

  **QA Scenarios**:
  ```
  Scenario: 应用入口验证
    Tool: Bash
    Preconditions: package.json已创建，npm install已执行
    Steps:
      1. test -f src/app.ts && echo "app.ts exists"
      2. test -f src/server.ts && echo "server.ts exists"
      3. test -f src/config/index.ts && echo "config/index.ts exists"
      4. timeout 5 npm run dev 2>&1 | grep -q "Server listening" && echo "Server starts successfully"
    Expected Result: 应用入口文件存在且服务器可启动
    Evidence: .sisyphus/evidence/task-07-app-entry-validation.txt
  ```

  **Commit**: YES
  - Message: `feat: add Fastify application entry points`
  - Files: `src/app.ts, src/server.ts, src/config/index.ts`

### Wave 2: 数据模型 + 工具（Wave 1后）

- [x] 8. Prisma模型定义

  **What to do**:
  - 在 `prisma/schema.prisma` 中定义完整模型：
    - `User` 模型（id, address, quota, createdAt, updatedAt）
    - `Provider` 模型（id, name, endpoint, models, status, createdAt, updatedAt）
    - `Request` 模型（id, userId, providerId, model, inputTokens, outputTokens, status, createdAt）
    - `Usage` 模型（id, userId, providerId, requests, tokens, cost, date）
  - 运行migration创建表

  **Must NOT do**:
  - 不添加文档中未提及的字段
  - 不创建复杂的索引（仅主键和基本外键）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Prisma模型定义是标准工作
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 9-14)
  - **Blocks**: Tasks 15-18 (核心服务需要这些模型)
  - **Blocked By**: Task 4 (需要Prisma设置)

  **References**:
  - `.prompts/01-init-repository.md:53-56` - models目录结构
  - `.prompts/02-core-services.md:39-49` - ProviderRegistry接口隐含Provider模型需求
  - `.prompts/02-core-services.md:57-71` - UsageTracker接口隐含Usage模型需求

  **Acceptance Criteria**:
  - [ ] 所有4个模型已定义
  - [ ] `npx prisma migrate dev` 成功
  - [ ] 数据库表已创建

  **QA Scenarios**:
  ```
  Scenario: Prisma模型验证
    Tool: Bash
    Preconditions: Task 4完成，PostgreSQL运行
    Steps:
      1. docker compose up -d postgres
      2. npx prisma validate && echo "Schema is valid"
      3. npx prisma migrate dev --name init && echo "Migration created"
      4. npx prisma db pull 2>&1 | grep -q "Models in Prisma Schema" && echo "Tables created"
    Expected Result: 所有模型已定义且migration成功
    Evidence: .sisyphus/evidence/task-08-prisma-models.txt
  ```

  **Commit**: YES
  - Message: `feat: add Prisma models for User, Provider, Request, Usage`
  - Files: `prisma/schema.prisma, prisma/migrations/`

- [x] 9. 工具函数

  **What to do**:
  - 创建 `src/utils/logger.ts` - 结构化日志工具（使用pino）
  - 创建 `src/utils/validators.ts` - 输入验证函数
  - 创建 `src/utils/errors.ts` - 自定义错误类（AppError, AuthError, ValidationError等）

  **Must NOT do**:
  - 不添加文档中未提及的工具函数
  - 不过度抽象

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准工具函数创建
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 10-14)
  - **Blocks**: Tasks 10-14, 15-20 (所有代码都需要这些工具)
  - **Blocked By**: Task 1 (需要package.json)

  **References**:
  - `.prompts/01-init-repository.md:63-66` - utils目录结构
  - `.prompts/system-prompt.md:35` - 详细的日志记录要求

  **Acceptance Criteria**:
  - [ ] `logger.ts` 导出logger实例
  - [ ] `validators.ts` 包含基本验证函数
  - [ ] `errors.ts` 定义自定义错误类
  - [ ] TypeScript编译无错误

  **QA Scenarios**:
  ```
  Scenario: 工具函数验证
    Tool: Bash
    Preconditions: package.json已创建
    Steps:
      1. test -f src/utils/logger.ts && echo "logger.ts exists"
      2. test -f src/utils/validators.ts && echo "validators.ts exists"
      3. test -f src/utils/errors.ts && echo "errors.ts exists"
      4. npx tsc --noEmit src/utils/*.ts && echo "TypeScript compilation OK"
    Expected Result: 所有工具文件存在且编译通过
    Evidence: .sisyphus/evidence/task-09-utils-validation.txt
  ```

  **Commit**: YES
  - Message: `feat: add utility functions (logger, validators, errors)`
  - Files: `src/utils/logger.ts, src/utils/validators.ts, src/utils/errors.ts`

- [x] 10. 错误处理中间件

  **What to do**:
  - 创建 `src/middleware/errorHandler.ts` - 全局错误处理中间件
  - 捕获所有未处理错误并返回标准化错误响应
  - 记录错误日志

  **Must NOT do**:
  - 不暴露敏感错误信息给客户端
  - 不吞掉错误（所有错误都必须被记录）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准错误处理中间件
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-9, 11-14)
  - **Blocks**: Tasks 11-14 (其他中间件需要错误处理)
  - **Blocked By**: Task 9 (需要errors.ts)

  **References**:
  - `.prompts/01-init-repository.md:60-61` - middleware/errorHandler.ts位置
  - `.prompts/system-prompt.md:35` - 完整的错误处理要求

  **Acceptance Criteria**:
  - [ ] 错误处理中间件已实现
  - [ ] 返回标准化错误格式
  - [ ] 错误被记录到日志

  **QA Scenarios**:
  ```
  Scenario: 错误处理验证
    Tool: Bash
    Preconditions: app.ts已创建
    Steps:
      1. test -f src/middleware/errorHandler.ts && echo "Error handler exists"
      2. curl -s http://localhost:3000/nonexistent 2>&1 | grep -q "error" && echo "Error response returned"
      3. curl -s http://localhost:3000/nonexistent 2>&1 | jq -r '.error.code' | grep -q "NOT_FOUND" && echo "Standard error format"
    Expected Result: 错误处理中间件工作正常
    Evidence: .sisyphus/evidence/task-10-error-handler.txt
  ```

  **Commit**: YES
  - Message: `feat: add global error handling middleware`
  - Files: `src/middleware/errorHandler.ts`

- [x] 11. Auth中间件 + Plugin（明确职责）

  **What to do**:
  - 创建 `src/plugins/auth.ts` - Fastify插件，注册认证装饰器和钩子
  - 创建 `src/middleware/auth.ts` - 纯函数，验证JWT和钱包签名
  - 职责划分：Plugin负责注册到Fastify，Middleware负责具体的验证逻辑
  - 实现JWT验证（使用环境变量中的SECRET）
  - 实现钱包签名验证（SIWE标准）

  **Must NOT do**:
  - 不在Plugin和Middleware中重复实现相同逻辑
  - 不硬编码JWT密钥
  - 不存储明文密码或私钥

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准认证实现
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-10, 12-14)
  - **Blocks**: Tasks 16, 23-24 (AuthService和路由需要认证)
  - **Blocked By**: Tasks 8, 9 (需要User模型和errors.ts)

  **References**:
  - `.prompts/01-init-repository.md:32` - plugins/auth.ts位置
  - `.prompts/01-init-repository.md:59` - middleware/auth.ts位置
  - `.prompts/02-core-services.md:74-87` - AuthService接口定义

  **Acceptance Criteria**:
  - [ ] Auth Plugin已实现
  - [ ] Auth Middleware已实现
  - [ ] JWT验证工作正常
  - [ ] 钱包签名验证工作正常

  **QA Scenarios**:
  ```
  Scenario: 认证中间件验证
    Tool: Bash
    Preconditions: app.ts和server.ts已创建
    Steps:
      1. test -f src/plugins/auth.ts && echo "Auth plugin exists"
      2. test -f src/middleware/auth.ts && echo "Auth middleware exists"
      3. curl -s http://localhost:3000/v1/user 2>&1 | jq -r '.error.code' | grep -q "AUTH_MISSING_TOKEN" && echo "Missing token rejected"
      4. curl -s -H "Authorization: Bearer invalid" http://localhost:3000/v1/user 2>&1 | jq -r '.error.code' | grep -q "AUTH_INVALID_TOKEN" && echo "Invalid token rejected"
    Expected Result: 认证中间件正确拒绝无效请求
    Evidence: .sisyphus/evidence/task-11-auth-middleware.txt
  ```

  **Commit**: YES
  - Message: `feat: add authentication plugin and middleware`
  - Files: `src/plugins/auth.ts, src/middleware/auth.ts`

- [x] 12. RateLimit中间件 + Plugin

  **What to do**:
  - 创建 `src/plugins/rateLimit.ts` - Fastify插件，配置限流
  - 创建 `src/middleware/rateLimit.ts` - 纯函数，检查限流状态
  - 职责划分：Plugin负责注册，Middleware负责限流逻辑
  - 使用Redis实现分布式限流
  - 采用滑动窗口算法
  - 按userId限流（默认100 req/min）

  **Must NOT do**:
  - 不在Plugin和Middleware中重复实现相同逻辑
  - 不使用内存限流（不支持分布式）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准限流实现
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-11, 13-14)
  - **Blocks**: Task 24 (Chat路由需要限流)
  - **Blocked By**: Tasks 5, 9 (需要Redis和logger)

  **References**:
  - `.prompts/01-init-repository.md:33` - plugins/rateLimit.ts位置
  - `.prompts/01-init-repository.md:60` - middleware/rateLimit.ts位置
  - `.prompts/system-prompt.md:20` - 用量统计和限流要求

  **Acceptance Criteria**:
  - [ ] RateLimit Plugin已实现
  - [ ] RateLimit Middleware已实现
  - [ ] Redis限流工作正常
  - [ ] 超过限制返回429错误

  **QA Scenarios**:
  ```
  Scenario: 限流验证
    Tool: Bash
    Preconditions: Redis已启动
    Steps:
      1. test -f src/plugins/rateLimit.ts && echo "RateLimit plugin exists"
      2. test -f src/middleware/rateLimit.ts && echo "RateLimit middleware exists"
      3. for i in {1..101}; do curl -s http://localhost:3000/v1/health > /dev/null; done
      4. curl -s http://localhost:3000/v1/health 2>&1 | jq -r '.error.code' | grep -q "RATE_LIMIT_EXCEEDED" && echo "Rate limit enforced"
    Expected Result: 限流正常工作，超过限制返回429
    Evidence: .sisyphus/evidence/task-12-ratelimit.txt
  ```

  **Commit**: YES
  - Message: `feat: add rate limiting plugin and middleware`
  - Files: `src/plugins/rateLimit.ts, src/middleware/rateLimit.ts`

- [x] 13. CORS插件

  **What to do**:
  - 创建 `src/plugins/cors.ts` - Fastify CORS插件配置
  - 允许指定的源（从环境变量读取）
  - 配置允许的方法和头

  **Must NOT do**:
  - 不允许所有源（安全风险）
  - 不暴露敏感头

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的插件配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-12, 14)
  - **Blocks**: None
  - **Blocked By**: Task 1 (需要package.json)

  **References**:
  - `.prompts/01-init-repository.md:35` - plugins/cors.ts位置

  **Acceptance Criteria**:
  - [ ] CORS插件已配置
  - [ ] 只有允许的源可访问
  - [ ] OPTIONS请求正确处理

  **QA Scenarios**:
  ```
  Scenario: CORS验证
    Tool: Bash
    Preconditions: server已启动
    Steps:
      1. test -f src/plugins/cors.ts && echo "CORS plugin exists"
      2. curl -s -I -X OPTIONS -H "Origin: http://localhost:3000" http://localhost:3000/v1/health | grep -q "Access-Control-Allow-Origin" && echo "CORS headers present"
    Expected Result: CORS插件正常工作
    Evidence: .sisyphus/evidence/task-13-cors.txt
  ```

  **Commit**: YES
  - Message: `feat: add CORS plugin`
  - Files: `src/plugins/cors.ts`

- [x] 14. Logging插件

  **What to do**:
  - 创建 `src/plugins/logging.ts` - Fastify日志插件
  - 配置请求/响应日志
  - 使用pino作为日志库
  - 结构化日志输出

  **Must NOT do**:
  - 不记录敏感信息（密码、token等）
  - 不在生产环境使用debug级别日志

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的插件配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-13)
  - **Blocks**: Task 21 (Health路由需要日志)
  - **Blocked By**: Task 9 (需要logger.ts)

  **References**:
  - `.prompts/01-init-repository.md:34` - plugins/logging.ts位置
  - `.prompts/system-prompt.md:36` - 详细的日志记录要求

  **Acceptance Criteria**:
  - [ ] Logging插件已配置
  - [ ] 请求/响应被记录
  - [ ] 日志格式结构化

  **QA Scenarios**:
  ```
  Scenario: 日志插件验证
    Tool: Bash
    Preconditions: server已启动
    Steps:
      1. test -f src/plugins/logging.ts && echo "Logging plugin exists"
      2. curl -s http://localhost:3000/v1/health > /dev/null
      3. tail -n 5 logs/app.log 2>/dev/null | grep -q "GET /v1/health" && echo "Request logged"
    Expected Result: 日志插件正常工作
    Evidence: .sisyphus/evidence/task-14-logging.txt
  ```

  **Commit**: YES
  - Message: `feat: add logging plugin`
  - Files: `src/plugins/logging.ts`

### Wave 3: 核心服务（Wave 2后）

- [x] 15. CacheService测试 + 实现

  **What to do**:
  - 先写测试（TDD）：
    - `test/unit/services/CacheService.test.ts`
    - 测试get、set、del操作
    - 测试TTL过期
    - 测试缓存miss
  - 实现 `src/services/CacheService.ts`:
    - `get(key)` - 获取缓存
    - `set(key, value, ttl)` - 设置缓存
    - `del(key)` - 删除缓存
  - 使用Redis作为后端

  **Must NOT do**:
  - 不缓存大对象（>1MB）
  - 不缓存敏感数据
  - 不设置过长的TTL（默认5分钟）

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 核心服务需要深入思考和完整实现
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 16-20)
  - **Blocks**: Task 22 (Models路由需要缓存)
  - **Blocked By**: Tasks 5, 8, 9 (需要Redis、Prisma、logger)

  **References**:
  - `.prompts/02-core-services.md:92-105` - CacheService接口定义
  - `.prompts/system-prompt.md:28` - Redis用于缓存

  **Acceptance Criteria**:
  - [ ] 测试文件已创建
  - [ ] `npm test CacheService` 通过
  - [ ] CacheService实现完整
  - [ ] 测试覆盖率 ≥80%

  **QA Scenarios**:
  ```
  Scenario: CacheService单元测试
    Tool: Bash
    Preconditions: Redis已启动
    Steps:
      1. test -f test/unit/services/CacheService.test.ts && echo "Test file exists"
      2. npm test -- CacheService.test.ts 2>&1 | grep -q "PASS" && echo "Tests passed"
      3. npm test -- --coverage CacheService.test.ts 2>&1 | grep -E "All files.*[8-9][0-9]|100" && echo "Coverage ≥80%"
    Expected Result: 所有测试通过，覆盖率达标
    Evidence: .sisyphus/evidence/task-15-cacheservice-tests.txt
  
  Scenario: CacheService功能验证
    Tool: Bash
    Preconditions: 服务已实现，Redis已启动
    Steps:
      1. npx ts-node -e "import CacheService from './src/services/CacheService'; const c = new CacheService(); c.set('test', 'value', 60).then(() => console.log('Set OK'))"
      2. npx ts-node -e "import CacheService from './src/services/CacheService'; const c = new CacheService(); c.get('test').then(v => console.log('Get:', v))"
      3. npx ts-node -e "import CacheService from './src/services/CacheService'; const c = new CacheService(); c.del('test').then(() => console.log('Del OK'))"
    Expected Result: CacheService基本操作工作正常
    Evidence: .sisyphus/evidence/task-15-cacheservice-functional.txt
  ```

  **Commit**: YES
  - Message: `feat(services): implement CacheService with tests`
  - Files: `test/unit/services/CacheService.test.ts, src/services/CacheService.ts`

- [x] 16. AuthService测试 + 实现

  **What to do**:
  - 先写测试（TDD）：
    - `test/unit/services/AuthService.test.ts`
    - 测试JWT验证（有效、过期、无效）
    - 测试钱包签名验证（SIWE标准）
    - 测试配额检查
  - 实现 `src/services/AuthService.ts`:
    - `verifyToken(token)` - 验证JWT
    - `verifySignature(message, signature, address)` - 验证钱包签名
    - `checkQuota(userId)` - 检查配额

  **Must NOT do**:
  - 不硬编码JWT密钥
  - 不存储明文密码
  - 不跳过nonce验证（防重放攻击）

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 认证是安全关键组件，需要仔细实现
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 15, 17-20)
  - **Blocks**: Task 23 (User路由需要认证)
  - **Blocked By**: Tasks 8, 9 (需要User模型和logger)

  **References**:
  - `.prompts/02-core-services.md:74-87` - AuthService接口定义
  - `.prompts/system-prompt.md:19` - 请求认证和授权要求

  **Acceptance Criteria**:
  - [ ] 测试文件已创建
  - [ ] `npm test AuthService` 通过
  - [ ] JWT验证工作正常
  - [ ] 钱包签名验证工作正常
  - [ ] 配额检查工作正常
  - [ ] 测试覆盖率 ≥80%

  **QA Scenarios**:
  ```
  Scenario: AuthService单元测试
    Tool: Bash
    Preconditions: 无
    Steps:
      1. test -f test/unit/services/AuthService.test.ts && echo "Test file exists"
      2. npm test -- AuthService.test.ts 2>&1 | grep -q "PASS" && echo "Tests passed"
      3. npm test -- --coverage AuthService.test.ts 2>&1 | grep -E "All files.*[8-9][0-9]|100" && echo "Coverage ≥80%"
    Expected Result: 所有测试通过，覆盖率达标
    Evidence: .sisyphus/evidence/task-16-authservice-tests.txt
  
  Scenario: JWT验证功能验证
    Tool: Bash
    Preconditions: 服务已实现
    Steps:
      1. TOKEN=$(npx ts-node -e "import jwt from 'jsonwebtoken'; console.log(jwt.sign({userId:'test'}, process.env.JWT_SECRET || 'test-secret'));")
      2. npx ts-node -e "import AuthService from './src/services/AuthService'; const a = new AuthService(); a.verifyToken('$TOKEN').then(p => console.log('Payload:', p.userId))"
    Expected Result: JWT验证工作正常
    Evidence: .sisyphus/evidence/task-16-authservice-jwt.txt
  ```

  **Commit**: YES
  - Message: `feat(services): implement AuthService with tests`
  - Files: `test/unit/services/AuthService.test.ts, src/services/AuthService.ts`

- [x] 17. UsageTracker测试 + 实现

  **What to do**:
  - 先写测试（TDD）：
    - `test/unit/services/UsageTracker.test.ts`
    - 测试请求记录
    - 测试响应记录
    - 测试用户用量统计
    - 测试Provider统计
  - 实现 `src/services/UsageTracker.ts`:
    - `trackRequest(request)` - 记录请求
    - `trackResponse(requestId, response)` - 记录响应
    - `getUserUsage(userId, start, end)` - 获取用户用量
    - `getProviderStats(providerId)` - 获取Provider统计

  **Must NOT do**:
  - 不同步写入数据库（增加尾延迟）
  - 不丢失用量数据（必须持久化）
  - 不统计敏感请求内容

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 用量跟踪是计费基础，需要准确实现
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 15-16, 18-20)
  - **Blocks**: Task 24 (Chat路由需要用量跟踪)
  - **Blocked By**: Tasks 8, 9 (需要Usage/Request模型和logger)

  **References**:
  - `.prompts/02-core-services.md:55-71` - UsageTracker接口定义
  - `.prompts/system-prompt.md:20` - 用量统计要求

  **Acceptance Criteria**:
  - [ ] 测试文件已创建
  - [ ] `npm test UsageTracker` 通过
  - [ ] 请求/响应记录工作正常
  - [ ] 用量统计工作正常
  - [ ] 异步写入实现
  - [ ] 测试覆盖率 ≥80%

  **QA Scenarios**:
  ```
  Scenario: UsageTracker单元测试
    Tool: Bash
    Preconditions: PostgreSQL已启动
    Steps:
      1. test -f test/unit/services/UsageTracker.test.ts && echo "Test file exists"
      2. npm test -- UsageTracker.test.ts 2>&1 | grep -q "PASS" && echo "Tests passed"
      3. npm test -- --coverage UsageTracker.test.ts 2>&1 | grep -E "All files.*[8-9][0-9]|100" && echo "Coverage ≥80%"
    Expected Result: 所有测试通过，覆盖率达标
    Evidence: .sisyphus/evidence/task-17-usagetracker-tests.txt
  
  Scenario: UsageTracker功能验证
    Tool: Bash
    Preconditions: 服务已实现，PostgreSQL已启动
    Steps:
      1. npx ts-node -e "import UsageTracker from './src/services/UsageTracker'; const u = new UsageTracker(); u.trackRequest({id:'1',userId:'test',model:'gpt-4'}).then(() => console.log('Request tracked'))"
      2. npx ts-node -e "import UsageTracker from './src/services/UsageTracker'; const u = new UsageTracker(); u.getUserUsage('test', new Date(), new Date()).then(s => console.log('Stats:', s.requests))"
    Expected Result: UsageTracker基本操作工作正常
    Evidence: .sisyphus/evidence/task-17-usagetracker-functional.txt
  ```

  **Commit**: YES
  - Message: `feat(services): implement UsageTracker with tests`
  - Files: `test/unit/services/UsageTracker.test.ts, src/services/UsageTracker.ts`

- [x] 18. ProviderRegistry测试 + 实现

  **What to do**:
  - 先写测试（TDD）：
    - `test/unit/services/ProviderRegistry.test.ts`
    - 测试Provider注册
    - 测试状态更新
    - 测试获取可用Providers
    - 测试心跳检测
  - 实现 `src/services/ProviderRegistry.ts`:
    - `register(provider)` - 注册Provider
    - `updateStatus(providerId, status)` - 更新Provider状态
    - `getAvailableProviders(model)` - 获取可用Providers
    - `heartbeat(providerId)` - 心跳检测

  **Must NOT do**:
  - 不注册重复的Provider
  - 不返回不可用的Provider
  - 不存储明文API密钥

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Provider管理是核心功能，需要完整实现
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 15-17, 19-20)
  - **Blocks**: Task 19 (Scheduler需要ProviderRegistry)
  - **Blocked By**: Tasks 8, 9 (需要Provider模型和logger)

  **References**:
  - `.prompts/02-core-services.md:34-51` - ProviderRegistry接口定义
  - `.prompts/02-core-services.md:39` - ProviderInfo类型隐含

  **Acceptance Criteria**:
  - [ ] 测试文件已创建
  - [ ] `npm test ProviderRegistry` 通过
  - [ ] Provider注册工作正常
  - [ ] 状态更新工作正常
  - [ ] 心跳检测工作正常
  - [ ] 测试覆盖率 ≥80%

  **QA Scenarios**:
  ```
  Scenario: ProviderRegistry单元测试
    Tool: Bash
    Preconditions: PostgreSQL已启动
    Steps:
      1. test -f test/unit/services/ProviderRegistry.test.ts && echo "Test file exists"
      2. npm test -- ProviderRegistry.test.ts 2>&1 | grep -q "PASS" && echo "Tests passed"
      3. npm test -- --coverage ProviderRegistry.test.ts 2>&1 | grep -E "All files.*[8-9][0-9]|100" && echo "Coverage ≥80%"
    Expected Result: 所有测试通过，覆盖率达标
    Evidence: .sisyphus/evidence/task-18-providerregistry-tests.txt
  
  Scenario: ProviderRegistry功能验证
    Tool: Bash
    Preconditions: 服务已实现，PostgreSQL已启动
    Steps:
      1. npx ts-node -e "import ProviderRegistry from './src/services/ProviderRegistry'; const p = new ProviderRegistry(); p.register({name:'test',endpoint:'https://api.test.com',models:['gpt-4']}).then(() => console.log('Provider registered'))"
      2. npx ts-node -e "import ProviderRegistry from './src/services/ProviderRegistry'; const p = new ProviderRegistry(); p.getAvailableProviders('gpt-4').then(ps => console.log('Available:', ps.length))"
    Expected Result: ProviderRegistry基本操作工作正常
    Evidence: .sisyphus/evidence/task-18-providerregistry-functional.txt
  ```

  **Commit**: YES
  - Message: `feat(services): implement ProviderRegistry with tests`
  - Files: `test/unit/services/ProviderRegistry.test.ts, src/services/ProviderRegistry.ts`

- [x] 19. Scheduler测试 + 实现

  **What to do**:
  - 先写测试（TDD）：
    - `test/unit/services/Scheduler.test.ts`
    - 测试Provider选择
    - 测试请求路由
    - 测试失败重试
  - 实现 `src/services/Scheduler.ts`:
    - `selectProvider(request)` - 选择最优Provider
    - `routeRequest(request)` - 路由请求到Provider
    - `retryRequest(request, attempts)` - 处理失败重试

  **Must NOT do**:
  - 不选择不可用的Provider
  - 不无限重试（最多3次）
  - 不阻塞事件循环（使用异步操作）

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Scheduler是最复杂的服务，需要深度思考选择策略和重试逻辑
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 15-18, 20)
  - **Blocks**: Task 24 (Chat路由需要Scheduler)
  - **Blocked By**: Tasks 6, 8, 9, 18 (需要类型、Provider模型、logger、ProviderRegistry)

  **References**:
  - `.prompts/02-core-services.md:11-32` - Scheduler接口定义
  - `.prompts/02-core-services.md:23-31` - 选择策略接口定义

  **Acceptance Criteria**:
  - [ ] 测试文件已创建
  - [ ] `npm test Scheduler` 通过
  - [ ] Provider选择工作正常
  - [ ] 请求路由工作正常
  - [ ] 失败重试工作正常
  - [ ] 支持多种选择策略
  - [ ] 测试覆盖率 ≥80%

  **QA Scenarios**:
  ```
  Scenario: Scheduler单元测试
    Tool: Bash
    Preconditions: ProviderRegistry已实现
    Steps:
      1. test -f test/unit/services/Scheduler.test.ts && echo "Test file exists"
      2. npm test -- Scheduler.test.ts 2>&1 | grep -q "PASS" && echo "Tests passed"
      3. npm test -- --coverage Scheduler.test.ts 2>&1 | grep -E "All files.*[8-9][0-9]|100" && echo "Coverage ≥80%"
    Expected Result: 所有测试通过，覆盖率达标
    Evidence: .sisyphus/evidence/task-19-scheduler-tests.txt
  
  Scenario: Scheduler功能验证
    Tool: Bash
    Preconditions: 服务已实现，有可用Provider
    Steps:
      1. npx ts-node -e "import Scheduler from './src/services/Scheduler'; const s = new Scheduler(); s.selectProvider({model:'gpt-4'}).then(p => console.log('Selected:', p.name))"
      2. npx ts-node -e "import Scheduler from './src/services/Scheduler'; const s = new Scheduler(); s.routeRequest({model:'gpt-4',prompt:'test'}).then(r => console.log('Response status:', r.status))"
    Expected Result: Scheduler基本操作工作正常
    Evidence: .sisyphus/evidence/task-19-scheduler-functional.txt
  ```

  **Commit**: YES
  - Message: `feat(services): implement Scheduler with tests`
  - Files: `test/unit/services/Scheduler.test.ts, src/services/Scheduler.ts`

- [x] 20. Provider选择策略（3种）

  **What to do**:
  - 先写测试（TDD）：
    - `test/unit/services/strategies/SelectionStrategy.test.ts`
    - 测试每种策略的评分逻辑
  - 实现三种选择策略：
    - `ResponseTimeStrategy` - 基于响应时间评分
    - `SuccessRateStrategy` - 基于成功率评分
    - `PriceStrategy` - 基于价格评分

  **Must NOT do**:
  - 不使用固定的评分权重（可配置）
  - 不忽略历史数据

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 策略实现需要考虑多种因素
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 15-19)
  - **Blocks**: None
  - **Blocked By**: Tasks 6, 9 (需要类型和logger)

  **References**:
  - `.prompts/02-core-services.md:24-31` - 三种策略接口定义

  **Acceptance Criteria**:
  - [ ] 测试文件已创建
  - [ ] `npm test SelectionStrategy` 通过
  - [ ] ResponseTimeStrategy已实现
  - [ ] SuccessRateStrategy已实现
  - [ ] PriceStrategy已实现
  - [ ] 测试覆盖率 ≥80%

  **QA Scenarios**:
  ```
  Scenario: 选择策略单元测试
    Tool: Bash
    Preconditions: 无
    Steps:
      1. test -f test/unit/services/strategies/SelectionStrategy.test.ts && echo "Test file exists"
      2. npm test -- SelectionStrategy.test.ts 2>&1 | grep -q "PASS" && echo "Tests passed"
      3. npm test -- --coverage SelectionStrategy.test.ts 2>&1 | grep -E "All files.*[8-9][0-9]|100" && echo "Coverage ≥80%"
    Expected Result: 所有测试通过，覆盖率达标
    Evidence: .sisyphus/evidence/task-20-strategies-tests.txt
  
  Scenario: 策略功能验证
    Tool: Bash
    Preconditions: 策略已实现
    Steps:
      1. npx ts-node -e "import ResponseTimeStrategy from './src/services/strategies/ResponseTimeStrategy'; const s = new ResponseTimeStrategy(); console.log('Score:', s.score({avgResponseTime:100}))"
      2. npx ts-node -e "import SuccessRateStrategy from './src/services/strategies/SuccessRateStrategy'; const s = new SuccessRateStrategy(); console.log('Score:', s.score({successRate:0.95}))"
      3. npx ts-node -e "import PriceStrategy from './src/services/strategies/PriceStrategy'; const s = new PriceStrategy(); console.log('Score:', s.score({pricePerToken:0.01}))"
    Expected Result: 所有策略基本操作工作正常
    Evidence: .sisyphus/evidence/task-20-strategies-functional.txt
  ```

  **Commit**: YES
  - Message: `feat(services): implement Provider selection strategies`
  - Files: `test/unit/services/strategies/SelectionStrategy.test.ts, src/services/strategies/ResponseTimeStrategy.ts, src/services/strategies/SuccessRateStrategy.ts, src/services/strategies/PriceStrategy.ts`

### Wave 4: API路由（Wave 3后）

- [x] 21. Health路由

  **What to do**:
  - 创建 `src/routes/v1/health.ts`
  - 实现 `GET /v1/health` 端点
  - 返回服务状态、数据库连接状态、Redis连接状态
  - 使用CacheService缓存响应（5秒TTL）

  **Must NOT do**:
  - 不暴露敏感信息
  - 不执行耗时操作

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的健康检查端点
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 22-26)
  - **Blocks**: Task 25 (路由注册)
  - **Blocked By**: Tasks 7, 14, 15 (需要app、logging、CacheService)

  **References**:
  - `.prompts/01-init-repository.md:43` - routes/v1/health.ts位置

  **Acceptance Criteria**:
  - [ ] health.ts已创建
  - [ ] `GET /v1/health` 返回200
  - [ ] 响应包含status字段
  - [ ] 响应被缓存

  **QA Scenarios**:
  ```
  Scenario: Health路由验证
    Tool: Bash
    Preconditions: server已启动
    Steps:
      1. test -f src/routes/v1/health.ts && echo "Health route exists"
      2. curl -s http://localhost:3000/v1/health | jq -r '.status' | grep -q "ok" && echo "Health check returns ok"
      3. curl -s http://localhost:3000/v1/health | jq -r '.database' | grep -q "connected" && echo "Database status included"
    Expected Result: Health路由工作正常
    Evidence: .sisyphus/evidence/task-21-health-route.txt
  ```

  **Commit**: YES
  - Message: `feat(routes): add health check endpoint`
  - Files: `src/routes/v1/health.ts`

- [x] 22. Models路由

  **What to do**:
  - 创建 `src/routes/v1/models.ts`
  - 实现 `GET /v1/models` 端点
  - 返回可用模型列表
  - 从ProviderRegistry获取数据
  - 使用CacheService缓存响应（1分钟TTL）

  **Must NOT do**:
  - 不返回不可用的模型
  - 不暴露Provider敏感信息

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的模型列表端点
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 21, 23-26)
  - **Blocks**: Task 25 (路由注册)
  - **Blocked By**: Tasks 7, 15, 18 (需要app、CacheService、ProviderRegistry)

  **References**:
  - `.prompts/01-init-repository.md:42` - routes/v1/models.ts位置

  **Acceptance Criteria**:
  - [ ] models.ts已创建
  - [ ] `GET /v1/models` 返回200
  - [ ] 响应包含模型列表
  - [ ] 响应被缓存

  **QA Scenarios**:
  ```
  Scenario: Models路由验证
    Tool: Bash
    Preconditions: server已启动，有Provider注册
    Steps:
      1. test -f src/routes/v1/models.ts && echo "Models route exists"
      2. curl -s http://localhost:3000/v1/models | jq -r '.data[0].id' | grep -q "gpt" && echo "Models list returned"
      3. curl -s http://localhost:3000/v1/models | jq '.data | length' | grep -q "[1-9]" && echo "At least one model available"
    Expected Result: Models路由工作正常
    Evidence: .sisyphus/evidence/task-22-models-route.txt
  ```

  **Commit**: YES
  - Message: `feat(routes): add models list endpoint`
  - Files: `src/routes/v1/models.ts`

- [x] 23. User路由

  **What to do**:
  - 创建 `src/routes/v1/user.ts`
  - 实现 `GET /v1/user` 端点（需要认证）
  - 返回用户信息、配额、用量统计
  - 使用Auth中间件验证JWT

  **Must NOT do**:
  - 不返回其他用户的信息
  - 不暴露敏感信息

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的用户信息端点
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 21-22, 24-26)
  - **Blocks**: Task 25 (路由注册)
  - **Blocked By**: Tasks 7, 11, 16, 17 (需要app、Auth中间件、AuthService、UsageTracker)

  **References**:
  - `.prompts/01-init-repository.md:43` - routes/v1/user.ts位置

  **Acceptance Criteria**:
  - [ ] user.ts已创建
  - [ ] `GET /v1/user` 需要认证
  - [ ] 返回用户信息
  - [ ] 返回配额信息

  **QA Scenarios**:
  ```
  Scenario: User路由认证验证
    Tool: Bash
    Preconditions: server已启动
    Steps:
      1. test -f src/routes/v1/user.ts && echo "User route exists"
      2. curl -s http://localhost:3000/v1/user | jq -r '.error.code' | grep -q "AUTH_MISSING_TOKEN" && echo "Auth required"
      3. curl -s -H "Authorization: Bearer invalid" http://localhost:3000/v1/user | jq -r '.error.code' | grep -q "AUTH_INVALID_TOKEN" && echo "Invalid token rejected"
    Expected Result: User路由认证工作正常
    Evidence: .sisyphus/evidence/task-23-user-auth.txt
  
  Scenario: User路由功能验证
    Tool: Bash
    Preconditions: server已启动，有有效token
    Steps:
      1. TOKEN=$(npx ts-node -e "import jwt from 'jsonwebtoken'; console.log(jwt.sign({userId:'test-user'}, process.env.JWT_SECRET || 'test-secret'));")
      2. curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/v1/user | jq -r '.id' | grep -q "test-user" && echo "User info returned"
      3. curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/v1/user | jq -r '.quota' && echo "Quota info returned"
    Expected Result: User路由功能工作正常
    Evidence: .sisyphus/evidence/task-23-user-functional.txt
  ```

  **Commit**: YES
  - Message: `feat(routes): add user info endpoint with auth`
  - Files: `src/routes/v1/user.ts`

- [x] 24. Chat路由（核心）

  **What to do**:
  - 创建 `src/routes/v1/chat.ts`
  - 实现 `POST /v1/chat/completions` 端点（需要认证）
  - 兼容OpenAI API格式
  - 使用Scheduler路由请求到最优Provider
  - 使用UsageTracker记录用量
  - 使用RateLimit中间件限流
  - 支持流式响应（SSE）

  **Must NOT do**:
  - 不路由到不可用的Provider
  - 不跳过用量记录
  - 不跳过限流检查

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Chat是核心功能，涉及多个服务的协调
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 21-23, 25-26)
  - **Blocks**: Task 25 (路由注册)
  - **Blocked By**: Tasks 7, 11, 12, 15, 17, 19 (需要app、Auth、RateLimit、CacheService、UsageTracker、Scheduler)

  **References**:
  - `.prompts/01-init-repository.md:41` - routes/v1/chat.ts位置
  - `.prompts/system-prompt.md:19-20` - 请求路由和调度要求

  **Acceptance Criteria**:
  - [ ] chat.ts已创建
  - [ ] `POST /v1/chat/completions` 需要认证
  - [ ] 请求被正确路由
  - [ ] 用量被正确记录
  - [ ] 限流生效
  - [ ] 支持流式响应

  **QA Scenarios**:
  ```
  Scenario: Chat路由认证验证
    Tool: Bash
    Preconditions: server已启动
    Steps:
      1. test -f src/routes/v1/chat.ts && echo "Chat route exists"
      2. curl -s -X POST http://localhost:3000/v1/chat/completions | jq -r '.error.code' | grep -q "AUTH_MISSING_TOKEN" && echo "Auth required"
    Expected Result: Chat路由认证工作正常
    Evidence: .sisyphus/evidence/task-24-chat-auth.txt
  
  Scenario: Chat路由功能验证
    Tool: Bash
    Preconditions: server已启动，有有效token和可用Provider
    Steps:
      1. TOKEN=$(npx ts-node -e "import jwt from 'jsonwebtoken'; console.log(jwt.sign({userId:'test-user'}, process.env.JWT_SECRET || 'test-secret'));")
      2. curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}]}' http://localhost:3000/v1/chat/completions | jq -r '.choices[0].message.content' && echo "Chat completion returned"
    Expected Result: Chat路由功能工作正常
    Evidence: .sisyphus/evidence/task-24-chat-functional.txt
  
  Scenario: Chat路由流式响应验证
    Tool: Bash
    Preconditions: server已启动，有有效token和可用Provider
    Steps:
      1. TOKEN=$(npx ts-node -e "import jwt from 'jsonwebtoken'; console.log(jwt.sign({userId:'test-user'}, process.env.JWT_SECRET || 'test-secret'));")
      2. curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}],"stream":true}' http://localhost:3000/v1/chat/completions | head -n 5 | grep -q "data:" && echo "Stream response started"
    Expected Result: 流式响应工作正常
    Evidence: .sisyphus/evidence/task-24-chat-stream.txt
  ```

  **Commit**: YES
  - Message: `feat(routes): add chat completions endpoint with auth and rate limiting`
  - Files: `src/routes/v1/chat.ts`

- [x] 25. 路由注册和版本管理

  **What to do**:
  - 创建 `src/routes/index.ts`
  - 注册所有v1路由到Fastify实例
  - 配置路由前缀 `/v1`
  - 导出路由注册函数供app.ts使用

  **Must NOT do**:
  - 不硬编码路由配置
  - 不跳过路由验证

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的路由注册
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 21-24, 26)
  - **Blocks**: Task 26 (集成测试需要完整路由)
  - **Blocked By**: Tasks 21-24 (需要所有路由文件)

  **References**:
  - `.prompts/01-init-repository.md:45-46` - routes/index.ts位置

  **Acceptance Criteria**:
  - [ ] routes/index.ts已创建
  - [ ] 所有v1路由已注册
  - [ ] 路由前缀正确

  **QA Scenarios**:
  ```
  Scenario: 路由注册验证
    Tool: Bash
    Preconditions: server已启动
    Steps:
      1. test -f src/routes/index.ts && echo "Routes index exists"
      2. curl -s http://localhost:3000/v1/health | jq -r '.status' | grep -q "ok" && echo "Health route registered"
      3. curl -s http://localhost:3000/v1/models | jq '.data' && echo "Models route registered"
    Expected Result: 所有路由正确注册
    Evidence: .sisyphus/evidence/task-25-routes-registration.txt
  ```

  **Commit**: YES
  - Message: `feat(routes): register all v1 routes`
  - Files: `src/routes/index.ts`

- [x] 26. API集成测试

  **What to do**:
  - 创建 `test/integration/api.test.ts`
  - 测试完整的请求流程：
    - Health检查
    - Models列表
    - User信息（需要认证）
    - Chat完成（需要认证和限流）
  - 测试错误处理
  - 测试限流

  **Must NOT do**:
  - 不依赖外部服务（使用mock）
  - 不跳过错误场景测试

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 集成测试需要覆盖完整的请求流程
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 21-25)
  - **Blocks**: Wave FINAL (最终验证需要集成测试通过)
  - **Blocked By**: Tasks 21-25 (需要所有路由)

  **References**:
  - `.prompts/01-init-repository.md:69-71` - test目录结构

  **Acceptance Criteria**:
  - [ ] api.test.ts已创建
  - [ ] `npm test api.test.ts` 通过
  - [ ] 覆盖所有主要场景
  - [ ] 包含错误场景

  **QA Scenarios**:
  ```
  Scenario: 集成测试执行
    Tool: Bash
    Preconditions: 所有服务已实现
    Steps:
      1. test -f test/integration/api.test.ts && echo "Integration test exists"
      2. npm test -- api.test.ts 2>&1 | grep -q "PASS" && echo "Integration tests passed"
      3. npm test -- --coverage api.test.ts 2>&1 | grep -E "All files.*[8-9][0-9]|100" && echo "Coverage ≥80%"
    Expected Result: 所有集成测试通过
    Evidence: .sisyphus/evidence/task-26-integration-tests.txt
  ```

  **Commit**: YES
  - Message: `test: add API integration tests`
  - Files: `test/integration/api.test.ts`

### Wave 5: 部署配置（Wave 4后）

- [x] 27. Kubernetes Deployment

  **What to do**:
  - 创建 `k8s/deployment.yaml`
  - 配置Deployment：
    - 3个副本
    - 资源限制（CPU/Memory）
    - 健康检查（liveness/readiness probes）
    - 环境变量引用ConfigMap

  **Must NOT do**:
  - 不硬编码敏感信息
  - 不配置过高的资源限制

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准K8s Deployment配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 28-32)
  - **Blocks**: Wave FINAL
  - **Blocked By**: Task 7 (需要app实现)

  **References**:
  - `.prompts/01-init-repository.md:73` - k8s/deployment.yaml位置

  **Acceptance Criteria**:
  - [ ] deployment.yaml已创建
  - [ ] `kubectl apply --dry-run=client -f k8s/deployment.yaml` 通过
  - [ ] 包含健康检查配置

  **QA Scenarios**:
  ```
  Scenario: K8s Deployment验证
    Tool: Bash
    Preconditions: kubectl已安装
    Steps:
      1. test -f k8s/deployment.yaml && echo "Deployment file exists"
      2. kubectl apply --dry-run=client -f k8s/deployment.yaml && echo "Deployment YAML is valid"
      3. grep -q "livenessProbe" k8s/deployment.yaml && echo "Health check configured"
    Expected Result: K8s Deployment配置正确
    Evidence: .sisyphus/evidence/task-27-k8s-deployment.txt
  ```

  **Commit**: YES
  - Message: `feat(k8s): add Kubernetes Deployment configuration`
  - Files: `k8s/deployment.yaml`

- [x] 28. Kubernetes Service

  **What to do**:
  - 创建 `k8s/service.yaml`
  - 配置Service：
    - 类型：ClusterIP
    - 端口：3000
    - selector匹配Deployment

  **Must NOT do**:
  - 不使用NodePort或LoadBalancer（除非生产环境）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准K8s Service配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 27, 29-32)
  - **Blocks**: Wave FINAL
  - **Blocked By**: Task 27 (需要Deployment)

  **References**:
  - `.prompts/01-init-repository.md:74` - k8s/service.yaml位置

  **Acceptance Criteria**:
  - [ ] service.yaml已创建
  - [ ] `kubectl apply --dry-run=client -f k8s/service.yaml` 通过

  **QA Scenarios**:
  ```
  Scenario: K8s Service验证
    Tool: Bash
    Preconditions: kubectl已安装
    Steps:
      1. test -f k8s/service.yaml && echo "Service file exists"
      2. kubectl apply --dry-run=client -f k8s/service.yaml && echo "Service YAML is valid"
    Expected Result: K8s Service配置正确
    Evidence: .sisyphus/evidence/task-28-k8s-service.txt
  ```

  **Commit**: YES
  - Message: `feat(k8s): add Kubernetes Service configuration`
  - Files: `k8s/service.yaml`

- [x] 29. Kubernetes Ingress

  **What to do**:
  - 创建 `k8s/ingress.yaml`
  - 配置Ingress：
    - 域名配置（占位符）
    - 路径：/
    - TLS配置（占位符）

  **Must NOT do**:
  - 不硬编码生产域名
  - 不跳过TLS配置

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准K8s Ingress配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 27-28, 30-32)
  - **Blocks**: Wave FINAL
  - **Blocked By**: Task 28 (需要Service)

  **References**:
  - `.prompts/01-init-repository.md:75` - k8s/ingress.yaml位置

  **Acceptance Criteria**:
  - [ ] ingress.yaml已创建
  - [ ] `kubectl apply --dry-run=client -f k8s/ingress.yaml` 通过

  **QA Scenarios**:
  ```
  Scenario: K8s Ingress验证
    Tool: Bash
    Preconditions: kubectl已安装
    Steps:
      1. test -f k8s/ingress.yaml && echo "Ingress file exists"
      2. kubectl apply --dry-run=client -f k8s/ingress.yaml && echo "Ingress YAML is valid"
    Expected Result: K8s Ingress配置正确
    Evidence: .sisyphus/evidence/task-29-k8s-ingress.txt
  ```

  **Commit**: YES
  - Message: `feat(k8s): add Kubernetes Ingress configuration`
  - Files: `k8s/ingress.yaml`

- [x] 30. Kubernetes ConfigMap

  **What to do**:
  - 创建 `k8s/configmap.yaml`
  - 配置ConfigMap：
    - 环境变量（非敏感）
    - 配置文件（如果需要）

  **Must NOT do**:
  - 不存储敏感信息（使用Secret）
  - 不硬编码特定环境值

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准K8s ConfigMap配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 27-29, 31-32)
  - **Blocks**: Task 27 (Deployment需要ConfigMap)
  - **Blocked By**: None

  **References**:
  - `.prompts/01-init-repository.md:76` - k8s/configmap.yaml位置

  **Acceptance Criteria**:
  - [ ] configmap.yaml已创建
  - [ ] `kubectl apply --dry-run=client -f k8s/configmap.yaml` 通过

  **QA Scenarios**:
  ```
  Scenario: K8s ConfigMap验证
    Tool: Bash
    Preconditions: kubectl已安装
    Steps:
      1. test -f k8s/configmap.yaml && echo "ConfigMap file exists"
      2. kubectl apply --dry-run=client -f k8s/configmap.yaml && echo "ConfigMap YAML is valid"
    Expected Result: K8s ConfigMap配置正确
    Evidence: .sisyphus/evidence/task-30-k8s-configmap.txt
  ```

  **Commit**: YES
  - Message: `feat(k8s): add Kubernetes ConfigMap configuration`
  - Files: `k8s/configmap.yaml`

- [x] 31. GitHub Actions CI

  **What to do**:
  - 创建 `.github/workflows/ci.yml`
  - 配置CI流水线：
    - 触发：push到main，pull request
    - 步骤：安装依赖、lint、测试、构建
    - 缓存node_modules

  **Must NOT do**:
  - 不运行耗时过长的任务
  - 不跳过测试

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准GitHub Actions配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 27-30, 32)
  - **Blocks**: Wave FINAL
  - **Blocked By**: Task 1 (需要package.json)

  **References**:
  - `.prompts/01-init-repository.md:79-80` - .github/workflows位置

  **Acceptance Criteria**:
  - [ ] ci.yml已创建
  - [ ] YAML语法正确
  - [ ] 包含所有必要步骤

  **QA Scenarios**:
  ```
  Scenario: GitHub Actions CI验证
    Tool: Bash
    Preconditions: 无
    Steps:
      1. test -f .github/workflows/ci.yml && echo "CI workflow exists"
      2. python3 -m yaml .github/workflows/ci.yml > /dev/null 2>&1 && echo "YAML is valid"
      3. grep -q "npm test" .github/workflows/ci.yml && echo "Test step included"
    Expected Result: GitHub Actions CI配置正确
    Evidence: .sisyphus/evidence/task-31-github-ci.txt
  ```

  **Commit**: YES
  - Message: `feat(ci): add GitHub Actions CI workflow`
  - Files: `.github/workflows/ci.yml`

- [x] 32. GitHub Actions Deploy

  **What to do**:
  - 创建 `.github/workflows/deploy.yml`
  - 配置CD流水线：
    - 触发：release创建
    - 步骤：构建镜像、推送镜像、更新K8s
    - 环境变量：Docker Hub凭证、K8s配置

  **Must NOT do**:
  - 不硬编码敏感信息
  - 不自动部署到生产（需要手动确认）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准GitHub Actions配置
  - **Skills**: [] 
    - 无特殊技能需求

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 27-31)
  - **Blocks**: Wave FINAL
  - **Blocked By**: Tasks 27-30 (需要K8s配置)

  **References**:
  - `.prompts/01-init-repository.md:81` - .github/workflows/deploy.yml位置

  **Acceptance Criteria**:
  - [ ] deploy.yml已创建
  - [ ] YAML语法正确
  - [ ] 包含所有必要步骤

  **QA Scenarios**:
  ```
  Scenario: GitHub Actions Deploy验证
    Tool: Bash
    Preconditions: 无
    Steps:
      1. test -f .github/workflows/deploy.yml && echo "Deploy workflow exists"
      2. python3 -m yaml .github/workflows/deploy.yml > /dev/null 2>&1 && echo "YAML is valid"
      3. grep -q "docker build" .github/workflows/deploy.yml && echo "Docker build step included"
    Expected Result: GitHub Actions Deploy配置正确
    Evidence: .sisyphus/evidence/task-32-github-deploy.txt
  ```

  **Commit**: YES
  - Message: `feat(ci): add GitHub Actions Deploy workflow`
  - Files: `.github/workflows/deploy.yml`

---

## Final Verification Wave (MANDATORY — 所有实现任务之后)

> 4个审查agent并行运行。全部必须APPROVE。拒绝 → 修复 → 重新运行。

- [x] F1. **计划合规性审计** — `oracle`
  读取计划全文。对于每个"Must Have"：验证实现存在（读文件、curl端点、运行命令）。对于每个"Must NOT Have"：搜索代码库中的禁止模式 — 如果发现则拒绝并提供file:line。检查.sisyphus/evidence/中的证据文件是否存在。比较交付物与计划。
  输出：`Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **代码质量审查** — `unspecified-high`
  运行 `tsc --noEmit` + linter + `bun test`。审查所有变更文件的：`as any`/`@ts-ignore`、空catch、console.log in prod、注释掉的代码、未使用的imports。检查AI slop：过多注释、过度抽象、泛型名称（data/result/item/temp）。
  输出：`Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **真实手动QA** — `unspecified-high` (+ `playwright` skill if UI)
  从干净状态开始。执行每个任务的每个QA场景 — 遵循确切步骤，捕获证据。测试跨任务集成（功能协同工作，而非隔离）。测试边界情况：空状态、无效输入、快速操作。保存到 `.sisyphus/evidence/final-qa/`。
  输出：`Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **范围保真度检查** — `deep`
  对于每个任务：读取"What to do"，读取实际diff（git log/diff）。验证1:1 — 规格中的所有内容都已构建（无遗漏），规格之外的内容都未构建（无蔓延）。检查"Must NOT do"合规性。检测跨任务污染：Task N触及Task M的文件。标记未说明的变更。
  输出：`Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

采用原子提交策略，每个逻辑单元一个commit：

- **Wave 1完成后**: `feat: init project structure and configuration`
- **Wave 2完成后**: `feat: add models, utils and middleware`
- **Wave 3每个服务**: `feat(scheduler): implement request scheduling service`
- **Wave 4完成后**: `feat: implement API routes with auth and rate limiting`
- **Wave 5完成后**: `feat: add deployment configurations and CI/CD`

---

## Success Criteria

### 验证命令
```bash
# 1. 编译检查
npm run build
# Expected: 无错误

# 2. 测试检查
npm test
# Expected: 全部通过，覆盖率 ≥80%

# 3. Docker启动检查
docker compose up -d
curl -sS http://localhost:3000/v1/health | jq -r '.status'
# Expected: "ok"

# 4. 认证冒烟测试
curl -sS -H "Authorization: Bearer invalid_token" http://localhost:3000/v1/user | jq -r '.error.code'
# Expected: "AUTH_INVALID_TOKEN"

# 5. Provider注册冒烟测试（需要先设置admin token）
# curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
#   -d '{"name":"test-provider","endpoint":"https://api.test.com","models":["gpt-4"]}' \
#   http://localhost:3000/v1/admin/providers
# Expected: 200 OK with provider ID
```

### 最终检查清单
- [ ] 所有"Must Have"存在
- [ ] 所有"Must NOT Have"不存在
- [ ] 所有测试通过
- [ ] Docker服务健康
- [ ] API端点可访问
- [ ] 认证流程正常
- [ ] 测试覆盖率 ≥80%
- [ ] 无TypeScript编译错误
- [ ] 无ESLint警告
