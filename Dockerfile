FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3000/v1/health || exit 1
CMD ["node", "dist/index.js"]
