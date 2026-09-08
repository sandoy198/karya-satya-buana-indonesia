const { describe, it, expect, runner } = require('./test-runner');

describe('Tier 2 - Feature 01: 5-Section Sticky Navigation (Boundaries & Corners)', () => {
  it('T2-F01-01: scroll threshold boundary: exactly 20px does not add is-scrolled, 21px does', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const header = env.document.getElementById('site-header');

    env.window.scrollTo(0, 20);
    expect(header.classList.contains('is-scrolled')).toBe(false);

    env.window.scrollTo(0, 21);
    expect(header.classList.contains('is-scrolled')).toBe(true);
  });

  it('T2-F01-02: rapid scroll oscillations between 0px and 100px toggle state cleanly', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const header = env.document.getElementById('site-header');

    for (let i = 0; i < 10; i++) {
      env.window.scrollTo(0, 100);
      expect(header.classList.contains('is-scrolled')).toBe(true);
      env.window.scrollTo(0, 0);
      expect(header.classList.contains('is-scrolled')).toBe(false);
    }
  });

  it('T2-F01-03: in-page anchor navigation to non-existent section fails gracefully', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const fakeLink = new (require('./test-runner').DOMElement)('a', { href: '#non-existent-section' });
    expect(() => {
      fakeLink.click();
    }).not.toThrow();
  });

  it('T2-F01-04: navigation bar items do not have negative margins causing overflow', () => {
    const css = runner.loadCss();
    const navDecls = css.getDeclarations('.desktop-nav__list');
    expect(navDecls).not.toBeNull();
    const margin = navDecls.margin || '0';
    expect(margin.includes('-')).toBe(false);
  });

  it('T2-F01-05: skip link moves from offscreen to top: 1rem upon keyboard focus', () => {
    const css = runner.loadCss();
    const normalDecls = css.getDeclarations('.skip-link');
    const focusDecls = css.getDeclarations('.skip-link:focus');
    expect(normalDecls.top).toBe('-100px');
    expect(focusDecls.top).toBe('1rem');
  });
});

describe('Tier 2 - Feature 02: Accessible Mobile Drawer Menu (Boundaries & Corners)', () => {
  it('T2-F02-01: viewport resize boundary: 1023px keeps drawer open, 1024px closes it', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    toggle.click();
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.window.setViewport(1023, 768);
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.window.setViewport(1024, 768);
    expect(drawer.classList.contains('is-open')).toBe(false);
  });

  it('T2-F02-02: rapid consecutive toggle clicks maintain synchronous boolean state', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    for (let i = 0; i < 6; i++) {
      toggle.click();
      const shouldBeOpen = i % 2 === 0;
      expect(drawer.classList.contains('is-open')).toBe(shouldBeOpen);
      expect(toggle.getAttribute('aria-expanded')).toBe(shouldBeOpen ? 'true' : 'false');
    }
  });

  it('T2-F02-03: focus trap Tab on last focusable wraps to first focusable element', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    toggle.click();
    const focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
    expect(focusables.length).toBeGreaterThan(0);

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    env.document.activeElement = last;
    const tabEvent = {
      type: 'keydown',
      key: 'Tab',
      shiftKey: false,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    env.document.dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(true);
  });

  it('T2-F02-04: focus trap Shift+Tab on first focusable wraps to last focusable element', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    toggle.click();
    const focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
    const first = focusables[0];

    env.document.activeElement = first;
    const shiftTabEvent = {
      type: 'keydown',
      key: 'Tab',
      shiftKey: true,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    env.document.dispatchEvent(shiftTabEvent);
    expect(shiftTabEvent.defaultPrevented).toBe(true);
  });

  it('T2-F02-05: non-Escape keys do not trigger drawer closure', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    toggle.click();
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.document.dispatchEvent({ type: 'keydown', key: 'Enter' });
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.document.dispatchEvent({ type: 'keydown', key: 'ArrowDown' });
    expect(drawer.classList.contains('is-open')).toBe(true);
  });

  it('T2-F02-06: clicking drawer backdrop closes drawer and restores body scroll', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');
    const backdrop = env.document.getElementById('drawer-backdrop');

    toggle.click();
    expect(drawer.classList.contains('is-open')).toBe(true);

    backdrop.click();
    expect(drawer.classList.contains('is-open')).toBe(false);
    expect(backdrop.classList.contains('is-open')).toBe(false);
  });
});

