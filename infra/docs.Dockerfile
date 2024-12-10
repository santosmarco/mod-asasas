# Use multi-platform base image
FROM --platform=linux/amd64 node:20-alpine AS base

# Create a builder stage with all build dependencies
FROM base AS builder
WORKDIR /app

# Install build dependencies in a single layer
RUN apk add --no-cache gcompat && \
  apk add --no-cache npm && \
  /usr/local/bin/npm install -g pnpm

# Copy only package files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
RUN /usr/local/bin/pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Create a minimal production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup -S -g 1001 nodejs && \
  adduser -S -u 1001 -G nodejs mintlify

# Copy necessary files from builder
COPY --from=builder --chown=mintlify:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mintlify:nodejs /app/package.json ./package.json
COPY --from=builder --chown=mintlify:nodejs /app/docs ./docs

# Use non-root user
USER mintlify

# Configure container
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE ${PORT}

ENTRYPOINT []
CMD ["/usr/local/bin/pnpm", "run", "docs:start"]
