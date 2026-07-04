// date.js — dynamically outputs copyright year and last modified date

// Current year in footer
const yearSpan = document.querySelector('#currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Last modified date
const lastModifiedEl = document.querySelector('#lastModified');
if (lastModifiedEl) {
  lastModifiedEl.textContent = `Last Modification: ${document.lastModified}`;
}
