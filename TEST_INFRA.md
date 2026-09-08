# Test Infrastructure & Quality Assurance Architecture
**PT Karya Satya Buana Indonesia (Company Profile - Paket A)**

Document Version: 2.0 (Gen 2 E2E Verification Suite)  
Author: test_writer_e2e_gen2  
Scope: Opaque-Box E2E Testing Tiers 1–4 for all 15 Features in `PROJECT.md`

---

## 1. Test Architecture & Design Principles

### 1.1 Zero-Dependency Standalone Runner
The test framework is completely self-contained in `tests/test-runner.js` and requires no external npm packages (`node_modules`). It executes directly in modern Node.js runtimes using built-in modules (`fs`, `path`, `vm`).

```
tests/
├── test-runner.js          # Core test engine, HTML/DOM parser, CSS rulebook analyzer, assertion library
├── tier1-features.test.js    # Tier 1: Feature Coverage (>=5 tests per feature for 15 features = 78 tests)
├── tier2-boundaries.test.js  # Tier 2: Boundary & Corner Cases (>=5 tests per feature = 78 tests)
├── tier3-combinations.test.js# Tier 3: Cross-Feature Combinations & Integrations (15 tests)
└── tier4-scenarios.test.js   # Tier 4: Real-World End-to-End User Journeys (10 tests)
```

### 1.2 Core Components of the Test Engine
1. **Lightweight In-Memory DOM Parser (`DOMDocument`, `DOMElement`)**:
   - Parses `index.html` into a full tree of Element nodes.
   - Implements standards-compliant query selector engine supporting tag names, IDs (`#id`), classes (`.class`), attribute selectors (`[attr]`, `[attr="val"]`, `[attr*="val"]`), child selectors (`>`), and descendant selectors (`a b`).
   - Implements `classList` (`add`, `remove`, `contains`, `toggle`), `attributes` map, `style` properties, `value`, `name`, `type`, `checked`, `disabled`, `textContent`, `innerHTML`, and `outerHTML`.
   - Provides DOM event simulation: `addEventListener`, `removeEventListener`, `dispatchEvent`, `click()`, `focus()`, and `blur()`.
2. **Window & Document Environment (`DOMWindow`)**:
   - Simulates viewport dimensions (`innerWidth`, `innerHeight`, `setViewport(w, h)`).
   - Simulates scroll coordinates (`scrollY`, `scrollTo(x, y)`).
   - Manages active keyboard focus tracking (`document.activeElement`).
3. **CSS Rulebook Parser (`CSSRuleBook`)**:
   - Extracts CSS custom properties (`:root` variables) from `assets/css/style.css`.
   - Parses base declaration blocks and selector mappings.
   - Parses media queries (`@media (min-width: 768px)`, `@media (min-width: 1024px)`) and verifies responsive layout reflows.
4. **Isolated JS Sandbox Execution**:
   - Loads `assets/js/main.js` in a secure Node `vm` context against the simulated DOM.
   - Verifies real event listeners, honeypot filters, input sanitization, dynamic focus traps, and form lifecycle transitions.
5. **Fluent Assertion Engine (`Expectation`)**:
   - Type-safe assertions: `toBe`, `toEqual`, `toBeNull`, `toBeDefined`, `toBeTruthy`, `toBeFalsy`, `toContain`, `toMatch`, `toBeGreaterThan`, `toBeLessThan`, and negated forms (`.not.*`).

---

## 2. Test Tier Definitions & Methodology

