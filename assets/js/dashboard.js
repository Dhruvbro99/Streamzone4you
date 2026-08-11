/* =========================================================
   StreamZone4You — dashboard logic
   Gated by a password, then two tabs:
     - Site settings: edit data/site-config.json
     - Posts: add/edit/delete entries in data/posts.json
   Everything happens in your browser — nothing is uploaded
   or saved automatically. Each tab has its own Download
   button; push the downloaded file to GitHub to publish.
   ========================================================= */

/* --- PASSWORD GATE ---
   This is a CLIENT-SIDE check only — not real server security.
   Anyone who can view page source/devtools could bypass it.
   It just keeps the dashboard out of casual browsing.

   To change the password: just edit the value below and push. */
const ADMIN_PASSWORD = "dhruv@96395"; // CHANGE THIS to whatever you want

function isUnlocked() {
  return sessionStorage.getItem("sz4y_dash_unlocked") === "true";
}

function unlock() {
  sessionStorage.setItem("sz4y_dash_unlocked", "true");
  document.getElementById("lock-screen").style.display = "none";
  document.getElementById("dash-root").style.display = "block";
  init();
}

function lock() {
  sessionStorage.removeItem("sz4y_dash_unlocked");
  document.getElementById("dash-root").style.display = "none";
  document.getElementById("lock-screen").style.display = "block";
  document.getElementById("password-input").value = "";
}

function wireLockForm() {
  document.getElementById("lock-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = document.getElementById("password-input").value;
    const statusEl = document.getElementById("lock-status");
    if (entered === ADMIN_PASSWORD) {
      unlock();
    } else {
      statusEl.textContent = "Wrong password.";
      statusEl.className = "status-msg err";
      statusEl.style.display = "block";
    }
  });
  document.getElementById("logout-btn").addEventListener("click", lock);
}

/* --- TABS --- */
function wireTabs() {
  const tabs = document.querySelectorAll(".dash-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".dash-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    });
  });
}

/* --- SITE SETTINGS PANEL --- */
let siteConfig = { siteName: "StreamZone4You", tagline: "", logoText: "StreamZone4You" };

function showSettingsStatus(msg, kind) {
  const el = document.getElementById("settings-status");
  el.textContent = msg;
  el.className = "status-msg " + kind;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
}

function fillSettingsForm() {
  document.getElementById("site-name-input").value = siteConfig.siteName || "";
  document.getElementById("tagline-input").value = siteConfig.tagline || "";
  document.getElementById("logo-text-input").value = siteConfig.logoText || "";
}

