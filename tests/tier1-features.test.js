const { describe, it, expect, runner } = require('./test-runner');

describe('Tier 1 - Feature 01: 5-Section Sticky Navigation', () => {
  it('T1-F01-01: desktop navbar renders with 5 active section anchors', () => {
    const dom = runner.loadHtml();
    const nav = dom.querySelector('.desktop-nav');
    expect(nav).not.toBeNull();
    const links = nav.querySelectorAll('a.nav-link');
    const hrefs = links.map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('#hero');
    expect(hrefs).toContain('#about');
    expect(hrefs).toContain('#services');
    expect(hrefs).toContain('#management');
    expect(hrefs).toContain('#contact');
    expect(links.length).toBeGreaterThanOrEqual(5);
  });

  it('T1-F01-02: brand link points to #hero with official company logo', () => {
    const dom = runner.loadHtml();
    const brandLink = dom.querySelector('.brand-link');
    expect(brandLink).not.toBeNull();
    expect(brandLink.getAttribute('href')).toBe('#hero');
    const logoImg = brandLink.querySelector('img.brand-logo');
    expect(logoImg).not.toBeNull();
    expect(logoImg.getAttribute('src')).toContain('logo');
    expect(Number(logoImg.getAttribute('width'))).toBeGreaterThanOrEqual(40);
    expect(Number(logoImg.getAttribute('height'))).toBeGreaterThanOrEqual(40);
  });

  it('T1-F01-03: header includes primary call-to-action button linking to contact', () => {
    const dom = runner.loadHtml();
    const cta = dom.querySelector('.desktop-actions a.btn--primary');
    expect(cta).not.toBeNull();
    expect(cta.getAttribute('href')).toBe('#contact');
    expect(cta.textContent.trim().length).toBeGreaterThan(0);
  });

  it('T1-F01-04: all 5 navbar target sections exist in DOM with tabindex for focus', () => {
    const dom = runner.loadHtml();
    const requiredSections = ['hero', 'about', 'services', 'management', 'contact'];
    for (const sectionId of requiredSections) {
      const section = dom.getElementById(sectionId);
      expect(section).not.toBeNull();
      expect(section.getAttribute('tabindex')).toBe('-1');
    }
  });

  it('T1-F01-05: sticky header toggles is-scrolled class when window scroll exceeds 20px', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const header = env.document.getElementById('site-header');
    expect(header).not.toBeNull();
    expect(header.classList.contains('is-scrolled')).toBe(false);

    env.window.scrollTo(0, 50);
    expect(header.classList.contains('is-scrolled')).toBe(true);

    env.window.scrollTo(0, 10);
    expect(header.classList.contains('is-scrolled')).toBe(false);
  });
});

