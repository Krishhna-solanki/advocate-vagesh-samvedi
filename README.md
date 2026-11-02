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
| `content/insights/*.md` | Blog articles (front matter + Markdown), served at `/blog/<file name>`. |
| `content/news/*.md` | News: professional activities, events, achievements and updates, served at `/news/<file name>`. |
| `content/social/*.md` | Social Life gallery posts (photograph, caption, platform, optional link to the post). |
| `content/categories.json` | Article categories. Only categories with articles appear as filters. |
| `content/offices.json` | Office locations, shown below the Contact section on the homepage and the Contact page. Managed in **Admin → Settings → Office Locations**. Entries marked `placeholder` show a badge and no map link. |
| `content/publications.json` | External publications (journals, op-eds). Shown on `/publications` when non-empty. |
| `public/admin/` | Decap CMS (`/admin`). |
| `scripts/import-wordpress.mjs` | Imports full article text from the old WordPress site. |

Routes:

- `/`, `/about`, `/practice-areas`, `/practice-areas/[slug]`
- `/news` (type filter, grouped by year) and `/news/[slug]`
- `/blog` (search, category filters, load more) and `/blog/[slug]`. Filter state is kept in the URL, e.g. `/blog?category=arbitration-adr&q=clat`.
- `/social`, `/publications`, `/contact`, `/disclaimer`, `/privacy-policy`
- `/sitemap.xml`, `/robots.txt`, `/api/contact`

Old URLs 308-redirect to their new homes. That covers the WordPress pages (`/blogs`, `/law-books`, `/elementor-948` and the three post slugs) and the former `/insights` pages.

Homepage order: Hero, About, Practice Areas, **News**, **Blog & Articles**, **Social Life**, **Digital Visiting Card**, Philosophy, Contact. The Digital Visiting Card section links to https://dvc.vageshsamvedi.com/.

News and Social Life show a "coming soon" state until they have published entries.

**Sample content.** The files `content/news/sample-*.md` and `content/social/sample-*.md` are labelled placeholders marked `draft: true`. They let you preview the layouts in `npm run dev`, and never appear on the live site. Delete them once real entries exist.

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
featured: true                   # newest featured article leads /blog
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

**Done.** The three published articles were migrated in full from the old site's WordPress API on 2 November 2026.

- **Taken from the original:** titles, publication dates, body text, bold lines, excerpts, tags and image descriptions.
- **Formatting:** paragraph breaks became Markdown paragraphs, and characters Markdown would reinterpret were escaped. Each article's displayed text was checked against the original HTML and is identical.
- **Skipped:** the two "Test Post for WordPress" placeholders.

To migrate further posts later, use one of:

- `npm run import:wp -- export.xml` (WordPress → **Tools → Export → Posts**);
- `npm run import:wp -- posts.json` (saved from `/wp-json/wp/v2/posts?per_page=100&_embed`).

## Verify before launch

- [ ] **Phone and email.** The old site lists two sets: homepage `+91 78040 97520` / `adv.vageshsamvedi@gmail.com`
      (used here) and Legal Advisory page `9202315511` / `vageshsamvedi@gmail.com`. Confirm which to publish (`src/lib/site.ts`).
- [ ] **Enrolment number** — add to `site.enrolment` if desired.
- [ ] **Education** — LinkedIn lists Vikram University; confirm and add the degree if wished.
- [ ] **Practice areas** — taken from the old site. Tax law was mentioned on LinkedIn only and is deliberately omitted.
- [ ] **About text** and the **Professional Philosophy** quote on the homepage (proposed copy, not attributed).
- [ ] **Bar Council of India compliance review** — including whether to restore an entry disclaimer pop-up (removed at the owner's request), the "Get in Touch" button, and the
      promotional passages about Law Astra & Associates in two migrated articles.
- [ ] **Privacy policy** — review against actual hosting/email providers.
- [ ] Set `NEXT_PUBLIC_SITE_URL` for canonical URLs, sitemap and Open Graph tags.