function downloadSiteConfigJson() {
  const blob = new Blob([JSON.stringify(siteConfig, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "site-config.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function wireSettingsForm() {
  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    siteConfig = {
      siteName: document.getElementById("site-name-input").value.trim(),
      tagline: document.getElementById("tagline-input").value.trim(),
      logoText: document.getElementById("logo-text-input").value.trim()
    };
    showSettingsStatus("Settings saved. Download site-config.json to publish it.", "ok");
  });
  document.getElementById("download-settings-btn").addEventListener("click", downloadSiteConfigJson);
}

/* --- POSTS PANEL --- */
let posts = [];
let editingSlug = null; // null = adding a new post

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function showStatus(msg, kind) {
  const el = document.getElementById("status-msg");
  el.textContent = msg;
  el.className = "status-msg " + kind;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
}

function renderList() {
  const list = document.getElementById("post-list");
  if (!posts.length) {
    list.innerHTML = `<p class="empty-state">No posts yet. Add one below.</p>`;
    return;
  }
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  list.innerHTML = sorted.map(p => `
    <div class="post-list-item">
      <img src="${p.thumbnail || 'https://placehold.co/45x65/1a1d24/ffffff?text=-'}" alt="">
      <div class="post-list-info">
        <div class="post-list-title">${p.title}</div>
        <div class="post-list-meta">${p.category} • ${p.year} • ${p.date} • ${p.slug}</div>
      </div>
      <div class="post-list-actions">
        <button class="btn btn-secondary" onclick="editPost('${p.slug}')">Edit</button>
        <button class="btn btn-danger" onclick="deletePost('${p.slug}')">Delete</button>
      </div>
    </div>`).join("");
}

function clearForm() {
  editingSlug = null;
  document.getElementById("post-form").reset();
  document.getElementById("form-heading").textContent = "Add New Post";
  document.getElementById("slug-input").readOnly = false;
  document.getElementById("date-input").value = new Date().toISOString().slice(0, 10);
  document.getElementById("cancel-edit-btn").style.display = "none";
}

window.editPost = function (slug) {
  const p = posts.find(x => x.slug === slug);
  if (!p) return;
  editingSlug = slug;
  document.getElementById("form-heading").textContent = "Editing: " + p.title;
  document.getElementById("title-input").value = p.title;
  document.getElementById("slug-input").value = p.slug;
  document.getElementById("slug-input").readOnly = true;
  document.getElementById("category-input").value = p.category;
  document.getElementById("year-input").value = p.year;
  document.getElementById("date-input").value = p.date;
  document.getElementById("thumbnail-input").value = p.thumbnail || "";
  document.getElementById("body-input").value = p.body || "";
  document.getElementById("cancel-edit-btn").style.display = "inline-block";
  window.scrollTo({ top: document.getElementById("post-form").offsetTop - 20, behavior: "smooth" });
};

window.deletePost = function (slug) {
  if (!confirm("Delete this post? This only removes it from the in-browser list until you download and push posts.json.")) return;
  posts = posts.filter(p => p.slug !== slug);
  renderList();
  showStatus("Post removed. Remember to download posts.json to save this.", "ok");
};

function downloadPostsJson() {
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "posts.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function wireForm() {
  document.getElementById("title-input").addEventListener("input", (e) => {
    if (!editingSlug) {
      document.getElementById("slug-input").value = slugify(e.target.value);
    }
  });

  document.getElementById("cancel-edit-btn").addEventListener("click", clearForm);

  document.getElementById("post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title-input").value.trim();
    const slug = document.getElementById("slug-input").value.trim();
    const category = document.getElementById("category-input").value.trim();
    const year = document.getElementById("year-input").value.trim();
    const date = document.getElementById("date-input").value;
    const thumbnail = document.getElementById("thumbnail-input").value.trim();
    const body = document.getElementById("body-input").value;

    if (!title || !slug || !category || !year || !date) {
      showStatus("Please fill in title, slug, category, year, and date.", "err");
      return;
    }
    if (!editingSlug && posts.some(p => p.slug === slug)) {
      showStatus("That slug already exists — pick a different title or edit the existing post instead.", "err");
      return;
    }

    const entry = { slug, title, category, year, date, thumbnail, body };

    if (editingSlug) {
      posts = posts.map(p => p.slug === editingSlug ? entry : p);
      showStatus("Post updated. Download posts.json to save it.", "ok");
    } else {
      posts.push(entry);
      showStatus("Post added. Download posts.json to save it.", "ok");
    }
    renderList();
    clearForm();
  });

  document.getElementById("download-btn").addEventListener("click", downloadPostsJson);

  document.getElementById("import-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!Array.isArray(parsed)) throw new Error("File is not a posts array");
        posts = parsed;
        renderList();
        showStatus(`Loaded ${posts.length} posts from file.`, "ok");
      } catch (err) {
        showStatus("Couldn't read that file: " + err.message, "err");
      }
    };
    reader.readAsText(file);
  });
}

async function init() {
  wireTabs();
  wireForm();
  wireSettingsForm();
  clearForm();

  try {
    const res = await fetch("data/posts.json");
    if (res.ok) {
      posts = await res.json();
      showStatus(`Loaded ${posts.length} existing posts.`, "ok");
    }
  } catch (err) {
    // fine — likely opened via file:// with no server; use Import instead
  }
  renderList();

  try {
    const res = await fetch("data/site-config.json");
    if (res.ok) {
      siteConfig = await res.json();
    }
  } catch (err) {
    // fine — keep defaults
  }
  fillSettingsForm();
}

document.addEventListener("DOMContentLoaded", () => {
  wireLockForm();
  if (isUnlocked()) {
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("dash-root").style.display = "block";
    init();
  }
});
