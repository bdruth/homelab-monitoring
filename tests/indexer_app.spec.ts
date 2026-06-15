import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Indexer app smoke test
 *
 * Verifies that:
 * 1. Indexer application is available
 * 2. The specified indexer is healthy
 */
test('Indexer application health check', async ({ page }) => {
  // Define constants
  const URL = process.env.INDEXER_APP_URL;
  const INDEXER_APP_NAME = process.env.INDEXER_APP_NAME;
  const INDEXER_NAME = process.env.INDEXER_NAME;

  // Step 1: Navigate to the indexer app
  await page.goto(URL);

  // Wait for the initial document; the visibility assertion below is the real
  // readiness gate. Avoid waitForLoadState('networkidle'), which hangs on pages
  // that poll/stream in the background and is the main source of flakiness here.
  await page.waitForLoadState('domcontentloaded');

  // Step 2: Verify page title (basic availability check)
  await expect(page).toHaveTitle(new RegExp(String(INDEXER_APP_NAME))); // Note: Update this if testing a different indexer app
  console.log('✅ Indexer application is available');

  // Step 3: Check if the specific indexer is present and healthy
  // Look for elements with text that contains the indexer name.
  // Allow generous time for the SPA to render its data (cold starts can take ~20s).
  const indexerElement = page.locator(`:text("${INDEXER_NAME}")`).first();
  await expect(indexerElement).toBeVisible({ timeout: 25000 });

  // Check if there are any error indicators near this indexer
  const errorIconNearIndexer = await page
    .locator(`:text("${INDEXER_NAME}")`)
    .locator(
      'xpath=./ancestor::div[contains(@class, "indexer")]//*[contains(@class, "error") or contains(@class, "warning")]'
    )
    .count();

  expect(errorIconNearIndexer, `${INDEXER_NAME} indexer has error indicators`).toBe(0);
  console.log(`✅ ${INDEXER_NAME} indexer appears to be healthy`);
});