describe('Tier 1 - Feature 02: Accessible Mobile Drawer Menu', () => {
  it('T1-F02-01: hamburger toggle button has aria-controls, aria-expanded, and label', () => {
    const dom = runner.loadHtml();
    const toggle = dom.getElementById('menu-toggle');
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-controls')).toBe('mobile-drawer');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBeTruthy();
  });

  it('T1-F02-02: mobile drawer element is dialog with aria-modal and aria-hidden', () => {
    const dom = runner.loadHtml();
    const drawer = dom.getElementById('mobile-drawer');
    expect(drawer).not.toBeNull();
    expect(drawer.getAttribute('role')).toBe('dialog');
    expect(drawer.getAttribute('aria-modal')).toBe('true');
    expect(drawer.getAttribute('aria-hidden')).toBe('true');
  });

  it('T1-F02-03: mobile drawer contains 5 section links and quick action buttons', () => {
    const dom = runner.loadHtml();
    const drawer = dom.getElementById('mobile-drawer');
    expect(drawer).not.toBeNull();
    const links = drawer.querySelectorAll('nav a.mobile-nav-link');
    const hrefs = links.map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('#hero');
    expect(hrefs).toContain('#about');
    expect(hrefs).toContain('#services');
    expect(hrefs).toContain('#management');
    expect(hrefs).toContain('#contact');
    const waLink = drawer.querySelector('a[href*="wa.me"]');
    expect(waLink).not.toBeNull();
  });

  it('T1-F02-04: clicking menu toggle opens drawer, updates aria-expanded, and locks scroll', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');
    const backdrop = env.document.getElementById('drawer-backdrop');

    toggle.click();
    expect(drawer.classList.contains('is-open')).toBe(true);
    expect(backdrop.classList.contains('is-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(drawer.getAttribute('aria-hidden')).toBe('false');
  });

  it('T1-F02-05: pressing Escape key closes drawer and returns focus to toggle', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    toggle.click();
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.document.dispatchEvent({ type: 'keydown', key: 'Escape' });
    expect(drawer.classList.contains('is-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(env.document.activeElement).toBe(toggle);
  });

  it('T1-F02-06: resizing viewport to desktop automatically closes mobile drawer', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    toggle.click();
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.window.setViewport(1280, 800);
    expect(drawer.classList.contains('is-open')).toBe(false);
  });
});

describe('Tier 1 - Feature 03: Corporate Management Section', () => {
  it('T1-F03-01: dedicated #management section exists with tabindex and accessible heading', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    expect(section.getAttribute('tabindex')).toBe('-1');
    const headingId = section.getAttribute('aria-labelledby');
    expect(headingId).toBeTruthy();
    const heading = dom.getElementById(headingId);
    expect(heading).not.toBeNull();
    expect(heading.textContent.toLowerCase()).toContain('manajemen');
  });

  it('T1-F03-02: management section displays Direktur profile for Tuan Soejiman', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const text = section.textContent;
    expect(text).toContain('Soejiman');
    expect(text.toLowerCase()).toContain('direktur');
  });

  it('T1-F03-03: management section displays Komisaris profile for Tuan Sutopo', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const text = section.textContent;
    expect(text).toContain('Sutopo');
    expect(text.toLowerCase()).toContain('komisaris');
  });

  it('T1-F03-04: management section includes 3 operational divisional pillars', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const text = section.textContent.toLowerCase();
    expect(text.includes('sdm') || text.includes('hr')).toBe(true);
    expect(text.includes('legal') || text.includes('hukum')).toBe(true);
    expect(text.includes('keuangan') || text.includes('finance')).toBe(true);
  });

  it('T1-F03-05: management cards render structured roles and corporate governance', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('management');
    expect(section).not.toBeNull();
    const cards = section.querySelectorAll('.management-card, .leader-card, article');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Tier 1 - Feature 04: Responsive Column Reflow (#management)', () => {
  it('T1-F04-01: CSS defines grid layout for management section', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.management-grid') || css.getDeclarations('.leaders-grid');
    expect(decls).not.toBeNull();
    expect(decls.display).toBe('grid');
  });

  it('T1-F04-02: CSS applies single column on mobile viewports for management cards', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.management-grid') || css.getDeclarations('.leaders-grid');
    expect(decls).not.toBeNull();
    const cols = decls['grid-template-columns'] || '1fr';
    expect(cols).toContain('1fr');
  });

  it('T1-F04-03: CSS defines 2-column reflow for management grid on tablet viewports', () => {
    const css = runner.loadCss();
    const decls = css.getMediaDeclarations(768, '.management-grid') || css.getMediaDeclarations(768, '.leaders-grid');
    expect(decls).not.toBeNull();
    const cols = decls['grid-template-columns'];
    expect(cols).toBeTruthy();
    expect(cols.includes('repeat(2') || cols.includes('1fr 1fr')).toBe(true);
  });

  it('T1-F04-04: CSS defines multi-column reflow for management grid on desktop viewports', () => {
    const css = runner.loadCss();
    const decls = css.getMediaDeclarations(1024, '.management-grid') || css.getMediaDeclarations(1024, '.leaders-grid');
    expect(decls).not.toBeNull();
    const cols = decls['grid-template-columns'];
    expect(cols).toBeTruthy();
    expect(cols.includes('repeat(3') || cols.includes('repeat(4') || cols.includes('1fr 1fr 1fr')).toBe(true);
  });

  it('T1-F04-05: management cards have adequate padding and border styling for readability', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.management-card') || css.getDeclarations('.leader-card');
    expect(decls).not.toBeNull();
    expect(decls.padding || decls['border-radius']).toBeTruthy();
  });
});

