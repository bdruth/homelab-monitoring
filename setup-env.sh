#!/bin/bash
#
# This script sets up the environment for running the monitoring tests locally.
# It uses the 1Password CLI to fetch credentials and set them as environment variables.
#
# Prerequisites:
# - 1Password CLI is installed and configured.
# - You are logged in to your 1Password account.
#
# Usage:
# source ./setup-env.sh

# Load environment variables from .env file
if [ -f .env ]; then
  source .env
fi

# Fetch credentials from 1Password
export AUTH_USERNAME="$(op read "op://$SERVICE_ACCOUNT_VAULT/$SERVICE_ACCOUNT_ITEM/username")"
export AUTH_PASSWORD="$(op read "op://$SERVICE_ACCOUNT_VAULT/$SERVICE_ACCOUNT_ITEM/password")"
export AUTH_TOTP="$(op read "op://$SERVICE_ACCOUNT_VAULT/$SERVICE_ACCOUNT_ITEM/one-time password?attribute=otp")"

export WORKFLOW_AUTH_USERNAME="$(op read "op://$WORKFLOW_SERVICE_ACCOUNT_VAULT/$WORKFLOW_SERVICE_ACCOUNT_ITEM/username")"
export WORKFLOW_AUTH_PASSWORD="$(op read "op://$WORKFLOW_SERVICE_ACCOUNT_VAULT/$WORKFLOW_SERVICE_ACCOUNT_ITEM/password")"

echo "✅ Environment variables set for local testing."
