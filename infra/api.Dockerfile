# Use multi-platform base image
FROM --platform=linux/amd64 node:20-alpine AS base

# Create a builder stage with all build dependencies
FROM base AS builder
WORKDIR /app

# Install build dependencies in a single layer
RUN apk add --no-cache gcompat npm && \
    npm install -g pnpm

# Set build arguments and environment variables
ARG DATABASE_URL
ARG API_KEY_SECRET
ARG SLACK_TOKEN

ENV DATABASE_URL=$DATABASE_URL
ENV API_KEY_SECRET=$API_KEY_SECRET
ENV SLACK_TOKEN=$SLACK_TOKEN

# Copy only package files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source files and build
COPY . .
RUN pnpm run build

# Create a minimal production image
FROM base AS runner
WORKDIR /app

# Create non-root user in a single layer
RUN addgroup -S nodejs && \
    adduser -S hono -G nodejs

# Copy only necessary files from builder
COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=builder --chown=hono:nodejs /app/package.json ./package.json

# Use non-root user
USER hono

# Configure container
ENV PORT=3000
ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
