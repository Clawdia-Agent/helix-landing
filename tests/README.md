# Playwright Tests for Helix Landing Page

This directory contains Playwright visual and functional tests for the Helix landing page, focusing on the hero section layout and responsive behavior.

## Test Structure

```
tests/
├── hero.spec.ts                    # Hero section layout tests
├── interactive.spec.ts             # Interactive elements tests
├── visual-regression.spec.ts       # Visual regression snapshot tests
├── hero.spec.ts-snapshots/         # Baseline snapshots for hero tests
├── visual-regression.spec.ts-snapshots/  # Baseline snapshots for visual regression tests
└── README.md                       # This file
```

## Test Categories

### Hero Section Layout (`hero.spec.ts`)

Tests the hero section at different breakpoints:

- **Desktop Layout (>1024px)**
  - Two-column grid layout (side-by-side)
  - Title, subtitle, and CTAs on left
  - Toggle + terminal on right
  - Horizontal stats row

- **Tablet Layout (900px-1024px)**
  - Single column stacked layout
  - Centered text and actions

- **Mobile Layout (<768px)**
  - Hidden navigation links
  - Abbreviated toggle labels
  - Vertical stats stacking

- **Small Mobile Layout (<480px)**
  - Full-width action buttons

### Interactive Elements (`interactive.spec.ts`)

Tests functional behavior:

- **Hero Toggle (Agent/Human Mode)**
  - Default state (agent active)
  - Click to switch modes
  - Terminal content changes
  - ARIA roles and accessibility

- **Navigation**
  - Links visibility and content
  - Fixed positioning
  - CTA button presence

- **CTA Buttons**
  - Correct href attributes
  - Target attributes for external links

- **Accessibility**
  - Skip link functionality
  - Keyboard accessibility
  - Focus states

### Visual Regression (`visual-regression.spec.ts`)

Captures baseline screenshots:

- **Full Page Screenshots**
  - Desktop, tablet, and mobile views

- **Component Screenshots**
  - Navigation bar
  - Hero toggle (both modes)
  - Hero badges
  - Hero stats
  - Hero terminal

- **Responsive Breakpoint Screenshots**
  - 9 different viewport sizes from 1920px to 320px

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Update visual regression snapshots
npm run test:update-snapshots

# View test report
npm run test:report
```

## Projects

Tests run across three browser configurations:

| Project | Viewport | Description |
|---------|----------|-------------|
| desktop | 1440×900 | Desktop Chrome |
| tablet | 900×1024 | Tablet viewport |
| mobile | 375×667 | Mobile viewport |

## Visual Regression

Snapshots are stored in `*-snapshots/` directories with naming convention:
`<test-name>-<project>-linux.png`

To update baselines after intentional UI changes:
```bash
npm run test:update-snapshots
```

## Breakpoints Tested

The CSS uses these breakpoints:

| Breakpoint | Behavior |
|------------|----------|
| >1024px | Two-column hero grid |
| 900-1024px | Stacked hero, visible nav |
| <768px | Hidden nav, abbreviated toggle |
| <480px | Full-width buttons |

## Adding New Tests

1. Add tests to appropriate spec file or create new one
2. Run with `--update-snapshots` to capture baselines
3. Commit both test file and new snapshots