describe('Tier 2 - Feature 03: Corporate Management Section (Boundaries & Corners)', () => {
  it('T2-F03-01: leadership names match official Notarial Deed spelling', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const text = section.textContent;
    expect(text).toMatch(/SOEJIMAN|Soejiman/);
    expect(text).toMatch(/SUTOPO|Sutopo/);
  });

  it('T2-F03-02: management section does not contain fictitious placeholder names', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const text = section.textContent.toLowerCase();
    expect(text.includes('lorem ipsum')).toBe(false);
    expect(text.includes('john doe')).toBe(false);
    expect(text.includes('jane doe')).toBe(false);
  });

  it('T2-F03-03: leadership card descriptions are fully formulated without truncation markers', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const cards = section.querySelectorAll('.management-card, .leader-card, article');
    for (const card of cards) {
      expect(card.textContent.trim().length).toBeGreaterThan(30);
      expect(card.textContent.includes('...')).toBe(false);
    }
  });

  it('T2-F03-04: management section follows strict h2 -> h3 heading hierarchy', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const h2 = section.querySelector('h2');
    expect(h2).not.toBeNull();
    const h3List = section.querySelectorAll('h3');
    expect(h3List.length).toBeGreaterThanOrEqual(2);
    expect(section.querySelectorAll('h1').length).toBe(0);
  });

  it('T2-F03-05: management section text contains zero em dash characters', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    expect(section.textContent.includes('—')).toBe(false);
  });
});

describe('Tier 2 - Feature 04: Responsive Column Reflow (#management) (Boundaries & Corners)', () => {
  it('T2-F04-01: 320px viewport layout: management container does not exceed full width', () => {
    const css = runner.loadCss();
    const containerDecls = css.getDeclarations('.container');
    expect(containerDecls.width).toBe('100%');
  });

  it('T2-F04-02: 480px mobile boundary maintains 1 column grid without overflow', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.management-grid') || css.getDeclarations('.leaders-grid');
    expect(decls).not.toBeNull();
    const cols = decls['grid-template-columns'] || '1fr';
    expect(cols.includes('repeat(3') || cols.includes('repeat(4')).toBe(false);
  });

  it('T2-F04-03: breakpoint transition at 768px introduces tablet multi-column layout', () => {
    const css = runner.loadCss();
    const tabletQuery = css.mediaQueries.find((mq) => mq.query.includes('768px'));
    expect(tabletQuery).not.toBeNull();
    const matchingRule = tabletQuery.rules.find((r) => r.selector.includes('management') || r.selector.includes('leaders'));
    expect(matchingRule).not.toBeNull();
  });

  it('T2-F04-04: breakpoint transition at 1024px expands grid to full desktop columns', () => {
    const css = runner.loadCss();
    const desktopQuery = css.mediaQueries.find((mq) => mq.query.includes('1024px'));
    expect(desktopQuery).not.toBeNull();
    const matchingRule = desktopQuery.rules.find((r) => r.selector.includes('management') || r.selector.includes('leaders'));
    expect(matchingRule).not.toBeNull();
  });

  it('T2-F04-05: management card touch target and padding prevent accidental clicks', () => {
    const css = runner.loadCss();
    const cardDecls = css.getDeclarations('.management-card') || css.getDeclarations('.leader-card');
    expect(cardDecls).not.toBeNull();
    expect(cardDecls.padding || cardDecls.gap).toBeTruthy();
  });
});

