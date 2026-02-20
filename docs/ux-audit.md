# UI/UX Audit: Helix Landing Page

**Auditor:** Designer Agent  
**Date:** 2026-02-20  
**Files Reviewed:** `index.html`, `css/styles.css`  
**Reference Screenshots:** `/images/dashboard-overview.png`, `/images/condo-context.png`, `/images/agents-overview.png`

---

## Executive Summary

The Helix landing page is a solid foundation with good visual alignment to the dashboard aesthetic. The dark theme, gradient accents, and typography choices successfully convey a modern, developer-focused product. However, several spacing inconsistencies, typography hierarchy issues, responsive breakpoint gaps, and visual balance problems reduce the overall polish.

**Priority Issues:**
1. 🔴 **Critical:** Hero section layout needs restructuring (agent/human toggle position)
2. 🟠 **High:** Inconsistent vertical rhythm and spacing throughout
3. 🟠 **High:** Responsive breakpoints missing intermediate sizes (tablet)
4. 🟡 **Medium:** Typography hierarchy issues in features and cards
5. 🟡 **Medium:** Visual balance problems in the Why Helix section

---

## 1. Spacing Inconsistencies

### 1.1 Section Padding Variance
**Location:** `styles.css` lines 187, 348, 437, 505, 565, 639

The sections have inconsistent vertical padding:
- `.hero`: `180px 0 120px` (asymmetric)
- `.showcase`: `80px 0`
- `.features`: `120px 0`
- `.why-helix`: `120px 0`
- `.how-it-works`: `120px 0`
- `.screenshots-gallery`: `80px 0 120px` (asymmetric)
- `.install`: `120px 0`
- `.cta`: `120px 0`

**Issue:** The `showcase` and top of `screenshots-gallery` use `80px` while other sections use `120px`. This creates visual rhythm breaks.

**Recommendation:**
```css
/* Standardize to 120px or use a spacing scale */
:root {
  --section-spacing-lg: 120px;
  --section-spacing-md: 80px;
}

/* Apply consistently based on content density */
.showcase { padding: var(--section-spacing-lg) 0; }
.screenshots-gallery { padding: var(--section-spacing-lg) 0; }
```

### 1.2 Hero Stats Gap
**Location:** `styles.css` lines 282-293

```css
.hero-stats {
  gap: 48px;
  margin-top: 80px;
  padding-top: 48px;
}
```

**Issue:** The `margin-top: 80px` creates excessive whitespace between hero actions and stats, making the section feel disconnected.

**Recommendation:**
```css
.hero-stats {
  gap: 64px;
  margin-top: 56px;  /* Reduce from 80px */
  padding-top: 56px;  /* Harmonize with margin */
}
```

### 1.3 Feature Card Padding
**Location:** `styles.css` lines 379-393

```css
.feature-card {
  padding: 32px;
}

.feature-icon {
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 12px;
}
```

**Issue:** Internal spacing doesn't follow a consistent scale. The mix of 32px, 20px, and 12px creates subtle visual noise.

**Recommendation:**
```css
.feature-card {
  padding: 28px;  /* More reasonable for card density */
}

.feature-icon {
  margin-bottom: 16px;  /* Align to 8px grid */
}

.feature-card h3 {
  margin-bottom: 8px;  /* Tighter coupling to description */
}
```

### 1.4 Why Helix Grid Gap
**Location:** `styles.css` lines 407-410

```css
.why-grid {
  gap: 80px;
}
```

**Issue:** 80px gap is excessive on desktop, causing visual separation between content and visual columns.

**Recommendation:**
```css
.why-grid {
  gap: 64px;  /* Slightly tighter but still spacious */
}
```

---

## 2. Typography Hierarchy Problems

### 2.1 Inconsistent Heading Scales
**Location:** `styles.css` lines 55-59 (base), various section styles

**Current heading sizes:**
- `.hero h1`: `clamp(2.5rem, 6vw, 4rem)` — Line 270
- `.section-title`: `clamp(1.75rem, 4vw, 2.5rem)` — Line 362
- `.why-content h2`: `clamp(1.75rem, 4vw, 2.25rem)` — Line 420
- `.cta h2`: `clamp(1.75rem, 4vw, 2.5rem)` — Line 622
- `.feature-card h3`: `1.2rem` — Line 395
- `.step-content h3`: `1.25rem` — Line 556

**Issue:** The h2 in "Why Helix" maxes at `2.25rem` while other h2s max at `2.5rem`. This breaks visual hierarchy consistency.

**Recommendation:** Standardize h2 sizes:
```css
.why-content h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);  /* Match other h2s */
}
```

### 2.2 Section Label Inconsistency
**Location:** `styles.css` lines 355-361

```css
.section-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}
```

**Issue:** The label styles are consistent, but `index.html` uses different label formats:
- Line 190: `<span class="section-label">Screenshots</span>`
- Line 236: `<span class="section-label">Features</span>`
- Line 280: `<span class="section-label">Why Helix?</span>` — question mark

