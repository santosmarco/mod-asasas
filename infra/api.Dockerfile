# Use multi-platform base image
FROM --platform=linux/amd64 node:20-alpine AS base

# Create a builder stage with all build dependencies
FROM base AS builder
WORKDIR /app

# Install build dependencies in a single layer
RUN apk add --no-cache gcompat && \
  apk add --no-cache npm && \
  /usr/local/bin/npm install -g pnpm

# Set build arguments and environment variables
ARG API_KEY_SECRET
ARG SLACK_TOKEN

ENV API_KEY_SECRET=$API_KEY_SECRET
ENV SLACK_TOKEN=$SLACK_TOKEN

# Copy only package files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
RUN /usr/local/bin/pnpm install --frozen-lockfile --ignore-scripts

# Copy source files and build
COPY . .
RUN /usr/local/bin/pnpm run db:generate && \
  /usr/local/bin/pnpm run build && \
  /usr/local/bin/pnpm prune --prod

# Create a minimal production image
FROM base AS runner
WORKDIR /app

# Create non-root user in a single layer
RUN addgroup -S -g 1001 nodejs && \
  adduser -S -u 1001 -G nodejs hono

# Copy only necessary files from builder
COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=builder --chown=hono:nodejs /app/package.json ./package.json

# Use non-root user
USER hono

# Configure container
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE ${PORT}

ENTRYPOINT []
CMD ["node", "dist/index.js"]