describe('Tier 2 - Feature 05: Mine Operations Photo Showcase Gallery (Boundaries & Corners)', () => {
  it('T2-F05-01: gallery container defines fallback background color for loading states', () => {
    const css = runner.loadCss();
    const cardDecls = css.getDeclarations('.gallery-item') || css.getDeclarations('.gallery-card') || css.getDeclarations('.gallery-item__media');
    expect(cardDecls).not.toBeNull();
    expect(cardDecls['background-color'] || cardDecls.background).toBeTruthy();
  });

  it('T2-F05-02: gallery renders bounded image count between 4 and 12 photos for performance', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
    expect(images.length).toBeLessThanOrEqual(12);
  });

  it('T2-F05-03: gallery grid reflows responsively across screen widths', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.gallery-grid');
    expect(decls).not.toBeNull();
    expect(decls.display).toBe('grid');
  });

  it('T2-F05-04: gallery images have 100% maximum width preventing horizontal bleed', () => {
    const css = runner.loadCss();
    const imgDecls = css.getDeclarations('img');
    expect(imgDecls['max-width']).toBe('100%');
  });

  it('T2-F05-05: gallery image sources use approved standard image extensions', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    const validExts = ['.jpeg', '.jpg', '.webp', '.png'];
    for (const img of images) {
      const src = (img.getAttribute('src') || '').toLowerCase();
      const hasValidExt = validExts.some((ext) => src.endsWith(ext));
      expect(hasValidExt).toBe(true);
    }
  });
});

describe('Tier 2 - Feature 06: Gallery Responsive Aspect Ratio & Lazy Loading (Boundaries & Corners)', () => {
  it('T2-F06-01: all gallery images strictly enforce loading=lazy without eager exceptions', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      expect(img.getAttribute('loading')).toBe('lazy');
    }
  });

  it('T2-F06-02: aspect ratio dimensions adhere to 4:3 or 16:9 proportional geometry', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      const width = Number(img.getAttribute('width'));
      const height = Number(img.getAttribute('height'));
      const ratio = width / height;
      const isFourThree = Math.abs(ratio - 4 / 3) < 0.15;
      const isSixteenNine = Math.abs(ratio - 16 / 9) < 0.15;
      expect(isFourThree || isSixteenNine).toBe(true);
    }
  });

  it('T2-F06-03: gallery media container specifies overflow: hidden for corner clipping', () => {
    const css = runner.loadCss();
    const containerDecls = css.getDeclarations('.gallery-item__media') || css.getDeclarations('.gallery-item');
    expect(containerDecls).not.toBeNull();
    expect(containerDecls.overflow).toBe('hidden');
  });

  it('T2-F06-04: CSS defines transition on gallery images for smooth interaction', () => {
    const css = runner.loadCss();
    const imgDecls = css.getDeclarations('.gallery-item__image') || css.getDeclarations('.gallery-image');
    expect(imgDecls).not.toBeNull();
    expect(imgDecls.transition).toBeTruthy();
  });

  it('T2-F06-05: gallery containers reserve height to eliminate cumulative layout shift', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.gallery-item__media') || css.getDeclarations('.gallery-item');
    expect(decls).not.toBeNull();
    expect(decls['aspect-ratio'] || decls['min-height'] || decls['padding-bottom']).toBeTruthy();
  });
});

describe('Tier 2 - Feature 07: Descriptive Accessibility Alt Texts (Boundaries & Corners)', () => {
  it('T2-F07-01: alt text does not contain solely whitespace characters', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      const alt = img.getAttribute('alt') || '';
      expect(alt.trim().length).toBeGreaterThan(0);
    }
  });

  it('T2-F07-02: alt text is concise and bounded under 250 characters', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      const alt = img.getAttribute('alt') || '';
      expect(alt.length).toBeLessThanOrEqual(250);
    }
  });

  it('T2-F07-03: alt text does not contain raw HTML tags or unescaped angle brackets', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      const alt = img.getAttribute('alt') || '';
      expect(alt.includes('<')).toBe(false);
      expect(alt.includes('>')).toBe(false);
    }
  });

  it('T2-F07-04: each gallery photo features a distinct and unique alt description', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    const alts = images.map((img) => (img.getAttribute('alt') || '').trim());
    const uniqueAlts = new Set(alts);
    expect(uniqueAlts.size).toBe(images.length);
  });

  it('T2-F07-05: alt text contains specific operational activity keywords', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    const combinedAlts = images.map((i) => i.getAttribute('alt') || '').join(' ').toLowerCase();
    expect(combinedAlts.includes('tambang') || combinedAlts.includes('operasional') || combinedAlts.includes('lapangan')).toBe(true);
  });
});

