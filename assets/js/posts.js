/* =========================================================
   StreamZone4You — site logic
   Reads data/posts.json and renders the category bar, year
   filter, post grid, search, and single-post view.
   To add a real post: open data/posts.json and add a new
   object to the array. Nothing else needs to change.
   ========================================================= */

const CATEGORY_EMOJI = {
  "Action": "🔥",
  "Comedy": "🤣🤪",
  "Drama": "🎬🎭",
  "Sci-fi": "👾👽"
};

async function loadPosts() {
  const res = await fetch("data/posts.json");
  if (!res.ok) throw new Error("Could not load posts.json");
  const posts = await res.json();
  // newest first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function qs(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function cardHtml(post) {
  const thumb = post.thumbnail || "https://placehold.co/300x450/1a1d24/ffffff?text=No+Poster";
  return `
    <a class="anime-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
      <img class="card-thumbnail" src="${thumb}" alt="${post.title}">
      <div class="card-info">
        <h3 class="card-title">${post.title}</h3>
        <span class="download-btn">View Post</span>
      </div>
    </a>`;
}

function renderCategoryBar(posts) {
  const el = document.getElementById("top-categories");
  if (!el) return;
  const cats = [...new Set(posts.map(p => p.category))];
  const active = qs("category") || "";
  let html = `<ul>
    <li><a data-cat="" class="${active === "" ? "active" : ""}" href="index.html">All</a></li>`;
  cats.forEach(c => {
    const label = c + (CATEGORY_EMOJI[c] ? " " + CATEGORY_EMOJI[c] : "");
    html += `<li><a data-cat="${c}" class="${active === c ? "active" : ""}" href="index.html?category=${encodeURIComponent(c)}">${label}</a></li>`;
  });
  html += "</ul>";
  el.innerHTML = html;
}

function renderYearFilter(posts) {
  const el = document.getElementById("top-categories-year");
  if (!el) return;
  const years = [...new Set(posts.map(p => p.year))].sort((a, b) => b - a);
  let html = `<details class="year-filter"><summary>Year</summary><ul>
    <li><a href="index.html">All Years</a></li>`;
  years.forEach(y => {
    html += `<li><a href="index.html?year=${encodeURIComponent(y)}">${y}</a></li>`;
  });
  html += "</ul></details>";
  el.innerHTML = html;
}

function renderGrid(posts) {
  const grid = document.getElementById("post-grid");
  if (!grid) return;
  const category = qs("category");
  const year = qs("year");
  const q = (qs("q") || "").toLowerCase().trim();

  let filtered = posts;
  if (category) filtered = filtered.filter(p => p.category === category);
  if (year) filtered = filtered.filter(p => String(p.year) === String(year));
  if (q) filtered = filtered.filter(p => p.title.toLowerCase().includes(q));

  document.getElementById("section-title").textContent =
    q ? `Results for "${qs("q")}"` :
    category ? `${category} — Latest Uploads` :
    year ? `${year} — Latest Uploads` :
    "Latest Uploads";

  grid.innerHTML = filtered.length
    ? filtered.map(cardHtml).join("")
    : `<p class="empty-state">No posts found. Add entries to data/posts.json to fill this section.</p>`;
}

function renderSinglePost(posts, siteName) {
  const container = document.getElementById("single-post-container");
  if (!container) return;
  const slug = qs("slug");
  const post = posts.find(p => p.slug === slug);
  const suffix = siteName ? " — " + siteName : "";
  if (!post) {
    container.innerHTML = `<p class="empty-state">Post not found. <a href="index.html">Back to home</a></p>`;
    document.title = "Not found" + suffix;
    return;
  }
  document.title = post.title + suffix;
  container.innerHTML = `
    <a class="back-link" href="index.html">&larr; Back to home</a>
    <article class="single-post">
      <div class="post-meta">${post.category} • ${post.year}</div>
      <h1 class="post-title-single">${post.title}</h1>
      <div class="post-body-single">${post.body}</div>
    </article>`;
}

function wireSearchForm() {
  const form = document.getElementById("search-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("search-input").value.trim();
    window.location.href = "search.html" + (val ? `?q=${encodeURIComponent(val)}` : "");
  });
}

async function loadSiteName() {
  try {
    const res = await fetch("data/site-config.json");
    if (!res.ok) return null;
    const cfg = await res.json();
    return cfg.siteName || null;
  } catch (err) {
    return null;
  }
}

async function init() {
  wireSearchForm();
  try {
    const [posts, siteName] = await Promise.all([loadPosts(), loadSiteName()]);
    renderCategoryBar(posts);
    renderYearFilter(posts);
    renderGrid(posts);
    renderSinglePost(posts, siteName);
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("post-grid");
    if (grid) grid.innerHTML = `<p class="empty-state">Couldn't load posts. If you're viewing this file directly (file://), run a local server instead — see README.md.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", init);
