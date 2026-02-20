import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('Full Page Screenshots', () => {
    test('desktop full page', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
      
      await expect(page).toHaveScreenshot('full-page-desktop.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('tablet full page', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
      
      await expect(page).toHaveScreenshot('full-page-tablet.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('mobile full page', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
      
      await expect(page).toHaveScreenshot('full-page-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Component Screenshots', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Disable animations
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
    });

    test('navigation bar - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const nav = page.locator('.nav');
      await expect(nav).toHaveScreenshot('nav-desktop.png');
    });

    test('hero toggle - agent mode', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const heroInstructions = page.locator('.hero-instructions');
      await expect(heroInstructions).toHaveScreenshot('hero-instructions-agent.png');
    });

    test('hero toggle - human mode', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      
      // Switch to human mode
      await page.locator('[data-mode="human"]').click();
      
      const heroInstructions = page.locator('.hero-instructions');
      await expect(heroInstructions).toHaveScreenshot('hero-instructions-human.png');
    });

    test('hero badges', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const badges = page.locator('.hero-badges');
      await expect(badges).toHaveScreenshot('hero-badges.png');
    });

    test('hero stats - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const stats = page.locator('.hero-stats');
      await expect(stats).toHaveScreenshot('hero-stats-desktop.png');
    });

    test('hero stats - mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const stats = page.locator('.hero-stats');
      await expect(stats).toHaveScreenshot('hero-stats-mobile.png');
    });

    test('hero terminal', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const terminal = page.locator('.hero-terminal');
      await expect(terminal).toHaveScreenshot('hero-terminal.png');
    });
  });

  test.describe('Responsive Breakpoint Screenshots', () => {
    const breakpoints = [
      { name: 'large-desktop', width: 1920, height: 1080 },
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'small-desktop', width: 1200, height: 800 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'tablet', width: 900, height: 1024 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'mobile-large', width: 414, height: 896 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'mobile-small', width: 320, height: 568 },
    ];

    for (const bp of breakpoints) {
      test(`hero at ${bp.name} (${bp.width}x${bp.height})`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
            }
          `
        });
        
        const hero = page.locator('.hero');
        await expect(hero).toHaveScreenshot(`hero-${bp.name}.png`);
      });
    }
  });
});
