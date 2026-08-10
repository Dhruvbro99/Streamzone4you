# StreamZone4You

A static clone of the StreamZone4You Blogger theme (dark UI, orange/blue
accents, category bar, year filter, post grid, single-post layout), rebuilt
as plain HTML/CSS/JS so it can be hosted for free on GitHub Pages — no
Blogger required.

See `NOTES.md` for a log of what was built/changed and why, and
`designsystem.md` for the color/type/component reference.

## File structure

```
StreamZone4You/
├── index.html              Homepage (post grid, category + year filters, search)
├── post.html                 Single post view (reads ?slug= from the URL)
├── search.html                 Search results page
├── dashboard.html               Owner dashboard — gated, not publicly linked
├── data/
│   ├── posts.json                All post content — this is what you edit
│   └── site-config.json          Site name, tagline, logo text
├── assets/
│   ├── css/
│   │   ├── style.css               Site styling (ported from the original theme)
│   │   └── dashboard.css           Dashboard-only styling
│   └── js/
│       ├── config.js               Loads site-config.json, applies it site-wide
│       ├── nav.js                  Mobile hamburger menu toggle
│       ├── posts.js                Renders the grid, filters, search, single post
│       └── dashboard.js            Dashboard logic: gate, tabs, settings, post CRUD
├── NOTES.md
├── designsystem.md
└── README.md
```

## How content works

There are no hand-written post pages. `post.html` and `index.html` both read
`data/posts.json` at load time and render themselves from it. To add, edit,
or remove a post, use the dashboard (see below) or edit
`data/posts.json` directly.

Each entry looks like this:

```json
{
  "slug": "unique-url-friendly-id",
  "title": "Post Title (Year)",
  "category": "Action",
  "year": "2026",
  "date": "2026-08-01",
  "thumbnail": "https://link-to-poster-image.jpg",
  "body": "<p>Full post HTML goes here — paragraphs, <h3> headers, tables, etc.</p>"
}
```

- `slug` becomes the URL: `post.html?slug=unique-url-friendly-id`
- `category` currently used: `Action`, `Comedy`, `Drama`, `Sci-fi` — add a new
  one just by using a new value; it'll automatically appear in the top bar
- `body` accepts raw HTML, so your existing quality/download tables from
  Blogger posts can be pasted in almost as-is

The 5 posts currently in `data/posts.json` are placeholders — replace them
with your real posts once you export them from Blogger (**Settings → Manage
blog → Back up content**). Send me that export and I can convert every post
into `posts.json` entries automatically.

Site identity (name, tagline) lives in `data/site-config.json` and drives
page titles and the footer copyright line across the site.

## Using the dashboard

Open `dashboard.html` (locally via the server below, or on your live GitHub
Pages site). It's password-protected — default password is **`streamzone`**.

**Change the default password immediately.** This is a client-side lock
only (there's no real backend to enforce it), so anyone determined enough
with browser devtools could bypass it — but it keeps the page out of casual
reach, which is all a static site can offer. To set your own password:

1. Open `assets/js/dashboard.js`.
2. Find the `ADMIN_PASSWORD` line near the top and change the value between
   the quotes to whatever you want.
3. Save, commit, and push.

Note the password is stored in plain text in this file, so it's visible to
anyone who views the page source — same as everything else about this lock,
it's a deterrent, not real security.

Once unlocked, the dashboard has two tabs:

- **Site settings** — edit site name/tagline/logo text, then **Download
  site-config.json** and replace `data/site-config.json` in your repo.
- **Posts** — add/edit/delete posts, then **Download posts.json** and
  replace `data/posts.json` in your repo.

Either way: download → replace the file in your repo → commit/push to
actually publish the change. Nothing saves itself. "Lock this page" clears
the unlocked state for that browser tab session.

The dashboard isn't linked from the site's navigation, but treat the
password as a deterrent, not real security — for anything sensitive, make
the GitHub repo private too.

## Running it locally

Because the pages fetch JSON files with JavaScript, opening `index.html`
directly by double-clicking it (`file://`) will fail due to browser CORS
rules. Run a tiny local server instead:

```bash
cd StreamZone4You
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Publishing to GitHub Pages

1. Create a new GitHub repository (e.g. `streamzone4you`).
2. Upload everything **inside** this `StreamZone4You` folder to the repo root
   (not the folder itself — its contents).
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   branch: `main`, folder: `/ (root)`. Save.
5. GitHub gives you a live URL like `https://yourusername.github.io/streamzone4you/`
   within a minute or two.

## Notes

- Ad slots from the original theme were intentionally left out (no third-party
  ad scripts included). If you want ads back in, add your ad network's embed
  code directly into `index.html`/`post.html` wherever you'd like it to show.
- Category and year filters, and the search page, are fully working — they
  just read/filter the same `posts.json` data, no backend needed.
