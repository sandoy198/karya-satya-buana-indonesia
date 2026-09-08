# Project: PT Karya Satya Buana Indonesia (Company Profile - Paket A)

## Architecture
- **Tech Stack**: Vanilla HTML5, CSS3 (mobile-first, custom properties, responsive grid/flexbox), modern ESNext JavaScript (modular, defer, accessible focus management, event delegation).
- **Hosting / Backend**: Static web architecture (zero backend dependencies, static form routing with robust `mailto:` fallback to `info@karyasatyabuana.co.id`, Google Maps embed via standard coordinate parameters, direct WhatsApp chat integration).
- **Data Source**: Otoritatif dari dokumen legalitas resmi perusahaan di `docs/references/brand/` (Akta Pendirian No. 13/2026, SK Menkumham AHU-0049654.AH.01.01.TAHUN 2026, NIB 1307260046954, NPWP 1000000010129264, KKKPR No. 13072610215207001) dan 36 foto operasional lapangan asli di `docs/references/images/foto pekerja/`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | 5-Section Sticky Navigation | Desktop navbar dengan 5 link aktif: Beranda (#hero), Tentang Kami (#about), Layanan (#services), Manajemen (#management), Kontak (#contact) | M1 | `ORIGINAL_REQUEST.md` R1 |
| 2 | Accessible Mobile Drawer Menu | Drawer menu mobile (<=768px) dengan 5 link navigasi, tombol WhatsApp, focus trap, Escape handler, dan auto-close saat navigasi diklik | M1 | `ORIGINAL_REQUEST.md` R1 |
| 3 | Corporate Management Section | Seksi `#management` dengan kartu kepemimpinan (Direktur Soejiman, Komisaris Sutopo) dan 3 pilar divisi manajemen operasional (SDM/HR, Legalitas & Kepatuhan, Keuangan & Administrasi Proyek) | M1 | `ORIGINAL_REQUEST.md` R1, Akta No. 13, SK Menkumham |
| 4 | Responsive Column Reflow (#management) | 1 kolom pada mobile (<=480px), 2 kolom pada tablet (768px), 3–4 kolom pada desktop (>=1024px) dengan touch target >= 44x44px | M1 | `ORIGINAL_REQUEST.md` R1, PRD §3.4 |
| 5 | Mine Operations Photo Showcase Gallery | Galeri visual interaktif di `#gallery` menampilkan foto operasional tambang asli dari `docs/references/images/foto pekerja/` | M2 | `ORIGINAL_REQUEST.md` R2 |
| 6 | Gallery Responsive Aspect Ratio & Lazy Loading | Rasio aspek konsisten (4:3 / 16:9), `object-fit: cover`, `loading="lazy"`, zero layout shift (CLS < 0.1) | M2 | `ORIGINAL_REQUEST.md` R2 |
| 7 | Descriptive Accessibility Alt Texts | Alt text deskriptif untuk setiap foto galeri operasional tanpa generic filler | M2 | `ORIGINAL_REQUEST.md` R2 |
| 8 | Interactive Google Maps Container | Embed iframe Google Maps responsif di `#contact` dengan pin koordinat resmi Sumbawa Barat (-8.91113, 116.75098) | M3 | `ORIGINAL_REQUEST.md` R3, KKKPR |
| 9 | Direct "Buka di Google Maps" Button | Tombol aksi eksternal di `#contact` membuka peta Google Maps Sumbawa Barat di tab baru | M3 | `ORIGINAL_REQUEST.md` R3 |
| 10 | Contact Form Client-Side Validation | Validasi nama lengkap (min 3 karakter), kontak (email valid / nomor HP 9-15 digit), jenis layanan (wajib), pesan (min 10 karakter) | M3 | `ORIGINAL_REQUEST.md` R4 |
| 11 | Anti-Spam Honeypot Preservation | Field tersembunyi `_gotcha` yang menggagalkan bot spam otomatis secara senyap | M3 | `ORIGINAL_REQUEST.md` R4 |
| 12 | Input Sanitization & Mailto Fallback | Sanitasi XSS input pengguna, routing ke `info@karyasatyabuana.co.id` dengan fallback mailto terformat rapi | M3 | `ORIGINAL_REQUEST.md` R4 |
| 13 | Direct WhatsApp Chat Link | Tautan langsung chat WhatsApp ke customer service dengan pesan tersandi `encodeURIComponent` | M3 | `ORIGINAL_REQUEST.md` R4 |
| 14 | Schema.org LocalBusiness JSON-LD | Structured data lengkap dengan koordinat GeoCoordinates (-8.91113, 116.75098), alamat lengkap Maluk Sumbawa Barat, data pimpinan (founder Soejiman & Sutopo), dan KBLI resmi | M4 | `ORIGINAL_REQUEST.md` R5 |
| 15 | Zero Overflow & Core Web Vitals | Zero horizontal overflow pada 320px–480px (`scrollWidth <= clientWidth`), zero console errors, touch target >= 44x44px | M4 | `ORIGINAL_REQUEST.md` R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Navigation & Management Section | Implementasi seksi `#management`, kartu kepemimpinan (Soejiman & Sutopo), divisi operasional, dan pembaruan 5 menu pada navbar, drawer, dan footer | Survey complete | DONE |
| M2 | Mine Operations Photo Showcase | Kurasi dan integrasi 6 foto lapangan dari `docs/references/images/foto pekerja/`, pembuatan seksi galeri `#gallery` responsif dengan alt text deskriptif | M1 | DONE |
| M3 | Maps, Contact Form & WA Reliability | Integrasi Google Maps embed Sumbawa Barat (-8.91113, 116.75098), tombol eksternal Google Maps, validasi form, honeypot, sanitasi XSS, fallback mailto ke info@karyasatyabuana.co.id, dan verifikasi link WA | M2 | DONE |
| M4 | Local SEO & Mobile Responsiveness Finalization | Schema.org LocalBusiness JSON-LD dengan koordinat & pimpinan, audit anti-overflow 320px-480px, audit font/contrast, dan kepatuhan anti-slop | M3 | DONE |
| M5 | E2E Testing Suite & Quality Assurance | Verifikasi pengujian E2E otomatis (181 tests) dan validasi DOM/visual lintas breakpoint | M4 | DONE |
| M6 | Adversarial Hardening & Forensic Audit | Pengujian ketahanan, stress testing form/drawer, audit integritas forensik mandiri (CLEAN) | M5 | DONE |

## Code Layout
- `index.html`: Entry point single-page landing page.
- `assets/css/style.css`: Design tokens `:root`, reset, layout mobile-first, navigasi, seksi `#hero`, `#about`, `#services`, `#management`, `#gallery`, `#contact`, footer, modal/overlay.
- `assets/js/main.js`: Logika navigasi mobile drawer, focus trap, smooth scroll, form validation & mailto fallback, WA link handler.
- `assets/images/gallery/`: Foto-foto operasional tambang terkurasi dari `docs/references/images/foto pekerja/`.
- `assets/images/`: Logo, hero visual, favicon.

## Interface Contracts
### Navigation ↔ Section Anchors
- `#hero`: Beranda
- `#about`: Tentang Kami (Profil, Visi Misi, Nilai Inti)
- `#services`: Layanan (Mining Support, Konstruksi Industri, Manpower Supply)
- `#management`: Manajemen Korporat (Direktur, Komisaris, Divisi Operasional)
- `#gallery`: Galeri Operasional Lapangan (6 kategori teknis)
- `#contact`: Hubungi Kami (Alamat Kantor, Google Maps, Form Inquiry, WhatsApp)

### Form Inquiry ↔ Fallback Routing
- Fields: `fullName`, `contactInfo`, `serviceType`, `message`, `_gotcha` (honeypot).
- Action: Routing inquiry ke email `info@karyasatyabuana.co.id` dengan fallback `mailto:info@karyasatyabuana.co.id?subject=...&body=...`.
- State Feedback: Visual status banner dengan aria-live="polite".
