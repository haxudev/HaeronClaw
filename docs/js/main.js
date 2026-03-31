/* ============ main.js ============ */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const html = document.documentElement;
  const THEME_KEY = "hc-theme";
  const LANG_KEY = "hc-lang";

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) { applyTheme(saved); return; }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  /* ---------- Language ---------- */
  function applyLang(lang) {
    html.setAttribute("data-lang", lang);
    localStorage.setItem(LANG_KEY, lang);
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = lang === "en" ? "\u4E2D\u6587" : "EN";
  }

  function initLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) { applyLang(saved); return; }
    const browserLang = (navigator.language || "").toLowerCase();
    applyLang(browserLang.startsWith("zh") ? "zh" : "en");
  }

  /* ---------- Sidebar ---------- */
  function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const toggle = document.querySelector(".menu-toggle");
    if (!sidebar || !toggle) return;

    function open() {
      sidebar.classList.add("open");
      if (overlay) overlay.classList.add("open");
    }

    function close() {
      sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
    }

    toggle.addEventListener("click", function () {
      sidebar.classList.contains("open") ? close() : open();
    });

    if (overlay) overlay.addEventListener("click", close);

    /* Active link */
    var current = location.pathname.split("/").pop() || "index.html";
    sidebar.querySelectorAll(".sidebar-link").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href === current || (current === "" && href === "index.html")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* ---------- Copy buttons ---------- */
  function initCopy() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-code");
        if (!code) {
          var block = btn.closest(".code-block");
          var pre = block ? block.querySelector("pre") : null;
          code = pre ? pre.textContent : "";
        }
        navigator.clipboard.writeText(code).then(function () {
          var original = btn.textContent;
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = original; }, 1500);
        });
      });
    });
  }

  /* ---------- Scroll to top ---------- */
  function initScrollTop() {
    var btn = document.getElementById("scroll-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 400);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Bind header buttons ---------- */
  function initHeaderButtons() {
    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var current = html.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }

    var langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        var current = html.getAttribute("data-lang") || "en";
        applyLang(current === "en" ? "zh" : "en");
      });
    }
  }

  /* ---------- Init ---------- */
  initTheme();
  initLang();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initHeaderButtons();
      initSidebar();
      initCopy();
      initScrollTop();
    });
  } else {
    initHeaderButtons();
    initSidebar();
    initCopy();
    initScrollTop();
  }
})();