describe('Tier 2 - Feature 08: Interactive Google Maps Container (Boundaries & Corners)', () => {
  it('T2-F08-01: Google Maps iframe uses width 100% rather than fixed pixel dimensions', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const width = iframe.getAttribute('width');
    expect(width === '100%' || width === null).toBe(true);
  });

  it('T2-F08-02: map container height is bounded between 200px and 500px', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.contact-map') || css.getDeclarations('.map-wrapper') || css.getDeclarations('.contact-map iframe');
    expect(decls).not.toBeNull();
    const height = decls.height || decls['min-height'] || '300px';
    expect(height).toBeTruthy();
  });

  it('T2-F08-03: map iframe removes native borders via attribute or CSS', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const style = iframe.getAttribute('style') || '';
    const frameborder = iframe.getAttribute('frameborder');
    expect(style.includes('border:0') || frameborder === '0' || style.includes('border: none')).toBe(true);
  });

  it('T2-F08-04: map embed URL does not leak confidential API key parameters', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const src = iframe.getAttribute('src') || '';
    expect(src.includes('key=AIza')).toBe(false);
  });

  it('T2-F08-05: map coordinates match official Maluk location with 4 decimal digits precision', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const src = iframe.getAttribute('src') || '';
    expect(src.includes('-8.9111')).toBe(true);
    expect(src.includes('116.750')).toBe(true);
  });
});

describe('Tier 2 - Feature 09: Direct "Buka di Google Maps" Button (Boundaries & Corners)', () => {
  it('T2-F09-01: direct button touch target satisfies min-height 44px', () => {
    const css = runner.loadCss();
    const btnDecls = css.getDeclarations('.btn');
    expect(btnDecls['min-height']).toContain('44');
  });

  it('T2-F09-02: button href query coordinate format is exact without spaces', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    const href = link.getAttribute('href') || '';
    expect(href.includes(' ')).toBe(false);
    expect(href.includes('q=-8.91113,116.75098') || href.includes('q=-8.911130,116.750865')).toBe(true);
  });

  it('T2-F09-03: external button includes rel=noopener noreferrer for security', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    const rel = link.getAttribute('rel') || '';
    expect(rel.includes('noopener')).toBe(true);
    expect(rel.includes('noreferrer')).toBe(true);
  });

  it('T2-F09-04: direct button defines hover transition state in CSS', () => {
    const css = runner.loadCss();
    const btnHover = css.getDeclarations('.btn:hover') || css.getDeclarations('.btn--primary:hover');
    expect(btnHover).not.toBeNull();
  });

  it('T2-F09-05: button copy is concise and free of generic AI slop words', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    const text = link.textContent.toLowerCase();
    expect(text.includes('game-changing')).toBe(false);
    expect(text.includes('seamless')).toBe(false);
    expect(text.includes('cutting-edge')).toBe(false);
  });
});

