# HAJA d.o.o. – website

Redesign of the website of **HAJA, sistemi v avtomatizaciji, d.o.o.** (www.haja.si), an industrial automation company from Slovenia.
Design and development: [cus.si](https://cus.si).

Live preview: https://custadej.github.io/HajaSpletnaStran/

## Stack

| Part | Solution |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS 4 with custom design tokens in `src/app/globals.css` |
| Animations | [motion](https://motion.dev) (`motion/react`): hero collage with 3D tilt and parallax, scroll reveals, counters, photo marquee, lightbox |
| Languages | next-intl – Slovenian (`/sl`), English (`/en`), German (`/de`) with localized URLs |
| Contact form | API route `/api/contact` + nodemailer (SMTP), honeypot and rate limiting |
| Analytics | Google Analytics 4, loaded only after consent (Consent Mode v2) |
| SEO | canonical + hreflang for every language, `sitemap.xml`, `robots.txt`, Open Graph image, JSON-LD (Organization / ProfessionalService), 301 redirects from the old WordPress URLs |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in SMTP and the site URL
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

## Environment variables

See `.env.example`:

- `NEXT_PUBLIC_SITE_URL` – public URL of the site (canonical URLs, sitemap, Open Graph).
- `NEXT_PUBLIC_GA_ID` – GA4 measurement ID (`G-…`). Analytics is not loaded when empty.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` – SMTP account used to send enquiries.
- `CONTACT_TO` – recipient of enquiries (defaults to info@haja.si).
- `CONTACT_FROM` – sender address (must be allowed by the SMTP provider).

Without SMTP settings the form returns 503 and shows the visitor the direct e-mail address instead.

## Languages and detection

`src/proxy.ts` picks the language in this order:

1. locale prefix in the URL (`/sl`, `/en`, `/de`),
2. the visitor's saved choice (cookie `haja_locale`, 12 months),
3. the visitor's country from the hosting platform's geo header (`x-vercel-ip-country`, `cf-ipcountry`): SI → sl, DE/AT/CH/LI → de,
4. the browser's `Accept-Language`,
5. otherwise English.

All copy lives in `messages/sl.json`, `messages/en.json` and `messages/de.json`. Localized paths (for example `/en/services`, `/de/leistungen`) are defined in `src/i18n/routing.ts`.

## Structure

```
src/app/[locale]/           pages (home, services, references, about, contact, legal pages)
src/app/api/contact/        contact form endpoint
src/components/             header, footer, cookie consent, gallery, form, home page sections
src/lib/site.ts             company data (address, phone, registration and tax numbers)
src/lib/references.ts       project photos per reference category
public/images/              photos (taken from the previous site, EXIF stripped)
scripts/                    static export helpers (GitHub Pages preview)
```

## Cookies and privacy

- Cookie banner with "Accept all", "Necessary only" and per-category settings.
- The choice is stored in the `haja_consent` cookie (12 months) and can be changed any time from the footer.
- Pages: Cookies, Privacy policy, Legal notice (in all three languages). The "last updated" date is in `src/lib/legal.ts`.

## Deployment

The project is ready for Vercel (geo headers for country detection) or any Node.js server (`npm run build && npm run start`). Behind a Cloudflare proxy, country detection works through `cf-ipcountry`.

## GitHub Pages preview

A static preview is published to the `gh-pages` branch with:

```bash
npm run deploy:pages
```

(A workflow for automatic deployment on every push is provided in `scripts/github-pages.workflow.yml`; move it to `.github/workflows/` to use it. The GitHub CLI token needs the `workflow` scope for that.)

The static preview is meant for demonstration only:

- the language is picked in the browser (no country detection) and URLs are the same for every language (`/en/storitve` instead of `/en/services`),
- the contact form opens the visitor's mail client (`mailto:`) instead of sending through the server,
- images are not optimized on the server.

For the real deployment use the normal `npm run build` (Vercel or a Node.js server), where language detection and form delivery work.
