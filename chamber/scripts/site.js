// ===========================================================
// Nairobi Chamber of Commerce — shared site behavior
// Loaded on every page: nav toggle, theme toggle, footer info.
// Page-specific scripts (directory.js, home.js) load AFTER this
// file and only contain logic unique to that page.
// ===========================================================

// ---- Navigation toggle (hamburger) --------------------------
const navToggle = document.querySelector("#navToggle");
const primaryNav = document.querySelector("#primaryNav");

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// ---- Theme toggle (dark / light) ----------------------------
const themeToggle = document.querySelector("#themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
});

// ---- Footer: year + last modified ----------------------------
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;
