/* config.js — loads data/site-config.json and applies it to every page.
   Every page includes this the same way; nothing page-specific needed.
   Elements opt in with data-site="name" | "tagline" | "copyright-year-name",
   and <title> opts in with a data-title-base attribute holding the
   page-specific part (config.js appends " — siteName"). */
(function () {
  function applyConfig(cfg) {
    document.querySelectorAll('[data-site="name"]').forEach(function (el) {
      el.textContent = cfg.siteName;
    });
    document.querySelectorAll('[data-site="tagline"]').forEach(function (el) {
      el.textContent = cfg.tagline;
    });
    document.querySelectorAll('[data-site="logo"]').forEach(function (el) {
      el.textContent = cfg.logoText;
    });
    document.querySelectorAll('[data-site="copyright-year-name"]').forEach(function (el) {
      var year = new Date().getFullYear();
      el.textContent = "© " + year + " " + cfg.siteName + ". All rights reserved.";
    });

    var titleEl = document.querySelector("title");
    if (titleEl && titleEl.hasAttribute("data-title-base")) {
      var base = titleEl.getAttribute("data-title-base");
      titleEl.textContent = base ? base + " — " + cfg.siteName : cfg.siteName;
    }

    document.dispatchEvent(new CustomEvent("siteconfig:ready", { detail: cfg }));
  }

  window.SiteConfig = {
    get: function () {
      return fetch("data/site-config.json").then(function (r) {
        if (!r.ok) throw new Error("site-config.json not found");
        return r.json();
      });
    }
  };

  window.SiteConfig.get()
    .then(applyConfig)
    .catch(function (err) {
      console.warn("StreamZone4You: could not load site-config.json, using page defaults.", err);
    });
})();