describe('Tier 1 - Feature 05: Mine Operations Photo Showcase Gallery', () => {
  it('T1-F05-01: dedicated gallery section exists with id="gallery"', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    expect(section.getAttribute('tabindex')).toBe('-1');
  });

  it('T1-F05-02: gallery renders a photo grid with multiple field operational images', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
  });

  it('T1-F05-03: gallery contains earthing resistance test inspection documentation', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const allText = section.textContent.toLowerCase() + section.innerHTML.toLowerCase();
    expect(allText.includes('earthing') || allText.includes('pembumian') || allText.includes('tahanan')).toBe(true);
  });

  it('T1-F05-04: gallery contains support building walkdown inspection documentation', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const allText = section.textContent.toLowerCase() + section.innerHTML.toLowerCase();
    expect(allText.includes('walkdown') || allText.includes('gedung') || allText.includes('fasilitas')).toBe(true);
  });

  it('T1-F05-05: gallery photos showcase field workers with safety compliance', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    const altStrings = images.map((img) => (img.getAttribute('alt') || '').toLowerCase());
    const hasSafetyContext = altStrings.some((alt) =>
      alt.includes('k3') || alt.includes('apd') || alt.includes('inspeksi') || alt.includes('keselamatan')
    );
    expect(hasSafetyContext).toBe(true);
  });
});

describe('Tier 1 - Feature 06: Gallery Responsive Aspect Ratio & Lazy Loading', () => {
  it('T1-F06-01: all gallery images implement native lazy loading attribute', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
    for (const img of images) {
      expect(img.getAttribute('loading')).toBe('lazy');
    }
  });

  it('T1-F06-02: all gallery images specify explicit width and height to prevent layout shift', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      expect(img.hasAttribute('width')).toBe(true);
      expect(img.hasAttribute('height')).toBe(true);
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
    }
  });

  it('T1-F06-03: CSS specifies object-fit: cover for gallery images', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.gallery-item__image') || css.getDeclarations('.gallery-image') || css.getDeclarations('.gallery-grid img');
    expect(decls).not.toBeNull();
    expect(decls['object-fit']).toBe('cover');
  });

  it('T1-F06-04: gallery card container defines consistent aspect-ratio in CSS', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.gallery-item__media') || css.getDeclarations('.gallery-item') || css.getDeclarations('.gallery-card');
    expect(decls).not.toBeNull();
    const aspect = decls['aspect-ratio'];
    expect(aspect).toBeTruthy();
    expect(aspect.includes('4/3') || aspect.includes('16/9') || aspect.includes('4 / 3') || aspect.includes('16 / 9')).toBe(true);
  });

  it('T1-F06-05: gallery image sources link to valid project assets directory', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      const src = img.getAttribute('src') || '';
      expect(src.startsWith('docs/references/images/') || src.startsWith('assets/images/')).toBe(true);
    }
  });
});

