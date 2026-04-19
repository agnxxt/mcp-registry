# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
# Copy source files - handles both src/ directory and root-level .ts files
COPY src/ ./src/ 2>/dev/null || true
COPY *.ts ./ 2>/dev/null || true

RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="tuwunel-mcp-server"
LABEL org.opencontainers.image.description="MCP server"
LABEL org.opencontainers.image.source="https://github.com/agentnxt/mcpservers"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Non-root user for security
RUN addgroup -S mcp && adduser -S mcp -G mcp
USER mcp

ENTRYPOINT ["node", "dist/index.js"]