import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  
  // Snapshot settings for visual regression
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
  
  use: {
    // Base URL for tests - serve locally
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Configure projects for cross-browser testing
  projects: [
    // ===== CHROME =====
    {
      name: 'chrome-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        channel: 'chrome',
      },
    },
    {
      name: 'chrome-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 900, height: 1024 },
        channel: 'chrome',
      },
    },
    {
      name: 'chrome-mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 667 },
        channel: 'chrome',
      },
    },

    // ===== FIREFOX =====
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'firefox-tablet',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 900, height: 1024 },
      },
    },
    {
      name: 'firefox-mobile',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 375, height: 667 },
      },
    },

    // ===== SAFARI (WebKit) =====
    {
      name: 'safari-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'safari-tablet',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 900, height: 1024 },
      },
    },
    {
      name: 'safari-mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 375, height: 667 },
      },
    },

    // ===== EDGE =====
    {
      name: 'edge-desktop',
      use: {
        ...devices['Desktop Edge'],
        viewport: { width: 1440, height: 900 },
        channel: 'msedge',
      },
    },
    {
      name: 'edge-tablet',
      use: {
        ...devices['Desktop Edge'],
        viewport: { width: 900, height: 1024 },
        channel: 'msedge',
      },
    },
    {
      name: 'edge-mobile',
      use: {
        ...devices['Desktop Edge'],
        viewport: { width: 375, height: 667 },
        channel: 'msedge',
      },
    },

    // Keep original projects for backward compatibility
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 900, height: 1024 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 667 },
      },
    },
  ],

  // Web server to serve the static site
  webServer: {
    command: 'npx http-server . -p 3000 -c-1',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
