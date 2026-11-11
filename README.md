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
| `content/social/*.md` | Social Journey gallery posts (photograph, caption, platform, optional link to the post). A post can also have a `video`, an MP4 in H.264 format saved in `public/video/`. It plays muted while visible, has pause and sound buttons, and uses `image` as its still frame. |
| `content/categories.json` | Article categories. Only categories with articles appear as filters. |
| `content/offices.json` | Office locations, shown below the Contact section on the homepage and the Contact page. Managed in **Admin → Settings → Office Locations** (up to 4). Offices with latitude/longitude get a pin on the interactive map (Leaflet + OpenStreetMap tiles, loaded only when the section scrolls near). "Get Directions" uses the pasted Google Maps link with any starting point removed, so the route starts from the visitor; without a link it uses the coordinates. Entries marked `placeholder` show a "Coming soon" card with no pin or links. |
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

Homepage order: Hero, About, Practice Areas, **News**, **Blog & Articles**, **Social Journey**, Philosophy, Contact. Directly below the Social Journey gallery is a compact banner for the free digital visiting card, linking to https://dvc.vageshsamvedi.com/.

News and Social Journey show a "coming soon" state until they have published entries.

**Social Journey on the homepage** shows the latest 4 posts, always including the 2 newest reels, followed by a "View All Moments" button to `/social`. "Latest" means the post's own date or, if it has none, its `addedOn` time, which the admin editor fills in automatically. To keep a post on `/social` only, set `showOnHomepage: false` ("Show on homepage" in the admin editor). Every post always appears on `/social`.

**Sample content.** The placeholder sample posts have been removed from both News and Social Journey, now that real entries exist.

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

## Adding newspaper coverage to News

Follow this for every press clipping, so all reports look and read the same.

1. **Read the clipping first.** Transcribe the masthead (newspaper, city, date, page), headline, deck, byline, body, sidebars and any quotes. Use the **date printed on the newspaper**. Leave out anything the clipping does not state: names, dates, case numbers, amounts, places.
2. **Image.** Save the clipping unchanged (no crop, resize or recompression) to `public/images/news/YYYY-MM-DD-<newspaper>-<topic>.png`.
3. **File.** Create `content/news/YYYY-MM-<seo-slug>.md` (the slug is the URL) with:
   ```yaml
   title: "<English headline>"
   date: "YYYY-MM-DD"            # as printed on the newspaper; omit entirely if no date is visible
                                 # (shown as "Date not stated", listed after dated news, never featured)
   type: Cyber Law & Courts      # one of: Cyber Law & Courts, Human Rights & Legal Affairs, Appointments & Achievements, Community & Events
   location: <dateline place>, <state>
   publication: <Newspaper name>
   excerpt: "<one-sentence summary, facts from the clipping only>"
   cover: /images/news/<file>.png
   coverAlt: "<newspaper, date, page, original headline and what the photos show>"
   coverStyle: clipping          # shown whole, never cropped or tinted
   featured: true                # the newest featured item leads the homepage News section
   draft: false                  # publish only after the facts have been checked
   gallery:                      # optional: more clippings of the SAME story (do not create a duplicate article)
     - image: /images/news/<file>.png
       alt: "<what the clipping shows>"
       caption: "<source details; say if name/date not visible>"
   ```
4. **Body.** Open with a summary paragraph. Then use `##` sections in the order the report gives them (e.g. the incident, the complaint, police action, court order, public advice). Quotes go in a blockquote, attributed and marked "translated from Hindi". Finish with a **Source:** line naming the newspaper, city, date, page and correspondent.
5. **Before publishing,** check every sentence against the transcription, use gender-neutral wording when the original does not specify gender, and run `npm run dev` to view `/news` and the article page.

## Contact form

`POST /api/contact` validates input (zod), rejects honeypot or sub-3-second submissions silently, rate-limits by IP and
sends via [Resend](https://resend.com). Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (a verified
sender domain). Without them the form returns a clear "not configured" error in production (in development it logs and
succeeds). Messages are not stored. The in-memory rate limit is per server instance; use a shared store on serverless.

## Appointment booking chatbot

A gold chat button on every page (and **Book an Appointment** under the contact form) opens the assistant.

