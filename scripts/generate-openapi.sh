#!/bin/bash

# Check if docs folder exists, create if it doesn't
if [ ! -d "docs" ]; then
  mkdir docs
fi

# Build the project
pnpm run build

# Start the server in background
node dist/index.js &
SERVER_PID=$!

# Wait for server to be ready
sleep 5

# Fetch OpenAPI spec
curl -s http://localhost:3000/openapi.json > docs/openapi.json

# Kill the server process
kill $SERVER_PID

echo ""
echo "✅ OpenAPI spec generated at docs/openapi.json"
