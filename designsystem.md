# DESIGN SYSTEM — StreamZone4You

### Colors (in `assets/css/style.css`)
```css
--bg:           #0d0f12   /* page background */
--bg-alt:       #0b0c10   /* top category bar background */
--surface:      #1a1d24   /* header, cards, panels */
--surface-alt:  #111318   /* table backgrounds */
--border:       #2e3440   /* card/table/panel borders */
--text:         #e2e8f0   /* body text */
--text-muted:   #94a3b8   /* secondary labels, nav links */
--text-dim:     #64748b   /* footer, meta text */
--accent:       #f97316   /* orange — primary accent, links on hover, buttons */
--accent-dark:  #ea580c   /* button gradient end */
--accent-blue:  #38bdf8   /* blue — links, hover-swap accent */
```
(These aren't literal CSS custom properties in the file yet — they're
written directly as hex values throughout `style.css`. Treat this table as
the reference palette if you ever refactor to variables.)

### Fonts
System UI stack: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` for
everything. No webfonts loaded — keeps the site fast and dependency-free.

### Components
- **Cards** (`.anime-card`): dark surface, `border-radius: 8px`,
  `1px solid var(--border)`, lifts and glows orange on hover
  (`translateY(-5px)`, border → `--accent`).
- **Primary button** (`.download-btn`, `.btn-primary`): orange-to-dark-orange
  gradient, white text, uppercase, swaps to blue on hover.
- **Secondary button** (`.btn-secondary`): flat dark surface, no gradient.
- **Danger button** (`.btn-danger`): dark red, used only for delete actions.
- **Inputs**: dark surface background, `1px solid var(--border)`, focus ring
  switches border to `--accent`.
- **Category bar**: horizontal scroll on mobile, uppercase bold labels,
  blue on hover/active.
- **Year filter**: native `<details>/<summary>` dropdown — no JS needed for
  open/close, only for populating options.
- **Dashboard tabs** (`.dash-tab`): flat text tabs, orange underline when
  active.

### Motion
- Card hover lift: `transform 0.3s ease, border-color 0.3s ease`
- Link color swap: `0.2s ease-in-out`
- No page-load animations — kept deliberately quiet since the content
  (movie/show posters) is the visual focus, not the chrome.

### Category emoji (content convention, not CSS)
Categories are plain strings in `data/posts.json` (`Action`, `Comedy`,
`Drama`, `Sci-fi`); `assets/js/posts.js` appends an emoji per category for
display only:
- Action 🔥
- Comedy 🤣🤪
- Drama 🎬🎭
- Sci-fi 👾👽

Add a new category by using a new string in a post's `category` field — it
appears in the top bar automatically. Add its emoji in the
`CATEGORY_EMOJI` map at the top of `assets/js/posts.js` if you want one.

### UI Tone
- Uppercase, bold, short labels for navigation and buttons (category bar,
  buttons, table headers).
- Empty states: plain and instructive — e.g. "No posts found. Add entries
  to data/posts.json to fill this section."
- No `alert()` for user-facing messaging — status banners
  (`.status-msg.ok` / `.status-msg.err`) are used in the dashboard instead;
  the one exception is `confirm()` before an irreversible delete.