| Tier | Name | Target Scope | Minimum Threshold | Delivered Count |
|------|------|--------------|-------------------|-----------------|
| **Tier 1** | Feature Coverage | Primary behaviors, DOM presence, attributes, and core contracts for all 15 features | >= 5 tests per feature (>= 75 tests) | **78 tests** |
| **Tier 2** | Boundary & Corner Cases | Boundary inputs, extreme string lengths, invalid emails/phones, 320px–1280px viewports, overflow detection, XSS injections, spambot honeypot triggers | >= 5 tests per feature (>= 75 tests) | **78 tests** |
| **Tier 3** | Cross-Feature Combinations | Interactions between multiple features (navbar + smooth scroll, drawer + resize, service card + form auto-fill, map embed + external link, schema + DOM parity) | >= 15 integration tests | **15 tests** |
| **Tier 4** | Real-World Scenarios | Complete end-to-end multi-step user flows (smartphone discovery, corporate procurement audit, K3 safety inspection, adversarial spambot mitigation, keyboard navigation) | >= 10 end-to-end flows | **10 tests** |
| **Total** | Full E2E Test Suite | Exhaustive coverage across the entire application lifecycle | >= 175 tests | **181 tests** |

---

## 3. Feature Coverage & Traceability Matrix

Authoritative sources: `ORIGINAL_REQUEST.md`, `PROJECT.md`, Akta Pendirian No. 13/2026, SK Menkumham AHU-0049654.AH.01.01.TAHUN 2026, KKKPR No. 13072610215207001.