**Recommendation:** Keep labels consistent — remove punctuation from section labels.

### 2.3 Body Text Variance
**Location:** Various

- `.hero-subtitle`: `1.25rem` (line 272)
- `.section-subtitle`: `1.1rem` (line 368)
- `.why-content p`: `1.05rem` (line 427)
- `.feature-card p`: `0.95rem` (line 398)
- `.step-content p`: `1rem` (line 561)

**Issue:** Body text varies from 0.95rem to 1.25rem without clear rationale. This muddies the typographic rhythm.

**Recommendation:** Establish a clear text scale:
```css
:root {
  --text-lg: 1.25rem;   /* Hero subtitle, CTA */
  --text-md: 1.1rem;    /* Section descriptions */
  --text-base: 1rem;    /* Default body */
  --text-sm: 0.9rem;    /* Cards, secondary */
}
```

---

## 3. Responsive Breakpoint Gaps

### 3.1 Missing Tablet Breakpoint
**Location:** `styles.css` lines 696-778

Current breakpoints:
- `1024px` — Why grid collapse
- `768px` — Mobile nav, hero adjustments
- `480px` — Full-width CTAs

**Issue:** No intermediate breakpoint between 768px-1024px. Features grid (`grid-template-columns: repeat(auto-fit, minmax(340px, 1fr))`) can create awkward 2-column layouts where cards are too wide on ~900px screens.

**Recommendation:** Add 900px breakpoint:
```css
@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .screenshots-grid {
    grid-template-columns: 1fr;
  }
}
```

### 3.2 Nav Links Hidden Too Early
**Location:** `styles.css` line 700

```css
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
```

**Issue:** Nav links disappear at 768px, but there's no hamburger menu. Users on tablets lose navigation entirely.

**Recommendation:** Either:
1. Add a hamburger menu component
2. Or compress nav links into icons/shorter labels before hiding:
```css
@media (max-width: 900px) {
  .nav-links {
    gap: 20px;
  }
  .nav-links a {
    font-size: 0.85rem;
  }
}
```

### 3.3 Hero Toggle Text Disappears
**Location:** `styles.css` lines 717-724

```css
@media (max-width: 768px) {
  .hero-toggle-btn span:not(.hero-toggle-icon) {
    display: none;
  }
}
```

**Issue:** Toggle labels ("I'm an agent" / "I'm human") disappear on mobile, leaving only emoji icons. This reduces clarity for users who may not understand the toggle's purpose.

**Recommendation:** Keep short labels or use abbreviated text:
```css
@media (max-width: 768px) {
  .hero-toggle-btn span:not(.hero-toggle-icon) {
    /* Use abbreviated labels instead of hiding */
  }
}
```

In `index.html`, consider data attributes:
```html
<button data-mobile-label="Agent">
  <span class="hero-toggle-icon">🤖</span>
  <span class="hero-toggle-text">I'm an agent</span>
</button>
```

### 3.4 Why Visual Order on Mobile
**Location:** `styles.css` lines 698-703

```css
@media (max-width: 1024px) {
  .why-visual {
    order: -1;
  }
}
```

**Issue:** On tablet/mobile, the visual cards appear before the content text. This is backwards — users should read the "Why" copy before seeing agent cards.

**Recommendation:**
```css
@media (max-width: 1024px) {
  .why-visual {
    order: 1;  /* Keep after content, not before */
  }
}
```

---

## 4. Visual Balance Issues

### 4.1 Hero Section Information Architecture
**Location:** `index.html` lines 54-123

**Current structure:**
1. Badges + Toggle row
2. Main heading
3. Subtitle
4. Terminal preview
5. CTA buttons
6. Stats

**Issue:** The agent/human toggle is visually separated from the terminal it controls. Users must scan down past the heading and subtitle to understand the toggle's effect.

**Recommendation:** Move toggle closer to terminal OR restructure hero with side-by-side columns:
```
[ TITLE + SUBTITLE ]  |  [ TOGGLE + TERMINAL ]
```
This aligns with the task brief (hero redesign with side-by-side layout).

### 4.2 Terminal Preview Width
**Location:** `styles.css` line 215

```css
.hero-terminal {
  max-width: 600px;
}
```

**Issue:** Terminal is narrow (600px) within a 1200px container, creating excessive side whitespace. The terminal content (install commands) is short enough to fit comfortably wider.

**Recommendation:**
```css
.hero-terminal {
  max-width: 680px;  /* Slightly wider */
}
```

### 4.3 Showcase Section Feels Disconnected
**Location:** `index.html` lines 143-189

**Issue:** The SVG mockup in `.showcase` (lines 156-188) is a placeholder that doesn't match the actual screenshots below. This creates visual dissonance — users see a fake dashboard followed by real screenshots.

