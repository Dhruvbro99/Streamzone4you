# StreamZone4You — Change Log & Notes

## What changed and why
The site was originally a single-purpose static clone of the StreamZone4You
Blogger theme with an ad-hoc `admin.html` for adding posts. This pass
restructures it to match a config-driven, multi-file pattern:

- **Site identity is now data, not hardcoded HTML.** `data/site-config.json`
  holds the site name, tagline, and logo text; `assets/js/config.js` applies
  it wherever a page opts in with `data-site="..."`.
- **Shared behavior lives in its own file per concern**, not inline
  `<script>` blocks: `config.js` (site identity), `nav.js` (mobile hamburger
  menu), `posts.js` (grid/filter/search/single-post rendering, renamed from
  the old `main.js`).
- **`admin.html` became `dashboard.html`**, restructured with tabs
  (**Site settings**, **Posts**) instead of one long page, so it can grow
  new tabs later without a redesign. Logic moved to `assets/js/dashboard.js`.
- **Theme/content were left alone.** Colors, fonts, category emoji, post
  card layout, and the sample posts are unchanged — only the file
  organization changed.

## Current files
| File | Purpose |
|---|---|
| `data/site-config.json` | Site name, tagline, logo text — single source of truth |
| `data/posts.json` | All post content — the only file you touch to add real posts |
| `assets/js/config.js` | Loads site-config.json, applies it wherever `data-site="..."` appears |
| `assets/js/nav.js` | Hamburger menu toggle, shared by every page |
| `assets/js/posts.js` | Post fetch/render helpers for the grid, filters, search, and single-post view |
| `assets/js/dashboard.js` | Dashboard logic: password gate, tabs, settings form, post CRUD |
| `assets/css/style.css` | Site styling (ported from the original Blogger theme) + hamburger nav |
| `assets/css/dashboard.css` | Dashboard-only styling (forms, tabs, post list) |
| `index.html` / `search.html` | Public pages — post grid with category/year filters and search |
| `post.html` | Single post view (reads `?slug=` from the URL) |
| `dashboard.html` | Owner dashboard — gated, not linked from any public nav |

## How the "no backend" limits show up
- **Site settings / posts**: the dashboard edits an in-memory copy, then you
  click "Download" and replace the corresponding JSON file in your project
  before your next deploy. Nothing saves itself.
- **Dashboard password**: a client-side hash check only (see the comment at
  the top of `assets/js/dashboard.js`). It stops casual visitors, not a
  determined one with devtools. Change the default password before you rely
  on it at all.

## Manual steps for you
1. Open `assets/js/dashboard.js` and change `ADMIN_PASSWORD_HASH` from the
   default (`streamzone`) to your own — instructions are in the file and in
   `README.md`.
2. Fill in your real posts via the dashboard or by editing `data/posts.json`
   directly, replacing the 5 placeholder entries.
3. After any dashboard edit, download the updated JSON file and commit/push
   it to actually publish the change.

## Flagged as future work, not built
- Real authentication for the dashboard (e.g. Supabase/Firebase) instead of
  the password-hash gate.
- A CMS or server-side storage so edits publish without a manual
  download-and-push step.
- Static-generated post pages (one physical HTML file per post) for better
  SEO than the current `post.html?slug=` router.

## Testing done
Ran the site through a local server and exercised the actual JS: the post
grid renders from `posts.json`, category/year filters and search all work,
a bad slug on `post.html` shows a calm "not found" state instead of
breaking, the hamburger menu opens/closes on mobile widths, and the
dashboard gate correctly blocks a wrong password and unlocks on the right
one — then adding, editing, and deleting a post all produced correct
downloadable JSON, as did editing and downloading site settings.
