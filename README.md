# HAJA d.o.o. – spletna stran

Prenovljena spletna stran podjetja **HAJA, sistemi v avtomatizaciji, d.o.o.** (www.haja.si).
Izdelava: [cus.si](https://cus.si).

## Tehnologija

| Del | Rešitev |
| --- | --- |
| Ogrodje | Next.js 16 (App Router, React 19, TypeScript) |
| Slog | Tailwind CSS 4, lastni oblikovni žetoni v `src/app/globals.css` |
| Animacije | [motion](https://motion.dev) (`motion/react`) |
| Jeziki | next-intl – slovenščina (`/sl`), angleščina (`/en`), nemščina (`/de`) z lokaliziranimi URL-ji |
| Kontaktni obrazec | API pot `/api/contact` + nodemailer (SMTP) |
| Analitika | Google Analytics 4, naložena šele po privolitvi (Consent Mode v2) |
| SEO | canonical + hreflang za vsak jezik, `sitemap.xml`, `robots.txt`, Open Graph slika, JSON-LD (Organization / ProfessionalService) |

## Zagon

```bash
npm install
cp .env.example .env.local   # izpolnite SMTP in URL
npm run dev                  # http://localhost:3000
```

Produkcija:

```bash
npm run build
npm run start
```

## Okoljske spremenljivke

Glej `.env.example`:

- `NEXT_PUBLIC_SITE_URL` – javni URL strani (za canonical, sitemap, OG).
- `NEXT_PUBLIC_GA_ID` – GA4 ID (`G-…`). Če je prazen, se analitika ne naloži.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` – SMTP za pošiljanje povpraševanj.
- `CONTACT_TO` – prejemnik povpraševanj (privzeto info@haja.si).
- `CONTACT_FROM` – pošiljatelj (mora biti dovoljen pri SMTP ponudniku).

Brez nastavljenega SMTP obrazec vrne napako 503 in obiskovalcu prikaže neposredni e-naslov.

## Jeziki in zaznavanje

`src/proxy.ts` izbere jezik po vrstnem redu:

1. jezik v URL-ju (`/sl`, `/en`, `/de`),
2. shranjena izbira obiskovalca (piškotek `haja_locale`, 12 mesecev),
3. država obiskovalca iz glave gostitelja (`x-vercel-ip-country`, `cf-ipcountry`): SI → sl, DE/AT/CH/LI → de,
4. `Accept-Language` brskalnika,
5. sicer angleščina.

Vsa besedila so v `messages/sl.json`, `messages/en.json`, `messages/de.json`. Lokalizirane poti (npr. `/en/services`, `/de/leistungen`) so definirane v `src/i18n/routing.ts`.

## Struktura

```
src/app/[locale]/           strani (domov, storitve, reference, o podjetju, kontakt, pravne strani)
src/app/api/contact/        pošiljanje kontaktnega obrazca
src/components/             glava, noga, piškotki, galerija, obrazec, odseki domače strani
src/lib/site.ts             podatki podjetja (naslov, telefon, matična/davčna številka)
src/lib/references.ts       seznam fotografij po področjih referenc
public/images/              fotografije (prenesene s stare strani, brez EXIF podatkov)
```

## Piškotki in zasebnost

- Pasica s piškotki z možnostmi »Sprejmi vse«, »Samo nujni« in nastavitvami po kategorijah.
- Izbira se hrani v piškotku `haja_consent` (12 mesecev); nastavitve je mogoče kadar koli spremeniti v nogi strani.
- Strani: Piškotki, Politika zasebnosti, Pravno obvestilo (v vseh treh jezikih). Datum zadnje posodobitve je v `src/lib/legal.ts`.

## Namestitev

Projekt je pripravljen za Vercel (gostovanje z geo glavami za zaznavanje države) ali kateri koli Node.js strežnik (`npm run build && npm run start`). Za lastno gostovanje za Cloudflare proxyjem deluje zaznavanje države prek `cf-ipcountry`.

## Predogled na GitHub Pages

Statični predogled se objavi na vejo `gh-pages` z ukazom:

```bash
npm run deploy:pages
```

(Vzorec delovnega toka za samodejno objavo ob vsakem pushu je v `scripts/github-pages.workflow.yml`; za uporabo ga premaknite v `.github/workflows/`, žeton GitHub CLI pa potrebuje pravico `workflow`.)

Statična različica je namenjena predstavitvi:

- jezik se izbere v brskalniku (brez zaznavanja države), naslovi so za vse jezike enaki (`/en/storitve` namesto `/en/services`),
- kontaktni obrazec odpre e-poštni odjemalec (`mailto:`) namesto pošiljanja prek strežnika,
- slike niso optimizirane na strežniku.

Za pravo objavo pri naročniku uporabite navadni `npm run build` (Vercel ali Node.js strežnik), kjer delujeta zaznavanje jezika in pošiljanje obrazca.
