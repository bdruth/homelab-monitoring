# Homelab Monitoring

Automated TypeScript and Playwright-based monitoring for homelab applications. Runs smoke tests to verify that applications are functioning correctly and sends notifications on failure.

## Current Monitors

- **Indexer App**: Verifies application availability and checks that a particular indexer is healthy.
- **Dashboard App**: Verifies that a dashboard application is accessible and not displaying "No Data" errors. This test handles authentication via an authentication proxy.

## Setup

1. Clone this repository:

   ```
   git clone <repository-url>
   cd homelab-monitoring
   ```

2. Use the required Node.js version:

   ```
   # Project requires Node.js v22+
   # If using nvm:
   nvm use
   ```

3. Install dependencies:

   ```
   yarn install
   ```

4. Install Playwright browser (Chromium):

   ```
   yarn playwright install chromium
   ```

5. **Set up 1Password CLI (for local development)**:
   This project uses 1Password to manage credentials for authenticated tests.

   - Install the 1Password CLI: [https://1password.com/downloads/cli/](https://1password.com/downloads/cli/)
   - Sign in to your 1Password account in the CLI.

6. Configure environment variables for notifications (optional):

   ```
   # For local development, create a .env file
   echo "PUSHOVER_TOKEN=your_token_here" > .env
   echo "PUSHOVER_USER=your_user_key_here" >> .env

   # Add variables for the dashboard monitor and authentication proxy
   echo "DASHBOARD_APP_URL=https://dashboard.example.com" >> .env
   echo "DASHBOARD_APP_NAME=MyDashboard" >> .env
   echo "DASHBOARD_URL_WILDCARD=**/dashboard.example.com/**" >> .env
   echo "AUTH_URL_WILDCARD=**/auth.example.com/**" >> .env
   echo "SERVICE_ACCOUNT_VAULT=your-1password-vault" >> .env
   echo "SERVICE_ACCOUNT_ITEM=your-1password-item" >> .env
   ```

7. Set up git-crypt (for secure .env file encryption):

   ```
   # Install git-crypt if not already installed
   # On macOS: brew install git-crypt
   # On Ubuntu: apt install git-crypt

   # Unlock the repository if you have the key
   git-crypt unlock /path/to/git-crypt-key

   # For new team members who need access:
   # 1. Generate GPG key if they don't have one
   # 2. Add their GPG key to the repository
   git-crypt add-gpg-user USER_ID
   ```

   > Note: The .env file is encrypted using git-crypt. Team members need to be added to the git-crypt configuration to access the encrypted files. For CI, the git-crypt key is stored as a secret named `GIT_CRYPT_KEY`.

## Running Tests

To run tests locally, you first need to load the secrets from 1Password into your shell session using the provided script:

```bash
source ./setup-env.sh
```

Then, you can run all tests:

```bash
yarn test
```

## Test Structure

Tests are located in the `tests` directory:

- `tests/<app>.spec.ts`

## Adding New Tests

1. Create a new test file in the `tests` directory
2. Import required modules
3. Define your test using the Playwright test framework

Example template:

```typescript
import { test, expect } from '@playwright/test';

test('My application check', async ({ page }) => {
  const URL = 'https://my-app.example.com';
  const TEST_NAME = 'My App Check';

  // Navigate to application
  await page.goto(URL);

  // Perform checks
  // ...
});
```

## CI Integration

This repository includes configuration for Gitea CI (compatible with GitHub Actions) in `.gitea/workflows/run-tests.yml`. The CI workflow uses the [1Password GitHub Action](https://github.com/1Password/load-secrets-action) to securely load credentials for authenticated tests. Tests will automatically run:

- On every push to the main branch
- On pull requests to the main branch
- On a schedule (hourly)

## Notification System

Alerts are sent via Pushover when tests fail. To configure:

1. Create a Pushover account and application at https://pushover.net/
2. Add your application token and user key as environment variables:
   - `PUSHOVER_TOKEN`: Your Pushover application token
   - `PUSHOVER_USER`: Your Pushover user key
