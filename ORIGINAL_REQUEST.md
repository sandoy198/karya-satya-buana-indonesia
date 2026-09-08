# Original User Request

## 2026-09-08T04:05:49Z

This is a single self-contained fix; keep it small and focused.
Build an interactive, modern, and mobile-responsive UI prototype for the company profile landing page of PT Karya Satya Buana Indonesia covering key sections: Navigation Header, Hero Section, Services showcase, and Contact Form.

Working directory: c:/filesandy/Antigravity Workspace/karya satya buana indonesia
Integrity mode: development

## Requirements

### R1. Core UI Components & Interactive Prototype
The prototype must render a clean, professional landing page containing:
- Sticky navigation header with brand title/logo placeholder, navigation links, primary CTA button, and a mobile hamburger menu drawer toggle.
- First-fold Hero section featuring clear value proposition, primary & secondary action buttons, and a responsive visual showcase container.
- Services section displaying structured capability cards with responsive column reflow and hover interaction.
- Contact inquiry section providing clear office contact information and an interactive inquiry form with basic front-end validation.

### R2. Responsive Layout & Accessibility Standards
Layout must seamlessly adapt across breakpoints (Mobile 320px-480px, Tablet 768px-1023px, Desktop 1024px+) according to specs:
- Mobile touch targets must measure at least 44x44px.
- Zero horizontal overflow or clipping on mobile viewports.
- Typography and contrast adhere to modern visual aesthetics without generic AI filler copy.

## Acceptance Criteria

### Visual & Component Rendering
- [ ] Running a local static or dev preview renders the landing page without console errors.
- [ ] Navigation header displays menu links on desktop (>=1024px) and collapses into a working mobile drawer menu on small screens (<=768px).
- [ ] Hero section displays headline, dual CTA buttons, and visual container in a single column on mobile and two columns on desktop.
- [ ] Services cards grid renders as single column on mobile (<=480px) and multi-column grid on desktop (>=1024px).
- [ ] Contact form contains required input fields (name, email/phone, service need, message) with interactive client-side submission feedback.

### Verification Resources & Specifications
- Refer to docs/prd.md for architecture and section narrative guidelines.
- Refer to docs/specs/company-profile-structure.md for responsive breakpoint definitions and component rules.

## 2026-09-08T05:24:35Z

Complete the production implementation of PT Karya Satya Buana Indonesia single-page responsive company profile according to Paket A specifications, delivering full navigation, management section, mine operations photo showcase, interactive Google Maps, inquiry form integration, and Local SEO enhancements.

Working directory: c:/filesandy/Antigravity Workspace/karya satya buana indonesia
Integrity mode: development

## Requirements

### R1. Complete Smooth-Scroll Navigation & Management Section
Integrate a dedicated Management section (`#management`) showcasing key corporate leadership and supervisory roles based on organizational documents. Update the sticky desktop navigation header, mobile drawer menu, and footer links to include "Manajemen" / `#management` with smooth-scrolling and accessible focus handling.

### R2. Mine Operations Photo Showcase Gallery
Incorporate an interactive, responsive visual gallery/showcase of genuine field operations and technical mining activities using the reference assets in `docs/references/images/foto pekerja/`. Ensure all imagery implements responsive aspect ratios, descriptive accessibility `alt` texts, and performance-friendly lazy loading (`loading="lazy"`).

### R3. Interactive Google Maps & Office Location
Embed an interactive, responsive Google Maps container within the Contact section (`#contact`) pinpointing the company's official registered domicile in West Sumbawa Regency (Kabupaten Sumbawa Barat), West Nusa Tenggara, alongside a direct "Buka di Google Maps" action button.

### R4. Contact Form Integration & WA Direct Reliability
Finalize inquiry form integration with client-side validation, anti-spam honeypot preservation, sanitized inputs, and an active static form endpoint (or robust mailto fallback) so user inquiries route to the company's official email `info@karyasatyabuana.co.id`, while preserving the direct WhatsApp chat link.

### R5. Local SEO & Structured Data Enhancements
Update Schema.org JSON-LD structured data in the document `<head>` to include geographical coordinates for West Sumbawa, organizational leadership schema, and verify high-performance Core Web Vitals compliance without horizontal overflow on mobile viewports (320px–480px).

## Acceptance Criteria

### Navigation & Management
- [ ] Desktop navbar contains working links for Beranda, Tentang Kami, Layanan, Manajemen, and Kontak.
- [ ] Mobile drawer menu displays all 5 section links and smoothly navigates/closes upon selection on viewports <= 768px.
- [ ] Management section renders corporate leadership/management cards with responsive column reflow (1 column on mobile <= 480px, multi-column on desktop >= 1024px).

### Visual & Media
- [ ] Mine operations showcase renders field documentation photos from the reference directory with zero horizontal layout distortion.
- [ ] All gallery and content images include meaningful `alt` descriptions and `loading="lazy"` attributes.

### Maps & Contact
- [ ] Contact section embeds a responsive Google Maps preview of West Sumbawa and a functional external link button opening Google Maps.
- [ ] Inquiry form validates inputs (name, contact info, service category, message) and provides interactive user feedback upon submission.

### SEO & Technical Standards
- [ ] Schema.org JSON-LD contains valid LocalBusiness metadata including geo coordinates and complete company profile details.
- [ ] Zero console errors and zero horizontal scroll overflow across all test breakpoints (320px, 375px, 768px, 1280px).
