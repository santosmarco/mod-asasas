#!/bin/bash

# Usage: ./setup-iam.sh <environment>
# Example: ./setup-iam.sh sandbox

set -e # Exit on any error

if [ -z "$1" ]; then
  echo "Error: Environment argument required (production or sandbox)"
  echo "Usage: ./setup-iam.sh <environment>"
  exit 1
fi

ENV=$1
PROJECT="sd2-mod-$ENV"

# Get project number and user email
PROJECT_NUMBER=$(gcloud projects describe $PROJECT --format='value(projectNumber)')
SERVICE_ACCOUNT_ID="cloudrun-compute-sa"
SERVICE_ACCOUNT="$SERVICE_ACCOUNT_ID@$PROJECT.iam.gserviceaccount.com"
USER_EMAIL=$(gcloud config get account)

echo "Setting up IAM permissions for $PROJECT..."
echo "Service Account: $SERVICE_ACCOUNT"
echo "User: $USER_EMAIL"

# Create the service account if it doesn't exist
echo "Creating service account if it doesn't exist..."
gcloud iam service-accounts create "$SERVICE_ACCOUNT_ID" \
  --project=$PROJECT \
  --display-name="Cloud Run Compute Service Account" || true

# Wait a few seconds for the service account to be fully created
sleep 5

# Grant Service Account User role to the deployer
echo "Granting Service Account User role to $USER_EMAIL..."
gcloud projects add-iam-policy-binding $PROJECT \
  --member="user:$USER_EMAIL" \
  --role="roles/iam.serviceAccountUser"

# Grant Service Account Token Creator role to the deployer
echo "Granting Service Account Token Creator role to $USER_EMAIL..."
gcloud projects add-iam-policy-binding $PROJECT \
  --member="user:$USER_EMAIL" \
  --role="roles/iam.serviceAccountTokenCreator"

# Grant Secret Manager Secret Accessor role
echo "Granting Secret Manager Secret Accessor role..."
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"

# Grant Cloud Run Invoker role
echo "Granting Cloud Run Invoker role..."
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/run.invoker"

# Grant additional required roles
echo "Granting additional required roles..."
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/cloudtrace.agent"

gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/monitoring.metricWriter"

gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/logging.logWriter"

# Grant Cloud Run Admin role instead of setIamPolicy
echo "Granting Cloud Run Admin role..."
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/run.admin"

echo "IAM setup completed successfully!"
