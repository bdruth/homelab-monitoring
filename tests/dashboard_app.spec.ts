import { test, expect } from '@playwright/test';
import { authenticator } from 'otplib';
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
  const AUTH_TOTP_SECRET = process.env.AUTH_TOTP_SECRET || '';
  const AUTH_URL_WILDCARD = process.env.AUTH_URL_WILDCARD || '';
  const DASHBOARD_URL_WILDCARD = process.env.DASHBOARD_URL_WILDCARD || '';

  // Step 1: Navigate to the dashboard app
  await page.goto(URL);

  // Step 2: Handle Authelia authentication
  await page.waitForURL(AUTH_URL_WILDCARD);
  console.log(`Current URL: ${page.url()}`);
  await page.getByLabel('Username').fill(AUTH_USERNAME);
  await page.getByRole('textbox', { name: 'Password' }).fill(AUTH_PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Generate a current TOTP code at entry time. Generating from the shared
  // secret (rather than a single code captured once at job start) keeps it valid
  // across the test and any retries — a pre-rendered code expires after ~30s and
  // is what made this step flaky. Fail loudly if no valid 6-digit code results.
  // AUTH_TOTP_SECRET may be a raw base32 seed or the full otpauth:// URI that
  // 1Password stores for an OTP field — referencing that field without
  // ?attribute=otp yields the URI (which embeds the seed). Handle both.
  const totpSecret = AUTH_TOTP_SECRET.startsWith('otpauth://')
    ? (AUTH_TOTP_SECRET.match(/[?&]secret=([^&]+)/i)?.[1] ?? '')
    : AUTH_TOTP_SECRET;
  const totp = authenticator.generate(totpSecret);
  expect(totp, 'TOTP code (is AUTH_TOTP_SECRET the seed / otpauth URI?)').toMatch(/^\d{6}$/);

  const totpDigits = totp.split('');
  for (let i = 0; i < totpDigits.length; i++) {
    const label = i === 0 ? 'Please enter verification code. Digit 1' : `Digit ${i + 1}`;
    await page.locator(`input[aria-label="${label}"]`).fill(totpDigits[i]);
  }

  // Handle the Authelia consent page. It only appears the first time consent is
  // granted for the client; on later runs Authelia remembers consent server-side
  // and redirects straight to the app, so this step must be conditional.
  const acceptButton = page.getByRole('button', { name: 'Accept' });
  await Promise.race([
    page.waitForURL(DASHBOARD_URL_WILDCARD),
    acceptButton.waitFor({ state: 'visible' }),
  ]).catch(() => {});
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }

  // Wait for the dashboard navigation to settle
  await page.waitForURL(DASHBOARD_URL_WILDCARD);
  await page.waitForLoadState('domcontentloaded');

  // Step 3: Verify page title (basic availability check)
  await expect(page).toHaveTitle(new RegExp(DASHBOARD_APP_NAME));
  console.log('✅ Dashboard application is available');

  // Step 4: Verify the dashboard is not showing "No Data".
  // Use a web-first assertion so it auto-retries while Grafana panels load their
  // series after the page settles (a one-shot .count() races panel loading).
  await expect(
    page.getByText('No Data'),
    `${DASHBOARD_APP_NAME} dashboard shows "No Data" error`
  ).toHaveCount(0, { timeout: 15000 });
  console.log(`✅ ${DASHBOARD_APP_NAME} dashboard appears to be healthy`);
});
