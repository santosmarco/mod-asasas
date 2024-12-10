#!/bin/bash

# Exit on any error
set -e

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is required"
  exit 1
fi

# Generate schema
echo "Generating Drizzle schema..."
pnpm run db:generate

echo "Schema generation completed successfully!"