**Recommendation:** Either:
1. Replace SVG mockup with an actual `dashboard-overview.png` screenshot
2. Or remove the showcase section entirely (screenshots gallery below is sufficient)

### 4.4 Feature Grid Density
**Location:** `index.html` lines 247-277

**Issue:** 9 feature cards in a 3-column grid creates a wall of content. Users may experience choice paralysis.

**Recommendation:** 
- Group into 6 primary features (2 rows)
- Move remaining 3 to a secondary "Also includes..." row with smaller cards:
```css
.feature-card-secondary {
  padding: 20px;
  background: transparent;
  border-style: dashed;
}
```

### 4.5 Why Cards Animation Timing
**Location:** `styles.css` lines 459-490

**Issue:** The "why" cards have no entrance animation or stagger. They feel static compared to the polished dashboard reference screenshots showing active states.

**Recommendation:** Add subtle entrance animations:
```css
.why-card {
  opacity: 0;
  transform: translateX(-10px);
  animation: slideIn 0.4s ease forwards;
}

.why-card:nth-child(2) { animation-delay: 0.1s; }
.why-card:nth-child(3) { animation-delay: 0.2s; }
.why-card:nth-child(4) { animation-delay: 0.3s; }

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## 5. Accessibility Issues

### 5.1 Color Contrast
**Location:** `styles.css` lines 12-14

```css
--text-secondary: #a0a0b8;
--text-tertiary: #6b6b80;
```

**Issue:** `--text-tertiary` (#6b6b80) on `--bg-primary` (#0f0f14) has a contrast ratio of approximately 3.9:1, below WCAG AA requirements (4.5:1) for normal text.

**Recommendation:**
```css
--text-tertiary: #8585a0;  /* Lighter for better contrast */
```

### 5.2 Focus States Missing
**Location:** Throughout `styles.css`

**Issue:** Buttons and links lack visible focus states. Keyboard users cannot track their position.

**Recommendation:**
```css
.btn:focus-visible,
.nav-links a:focus-visible,
.hero-toggle-btn:focus-visible {
  outline: 2px solid var(--accent-indigo);
  outline-offset: 2px;
}
```

### 5.3 Skip Navigation Missing
**Location:** `index.html` line 22

**Issue:** No skip link for keyboard users to bypass navigation.

**Recommendation:** Add at top of `<body>`:
```html
<a href="#main" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
}

.skip-link:focus {
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
  padding: 12px 24px;
  background: var(--accent-indigo);
  color: white;
  z-index: 9999;
}
```

---

## 6. Code Quality & Maintainability

### 6.1 Magic Numbers
**Location:** Various

Multiple hard-coded pixel values (80px, 48px, 36px, etc.) appear throughout without clear relationship. Moving these to CSS variables would improve maintainability.

**Recommendation:** Establish a spacing scale:
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-30: 120px;
}
```

### 6.2 Duplicate Gradient Definitions
**Location:** `index.html` lines 27-35, 533-541

The nav and footer logos define identical SVG gradients (`nav-s1`/`nav-s2` and `ft-s1`/`ft-s2`). This could be consolidated.

**Recommendation:** Define gradients once in a `<defs>` block at document start, or extract to an external SVG sprite.

---

## 7. Priority Action Items

### Immediate (Before Hero Redesign)
1. [ ] Fix text-tertiary contrast ratio
2. [ ] Add focus-visible states to interactive elements
3. [ ] Standardize section padding to 120px

### Short Term (With Hero Redesign)
4. [ ] Restructure hero with side-by-side columns
5. [ ] Add tablet breakpoint (900px)
6. [ ] Improve toggle visibility on mobile
7. [ ] Replace showcase SVG with real screenshot

### Medium Term (Polish)
8. [ ] Establish and apply spacing scale variables
9. [ ] Add entrance animations to Why section cards
10. [ ] Group features into primary/secondary tiers
11. [ ] Add hamburger menu for mobile nav

---

## Appendix: Line References

| Issue | File | Lines |
|-------|------|-------|
| Section padding variance | styles.css | 187, 348, 437, 505, 565, 639 |
| Hero stats spacing | styles.css | 282-293 |
| Feature card padding | styles.css | 379-398 |
| Why grid gap | styles.css | 407-410 |
| Heading size inconsistency | styles.css | 270, 362, 420, 622 |
| Missing tablet breakpoint | styles.css | 696-778 |
| Nav links hidden early | styles.css | 700 |
| Hero toggle text hidden | styles.css | 717-724 |
| Why visual order | styles.css | 698-703 |
| Hero terminal width | styles.css | 215 |
| Text tertiary contrast | styles.css | 14 |
| Hero structure | index.html | 54-123 |
| Showcase SVG | index.html | 143-189 |
| Feature cards | index.html | 247-277 |
| Duplicate gradients | index.html | 27-35, 533-541 |

---

*This audit provides the foundation for Tasks 2 (Hero Section Redesign) and 3 (Implement Audit Improvements).*