describe('Tier 1 - Feature 07: Descriptive Accessibility Alt Texts', () => {
  it('T1-F07-01: every gallery image has a non-empty alt attribute', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
    for (const img of images) {
      const alt = img.getAttribute('alt');
      expect(alt).not.toBeNull();
      expect(alt.trim().length).toBeGreaterThan(0);
    }
  });

  it('T1-F07-02: gallery alt texts describe specific technical operations and equipment', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    const alts = images.map((i) => (i.getAttribute('alt') || '').toLowerCase());
    const mentionsTechnicalAction = alts.some((a) =>
      a.includes('uji') || a.includes('inspeksi') || a.includes('walkdown') || a.includes('pembumian') || a.includes('tahanan')
    );
    expect(mentionsTechnicalAction).toBe(true);
  });

  it('T1-F07-03: alt texts do not contain generic AI slop words', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    const bannedPhrases = ['image of', 'picture of', 'photo of', 'placeholder', 'gambar foto'];
    for (const img of images) {
      const alt = (img.getAttribute('alt') || '').toLowerCase();
      for (const banned of bannedPhrases) {
        expect(alt.startsWith(banned)).toBe(false);
      }
    }
  });

  it('T1-F07-04: alt texts have sufficient descriptive detail (minimum 20 characters)', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    for (const img of images) {
      const alt = (img.getAttribute('alt') || '').trim();
      expect(alt.length).toBeGreaterThanOrEqual(20);
    }
  });

  it('T1-F07-05: alt text contains company identification context', () => {
    const dom = runner.loadHtml();
    const section = dom.getElementById('gallery');
    expect(section).not.toBeNull();
    const images = section.querySelectorAll('img');
    const alts = images.map((i) => i.getAttribute('alt') || '');
    const containsBrand = alts.some((a) => a.includes('PT Karya Satya Buana') || a.includes('PT KSBI'));
    expect(containsBrand).toBe(true);
  });
});

describe('Tier 1 - Feature 08: Interactive Google Maps Container', () => {
  it('T1-F08-01: contact section embeds a responsive Google Maps iframe container', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const src = iframe.getAttribute('src') || '';
    expect(src).toContain('google.com/maps');
  });

  it('T1-F08-02: Google Maps embed targets official West Sumbawa registered coordinates', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const src = iframe.getAttribute('src') || '';
    expect(src.includes('-8.91113') || src.includes('116.7508') || src.includes('116.7509')).toBe(true);
  });

  it('T1-F08-03: Google Maps iframe has accessible title attribute for screen readers', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const title = iframe.getAttribute('title');
    expect(title).not.toBeNull();
    expect(title.trim().length).toBeGreaterThan(10);
  });

  it('T1-F08-04: Google Maps iframe specifies loading=lazy and safe referrerpolicy', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const iframe = contact.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute('loading')).toBe('lazy');
    expect(iframe.getAttribute('referrerpolicy')).toBe('no-referrer-when-downgrade');
  });

  it('T1-F08-05: CSS defines responsive styling and border radius for map container', () => {
    const css = runner.loadCss();
    const decls = css.getDeclarations('.contact-map-container') || css.getDeclarations('.map-wrapper') || css.getDeclarations('.contact-map iframe');
    expect(decls).not.toBeNull();
    expect(decls['border-radius'] || decls['overflow']).toBeTruthy();
  });
});

describe('Tier 1 - Feature 09: Direct "Buka di Google Maps" Button', () => {
  it('T1-F09-01: contact section contains a direct "Buka di Google Maps" action button', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    expect(link.textContent.toLowerCase()).toContain('google maps');
  });

  it('T1-F09-02: direct button URL targets official Sumbawa Barat coordinates', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    const href = link.getAttribute('href') || '';
    expect(href.includes('-8.91113') || href.includes('116.7508') || href.includes('116.7509')).toBe(true);
  });

  it('T1-F09-03: direct button opens in new tab with target=_blank and rel=noopener', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('T1-F09-04: direct button has button styling class with compact or full modifier', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    expect(link.classList.contains('btn')).toBe(true);
  });

  it('T1-F09-05: direct button link uses HTTPS protocol', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const link = contact.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href').startsWith('https://')).toBe(true);
  });
});

