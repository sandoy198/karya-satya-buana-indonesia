const initializeCompanyProfile = () => {
  const siteHeader = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const inquiryForm = document.getElementById('inquiry-form');
  const submitButton = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  const updateHeaderOnScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();

  let activeElementBeforeDrawer = null;

  const getDrawerFocusableElements = () => {
    if (!mobileDrawer) return [];
    return Array.from(
      mobileDrawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  };

  const trapDrawerFocus = (event) => {
    if (event.key !== 'Tab') return;
    if (!mobileDrawer || !mobileDrawer.classList.contains('is-open')) return;

    const focusableElements = getDrawerFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeIndex = focusableElements.indexOf(document.activeElement);

    if (activeIndex === -1) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    if (event.shiftKey) {
      if (document.activeElement === firstElement || activeIndex === 0) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement || activeIndex === focusableElements.length - 1) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  const openDrawer = () => {
    if (!mobileDrawer || !drawerBackdrop || !menuToggle) return;
    activeElementBeforeDrawer = document.activeElement;
    mobileDrawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', trapDrawerFocus);

    requestAnimationFrame(() => {
      if (drawerClose) {
        drawerClose.focus();
      }
    });
  };

  const closeDrawer = (restoreFocus = true) => {
    if (!mobileDrawer || !drawerBackdrop || !menuToggle) return;
    document.removeEventListener('keydown', trapDrawerFocus);
    mobileDrawer.classList.remove('is-open');
    drawerBackdrop.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (restoreFocus && activeElementBeforeDrawer && typeof activeElementBeforeDrawer.focus === 'function') {
      activeElementBeforeDrawer.focus();
    }
  };

  const handleWindowResize = () => {
    if (window.innerWidth >= 1024 && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeDrawer(false);
    }
  };

  window.addEventListener('resize', handleWindowResize, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        closeDrawer(true);
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', () => closeDrawer(true));
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => closeDrawer(true));
  }

  const allDrawerLinks = mobileDrawer ? mobileDrawer.querySelectorAll('a') : [];
  allDrawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      closeDrawer(false);
      if (href && href.startsWith('#')) {
        const targetElement = document.getElementById(href.substring(1));
        if (targetElement) {
          targetElement.focus({ preventScroll: true });
        }
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeDrawer(true);
    }
  });

  const sanitizeInput = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const validateEmailOrPhone = (value) => {
    const trimmedValue = value.trim();
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    const phoneDigitsOnly = trimmedValue.replace(/[\s\-\(\)\+]/g, '');
    const isNumericPhone = /^\d{9,15}$/.test(phoneDigitsOnly) && /^[\d\s\-\(\)\+]+$/.test(trimmedValue);

    return emailRegex.test(trimmedValue) || isNumericPhone;
  };

  const clearFieldError = (fieldId) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (field) {
      field.classList.remove('has-error');
      field.removeAttribute('aria-invalid');
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
  };

  const setFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (field) {
      field.classList.add('has-error');
      field.setAttribute('aria-invalid', 'true');
    }
    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const resetFormFeedback = () => {
    if (formFeedback && formFeedback.classList.contains('is-visible')) {
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
    }
  };

  ['fullName', 'contactInfo', 'serviceType', 'message'].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', () => {
        clearFieldError(fieldId);
        resetFormFeedback();
      });
      field.addEventListener('change', () => {
        clearFieldError(fieldId);
        resetFormFeedback();
      });
    }
  });

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (formFeedback) {
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = '';
      }

      const formData = new FormData(inquiryForm);
      const honeypot = formData.get('_gotcha');
      const fullName = (formData.get('fullName') || '').toString().trim();
      const contactInfo = (formData.get('contactInfo') || '').toString().trim();
      const serviceType = (formData.get('serviceType') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (honeypot) {
        return;
      }

      let isValid = true;
      let firstInvalidElement = null;

      if (fullName.length < 3) {
        setFieldError('fullName', 'Nama lengkap wajib diisi minimal 3 karakter.');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = document.getElementById('fullName');
      } else {
        clearFieldError('fullName');
      }

      if (!contactInfo || !validateEmailOrPhone(contactInfo)) {
        setFieldError('contactInfo', 'Masukkan format email valid atau nomor telepon aktif (minimal 9 digit).');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = document.getElementById('contactInfo');
      } else {
        clearFieldError('contactInfo');
      }

      if (!serviceType) {
        setFieldError('serviceType', 'Silakan pilih salah satu kategori layanan.');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = document.getElementById('serviceType');
      } else {
        clearFieldError('serviceType');
      }

      if (message.length < 10) {
        setFieldError('message', 'Pesan inquiry wajib diisi minimal 10 karakter.');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = document.getElementById('message');
      } else {
        clearFieldError('message');
      }

      if (!isValid) {
        if (firstInvalidElement) {
          firstInvalidElement.focus();
        }
        return;
      }

      if (submitButton) {
        submitButton.classList.add('is-loading');
        submitButton.disabled = true;
      }

      const safeName = sanitizeInput(fullName);
      const subject = encodeURIComponent(`Inquiry Layanan: ${serviceType} (${fullName})`);
      const body = encodeURIComponent(
        `Nama Lengkap: ${fullName}\nKontak: ${contactInfo}\nKategori Layanan: ${serviceType}\n\nRincian Kebutuhan Proyek:\n${message}\n\n---\nDikirim melalui Formulir Website PT Karya Satya Buana Indonesia`
      );
      const mailtoUrl = `mailto:info@karyasatyabuana.co.id?subject=${subject}&body=${body}`;

      if (formFeedback) {
        formFeedback.className = 'form-feedback form-feedback--success is-visible';
        formFeedback.innerHTML = `<strong>Terima kasih, ${safeName}!</strong> Pesan inquiry Anda telah disiapkan. Aplikasi email Anda akan terbuka untuk mengirimkan rincian ini langsung ke info@karyasatyabuana.co.id. Tim PT Karya Satya Buana Indonesia akan segera menindaklanjuti kebutuhan proyek Anda.`;
        formFeedback.setAttribute('tabindex', '-1');
        formFeedback.focus();
      }

      try {
        window.location.href = mailtoUrl;
      } catch (err) {}

      inquiryForm.reset();

      if (submitButton) {
        submitButton.classList.remove('is-loading');
        submitButton.disabled = false;
      }
    });
  }

  const serviceLinks = document.querySelectorAll('.service-card__link[data-service]');
  const serviceSelect = document.getElementById('serviceType');
  serviceLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const serviceValue = link.getAttribute('data-service');
      if (serviceSelect && serviceValue) {
        serviceSelect.value = serviceValue;
        clearFieldError('serviceType');
        resetFormFeedback();
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.focus({ preventScroll: true });
      }
    });
  });

  const inPageLinks = document.querySelectorAll('.skip-link, .desktop-nav a, .desktop-actions a, .brand-link, .hero-actions a, .footer-nav a');
  inPageLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetElement = document.getElementById(href.substring(1));
        if (targetElement) {
          targetElement.focus({ preventScroll: true });
        }
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', initializeCompanyProfile);
