# Homelab Monitoring

Automated TypeScript and Playwright-based monitoring for homelab applications. Runs smoke tests to verify that applications are functioning correctly and sends notifications on failure.

## Current Monitors

- **Indexer App**: Verifies application availability and checks that a particular indexer is healthy

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

5. Configure environment variables for notifications (optional):

   ```
   # For local development, create a .env file
   echo "PUSHOVER_TOKEN=your_token_here" > .env
   echo "PUSHOVER_USER=your_user_key_here" >> .env
   ```

6. Set up git-crypt (for secure .env file encryption):

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

Run all tests:

```
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

This repository includes configuration for Gitea CI (compatible with GitHub Actions) in `.gitea/workflows/run-tests.yml`. Tests will automatically run:

- On every push to the main branch
- On pull requests to the main branch
- On a schedule (hourly)

## Notification System

Alerts are sent via Pushover when tests fail. To configure:

1. Create a Pushover account and application at https://pushover.net/
2. Add your application token and user key as environment variables:
   - `PUSHOVER_TOKEN`: Your Pushover application token
   - `PUSHOVER_USER`: Your Pushover user key