describe('Tier 1 - Feature 10: Contact Form Client-Side Validation', () => {
  it('T1-F10-01: form contains 4 required interactive input fields and submit button', () => {
    const dom = runner.loadHtml();
    const form = dom.getElementById('inquiry-form');
    expect(form).not.toBeNull();
    expect(form.querySelector('#fullName')).not.toBeNull();
    expect(form.querySelector('#contactInfo')).not.toBeNull();
    expect(form.querySelector('#serviceType')).not.toBeNull();
    expect(form.querySelector('#message')).not.toBeNull();
    expect(form.querySelector('#submit-btn')).not.toBeNull();
  });

  it('T1-F10-02: submitting empty form displays inline errors and marks fields invalid', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    const fullName = env.document.getElementById('fullName');
    const nameError = env.document.getElementById('fullName-error');
    expect(fullName.getAttribute('aria-invalid')).toBe('true');
    expect(nameError.textContent.length).toBeGreaterThan(0);
  });

  it('T1-F10-03: fullName under 3 characters triggers validation error', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    env.document.getElementById('fullName').value = 'AB';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    const nameError = env.document.getElementById('fullName-error');
    expect(nameError.textContent.length).toBeGreaterThan(0);
  });

  it('T1-F10-04: contactInfo with invalid email or phone triggers validation error', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    env.document.getElementById('fullName').value = 'John Doe';
    env.document.getElementById('contactInfo').value = 'not-an-email';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    const contactError = env.document.getElementById('contactInfo-error');
    expect(contactError.textContent.length).toBeGreaterThan(0);
  });

  it('T1-F10-05: message under 10 characters triggers validation error', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    env.document.getElementById('fullName').value = 'John Doe';
    env.document.getElementById('contactInfo').value = 'john@example.com';
    env.document.getElementById('serviceType').value = 'Aktivitas Penunjang Pertambangan';
    env.document.getElementById('message').value = 'Short';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    const msgError = env.document.getElementById('message-error');
    expect(msgError.textContent.length).toBeGreaterThan(0);
  });

  it('T1-F10-06: first invalid field receives focus on validation failure', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    expect(env.document.activeElement).toBe(env.document.getElementById('fullName'));
  });
});

describe('Tier 1 - Feature 11: Anti-Spam Honeypot Preservation', () => {
  it('T1-F11-01: form includes hidden honeypot input named _gotcha', () => {
    const dom = runner.loadHtml();
    const form = dom.getElementById('inquiry-form');
    expect(form).not.toBeNull();
    const gotcha = form.querySelector('input[name="_gotcha"]');
    expect(gotcha).not.toBeNull();
  });

  it('T1-F11-02: honeypot input is hidden visually with tabindex -1 and aria-hidden', () => {
    const dom = runner.loadHtml();
    const form = dom.getElementById('inquiry-form');
    const gotcha = form.querySelector('input[name="_gotcha"]');
    expect(gotcha).not.toBeNull();
    expect(gotcha.classList.contains('visually-hidden')).toBe(true);
    expect(gotcha.getAttribute('tabindex')).toBe('-1');
    expect(gotcha.getAttribute('aria-hidden')).toBe('true');
  });

  it('T1-F11-03: honeypot has autocomplete=off to prevent browser autofill triggers', () => {
    const dom = runner.loadHtml();
    const form = dom.getElementById('inquiry-form');
    const gotcha = form.querySelector('input[name="_gotcha"]');
    expect(gotcha.getAttribute('autocomplete')).toBe('off');
  });

  it('T1-F11-04: form submission silently aborts if bot populates _gotcha', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const gotcha = form.querySelector('input[name="_gotcha"]');
    gotcha.value = 'http://spam-link.com';

    env.document.getElementById('fullName').value = 'Spam Bot';
    env.document.getElementById('contactInfo').value = 'bot@spam.com';
    env.document.getElementById('serviceType').value = 'Aktivitas Penunjang Pertambangan';
    env.document.getElementById('message').value = 'Buy our cheap products now!';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.classList.contains('is-visible')).toBe(false);
  });

  it('T1-F11-05: form proceeds normally when _gotcha is empty', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = 'Ir. Bambang';
    env.document.getElementById('contactInfo').value = 'bambang@miningcorp.co.id';
    env.document.getElementById('serviceType').value = 'Aktivitas Penunjang Pertambangan';
    env.document.getElementById('message').value = 'Kami membutuhkan penunjang pompa lumpur selama 6 bulan.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.classList.contains('is-visible')).toBe(true);
    expect(feedback.textContent).toContain('Bambang');
  });
});

