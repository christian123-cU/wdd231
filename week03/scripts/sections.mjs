/**
 * sections.mjs
 * ------------
 * Builds the <option> elements inside the "Choose a section" dropdown.
 */

/**
 * Populates the #sectionNumber <select> with one <option> per section.
 * @param {Array<{number: number}>} sections
 */
export function setSectionSelection(sections) {
  const selection = document.querySelector("#sectionNumber");

  // Guard clause: fail loudly and early instead of throwing a cryptic
  // "cannot read property 'appendChild' of null" further down. This is
  // the kind of defensive check that matters once code is split across
  // multiple files and it's no longer obvious, at a glance, that the
  // HTML and JS are in sync.
  if (!selection) {
    console.error("setSectionSelection: #sectionNumber element not found in the DOM.");
    return;
  }

  // Build every <option> off-DOM first inside a DocumentFragment, then
  // attach them all in a single appendChild call. Appending one at a
  // time inside the loop forces the browser
  // to recalculate layout on every iteration; batching avoids that.
  const fragment = document.createDocumentFragment();

  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.number;
    option.textContent = section.number;
    fragment.appendChild(option);
  });

  selection.appendChild(fragment);
}
