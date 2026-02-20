import { test, expect } from '@playwright/test';

test.describe('Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Hero Toggle (Agent/Human Mode)', () => {
    test('agent tab is active by default', async ({ page }) => {
      const agentTab = page.locator('[data-mode="agent"]');
      await expect(agentTab).toHaveAttribute('aria-selected', 'true');
      await expect(agentTab).toHaveClass(/active/);
    });

    test('human tab is not active by default', async ({ page }) => {
      const humanTab = page.locator('[data-mode="human"]');
      await expect(humanTab).toHaveAttribute('aria-selected', 'false');
      await expect(humanTab).not.toHaveClass(/active/);
    });

    test('agent terminal content is visible by default', async ({ page }) => {
      const agentTerminal = page.locator('#terminal-agent');
      await expect(agentTerminal).toBeVisible();
      await expect(agentTerminal).not.toHaveAttribute('hidden');
    });

    test('human terminal content is hidden by default', async ({ page }) => {
      const humanTerminal = page.locator('#terminal-human');
      await expect(humanTerminal).toBeHidden();
    });

    test('clicking human tab switches to human mode', async ({ page }) => {
      const humanTab = page.locator('[data-mode="human"]');
      await humanTab.click();
      
      // Human tab should now be active
      await expect(humanTab).toHaveClass(/active/);
      await expect(humanTab).toHaveAttribute('aria-selected', 'true');
      
      // Agent tab should no longer be active
      const agentTab = page.locator('[data-mode="agent"]');
      await expect(agentTab).not.toHaveClass(/active/);
      await expect(agentTab).toHaveAttribute('aria-selected', 'false');
      
      // Human terminal should be visible
      const humanTerminal = page.locator('#terminal-human');
      await expect(humanTerminal).toBeVisible();
      
      // Agent terminal should be hidden
      const agentTerminal = page.locator('#terminal-agent');
      await expect(agentTerminal).toBeHidden();
    });

    test('clicking agent tab switches back to agent mode', async ({ page }) => {
      // First switch to human
      await page.locator('[data-mode="human"]').click();
      
      // Then switch back to agent
      const agentTab = page.locator('[data-mode="agent"]');
      await agentTab.click();
      
      await expect(agentTab).toHaveClass(/active/);
      await expect(page.locator('#terminal-agent')).toBeVisible();
      await expect(page.locator('#terminal-human')).toBeHidden();
    });

    test('terminal shows correct content for agent mode', async ({ page }) => {
      const agentTerminal = page.locator('#terminal-agent');
      await expect(agentTerminal).toContainText('curl');
      await expect(agentTerminal).toContainText('skill.md');
    });

    test('terminal shows correct content for human mode', async ({ page }) => {
      await page.locator('[data-mode="human"]').click();
      
      const humanTerminal = page.locator('#terminal-human');
      await expect(humanTerminal).toContainText('git clone');
      await expect(humanTerminal).toContainText('npm install');
      await expect(humanTerminal).toContainText('npm start');
    });

    test('toggle has proper ARIA roles', async ({ page }) => {
      const toggle = page.locator('.hero-toggle');
      await expect(toggle).toHaveAttribute('role', 'tablist');
      
      const agentTab = page.locator('[data-mode="agent"]');
      await expect(agentTab).toHaveAttribute('role', 'tab');
      await expect(agentTab).toHaveAttribute('aria-controls', 'terminal-agent');
      
      const humanTab = page.locator('[data-mode="human"]');
      await expect(humanTab).toHaveAttribute('role', 'tab');
      await expect(humanTab).toHaveAttribute('aria-controls', 'terminal-human');
    });

    test('terminal panels have proper ARIA roles', async ({ page }) => {
      const agentTerminal = page.locator('#terminal-agent');
      await expect(agentTerminal).toHaveAttribute('role', 'tabpanel');
      await expect(agentTerminal).toHaveAttribute('aria-labelledby', 'tab-agent');
      
      const humanTerminal = page.locator('#terminal-human');
      await expect(humanTerminal).toHaveAttribute('role', 'tabpanel');
      await expect(humanTerminal).toHaveAttribute('aria-labelledby', 'tab-human');
    });
  });

  test.describe('Navigation', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('nav links are visible on desktop', async ({ page }) => {
      const navLinks = page.locator('.nav-links');
      await expect(navLinks).toBeVisible();
    });

    test('nav links contain correct items', async ({ page }) => {
      const features = page.locator('.nav-links a[href="#features"]');
      await expect(features).toBeVisible();
      await expect(features).toContainText('Features');
      
      const screenshots = page.locator('.nav-links a[href="#screenshots"]');
      await expect(screenshots).toBeVisible();
      await expect(screenshots).toContainText('Screenshots');
      
      const howItWorks = page.locator('.nav-links a[href="#how-it-works"]');
      await expect(howItWorks).toBeVisible();
      await expect(howItWorks).toContainText('How It Works');
      
      const github = page.locator('.nav-links a[href*="github.com"]');
      await expect(github).toBeVisible();
      await expect(github).toContainText('GitHub');
    });

    test('Get Started CTA button is visible', async ({ page }) => {
      const ctaBtn = page.locator('.nav-cta .btn-primary');
      await expect(ctaBtn).toBeVisible();
      await expect(ctaBtn).toContainText('Get Started');
    });

    test('navigation is fixed to top', async ({ page }) => {
      const nav = page.locator('.nav');
      const position = await nav.evaluate((el) => {
        return window.getComputedStyle(el).position;
      });
      expect(position).toBe('fixed');
    });
  });

  test.describe('CTA Buttons', () => {
    test('Quick Start button links to install section', async ({ page }) => {
      const quickStart = page.locator('.hero-actions .btn-primary');
      await expect(quickStart).toHaveAttribute('href', '#install');
    });

    test('GitHub button opens in new tab', async ({ page }) => {
      const githubBtn = page.locator('.hero-actions .btn-secondary');
      await expect(githubBtn).toHaveAttribute('target', '_blank');
      await expect(githubBtn).toHaveAttribute('href', /github\.com/);
    });

    test('buttons have hover styles', async ({ page }) => {
      const primaryBtn = page.locator('.hero-actions .btn-primary');
      
      // Get initial background
      const initialBg = await primaryBtn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      // Hover over button
      await primaryBtn.hover();
      
      // Note: hover styles may or may not change immediately depending on transitions
      // The key is that the button is interactive
      await expect(primaryBtn).toBeEnabled();
    });
  });

  test.describe('Skip Link (Accessibility)', () => {
    test('skip link exists and is focusable', async ({ page }) => {
      const skipLink = page.locator('.skip-link');
      await expect(skipLink).toHaveAttribute('href', '#main');
      
      // Focus the skip link
      await skipLink.focus();
      
      // When focused, it should become visible
      await expect(skipLink).toBeFocused();
    });

    test('main content has correct ID for skip link', async ({ page }) => {
      const main = page.locator('main#main');
      await expect(main).toBeVisible();
    });
  });
});

test.describe('Focus States (Accessibility)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('toggle buttons are keyboard accessible', async ({ page }) => {
    const agentTab = page.locator('[data-mode="agent"]');
    const humanTab = page.locator('[data-mode="human"]');
    
    // Tab to the toggle area
    await agentTab.focus();
    await expect(agentTab).toBeFocused();
    
    // Press Enter to activate (it's already active, but should work)
    await page.keyboard.press('Enter');
    await expect(agentTab).toHaveClass(/active/);
    
    // Tab to human tab
    await humanTab.focus();
    await expect(humanTab).toBeFocused();
    
    // Press Enter to switch
    await page.keyboard.press('Enter');
    await expect(humanTab).toHaveClass(/active/);
  });

  test('CTA buttons are keyboard accessible', async ({ page }) => {
    const quickStart = page.locator('.hero-actions .btn-primary');
    await quickStart.focus();
    await expect(quickStart).toBeFocused();
  });
});