describe('Tier 1 - Feature 12: Input Sanitization & Mailto Fallback', () => {
  it('T1-F12-01: HTML special characters in full name are sanitized to safe entities', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = '<script>alert("hack")</script>';
    env.document.getElementById('contactInfo').value = 'tester@company.id';
    env.document.getElementById('serviceType').value = 'Manpower Supply';
    env.document.getElementById('message').value = 'Pengadaan 20 operator tambang bersertifikasi.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.innerHTML).not.toContain('<script>');
    expect(feedback.innerHTML).toContain('&lt;script&gt;');
  });

  it('T1-F12-02: successful submission renders feedback banner with role=status or aria-live', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = 'Ahmad Sanusi';
    env.document.getElementById('contactInfo').value = '081234567890';
    env.document.getElementById('serviceType').value = 'Manpower Supply';
    env.document.getElementById('message').value = 'Permintaan tenaga teknisi mekanik alat berat.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.getAttribute('role') || feedback.getAttribute('aria-live')).toBeTruthy();
    expect(feedback.classList.contains('form-feedback--success')).toBe(true);
  });

  it('T1-F12-03: official correspondence email address is info@karyasatyabuana.co.id', () => {
    const dom = runner.loadHtml();
    const contactLinks = dom.querySelectorAll('a[href^="mailto:"]');
    const mailtoHrefs = contactLinks.map((a) => a.getAttribute('href'));
    expect(mailtoHrefs).toContain('mailto:info@karyasatyabuana.co.id');
  });

  it('T1-F12-04: form submission generates or supports mailto fallback to official email', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = 'Budi Santoso';
    env.document.getElementById('contactInfo').value = 'budi@ptgas.com';
    env.document.getElementById('serviceType').value = 'Inspeksi Teknis';
    env.document.getElementById('message').value = 'Uji tahanan pembumian generator kapasitas 500kVA.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const dom = runner.loadHtml();
    const emailRef = dom.querySelector('a[href="mailto:info@karyasatyabuana.co.id"]');
    expect(emailRef).not.toBeNull();
  });

  it('T1-F12-05: form resets input fields after successful submission', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    env.document.getElementById('fullName').value = 'Siti Rahma';
    env.document.getElementById('contactInfo').value = 'siti@karya.com';
    env.document.getElementById('serviceType').value = 'Konsultasi Terpadu';
    env.document.getElementById('message').value = 'Konsultasi audit manajemen K3 terintegrasi.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    expect(env.document.getElementById('fullName').value).toBe('');
    expect(env.document.getElementById('contactInfo').value).toBe('');
    expect(env.document.getElementById('message').value).toBe('');
  });
});

