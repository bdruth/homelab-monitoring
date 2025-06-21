import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Maximum time one test can run for
  timeout: 30 * 1000,
  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 5000,
  },
  // Run tests in files in parallel
  fullyParallel: false,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,
  // Reporter to use
  reporter: 'list',
  // Shared settings for all the projects below
  use: {
    // Maximum time each action (like click()) can take
    actionTimeout: 10000,
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    // Record video on failure
    video: 'retain-on-failure',
    // Viewport size
    viewport: { width: 1280, height: 720 },
  },
  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: {
        headless: true,
      },
    },
  ],
});
