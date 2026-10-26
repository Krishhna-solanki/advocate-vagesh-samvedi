# Adv. Vagesh Samvedi — website

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Markdown content · Decap CMS.

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/lib/site.ts` | Name, contact details, profiles, firm, enrolment number. **Edit professional details here only.** |
| `src/lib/practice-areas.ts` | Practice areas and their detail pages. |
| `content/insights/*.md` | Articles (front matter + Markdown). File name = URL slug. |
| `content/categories.json` | Article categories. Only categories with articles appear as filters. |
| `content/publications.json` | External publications (journals, op-eds). Shown on `/publications` when non-empty. |
| `public/admin/` | Decap CMS (`/admin`). |
| `scripts/import-wordpress.mjs` | Imports full article text from the old WordPress site. |

Routes: `/`, `/about`, `/practice-areas`, `/practice-areas/[slug]`, `/insights` (search, category filters, load more —
state kept in the URL, e.g. `/insights?category=arbitration-adr&q=clat`), `/insights/[slug]`, `/publications`, `/contact`,
`/disclaimer`, `/privacy-policy`, `/sitemap.xml`, `/robots.txt`, `/api/contact`.
Old WordPress URLs (`/blogs`, `/law-books`, `/elementor-948` and the three post slugs) 308-redirect to their new homes.

## Article front matter

```yaml
title: "…"
date: "2025-05-28T08:17:41"     # IST if no offset given
category: arbitration-adr        # slug from content/categories.json
tags: [arbitration]
author: Vagesh Samvedi           # verified names only
excerpt: "…"                     # listing summary + standfirst
cover: /images/insights/x.jpg
coverAlt: "…"
featured: true                   # newest featured article leads /insights
draft: false                     # true = hidden in production, visible in `npm run dev`
seoTitle: "…"                    # optional
seoDescription: "…"              # optional
migrationStatus: full            # "summary" shows a migration notice on the article
```

A table of contents appears automatically when an article has three or more `##`/`###` headings.

## Content management (`/admin`)

Decap CMS stores content as commits in this repository, so it is persistent and needs no database. Sign-in and
authorisation are enforced by GitHub: only accounts with write access to the repository can edit or publish.
Editorial workflow is on — articles move Draft → In review → Ready, and nothing goes live until published.

**Needs configuration before it works in production:**

1. `repo:` in `public/admin/config.yml` points to `Krishhna-solanki/advocate-vagesh-samvedi`; change it if the repository moves.
2. Provide GitHub OAuth: either host on Netlify (built-in), or deploy an OAuth proxy (e.g. `decap-proxy` on
   Cloudflare Workers) and set `base_url:`.
3. Deploy from that repository so each CMS publish triggers a rebuild (Vercel, Netlify, Cloudflare Pages).

Local editing without sign-in: run `npm run cms` and `npm run dev` together, then open `http://localhost:3000/admin`.

## Animation & preloader

GSAP 3 (ScrollTrigger + SplitText) drives all motion from `src/components/ScrollAnimations.tsx`. Pages opt in with data
attributes, so server components need no client code:

| Attribute | Effect |
| --- | --- |
| `data-anim="fade-up"` | fades and rises into view (`data-delay="ms"` optional) |
| `data-anim="heading"` | line-by-line masked text reveal |
| `data-anim="stagger"` | children rise in sequence |
| `data-anim="children"` | each child animates as it scrolls into view (long text) |
| `data-anim="image"` | clip-path wipe with the image settling from a zoom |
| `data-anim="line-x"` / `"line-y"` | gold rule draws across / down |
| `data-anim="scrub-words"` | words brighten with scroll (homepage philosophy quote) |
| `data-anim="progress"` | reading-progress bar (article pages) |
| `data-speed="0.25"` | gentle parallax |

The `<Reveal>` component is a shorthand for these. Content that mounts later on the client calls `animateNew(root)`.

Other motion pieces:

- **Smooth scrolling.** `SmoothScroll.tsx` runs Lenis on GSAP's ticker and keeps ScrollTrigger in sync with it.
  - Same-page `#anchor` links scroll smoothly, move keyboard focus to the target and update browser history.
  - ScrollTrigger positions refresh after fonts, images and layout changes.
  - Scrolling is paused while the preloader, mobile menu or disclaimer is open; see `lockScroll` in `src/lib/smooth-scroll.ts`.
- **Scroll progress.** `ScrollUI.tsx` adds the gold progress bar at the top of the page and the back-to-top button.
- **Magnetic buttons.** `Magnetic.tsx` makes elements marked `data-magnetic` drift slightly toward the pointer. It runs only on desktop mice. Use it on primary CTAs only.
- **Mobile and touch.** Parallax and the hero's light drift are skipped on mobile and touch screens.

With reduced motion turned on, visitors get a fade-only version: no smooth scrolling, parallax, magnetic buttons or header hiding.

`src/components/Preloader.tsx` shows once per browser session. Its progress follows real loading (images, fonts,
window load), with a 1.6s minimum and a 3.2s cap. The site skips the preloader and all motion for visitors with
reduced motion turned on. Without JavaScript, nothing is hidden. If scripts fail to start within 7s, the page reveals
all content anyway.

## Contact form

`POST /api/contact` validates input (zod), rejects honeypot or sub-3-second submissions silently, rate-limits by IP and
sends via [Resend](https://resend.com). Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (a verified
sender domain). Without them the form returns a clear "not configured" error in production (in development it logs and
succeeds). Messages are not stored. The in-memory rate limit is per server instance; use a shared store on serverless.

## Importing the full WordPress articles

The three articles currently contain **summaries** (flagged on each page) because the full text could not be copied
automatically. Before switching the domain to this site:

1. In the old WordPress admin: **Tools → Export → Posts → Download**.
2. `npm run import:wp -- path/to/export.xml`
3. Review each file in `content/insights/` and commit. Imported articles are marked `migrationStatus: full`.

Do this before launch: once the domain points here, the old WordPress pages will no longer be reachable.

## Verify before launch

- [ ] **Phone and email.** The old site lists two sets: homepage `+91 78040 97520` / `adv.vageshsamvedi@gmail.com`
      (used here) and Legal Advisory page `9202315511` / `vageshsamvedi@gmail.com`. Confirm which to publish (`src/lib/site.ts`).
- [ ] **Enrolment number** — add to `site.enrolment` if desired.
- [ ] **Education** — LinkedIn lists Vikram University; confirm and add the degree if wished.
- [ ] **Practice areas** — taken from the old site. Tax law was mentioned on LinkedIn only and is deliberately omitted.
- [ ] **About text** and the **Professional Philosophy** quote on the homepage (proposed copy, not attributed).
- [ ] **Bar Council of India compliance review** — including the entry disclaimer, the "Get in Touch" button, and the
      promotional passages about Law Astra & Associates in two migrated articles.
- [ ] **Privacy policy** — review against actual hosting/email providers.
- [ ] Set `NEXT_PUBLIC_SITE_URL` for canonical URLs, sitemap and Open Graph tags.