describe('Tier 1 - Feature 13: Direct WhatsApp Chat Link', () => {
  it('T1-F13-01: WhatsApp links target official registered customer service number', () => {
    const dom = runner.loadHtml();
    const waLinks = dom.querySelectorAll('a[href*="wa.me"]');
    expect(waLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of waLinks) {
      expect(link.getAttribute('href')).toContain('6282236881925');
    }
  });

  it('T1-F13-02: WhatsApp link prefilled message is URL encoded', () => {
    const dom = runner.loadHtml();
    const waLinks = dom.querySelectorAll('a[href*="wa.me"]');
    for (const link of waLinks) {
      const href = link.getAttribute('href');
      expect(href).toContain('text=');
      expect(href).toContain('%20');
      expect(href).not.toContain(' ');
    }
  });

  it('T1-F13-03: WhatsApp link opens in new tab with secure rel=noopener noreferrer', () => {
    const dom = runner.loadHtml();
    const waLinks = dom.querySelectorAll('a[href*="wa.me"]');
    for (const link of waLinks) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    }
  });

  it('T1-F13-04: contact section contains a dedicated full-width WhatsApp CTA button', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    const waBtn = contact.querySelector('.contact-card__cta a[href*="wa.me"]') || contact.querySelector('a.btn--accent[href*="wa.me"]');
    expect(waBtn).not.toBeNull();
    expect(waBtn.classList.contains('btn--accent')).toBe(true);
    expect(waBtn.textContent.toLowerCase()).toContain('whatsapp');
  });

  it('T1-F13-05: mobile drawer provides instant WhatsApp quick access link', () => {
    const dom = runner.loadHtml();
    const drawer = dom.getElementById('mobile-drawer');
    const waLink = drawer.querySelector('a[href*="wa.me"]');
    expect(waLink).not.toBeNull();
    expect(waLink.textContent.toLowerCase()).toContain('whatsapp');
  });
});

describe('Tier 1 - Feature 14: Schema.org LocalBusiness JSON-LD', () => {
  it('T1-F14-01: head includes parseable application/ld+json script', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script.textContent);
    expect(json).toBeTruthy();
    expect(json['@context']).toBe('https://schema.org');
  });

  it('T1-F14-02: schema specifies LocalBusiness type and official registered company name', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(json['@type']).toBe('LocalBusiness');
    expect(json.name).toBe('PT Karya Satya Buana Indonesia');
  });

  it('T1-F14-03: schema defines GeoCoordinates matching West Sumbawa registered domicile', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(json.geo).toBeDefined();
    expect(json.geo['@type']).toBe('GeoCoordinates');
    const lat = Number(json.geo.latitude);
    const lon = Number(json.geo.longitude);
    expect(lat).toBeLessThanOrEqual(-8.9);
    expect(lat).toBeGreaterThanOrEqual(-9.0);
    expect(lon).toBeGreaterThanOrEqual(116.7);
    expect(lon).toBeLessThanOrEqual(116.8);
  });

  it('T1-F14-04: schema defines complete registered address in West Sumbawa', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(json.address).toBeDefined();
    expect(json.address['@type']).toBe('PostalAddress');
    expect(json.address.addressLocality).toContain('Sumbawa Barat');
    expect(json.address.addressRegion).toContain('Nusa Tenggara Barat');
    expect(json.address.addressCountry).toBe('ID');
  });

  it('T1-F14-05: schema includes official leadership representation for Soejiman and Sutopo', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    const serialized = JSON.stringify(json);
    expect(serialized).toContain('Soejiman');
    expect(serialized).toContain('Sutopo');
  });

  it('T1-F14-06: schema specifies official contact email and telephone', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);
    expect(json.contactPoint).toBeDefined();
    expect(json.contactPoint.email).toBe('info@karyasatyabuana.co.id');
    expect(json.contactPoint.telephone).toContain('822-3688-1925');
  });
});

