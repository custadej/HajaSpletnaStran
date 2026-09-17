# HAJA d.o.o. website – project notes for future sessions

Read this first. It records what was built, where things live, decisions the client made and the gotchas hit along the way. No chat history is needed.

## What this is
- Redesign of www.haja.si for **HAJA, sistemi v avtomatizaciji, d.o.o.** (industrial automation, Naraplje 11, 2322 Majšperk). Built September 2026 by the user (Tadej Čuš, agency **cus.si**) with Claude Code.
- Client gave no material: all text was rewritten from the old WordPress site, all photos scraped from it (`public/images`, EXIF stripped, renamed by subject).
- Repo: https://github.com/custadej/HajaSpletnaStran (public). Live preview (static demo): https://custadej.github.io/HajaSpletnaStran/
- The real deployment for the client is NOT done yet: needs Vercel or a Node server + SMTP credentials (see `.env.example`).

## Stack
Next.js 16.3 (App Router, Turbopack, `src/proxy.ts` instead of middleware), React 19, TypeScript, Tailwind CSS 4 (`@theme` tokens in `src/app/globals.css`), `motion/react` 13, `next-intl` 4 (sl/en/de), `lucide-react`, `nodemailer`, `zod`. Fonts: Bricolage Grotesque (display) + Figtree (body) via next/font.

## Commands
- `npm run dev` – http://localhost:3000 (redirects to language)
- `npm run build` / `npm run start` – production
- `npx tsc --noEmit`, `npx eslint src scripts` – must stay clean (React 19 rule: no setState directly in effects)
- `npm run deploy:pages` – builds the static demo in `.pages-build/` and force-pushes it to the `gh-pages` branch (GitHub Pages). Run after every change you want visible on the preview link.

## Where things are
```
messages/{sl,en,de}.json         ALL copy (same key structure in all three; validate with a key-diff before committing)
src/i18n/routing.ts              locales, localized slugs (identity slugs when NEXT_PUBLIC_STATIC_EXPORT=true)
src/proxy.ts                     language detection: URL prefix > cookie haja_locale > country header (SI->sl, DE/AT/CH/LI->de) > Accept-Language > en
                                 matcher MUST be explicit ["/", "/(sl|en|de)/:path*"]; lookahead matchers never match in Next 16
src/app/[locale]/layout.tsx      root layout, fonts, metadata (icons use NEXT_PUBLIC_BASE_PATH), JSON-LD, Header/Footer/CookieConsent/Analytics
src/app/[locale]/page.tsx        home: Hero > Stats > ServicesSection > PhotoMarquee > TechSection > ValuesSection > ReferencesSection(showIndustries) > ProcessSection > CtaSection
src/app/[locale]/storitve        services page (ServicesSection h1 + Tech + Industries + Process + CTA)
src/app/[locale]/reference/*     overview + 3 category pages (rubber / robots / automation) via components/ReferencePage.tsx
src/app/[locale]/o-podjetju      about (paragraphs, facts table, 4-photo gallery, Stats, values)
src/app/[locale]/kontakt         contact form + company details card (hours = "by arrangement")
src/app/[locale]/{piskotki,zasebnost,pravno-obvestilo}  legal pages, date in src/lib/legal.ts
src/app/[locale]/[...rest]       catch-all -> localized 404 (removed in static build)
src/app/api/contact/route.ts     form endpoint: zod, honeypot `website`, 5 msgs/10 min per IP, SMTP env, 503 if SMTP missing
src/app/{sitemap,robots,manifest}.ts   force-static; sitemap has hreflang alternates
src/components/Header.tsx        sticky header, references dropdown, mobile menu (rendered OUTSIDE <header>: backdrop-blur would clip a fixed panel), menu state keyed by pathname
src/components/LocaleSwitcher.tsx + Flag.tsx   flags + SL/EN/DE, keeps current page
src/components/Logo.tsx          <Image> of public/haja-logo.png (dark) / haja-logo-white.png (footer)
src/components/CookieConsent.tsx banner + settings modal; src/lib/consent.ts (cookie haja_consent 12 months, useConsent via useSyncExternalStore)
src/components/Analytics.tsx     GA4 (NEXT_PUBLIC_GA_ID) only after consent, Consent Mode v2, SPA page_view
src/components/Gallery.tsx       photo grid + lightbox (keyboard, Escape, arrows)
src/components/ContactForm.tsx   client validation; mailto fallback when NEXT_PUBLIC_STATIC_EXPORT=true
src/components/motion/           Reveal / Stagger (scroll reveals), Counter, TiltCard (pointer 3D tilt)
src/components/home/*            Hero (3-photo collage, tilt + parallax, glow blobs), Stats, ServicesSection, PhotoMarquee (CSS marquee), TechSection (dark, bg photo + 4 photos), ValuesSection, IndustriesSection (services page only), ReferencesSection (tall photo cards + industry chips), ProcessSection (5 steps + machinery-factory.jpg), CtaSection (centered, photo bg, primary + phone button)
src/lib/site.ts                  company constants (address, phone +386 31 395 374, e-mail, matična 8034095000, davčna 48233897, Peter Čuš, LinkedIn, GA id, author cus.si)
src/lib/references.ts            photo lists per category + cover photos (covers differ from hero collage photos on purpose)
src/lib/seo.ts                   buildMetadata(): canonical + hreflang + OG
src/lib/image-loader.ts          static-export image loader (prefixes base path)
scripts/deploy-pages.mjs         static demo build + push to gh-pages
scripts/finish-static-export.mjs root index.html redirect, .nojekyll, flattens __next.* prefetch files
scripts/github-pages.workflow.yml  Actions workflow (unused: user's gh token lacks `workflow` scope)
public/haja-logo*.png            ORIGINAL client logo, outline thickened + clipped "o" glyphs repaired (see "Logo" below)
public/favicon.*, icon-*.png, apple-icon.png   ORIGINAL favicon of the old site (blue factory icon)
public/og.jpg                    Open Graph image with the real logo
```

