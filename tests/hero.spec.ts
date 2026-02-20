import { test, expect } from '@playwright/test';

test.describe('Hero Section Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop Layout (>1024px)', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('hero section renders correctly', async ({ page }) => {
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('hero grid has two-column side-by-side layout', async ({ page }) => {
      const heroGrid = page.locator('.hero-grid');
      await expect(heroGrid).toBeVisible();
      
      // Check that grid has two columns at desktop
      const gridStyles = await heroGrid.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
        };
      });
      
      expect(gridStyles.display).toBe('grid');
      // Two columns should result in two values (e.g., "714px 714px" or similar)
      const columns = gridStyles.gridTemplateColumns.split(' ').filter(c => c.trim());
      expect(columns.length).toBe(2);
    });

    test('hero main section (left column) renders correctly', async ({ page }) => {
      const heroMain = page.locator('.hero-main');
      await expect(heroMain).toBeVisible();
      
      // Check title
      const title = page.locator('.hero-main h1');
      await expect(title).toBeVisible();
      await expect(title).toContainText('Goals-First');
      
      // Check subtitle
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toBeVisible();
      
      // Check CTA buttons
      const actions = page.locator('.hero-actions');
      await expect(actions).toBeVisible();
      
      const primaryBtn = page.locator('.hero-actions .btn-primary');
      await expect(primaryBtn).toBeVisible();
      await expect(primaryBtn).toContainText('Quick Start');
      
      const secondaryBtn = page.locator('.hero-actions .btn-secondary');
      await expect(secondaryBtn).toBeVisible();
      await expect(secondaryBtn).toContainText('Star on GitHub');
    });

    test('hero instructions section (right column) renders correctly', async ({ page }) => {
      const heroInstructions = page.locator('.hero-instructions');
      await expect(heroInstructions).toBeVisible();
      
      // Check toggle
      const toggle = page.locator('.hero-toggle');
      await expect(toggle).toBeVisible();
      
      // Check terminal
      const terminal = page.locator('.hero-terminal');
      await expect(terminal).toBeVisible();
    });

    test('hero badges row displays above grid', async ({ page }) => {
      const badges = page.locator('.hero-badges');
      await expect(badges).toBeVisible();
      
      const wipBadge = page.locator('.wip-badge');
      await expect(wipBadge).toContainText('Work in Progress');
    });

    test('hero stats row displays below grid', async ({ page }) => {
      const stats = page.locator('.hero-stats');
      await expect(stats).toBeVisible();
      
      // Check stats are displayed horizontally on desktop
      const statsLayout = await stats.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.flexDirection;
      });
      expect(statsLayout).toBe('row');
      
      // Check all 3 stats present
      const statItems = page.locator('.hero-stat');
      await expect(statItems).toHaveCount(3);
    });

    test('visual regression - hero desktop', async ({ page }) => {
      const hero = page.locator('.hero');
      await expect(hero).toHaveScreenshot('hero-desktop.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Tablet Layout (900px-1024px)', () => {
    test.use({ viewport: { width: 900, height: 1024 } });

    test('hero grid stacks to single column', async ({ page }) => {
      const heroGrid = page.locator('.hero-grid');
      await expect(heroGrid).toBeVisible();
      
      const gridStyles = await heroGrid.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
        };
      });
      
      expect(gridStyles.display).toBe('grid');
      // Single column should have just one value
      const columns = gridStyles.gridTemplateColumns.split(' ').filter(c => c.trim());
      expect(columns.length).toBe(1);
    });

    test('hero main section is centered on tablet', async ({ page }) => {
      const heroMain = page.locator('.hero-main');
      const textAlign = await heroMain.evaluate((el) => {
        return window.getComputedStyle(el).textAlign;
      });
      expect(textAlign).toBe('center');
    });

    test('hero actions are centered', async ({ page }) => {
      const heroActions = page.locator('.hero-actions');
      const justifyContent = await heroActions.evaluate((el) => {
        return window.getComputedStyle(el).justifyContent;
      });
      expect(justifyContent).toBe('center');
    });

    test('visual regression - hero tablet', async ({ page }) => {
      const hero = page.locator('.hero');
      await expect(hero).toHaveScreenshot('hero-tablet.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Mobile Layout (<768px)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('hero renders correctly on mobile', async ({ page }) => {
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('hero grid stacks vertically', async ({ page }) => {
      const heroGrid = page.locator('.hero-grid');
      const gridStyles = await heroGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      
      // Single column on mobile
      const columns = gridStyles.split(' ').filter(c => c.trim());
      expect(columns.length).toBe(1);
    });

    test('navigation links are hidden on mobile', async ({ page }) => {
      const navLinks = page.locator('.nav-links');
      await expect(navLinks).toBeHidden();
    });

    test('hero toggle shows abbreviated labels', async ({ page }) => {
      // On mobile, the .hero-toggle-label is hidden and abbreviated via pseudo-elements
      const toggleLabel = page.locator('.hero-toggle-label').first();
      const display = await toggleLabel.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('none');
    });

    test('hero stats stack vertically on mobile', async ({ page }) => {
      const stats = page.locator('.hero-stats');
      const flexDirection = await stats.evaluate((el) => {
        return window.getComputedStyle(el).flexDirection;
      });
      expect(flexDirection).toBe('column');
    });

    test('visual regression - hero mobile', async ({ page }) => {
      const hero = page.locator('.hero');
      await expect(hero).toHaveScreenshot('hero-mobile.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Small Mobile Layout (<480px)', () => {
    test.use({ viewport: { width: 320, height: 568 } });

    test('hero action buttons are full width', async ({ page }) => {
      const heroActions = page.locator('.hero-actions');
      const flexDirection = await heroActions.evaluate((el) => {
        return window.getComputedStyle(el).flexDirection;
      });
      expect(flexDirection).toBe('column');
    });

    test('buttons take full width', async ({ page }) => {
      const primaryBtn = page.locator('.hero-actions .btn-primary');
      const width = await primaryBtn.evaluate((el) => {
        return window.getComputedStyle(el).width;
      });
      // Button should be 100% width (will be the container width minus padding)
      // Just check it's wider than typical button width
      const widthNum = parseInt(width);
      expect(widthNum).toBeGreaterThan(200);
    });

    test('visual regression - hero small mobile', async ({ page }) => {
      const hero = page.locator('.hero');
      await expect(hero).toHaveScreenshot('hero-small-mobile.png', {
        animations: 'disabled',
      });
    });
  });
});