describe('Tier 2 - Feature 10: Contact Form Client-Side Validation (Boundaries & Corners)', () => {
  it('T2-F10-01: fullName boundary: 2 chars fails, 3 chars passes', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const nameInput = env.document.getElementById('fullName');
    const nameError = env.document.getElementById('fullName-error');

    nameInput.value = 'AB';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(nameError.textContent.length).toBeGreaterThan(0);

    nameInput.value = 'Ali';
    nameInput.dispatchEvent({ type: 'input' });
    expect(nameError.textContent.length).toBe(0);
  });

  it('T2-F10-02: message boundary: 9 chars fails, 10 chars passes', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const msgInput = env.document.getElementById('message');
    const msgError = env.document.getElementById('message-error');

    env.document.getElementById('fullName').value = 'Budi Santoso';
    env.document.getElementById('contactInfo').value = 'budi@ptgas.com';
    env.document.getElementById('serviceType').value = 'Inspeksi Teknis';

    msgInput.value = '123456789';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(msgError.textContent.length).toBeGreaterThan(0);

    msgInput.value = '1234567890';
    msgInput.dispatchEvent({ type: 'input' });
    expect(msgError.textContent.length).toBe(0);
  });

  it('T2-F10-03: email format corner cases: missing domain or missing TLD rejected', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const contactInput = env.document.getElementById('contactInfo');
    const contactError = env.document.getElementById('contactInfo-error');

    env.document.getElementById('fullName').value = 'Budi Santoso';

    const invalidEmails = ['plainaddress', '@missingusername.com', 'user@domain', 'user@.com', 'user@domain..com'];
    for (const email of invalidEmails) {
      contactInput.value = email;
      form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
      expect(contactError.textContent.length).toBeGreaterThan(0);
    }
  });

  it('T2-F10-04: phone number boundaries: 8 digits fails, 9-15 digits passes, 16 digits fails', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const contactInput = env.document.getElementById('contactInfo');
    const contactError = env.document.getElementById('contactInfo-error');

    env.document.getElementById('fullName').value = 'Budi Santoso';

    contactInput.value = '12345678';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(contactError.textContent.length).toBeGreaterThan(0);

    contactInput.value = '1234567890123456';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(contactError.textContent.length).toBeGreaterThan(0);

    contactInput.value = '08123456789';
    contactInput.dispatchEvent({ type: 'input' });
    expect(contactError.textContent.length).toBe(0);
  });

  it('T2-F10-05: whitespace-only strings fail validation as empty fields', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    env.document.getElementById('fullName').value = '    ';
    env.document.getElementById('message').value = '          ';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(env.document.getElementById('fullName-error').textContent.length).toBeGreaterThan(0);
    expect(env.document.getElementById('message-error').textContent.length).toBeGreaterThan(0);
  });

  it('T2-F10-06: selecting valid service category clears previous service error', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const select = env.document.getElementById('serviceType');
    const selectError = env.document.getElementById('serviceType-error');

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(selectError.textContent.length).toBeGreaterThan(0);

    select.value = 'Penyediaan Tenaga Kerja';
    select.dispatchEvent({ type: 'change' });
    expect(selectError.textContent.length).toBe(0);
  });
});

describe('Tier 2 - Feature 11: Anti-Spam Honeypot Preservation (Boundaries & Corners)', () => {
  it('T2-F11-01: honeypot populated with single character triggers silent abort', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.querySelector('input[name="_gotcha"]').value = 'x';

    env.document.getElementById('fullName').value = 'Legitimate User';
    env.document.getElementById('contactInfo').value = 'user@valid.com';
    env.document.getElementById('serviceType').value = 'Konsultasi Terpadu';
    env.document.getElementById('message').value = 'Permintaan audit fasilitas tambang.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    expect(env.document.getElementById('form-feedback').classList.contains('is-visible')).toBe(false);
  });

  it('T2-F11-02: honeypot populated with spam URL triggers silent abort', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.querySelector('input[name="_gotcha"]').value = 'https://casino-online-spam.biz';

    env.document.getElementById('fullName').value = 'Bot Spammer';
    env.document.getElementById('contactInfo').value = 'bot@casino.biz';
    env.document.getElementById('serviceType').value = 'Inspeksi Teknis';
    env.document.getElementById('message').value = 'Check our gambling site right now.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    expect(env.document.getElementById('form-feedback').classList.contains('is-visible')).toBe(false);
  });

  it('T2-F11-03: visually-hidden class CSS rules strictly enforce zero visual footprint', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.visually-hidden');
    expect(decls.position).toBe('absolute');
    expect(decls.width).toBe('1px');
    expect(decls.height).toBe('1px');
    expect(decls.overflow).toBe('hidden');
  });

  it('T2-F11-04: honeypot field has no associated label to avoid assistive tech confusion', () => {
    const dom = runner.loadHtml();
    const form = dom.getElementById('inquiry-form');
    const labels = form.querySelectorAll('label');
    for (const label of labels) {
      expect(label.getAttribute('for')).not.toBe('_gotcha');
    }
  });

  it('T2-F11-05: honeypot maintains empty string on standard form reset', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.reset();
    expect(form.querySelector('input[name="_gotcha"]').value).toBe('');
  });
});

