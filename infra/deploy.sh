#!/bin/bash

# Usage: ./deploy.sh <environment>
# Example: ./deploy.sh production

set -e # Exit on any error

if [ -z "$1" ]; then
  echo "Error: Environment argument required (production or sandbox)"
  echo "Usage: ./deploy.sh <environment>"
  exit 1
fi

ENV=$1
PROJECT="sd2-mod-$ENV"

# Validate environment
if [ "$ENV" != "production" ] && [ "$ENV" != "sandbox" ]; then
  echo "Error: Environment must be either 'production' or 'sandbox'"
  exit 1
fi

echo "Deploying to $ENV environment..."

# Setup IAM permissions if needed
echo "Setting up IAM permissions..."
./infra/setup-iam.sh $ENV || {
  echo "Error: IAM setup failed"
  exit 1
}

# Load environment variables for schema generation
if [ -f ".env.$ENV" ]; then
  echo "Loading environment variables from .env.$ENV..."
  source .env.$ENV
else
  echo "Warning: .env.$ENV file not found"
fi

# Generate schema if DATABASE_URL is available
if [ ! -z "$DATABASE_URL" ]; then
  echo "Generating database schema..."
  pnpm run schema:generate || {
    echo "Error: Schema generation failed"
    exit 1
  }
else
  echo "Warning: DATABASE_URL not set, skipping schema generation"
  echo "Make sure to run schema:generate locally before deploying"
fi

# Authenticate with GCP (if needed)
echo "Authenticating with GCP..."
gcloud auth configure-docker || {
  echo "Error: Docker authentication failed"
  exit 1
}

# Build and push API image
echo "Building and pushing API image..."
docker buildx build --platform linux/amd64 -t gcr.io/$PROJECT/api:latest -f infra/api.Dockerfile . || {
  echo "Error: API image build failed"
  exit 1
}
docker push gcr.io/$PROJECT/api:latest || {
  echo "Error: API image push failed"
  exit 1
}

# Build and push Docs image
echo "Building and pushing Docs image..."
docker buildx build --platform linux/amd64 -t gcr.io/$PROJECT/docs:latest -f infra/docs.Dockerfile . || {
  echo "Error: Docs image build failed"
  exit 1
}
docker push gcr.io/$PROJECT/docs:latest || {
  echo "Error: Docs image push failed"
  exit 1
}

# Deploy to Cloud Run
echo "Deploying services to Cloud Run..."

# Get project number
PROJECT_NUMBER=$(gcloud projects describe $PROJECT --format='value(projectNumber)') || {
  echo "Error: Failed to get project number"
  exit 1
}

# Create temporary directory for modified YAML files
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# Deploy API service
if [ -f "infra/cloudrun-$ENV-api.yaml" ]; then
  echo "Deploying API service..."
  # Replace project number in YAML
  sed "s/\${PROJECT_NUMBER}/$PROJECT_NUMBER/g" "infra/cloudrun-$ENV-api.yaml" >"$TEMP_DIR/cloudrun-$ENV-api.yaml" || {
    echo "Error: Failed to process API YAML file"
    exit 1
  }
  gcloud run services replace "$TEMP_DIR/cloudrun-$ENV-api.yaml" \
    --platform managed \
    --region us-central1 \
    --project $PROJECT || {
    echo "Error: API service deployment failed"
    exit 1
  }
else
  echo "Error: API configuration file not found: infra/cloudrun-$ENV-api.yaml"
  exit 1
fi

# Deploy Docs service
if [ -f "infra/cloudrun-$ENV-docs.yaml" ]; then
  echo "Deploying Docs service..."
  gcloud run services replace "infra/cloudrun-$ENV-docs.yaml" \
    --platform managed \
    --region us-central1 \
    --project $PROJECT || {
    echo "Error: Docs service deployment failed"
    exit 1
  }
else
  echo "Error: Docs configuration file not found: infra/cloudrun-$ENV-docs.yaml"
  exit 1
fi

echo "Deployment completed successfully!"
