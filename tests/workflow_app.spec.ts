import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Workflow app smoke test
 *
 * Verifies that:
 *
 * 1. Workflow application is available
 * 2. The overview page loads successfully after login
 */
test('Workflow application health check', async ({ page }) => {
  // Define constants
  const URL = process.env.WORKFLOW_APP_URL || '';
  const WORKFLOW_APP_NAME = process.env.WORKFLOW_APP_NAME || '';
  const AUTH_USERNAME = process.env.WORKFLOW_AUTH_USERNAME || '';
  const AUTH_PASSWORD = process.env.WORKFLOW_AUTH_PASSWORD || '';
  const WORKFLOW_URL_WILDCARD = process.env.WORKFLOW_URL_WILDCARD || '';

  // Step 1: Navigate to the workflow app
  await page.goto(URL);

  // Step 2: Handle workflow login
  await page.fill("[name='emailOrLdapLoginId']", AUTH_USERNAME);
  await page.fill("[name='password']", AUTH_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for page to load completely
  await page.waitForURL(WORKFLOW_URL_WILDCARD);
  await page.waitForLoadState('networkidle');

  // Step 3: Verify page title (basic availability check)
  const title = await page.title();
  expect(title).toContain(WORKFLOW_APP_NAME);
  console.log('✅ Workflow application is available');

  // Step 4: Verify the overview page is loaded
  const overviewHeader = await page.locator('h2:has-text("Overview")');
  await expect(overviewHeader).toBeVisible();
  console.log('✅ Workflow overview page is loaded');
});
