import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Dashboard app smoke test
 *
 * Verifies that:

 * 
 * 1. Dashboard application is available
 * 2. The default dashboard is not showing "No Data"
 */
test('Dashboard application health check', async ({ page }) => {
  // Define constants
  const URL = process.env.DASHBOARD_APP_URL || '';
  const DASHBOARD_APP_NAME = process.env.DASHBOARD_APP_NAME || '';
  const AUTH_USERNAME = process.env.AUTH_USERNAME || '';
  const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '';
  const AUTH_TOTP = process.env.AUTH_TOTP || '';
  const AUTH_URL_WILDCARD = process.env.AUTH_URL_WILDCARD || '';
  const DASHBOARD_URL_WILDCARD = process.env.DASHBOARD_URL_WILDCARD || '';

  // Step 1: Navigate to the dashboard app
  await page.goto(URL);

  // Step 2: Handle Authelia authentication
  await page.waitForURL(AUTH_URL_WILDCARD);
  console.log(`Current URL: ${page.url()}`);
  await page.getByLabel('Username').fill(AUTH_USERNAME);
  await page.getByRole('textbox', { name: 'Password' }).fill(AUTH_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for the TOTP input to appear
  const totpDigits = AUTH_TOTP.split('');
  for (let i = 0; i < totpDigits.length; i++) {
    const label = i === 0 ? 'Please enter verification code. Digit 1' : `Digit ${i + 1}`;
    await page.locator(`input[aria-label="${label}"]`).fill(totpDigits[i]);
  }

  // Handle consent page
  await page.getByRole('button', { name: 'Accept' }).click();

  // Wait for page to load completely
  await page.waitForURL(DASHBOARD_URL_WILDCARD);
  await page.waitForLoadState('networkidle');

  // Step 3: Verify page title (basic availability check)
  const title = await page.title();
  expect(title).toContain(DASHBOARD_APP_NAME);
  console.log('✅ Dashboard application is available');

  // Step 4: Verify the dashboard is not showing "No Data"
  const noDataCount = await page.getByText('No Data').count();
  expect(noDataCount, `${DASHBOARD_APP_NAME} dashboard shows "No Data" error`).toBe(0);
  console.log(`✅ ${DASHBOARD_APP_NAME} dashboard appears to be healthy`);
});
