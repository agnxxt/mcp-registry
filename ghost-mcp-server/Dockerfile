# syntax=docker/dockerfile:1

# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
      npm ci --ignore-scripts; \
    else \
      npm install --ignore-scripts; \
    fi

COPY tsconfig.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev


# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="ghost-mcp-server"
LABEL org.opencontainers.image.description="Ghost CMS MCP server exposed over HTTP/SSE for Coolify"
LABEL org.opencontainers.image.source="https://github.com/agentnxt/mcp-registry"
LABEL org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production
ENV PORT=8000
ENV BASE_URL=http://localhost:8000

WORKDIR /app

RUN apk add --no-cache curl \
  && addgroup -S mcp \
  && adduser -S mcp -G mcp \
  && npm install -g supergateway

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/healthz" || exit 1

USER mcp

CMD ["sh", "-c", "supergateway --stdio 'node /app/dist/index.js' --port ${PORT} --baseUrl ${BASE_URL} --ssePath /sse --messagePath /message --healthEndpoint /healthz"]