## Design decisions (client feedback, do not undo)
- Light premium look: steel greys (`--color-steel-*`), navy darks (`--color-graphite-*`), ONE blue accent (`--color-signal` #2f6bff). Client explicitly rejected the first yellow accent and a decorative trend line behind the hero headline.
- Client wanted: more photos everywhere (marquee, photo cards, dark section photos, about gallery), flags next to language codes, legible "d.o.o." in the logo, office hours "Po dogovoru / By arrangement / Nach Vereinbarung", centred CTA with phone as an equal-height button, no photo on the contact page, no repeated photos/sections (industries merged into references), process section photo = detailed machinery, not people or control panels.
- Motion kept restrained and reduced-motion aware. Hover shine on reference cards (`.shine`), drifting glow blobs in hero (`.blob-a/.blob-b`).

## Logo
The old site's logo PNG (2846×753) is a hairline outline and is clipped at its right edge (both "o" in "d.o.o." lose their outer stroke). `public/haja-logo.png` was produced with Pillow: pad, mirror the left half of each "o" around its centre, dilate alpha with MaxFilter(15), crop, export 1000 px wide in navy and white. If it needs regenerating, the original is at https://www.haja.si/wp-content/uploads/2022/10/haja-logo-png.png. Rename the file after any change (Next's image cache is keyed by URL).

## Static demo (GitHub Pages) specifics
`STATIC_EXPORT=true` in next.config.ts switches to `output: "export"`, trailingSlash, basePath `/HajaSpletnaStran`, custom image loader, no redirects/headers. The deploy script builds a throw-away copy without `src/proxy.ts`, `src/app/api` and `[...rest]`. Known Next 16 quirk: export writes `__next.x/__PAGE__.txt` but the client fetches `__next.x.__PAGE__.txt`; `finish-static-export.mjs` creates flat copies so there are no 404s. Do not set a custom `distDir` in export mode (the export then lands in distDir instead of `out/`).

## Git / GitHub rules
- Commit author must be **Tadej Čuš <cus.tadej1@scptuj.si>** (repo-local git config is set). No Co-Authored-By or AI attribution lines. Repo description and README are in English (like the user's other repos).
- Commit only when the user asks. `AGENTS.md` is gitignored (regenerated by `next dev`); `CLAUDE.md` is committed.

## Testing approach that worked
- The Claude-in-Chrome extension was unreliable here; Playwright with the installed Chrome (`chromium.launch({ channel: "chrome" })`, package installed in a scratch folder, not in the repo) gave real screenshots and console/404 checks. Reveal animations are `whileInView`, so scroll through the page before full-page screenshots.
- Long Bash heredocs (>~250 lines) get truncated by the tool on this machine: write big files with the Write tool.

## Open items for the client / user
- SMTP credentials for the contact form (`.env.local`), production hosting (Vercel recommended, geo header enables country detection).
- Unverified claims copied from the old site: "20 years experience", "150+ customers", "5 long-term partners", Peter Čuš named as the person behind the company.
- GA4 ID `G-7QQ2C449QM` reused from the old site; confirm it is still wanted.
