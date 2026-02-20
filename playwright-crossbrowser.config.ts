import { defineConfig, devices } from '@playwright/test';

/**
 * Cross-browser validation config for Chrome, Firefox, and Safari (WebKit)
 * Edge uses the same engine as Chrome (Chromium), so Chrome tests cover Edge compatibility
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'cross-browser-report' }], ['list']],
  
  // More lenient settings for cross-browser comparison
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 500, // Allow more variance across browsers
      threshold: 0.3,
    },
  },
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'on', // Always capture screenshots
  },

  // Test across all major browser engines
  projects: [
    // Chromium (covers Chrome and Edge)
    {
      name: 'chromium-desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        browserName: 'chromium',
        viewport: { width: 900, height: 1024 },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
      },
    },

    // Firefox
    {
      name: 'firefox-desktop',
      use: {
        browserName: 'firefox',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'firefox-tablet',
      use: {
        browserName: 'firefox',
        viewport: { width: 900, height: 1024 },
      },
    },
    {
      name: 'firefox-mobile',
      use: {
        browserName: 'firefox',
        viewport: { width: 375, height: 667 },
      },
    },

    // WebKit (Safari engine)
    {
      name: 'webkit-desktop',
      use: {
        browserName: 'webkit',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-tablet',
      use: {
        browserName: 'webkit',
        viewport: { width: 900, height: 1024 },
      },
    },
    {
      name: 'webkit-mobile',
      use: {
        browserName: 'webkit',
        viewport: { width: 375, height: 667 },
      },
    },
  ],

  webServer: {
    command: 'npx http-server . -p 3000 -c-1',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
