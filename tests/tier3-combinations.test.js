const { describe, it, expect, runner } = require('./test-runner');

describe('Tier 3 - Cross-Feature Combinations', () => {
  it('T3-01: navbar link click smooth-scrolls and sets focus to target section', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const navLink = env.document.querySelector('.desktop-nav a[href="#services"]');
    expect(navLink).not.toBeNull();

    navLink.click();
    const servicesSection = env.document.getElementById('services');
    expect(env.document.activeElement).toBe(servicesSection);
  });

  it('T3-02: mobile drawer open + viewport resize to desktop auto-closes drawer and cleans body scroll', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');

    toggle.click();
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.window.setViewport(1280, 800);
    expect(drawer.classList.contains('is-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('T3-03: clicking drawer navigation link closes drawer and shifts focus to section', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');
    toggle.click();

    const drawerAboutLink = drawer.querySelector('a[href="#about"]');
    expect(drawerAboutLink).not.toBeNull();
    drawerAboutLink.click();

    expect(drawer.classList.contains('is-open')).toBe(false);
    const aboutSection = env.document.getElementById('about');
    expect(env.document.activeElement).toBe(aboutSection);
  });

  it('T3-04: clicking service card consultation link auto-populates form serviceType dropdown and focuses contact', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const serviceLink = env.document.querySelector('.service-card__link[data-service="Penyediaan Tenaga Kerja"]') || env.document.querySelector('a[data-service="Penyediaan Tenaga Kerja"]');
    expect(serviceLink).not.toBeNull();

    serviceLink.click();
    const select = env.document.getElementById('serviceType');
    expect(select.value).toBe('Penyediaan Tenaga Kerja');
    const contactSection = env.document.getElementById('contact');
    expect(env.document.activeElement).toBe(contactSection);
  });

  it('T3-05: service card auto-population clears existing validation error on serviceType', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    const serviceError = env.document.getElementById('serviceType-error');
    expect(serviceError.textContent.length).toBeGreaterThan(0);

    const serviceLink = env.document.querySelector('.service-card__link[data-service="Aktivitas Penunjang Pertambangan"]') || env.document.querySelector('a[data-service="Aktivitas Penunjang Pertambangan"]');
    expect(serviceLink).not.toBeNull();
    serviceLink.click();

    expect(serviceError.textContent.length).toBe(0);
  });

  it('T3-06: form validation error followed by user input clears field error and hides feedback banner', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    const nameInput = env.document.getElementById('fullName');
    const nameError = env.document.getElementById('fullName-error');
    expect(nameError.textContent.length).toBeGreaterThan(0);

    nameInput.value = 'PT Petro Perkasa';
    nameInput.dispatchEvent({ type: 'input' });
    expect(nameError.textContent.length).toBe(0);
    expect(nameInput.classList.contains('has-error')).toBe(false);
  });

  it('T3-07: spambot honeypot injection preserves form state without exposing feedback or crashing', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    form.querySelector('input[name="_gotcha"]').value = 'SPAMBOT_PAYLOAD';

    env.document.getElementById('fullName').value = 'Automated Bot';
    env.document.getElementById('contactInfo').value = 'bot@badactor.net';
    env.document.getElementById('serviceType').value = 'Manpower Supply';
    env.document.getElementById('message').value = 'Spam advertising message text.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.classList.contains('is-visible')).toBe(false);
    expect(env.document.getElementById('submit-btn').disabled).toBe(false);
  });

  it('T3-08: valid form submission lifecycle: loading -> sanitize -> feedback -> reset -> focus', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');
    const submitBtn = env.document.getElementById('submit-btn');

    env.document.getElementById('fullName').value = 'Drs. Supriyanto & Rekan';
    env.document.getElementById('contactInfo').value = 'supriyanto@energi.co.id';
    env.document.getElementById('serviceType').value = 'Konsultasi Terpadu';
    env.document.getElementById('message').value = 'Permohonan presentasi company profile di kantor cabang Mataram.';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(submitBtn.classList.contains('is-loading')).toBe(false);

    await new Promise((r) => setTimeout(r, 700));

    expect(submitBtn.classList.contains('is-loading')).toBe(false);
    expect(submitBtn.disabled).toBe(false);

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.classList.contains('is-visible')).toBe(true);
    expect(feedback.innerHTML).toContain('&amp;');
    expect(env.document.activeElement).toBe(feedback);
    expect(env.document.getElementById('fullName').value).toBe('');
  });

  it('T3-09: coordinate parity: Google Maps embed and direct external button match official coordinates', () => {
    const dom = runner.loadHtml();
    const contact = dom.getElementById('contact');
    const iframe = contact.querySelector('iframe');
    const directBtn = contact.querySelector('a[href*="google.com/maps"]');

    expect(iframe).not.toBeNull();
    expect(directBtn).not.toBeNull();

    const iframeSrc = iframe.getAttribute('src');
    const btnHref = directBtn.getAttribute('href');

    const latMatch = iframeSrc.includes('-8.91113') && btnHref.includes('-8.91113');
    expect(latMatch).toBe(true);
  });

  it('T3-10: leadership parity: Schema.org JSON-LD leadership matches corporate management section', () => {
    const dom = runner.loadHtml();
    const managementSection = dom.getElementById('management');
    expect(managementSection).not.toBeNull();

    const script = dom.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script.textContent);
    const schemaStr = JSON.stringify(schema);

    expect(managementSection.textContent).toContain('Soejiman');
    expect(schemaStr).toContain('Soejiman');

    expect(managementSection.textContent).toContain('Sutopo');
    expect(schemaStr).toContain('Sutopo');
  });

  it('T3-11: geolocation parity: Schema.org coordinates match Google Maps embed location', () => {
    const dom = runner.loadHtml();
    const script = dom.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script.textContent);
    const contact = dom.getElementById('contact');
    const iframe = contact.querySelector('iframe');

    expect(schema.geo).toBeDefined();
    const schemaLat = Number(schema.geo.latitude);
    expect(Math.abs(schemaLat - (-8.91113))).toBeLessThan(0.01);

    if (iframe) {
      expect(iframe.getAttribute('src')).toContain('-8.91113');
    }
  });

  it('T3-12: WhatsApp link parity: drawer, contact section, and schema point to identical number', () => {
    const dom = runner.loadHtml();
    const drawerWa = dom.querySelector('#mobile-drawer a[href*="wa.me"]');
    const contactWa = dom.querySelector('#contact a[href*="wa.me"]');
    const script = dom.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script.textContent);

    expect(drawerWa).not.toBeNull();
    expect(contactWa).not.toBeNull();

    expect(drawerWa.getAttribute('href')).toContain('6282236881925');
    expect(contactWa.getAttribute('href')).toContain('6282236881925');

    const schemaSameAs = JSON.stringify(schema.sameAs || []);
    expect(schemaSameAs).toContain('6282236881925');
  });

  it('T3-13: scroll listener keeps sticky header functional after multiple drawer open/close cycles', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const toggle = env.document.getElementById('menu-toggle');
    const drawer = env.document.getElementById('mobile-drawer');
    const header = env.document.getElementById('site-header');

    toggle.click();
    env.document.getElementById('drawer-close').click();
    expect(drawer.classList.contains('is-open')).toBe(false);

    env.window.scrollTo(0, 150);
    expect(header.classList.contains('is-scrolled')).toBe(true);

    env.window.scrollTo(0, 0);
    expect(header.classList.contains('is-scrolled')).toBe(false);
  });

  it('T3-14: skip link focus jumps directly to main content landmark with tabindex -1', () => {
    const dom = runner.loadHtml();
    const skipLink = dom.querySelector('.skip-link');
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#main-content');

    const main = dom.getElementById('main-content');
    expect(main).not.toBeNull();
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('T3-15: gallery and management sections are cleanly integrated within main landmarks', () => {
    const dom = runner.loadHtml();
    const main = dom.querySelector('main');
    expect(main).not.toBeNull();

    const management = main.querySelector('#management');
    const gallery = main.querySelector('#gallery');
    expect(management).not.toBeNull();
    expect(gallery).not.toBeNull();
  });
});