| # | Feature Name | Milestone | Tier 1 Tests | Tier 2 Tests | Tier 3 & 4 Tests | Verification Criteria |
|---|--------------|-----------|--------------|--------------|-------------------|-----------------------|
| 1 | 5-Section Sticky Navigation | M1 | `T1-F01-01` .. `05` | `T2-F01-01` .. `05` | `T3-01`, `T3-13`, `T4-06` | Desktop navbar with 5 links (`#hero`, `#about`, `#services`, `#management`, `#contact`), sticky scroll toggle (>20px), focus management |
| 2 | Accessible Mobile Drawer Menu | M1 | `T1-F02-01` .. `06` | `T2-F02-01` .. `06` | `T3-02`, `T3-03`, `T4-01`, `T4-06` | Hamburger toggle, aria-expanded, dialog role, focus trap, Escape key, backdrop click, auto-close at >=1024px |
| 3 | Corporate Management Section | M1 | `T1-F03-01` .. `05` | `T2-F03-01` .. `05` | `T3-10`, `T4-02` | Section `#management`, Direktur Soejiman, Komisaris Sutopo, 3 operational pillars (SDM, Legal, Finance) |
| 4 | Responsive Column Reflow (#management) | M1 | `T1-F04-01` .. `05` | `T2-F04-01` .. `05` | `T4-09` | 1 column on <=480px, 2 columns on 768px, 3-4 columns on >=1024px, touch target >=44x44px |
| 5 | Mine Operations Photo Showcase Gallery | M2 | `T1-F05-01` .. `05` | `T2-F05-01` .. `05` | `T3-15`, `T4-03` | Section `#gallery`, 4-12 authentic photos from `docs/references/images/foto pekerja/` (earthing test, walkdown, K3) |
| 6 | Gallery Responsive Aspect Ratio & Lazy Loading | M2 | `T1-F06-01` .. `05` | `T2-F06-01` .. `05` | `T4-03` | Aspect ratios 4:3 / 16:9, `object-fit: cover`, `loading="lazy"`, explicit width/height preventing CLS (<0.1) |
| 7 | Descriptive Accessibility Alt Texts | M2 | `T1-F07-01` .. `05` | `T2-F07-01` .. `05` | `T4-03` | Non-empty descriptive alt text >=20 chars, zero AI slop phrases, operational equipment context |
| 8 | Interactive Google Maps Container | M3 | `T1-F08-01` .. `05` | `T2-F08-01` .. `05` | `T3-09`, `T3-11`, `T4-02` | Embed iframe in `#contact` with registered West Sumbawa coordinates (-8.91113, 116.75098), accessible title, `loading="lazy"` |
| 9 | Direct "Buka di Google Maps" Button | M3 | `T1-F09-01` .. `05` | `T2-F09-01` .. `05` | `T3-09`, `T4-02` | External button opening Google Maps in new tab (`_blank`, `noopener noreferrer`) with official coordinates |
| 10 | Contact Form Client-Side Validation | M3 | `T1-F10-01` .. `06` | `T2-F10-01` .. `06` | `T3-04`, `T3-05`, `T3-06`, `T4-01`, `T4-07` | Required fields, name min 3 chars, contactInfo email or 9-15 digit phone, message min 10 chars, inline aria error |
| 11 | Anti-Spam Honeypot Preservation | M3 | `T1-F11-01` .. `05` | `T2-F11-01` .. `05` | `T3-07`, `T4-05` | Hidden field `_gotcha` (`visually-hidden`, `tabindex="-1"`, `autocomplete="off"`), silent abort on bot spam |
| 12 | Input Sanitization & Mailto Fallback | M3 | `T1-F12-01` .. `05` | `T2-F12-01` .. `05` | `T3-08`, `T4-10` | HTML/XSS entity escaping, destination `info@karyasatyabuana.co.id`, polite live region, safe feedback |
| 13 | Direct WhatsApp Chat Link | M3 | `T1-F13-01` .. `05` | `T2-F13-01` .. `05` | `T3-12`, `T4-04` | Link to `https://wa.me/6282236881925` with `encodeURIComponent` prefilled greeting, external tab, contact & drawer presence |
| 14 | Schema.org LocalBusiness JSON-LD | M4 | `T1-F14-01` .. `06` | `T2-F14-01` .. `05` | `T3-10`, `T3-11`, `T4-08` | `LocalBusiness` JSON-LD, GeoCoordinates (-8.91113, 116.75098), postal address Maluk Sumbawa Barat, Soejiman & Sutopo |
| 15 | Zero Overflow & Core Web Vitals | M4 | `T1-F15-01` .. `05` | `T2-F15-01` .. `05` | `T4-09` | CSS `overflow-x: clip`, container max-width 1200px, touch target >=44x44px, single `h1`, responsive images |

---

## 4. How to Execute the Test Suite

### 4.1 Running the Entire Test Suite
Run the test runner from the workspace root:

```powershell
node tests/test-runner.js
```

### 4.2 Running Specific Test Tiers
To isolate a single test tier during development:

```powershell
# Run Tier 1 Feature Coverage suite
node tests/test-runner.js --tier=1

# Run Tier 2 Boundary and Corner Cases suite
node tests/test-runner.js --tier=2

# Run Tier 3 Cross-Feature Combinations suite
node tests/test-runner.js --tier=3

# Run Tier 4 Real-World Scenarios suite
node tests/test-runner.js --tier=4
```

### 4.3 Filtering by Test Suite Name
```powershell
node tests/test-runner.js --suite="Feature 10"
node tests/test-runner.js --suite="Mobile Drawer"
```

---

## 5. Implementation Status & Known Gaps (Pre-Implementation Baseline)

As an opaque-box test suite developed prior to feature completion for Milestones M1–M4, the suite acts as the authoritative test oracle:
- **Passing Tests**: Existing features in the prototype baseline (Form validation logic, Honeypot preservation, XSS sanitization, WhatsApp links, Sticky header scroll toggle, Mobile drawer base logic, Anti-overflow CSS, Single `<h1>`).
- **Failing Tests (Expected for uncompleted Milestones)**:
  - **M1 Gaps**: Section `#management` not yet added to `index.html`; "Manajemen" link missing from `.desktop-nav` and `.mobile-drawer__nav`; leadership profiles for Soejiman and Sutopo not yet rendered; responsive column reflow styles for `.management-grid` pending in CSS.
  - **M2 Gaps**: Section `#gallery` not yet added to `index.html`; mine operational photos from `docs/references/images/foto pekerja/` pending integration; aspect ratio and lazy loading for gallery cards pending.
  - **M3 Gaps**: Google Maps iframe embed and direct external button pending addition in `#contact`.
  - **M4 Gaps**: Schema.org JSON-LD pending enrichment with `geo` GeoCoordinates (-8.91113, 116.75098) and corporate leadership data.

When implementing agents complete Milestones M1–M4, running `node tests/test-runner.js` will verify 100% test passage across all 181 tests.
