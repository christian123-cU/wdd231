/**
 * output.mjs
 * ----------
 * The only file allowed to touch the DOM for course info: title/code
 * text and the enrollment table.
 */

/**
 * Writes the course title and code into the page header.
 * @param {{title: string, code: string}} course
 */
export function setTitle(course) {
  const titleEl = document.querySelector("#courseTitle");
  const codeEl = document.querySelector("#courseCode");

  if (!titleEl || !codeEl) {
    console.error("setTitle: #courseTitle or #courseCode element not found.");
    return;
  }

  titleEl.textContent = course.title;
  codeEl.textContent = course.code;
}

/**
 * Rebuilds the enrollment table body from the current sections array.
 * @param {Array<{number:number, enrolled:number, instructor:string}>} sections
 */
export function renderSections(sections) {
  const tbody = document.querySelector("#sectionsTable tbody");

  if (!tbody) {
    console.error("renderSections: #sectionsTable tbody not found.");
    return;
  }

  // Clear existing rows before re-rendering the current state.
  tbody.innerHTML = "";

  sections.forEach((section) => {
    const row = document.createElement("tr");

    // BUG FIXED from the intermediate pass: building rows with a
    // template-literal string assigned to innerHTML works fine with
    // trusted, hardcoded data like this — but it's the wrong habit to
    // build. The moment any of this data came from a form, an API, or
    // a URL, that pattern becomes an HTML/script-injection risk. Using
    // createElement + textContent is the safe default regardless of
    // where the data came from, so it's what we use here too.
    const numberCell = document.createElement("td");
    numberCell.textContent = section.number;

    const enrolledCell = document.createElement("td");
    enrolledCell.textContent = section.enrolled;

    const instructorCell = document.createElement("td");
    instructorCell.textContent = section.instructor;

    row.append(numberCell, enrolledCell, instructorCell);
    tbody.appendChild(row);
  });
}