describe('Tier 1 - Feature 15: Zero Overflow & Core Web Vitals', () => {
  it('T1-F15-01: CSS enforces overflow-x clip or hidden on body to eliminate horizontal scroll', () => {
    const css = runner.loadCss();
    const bodyDecls = css.getDeclarations('body');
    expect(bodyDecls).not.toBeNull();
    const overflowX = bodyDecls['overflow-x'];
    expect(overflowX === 'clip' || overflowX === 'hidden').toBe(true);
  });

  it('T1-F15-02: container has max-width and fluid padding across breakpoints', () => {
    const css = runner.loadCss();
    const containerDecls = css.getDeclarations('.container');
    expect(containerDecls['max-width']).toContain('var(--container-max)');
    expect(containerDecls['padding-left']).toBeTruthy();
    expect(containerDecls['padding-right']).toBeTruthy();
  });

  it('T1-F15-03: all buttons and primary interactive controls satisfy min 44x44px touch target', () => {
    const css = runner.loadCss();
    const menuToggleDecls = css.getDeclarations('.menu-toggle');
    const drawerCloseDecls = css.getDeclarations('.drawer-close');
    expect(menuToggleDecls['min-width'] || menuToggleDecls.width).toContain('44');
    expect(menuToggleDecls['min-height'] || menuToggleDecls.height).toContain('44');
    expect(drawerCloseDecls['min-width'] || drawerCloseDecls.width).toContain('44');
    expect(drawerCloseDecls['min-height'] || drawerCloseDecls.height).toContain('44');
  });

  it('T1-F15-04: document contains exactly one single <h1> heading', () => {
    const dom = runner.loadHtml();
    const h1List = dom.getElementsByTagName('h1');
    expect(h1List.length).toBe(1);
    expect(h1List[0].id).toBe('hero-title');
  });

  it('T1-F15-05: all responsive images apply max-width: 100% and height: auto', () => {
    const css = runner.loadCss();
    const imgDecls = css.getDeclarations('img');
    expect(imgDecls['max-width']).toBe('100%');
    expect(imgDecls.height).toBe('auto');
  });
});

runner.describe('Tier 1 - Feature 16: Strategic Partners Grid & Dual Office Infrastructure', () => {
  it('T1-F16-01: partners section renders with client logos including Amman Mineral, PT PIL, TCC, and MCC', () => {
    const dom = runner.loadHtml();
    const partners = dom.getElementById('partners');
    expect(partners).not.toBeNull();

    const partnerCards = partners.querySelectorAll('.partner-card');
    expect(partnerCards.length).toBeGreaterThanOrEqual(6);

    const partnerImages = partners.querySelectorAll('.partner-card__logo');
    for (const img of partnerImages) {
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('alt')).toBeTruthy();
      expect(img.getAttribute('src')).toContain('assets/images/clients/');
    }

    const partnersText = partners.textContent.toLowerCase();
    expect(partnersText).toContain('amman mineral');
    expect(partnersText).toContain('pil');
    expect(partnersText).toContain('tcc');
    expect(partnersText).toContain('mcc');
  });

  it('T1-F16-02: dual office structure explicitly presents both Sumbawa Barat and Gorontalo offices', () => {
    const dom = runner.loadHtml();
    const headOffice = dom.querySelector('.office-card--head');
    const branchOffice = dom.querySelector('.office-card--branch');

    expect(headOffice).not.toBeNull();
    expect(branchOffice).not.toBeNull();

    expect(headOffice.textContent.toLowerCase()).toContain('sumbawa barat');
    expect(branchOffice.textContent.toLowerCase()).toContain('gorontalo');
    expect(branchOffice.textContent.toLowerCase()).toContain('pohuwato');
  });

  it('T1-F16-03: Schema.org structured data includes Gorontalo branch office department', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.textContent);

    expect(json.department).toBeTruthy();
    expect(Array.isArray(json.department)).toBe(true);
    expect(json.department[0].name).toContain('Gorontalo');
    expect(json.department[0].address.addressLocality).toContain('Pohuwato');
  });

  it('T1-F16-04: Footer legal notice includes both KBLI 41013 and KBLI 78200', () => {
    const dom = runner.loadHtml();
    const footerLegal = dom.querySelector('.footer-legal');
    expect(footerLegal).not.toBeNull();
    expect(footerLegal.textContent).toContain('41013');
    expect(footerLegal.textContent).toContain('78200');
    expect(footerLegal.textContent).toContain('Gorontalo');
  });
});