**It costs nothing to run.** There is no AI service, database or paid email provider. It uses only Google Calendar API and Gmail API (free within Google's normal quotas) and Vercel's free plan.

- **Questions** are answered in the visitor's browser by matching keywords (English, Hinglish and Hindi) to topics: about, practice areas, offices with directions, contact, fees, news, blog, social profiles, timings. Answers come only from the site's own content (`src/lib/assistant/knowledge.ts`), so nothing is invented. Personal legal problems get a polite "no advice in chat, please book" reply. To teach it a new way of asking, add words in `src/lib/assistant/answer.ts` (topics) or `AREA_KEYWORDS` in `knowledge.ts` (practice areas).
- **Booking:** date (date picker) → free times → full name → address → email → phone → purpose → confirm.
- **Google Calendar is the single source of truth.** The possible slots are Monday–Saturday, 6:00–9:00 pm IST, 30 minutes each (`src/lib/appointments/schedule.ts`). Sundays, past dates, configured holidays and slots less than an hour away are never offered. Any slot overlapping a busy period in the advocate's calendar (FreeBusy API) is hidden. Visitors see only free times, never event details. Edits made directly in Google Calendar take effect on the next availability check.
- **Before booking,** the server checks the calendar again, then creates the event "Client Appointment – Name" with the client's details in the description. Each slot has a fixed event id, so Google itself refuses a second booking of the same slot, even from two visitors at the same moment. "Appointment booked" is shown only after Google confirms the event exists. If the calendar can't be reached, nothing is confirmed.
- **Email:** the advocate gets a notification (Gmail API, sent from the connected account) at `APPOINTMENT_NOTIFY_EMAIL`. If sending fails, the booking stays and the failure is logged in Vercel; no second event is ever created.
- **Holidays:** `src/config/holidays-mp.ts`. Only `general` entries block booking; `optional` ones don't. Apart from the national days, the 2026 dates come from published calendars and are marked `verified: false` until checked against the GAD notification. For 2027 only the national days are listed so far, so add the full 2027 list when it is notified.
- **No admin dashboard:** the advocate manages the diary in Google Calendar. To block an evening, add an event, or mark the day busy.

### Google setup (one time, free)

1. **Google Cloud project.** Go to [console.cloud.google.com](https://console.cloud.google.com), sign in, and create a project (e.g. "Advocate Website"). No billing account is needed.
2. **Enable APIs.** In APIs & Services → Library, enable **Google Calendar API** and **Gmail API**.
3. **OAuth consent screen** (Google Auth Platform → Branding / Audience / Data access):
   - Set user type to **External**, with an app name, support email and developer email.
   - Under Data access, add the scopes `…/auth/calendar.freebusy`, `…/auth/calendar.events` and `…/auth/gmail.send`.
   - Under Audience, **Publish app** (status "In production"). While an app is in "Testing", Google expires its refresh tokens after 7 days. Publishing doesn't need Google's review for your own use: the advocate just sees an "unverified app" notice when connecting, and chooses **Advanced → Go to … (unsafe)**. If you keep it in Testing instead, add the account under **Test users** and reconnect weekly.
4. **OAuth client.** Go to Clients → Create client → **Web application**. Add these authorised redirect URIs:
   - `https://advocate-vagesh-samvedi.vercel.app/api/google/callback`
   - `https://www.vageshsamvedi.com/api/google/callback` (once the domain is live)
   - `http://localhost:3000/api/google/callback` (for local testing)

   Copy the client ID and client secret.
5. **Vercel environment variables:** set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CONNECT_KEY` (a long random text you keep private) and `APPOINTMENT_NOTIFY_EMAIL`. Redeploy.
6. **Connect the calendar account.** Open `https://<site>/api/google/connect?key=<GOOGLE_CONNECT_KEY>` and sign in as the calendar owner. Allow all requested permissions. The page then shows a refresh token: save it as `GOOGLE_REFRESH_TOKEN` in Vercel and redeploy.
7. **Check it.** `https://<site>/api/google/status?key=<GOOGLE_CONNECT_KEY>` should show `"ok": true`.
8. **Test** with a real booking from the chat. Check that the event appears in Google Calendar and the email arrives. Then delete the test event; the slot becomes free again.

To switch to the advocate's own account later, repeat step 6 signed in as that account and replace `GOOGLE_REFRESH_TOKEN`. To use a calendar other than the main one, set `GOOGLE_CALENDAR_ID` to that calendar's ID (Google Calendar → Settings → the calendar → Integrate calendar).

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
- [ ] Canonical URLs follow the Vercel production domain automatically. Only set `NEXT_PUBLIC_SITE_URL` once that address serves this site (www.vageshsamvedi.com still shows the old WordPress site).
- [ ] Verify the site in Google Search Console and Bing Webmaster Tools (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`), then submit `/sitemap.xml`.
- [ ] Create or claim a Google Business Profile for each office (Petlawad, Indore) with the same name, address and phone as the site.
