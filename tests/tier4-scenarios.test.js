const { describe, it, expect, runner } = require('./test-runner');

describe('Tier 4 - Real-World Scenarios', () => {
  it('T4-01: end-to-end smartphone visitor discovery, navigation, and inquiry flow', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    env.window.setViewport(375, 667);

    const heroTitle = env.document.getElementById('hero-title');
    expect(heroTitle).not.toBeNull();
    expect(heroTitle.textContent.length).toBeGreaterThan(20);

    const toggle = env.document.getElementById('menu-toggle');
    toggle.click();
    const drawer = env.document.getElementById('mobile-drawer');
    expect(drawer.classList.contains('is-open')).toBe(true);

    const servicesLink = drawer.querySelector('a[href="#services"]');
    expect(servicesLink).not.toBeNull();
    servicesLink.click();
    expect(drawer.classList.contains('is-open')).toBe(false);

    const serviceCardLink = env.document.querySelector('.service-card__link[data-service="Penyediaan Tenaga Kerja"]');
    serviceCardLink.click();

    const serviceSelect = env.document.getElementById('serviceType');
    expect(serviceSelect.value).toBe('Penyediaan Tenaga Kerja');

    env.document.getElementById('fullName').value = 'Bambang Irawan';
    env.document.getElementById('contactInfo').value = '081234567890';
    env.document.getElementById('message').value = 'Kebutuhan 15 personel teknisi mekanik untuk lokasi Sumbawa.';

    const form = env.document.getElementById('inquiry-form');
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });

    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.classList.contains('is-visible')).toBe(true);
    expect(feedback.textContent).toContain('Bambang Irawan');
  });

  it('T4-02: corporate procurement officer credential and management verification journey', () => {
    const dom = runner.loadHtml();

    const highlights = dom.querySelectorAll('.highlight-pill');
    expect(highlights.length).toBeGreaterThanOrEqual(2);

    const management = dom.getElementById('management');
    expect(management).not.toBeNull();
    const managementText = management.textContent;
    expect(managementText).toContain('Soejiman');
    expect(managementText).toContain('Sutopo');

    const contact = dom.getElementById('contact');
    expect(contact).not.toBeNull();
    const mapLink = contact.querySelector('a[href*="google.com/maps"]');
    expect(mapLink).not.toBeNull();
    expect(mapLink.getAttribute('href')).toContain('-8.91113');

    const form = contact.querySelector('#inquiry-form');
    expect(form).not.toBeNull();
    expect(form.querySelector('#serviceType')).not.toBeNull();
  });

  it('T4-03: safety inspector and technical auditor photo showcase due diligence', () => {
    const dom = runner.loadHtml();

    const gallery = dom.getElementById('gallery');
    expect(gallery).not.toBeNull();

    const images = gallery.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(4);

    for (const img of images) {
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('alt')).toBeTruthy();
      expect(img.getAttribute('alt').length).toBeGreaterThanOrEqual(20);
    }

    const footer = dom.querySelector('.site-footer');
    expect(footer).not.toBeNull();
    expect(footer.textContent.toLowerCase()).toContain('sumbawa barat');
  });

  it('T4-04: instant WhatsApp business consultation engagement', () => {
    const dom = runner.loadHtml();
    const waButton = dom.querySelector('#contact a.btn--accent[href*="wa.me"]');
    expect(waButton).not.toBeNull();

    const href = waButton.getAttribute('href');
    expect(href).toContain('6282236881925');
    expect(href).toContain('text=');
    expect(waButton.getAttribute('target')).toBe('_blank');
    expect(waButton.getAttribute('rel')).toContain('noopener');

    const decodedText = decodeURIComponent(href);
    expect(decodedText).toContain('PT Karya Satya Buana Indonesia');
  });

  it('T4-05: automated spambot attack mitigation and zero-leak preservation', async () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    form.querySelector('input[name="_gotcha"]').value = 'SPAM_BOT_PAYLOAD_VALUE';
    env.document.getElementById('fullName').value = 'Automated Link Harvester';
    env.document.getElementById('contactInfo').value = 'harvester@spamnetwork.com';
    env.document.getElementById('serviceType').value = 'Manpower Supply';
    env.document.getElementById('message').value = 'Visit our scam links now at discount prices!';

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    await new Promise((r) => setTimeout(r, 700));

    const feedback = env.document.getElementById('form-feedback');
    expect(feedback.classList.contains('is-visible')).toBe(false);
    expect(feedback.textContent).toBe('');
    expect(env.document.getElementById('submit-btn').disabled).toBe(false);
  });

  it('T4-06: keyboard-only accessibility journey using Tab, Enter, and Escape', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);

    const skipLink = env.document.querySelector('.skip-link');
    expect(skipLink).not.toBeNull();
    skipLink.click();
    expect(env.document.activeElement).toBe(env.document.getElementById('main-content'));

    const toggle = env.document.getElementById('menu-toggle');
    toggle.click();
    const drawer = env.document.getElementById('mobile-drawer');
    expect(drawer.classList.contains('is-open')).toBe(true);

    env.document.dispatchEvent({ type: 'keydown', key: 'Escape' });
    expect(drawer.classList.contains('is-open')).toBe(false);
    expect(env.document.activeElement).toBe(toggle);
  });

  it('T4-07: form error recovery and self-correction sequence', () => {
    const env = runner.createDomEnvironment();
    runner.loadMainScript(env);
    const form = env.document.getElementById('inquiry-form');

    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(env.document.activeElement).toBe(env.document.getElementById('fullName'));

    const nameInput = env.document.getElementById('fullName');
    const nameError = env.document.getElementById('fullName-error');
    expect(nameError.textContent.length).toBeGreaterThan(0);

    nameInput.value = 'R';
    nameInput.dispatchEvent({ type: 'input' });
    nameInput.value = 'Rian Hidayat';
    nameInput.dispatchEvent({ type: 'input' });
    expect(nameError.textContent.length).toBe(0);

    const contactInput = env.document.getElementById('contactInfo');
    const contactError = env.document.getElementById('contactInfo-error');
    contactInput.value = 'invalid';
    form.dispatchEvent({ type: 'submit', defaultPrevented: false, preventDefault() {} });
    expect(contactError.textContent.length).toBeGreaterThan(0);

    contactInput.value = 'rian@tambang.co.id';
    contactInput.dispatchEvent({ type: 'input' });
    expect(contactError.textContent.length).toBe(0);
  });

  it('T4-08: search engine crawler metadata and structured data verification', () => {
    const dom = runner.loadHtml();

    expect(dom.title).toBeTruthy();
    expect(dom.title).toContain('PT Karya Satya Buana Indonesia');

    const desc = dom.querySelector('meta[name="description"]');
    expect(desc).not.toBeNull();
    expect(desc.getAttribute('content').length).toBeGreaterThan(30);

    const canonical = dom.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical.getAttribute('href')).toContain('karyasatyabuana.co.id');

    const script = dom.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const schema = JSON.parse(script.textContent);
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe('PT Karya Satya Buana Indonesia');
    expect(schema.geo).toBeDefined();

    const h1s = dom.getElementsByTagName('h1');
    expect(h1s.length).toBe(1);
  });

  it('T4-09: multi-device layout responsiveness and anti-overflow consistency', () => {
    const css = runner.loadCss();

    expect(css.getDeclarations('body')['overflow-x']).toBeTruthy();
    expect(css.getDeclarations('.container')['max-width']).toBeTruthy();

    const mobileHeader = css.getDeclarations('.desktop-nav');
    expect(mobileHeader.display).toBe('none');

    const desktopNav = css.getMediaDeclarations(1024, '.desktop-nav');
    expect(desktopNav.display).toBe('block');

    const desktopToggle = css.getMediaDeclarations(1024, '.menu-toggle');
    expect(desktopToggle.display).toBe('none');
  });

  it('T4-10: inquiry email correspondence routing and mailto fallback integrity', () => {
    const dom = runner.loadHtml();
    const mailtoLinks = dom.querySelectorAll('a[href^="mailto:"]');
    expect(mailtoLinks.length).toBeGreaterThanOrEqual(1);

    for (const link of mailtoLinks) {
      expect(link.getAttribute('href')).toContain('info@karyasatyabuana.co.id');
    }
  });
});