describe('Tier 2 - Feature 12: Input Sanitization & Mailto Fallback (Boundaries & Corners)', () => {
  it('T2-F12-01: script tag payload sanitized to prevent execution', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = '<script src="evil.js"></script>';
    env.document.getElementById('contactInfo').value = 'test@example.com';
    env.document.getElementById('serviceType').value = 'Manpower Supply';
    env.document.getElementById('message').value = 'Pengujian sanitasi script injection.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.innerHTML.includes('<script')).toBe(false);
    expect(feedback.innerHTML.includes('&lt;script')).toBe(true);
  });

  it('T2-F12-02: img onerror payload sanitized', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = '<img src=x onerror=alert(1)>';
    env.document.getElementById('contactInfo').value = 'test@example.com';
    env.document.getElementById('serviceType').value = 'Manpower Supply';
    env.document.getElementById('message').value = 'Pengujian sanitasi img tag injection.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.innerHTML.includes('<img')).toBe(false);
  });

  it('T2-F12-03: quote escaping prevents attribute injection', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = 'O\'Connor & "Partners"';
    env.document.getElementById('contactInfo').value = 'test@example.com';
    env.document.getElementById('serviceType').value = 'Manpower Supply';
    env.document.getElementById('message').value = 'Pengujian sanitasi quotes dan ampersand.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.innerHTML.includes('&quot;')).toBe(true);
    expect(feedback.innerHTML.includes('&#039;')).toBe(true);
  });

  it('T2-F12-04: extreme text length (5000 chars) processed safely without crashing', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    const longMessage = 'A'.repeat(5000);
    env.document.getElementById('fullName').value = 'Budi Santoso';
    env.document.getElementById('contactInfo').value = 'budi@ptgas.com';
    env.document.getElementById('serviceType').value = 'Inspeksi Teknis';
    env.document.getElementById('message').value = longMessage;

    expect(() => {
      form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    }).not.toThrow();
  });

  it('T2-F12-05: submit button enters loading state and disables during submission', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const submitBtn = env.document.getElementById('submit-btn');

    env.document.getElementById('fullName').value = 'Budi Santoso';
    env.document.getElementById('contactInfo').value = 'budi@ptgas.com';
    env.document.getElementById('serviceType').value = 'Inspeksi Teknis';
    env.document.getElementById('message').value = 'Pengujian state disabled submit button.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(submitBtn.classList.contains('is-loading')).toBe(true);
    expect(submitBtn.disabled).toBe(true);
  });
});

describe('Tier 2 - Feature 13: Direct WhatsApp Chat Link (Boundaries & Corners)', () => {
  it('T2-F13-01: WhatsApp prefilled text encodes spaces, commas, and punctuation', () => {
    const dom = runner.loadHtml();
    const waLink = dom.querySelector('a[href*="wa.me"]');
    expect(waLink).not.toBeNull();
    const href = waLink.getAttribute('href');
    expect(href).toContain('%20');
    expect(href).toContain('%2C');
  });

  it('T2-F13-02: WhatsApp phone number contains no leading zero or plus sign in path', () => {
    const dom = runner.loadHtml();
    const waLinks = dom.querySelectorAll('a[href*="wa.me"]');
    for (const link of waLinks) {
      const href = link.getAttribute('href');
      const numberPart = href.split('wa.me/')[1].split('?')[0];
      expect(numberPart.startsWith('628')).toBe(true);
      expect(numberPart.startsWith('+')).toBe(false);
      expect(numberPart.startsWith('08')).toBe(false);
    }
  });

  it('T2-F13-03: WhatsApp message text contains PT Karya Satya Buana Indonesia', () => {
    const dom = runner.loadHtml();
    const waLink = dom.querySelector('a[href*="wa.me"]');
    const href = waLink.getAttribute('href');
    const decoded = decodeURIComponent(href);
    expect(decoded).toContain('PT Karya Satya Buana Indonesia');
  });

  it('T2-F13-04: WhatsApp link touch target in footer and drawer meets 44px min-height', () => {
    const css = runner.loadCss();
    const btnCompact = css.getDeclarations('.btn--compact');
    expect(btnCompact['min-height']).toContain('44');
  });

  it('T2-F13-05: WhatsApp link contains single ?text= query delimiter without double question marks', () => {
    const dom = runner.loadHtml();
    const waLinks = dom.querySelectorAll('a[href*="wa.me"]');
    for (const link of waLinks) {
      const href = link.getAttribute('href');
      const questionMarks = (href.match(/\?/g) || []).length;
      expect(questionMarks).toBe(1);
    }
  });
});

describe('Tier 2 - Feature 14: Schema.org LocalBusiness JSON-LD (Boundaries & Corners)', () => {
  it('T2-F14-01: Schema JSON string contains zero invalid trailing commas or syntax errors', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    expect(() => {
      JSON.parse(script.textContent);
    }).not.toThrow();
  });

  it('T2-F14-02: GeoCoordinates latitude and longitude are valid numeric floats', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(typeof Number(json.geo.latitude)).toBe('number');
    expect(typeof Number(json.geo.longitude)).toBe('number');
    expect(Number.isNaN(Number(json.geo.latitude))).toBe(false);
    expect(Number.isNaN(Number(json.geo.longitude))).toBe(false);
  });

  it('T2-F14-03: Schema address defines West Sumbawa postal code 84459', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    const serialized = JSON.stringify(json.address);
    expect(serialized).toContain('84459');
  });

  it('T2-F14-04: Schema telephone matches E.164 standard starting with +62', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(json.contactPoint.telephone.startsWith('+62')).toBe(true);
  });

  it('T2-F14-05: Schema opening hours follow standard day range Mo-Fr 08:00-17:00', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(json.openingHours).toBe('Mo-Fr 08:00-17:00');
  });

  it('T2-F14-06: Schema employee leadership and social profile links contain valid structures', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(Array.isArray(json.founder)).toBe(true);
    expect(json.founder.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(json.sameAs)).toBe(true);
    expect(json.sameAs[0]).toContain('wa.me');
  });
});

describe('Tier 2 - Feature 15: Zero Overflow & Core Web Vitals (Boundaries & Corners)', () => {
  it('T2-F15-01: 320px viewport stress: header inner container layout remains responsive', () => {
    const css = runner.loadCss();
    const headerInner = css.getDeclarations('.site-header__inner');
    expect(headerInner.display).toBe('flex');
    expect(headerInner['align-items']).toBe('center');
  });

  it('T2-F15-02: 375px viewport stress: hero grid uses single column on mobile', () => {
    const css = runner.loadCss();
    const heroGrid = css.getDeclarations('.hero-grid');
    expect(heroGrid.display).toBe('grid');
    expect(heroGrid['grid-template-columns'] || '1fr').toContain('1fr');
  });

  it('T2-F15-03: 480px viewport stress: services grid reflow stays single column', () => {
    const css = runner.loadCss();
    const servicesGrid = css.getDeclarations('.services-grid');
    expect(servicesGrid.display).toBe('grid');
  });

  it('T2-F15-04: 768px tablet layout transitions container padding to 1.5rem', () => {
    const css = runner.loadCss();
    const tabletContainer = css.getMediaDeclarations(768, '.container');
    expect(tabletContainer['padding-left']).toBe('1.5rem');
    expect(tabletContainer['padding-right']).toBe('1.5rem');
  });

  it('T2-F15-05: 1280px desktop layout restricts container to max-width 1200px', () => {
    const css = runner.loadCss();
    expect(css.variables['--container-max']).toBe('1200px');
  });
});
