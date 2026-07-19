/**
 * modules.mjs
 * -----------
 * Entry point loaded by modules.html via <script type="module">.
 * Wires together the data (course.mjs), the dropdown (sections.mjs),
 * and the DOM output (output.mjs). This file should stay "thin" —
 * it coordinates the other three modules rather than containing
 * business logic or DOM-building logic itself.
 */

import byuiCourse from "./course.mjs";
import { setSectionSelection } from "./sections.mjs";
import { setTitle, renderSections } from "./output.mjs";

// Initial page render
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);

// Cache selectors once instead of re-querying the DOM inside every
// event listener (the intermediate version re-ran querySelector for
// #sectionNumber on every single click).
const enrollButton = document.querySelector("#enrollStudent");
const dropButton = document.querySelector("#dropStudent");
const sectionSelect = document.querySelector("#sectionNumber");

/**
 * Reads and validates the currently-selected section number.
 * @returns {number} the selected section number, or NaN if invalid.
 */
function getSelectedSectionNumber() {
    return Number(sectionSelect.value);
}

/**
 * Shared handler for both buttons — avoids duplicating the same
 * "read value, guard against NaN, update data, re-render" sequence
 * twice, which is how the two listeners drift out of sync over time.
 * @param {boolean} increment - true to enroll, false to drop.
 */
function handleEnrollmentChange(increment) {
    const sectionNum = getSelectedSectionNumber();

    // There was no check for an
    // empty/invalid selection. Number("") is NaN, and passing NaN into
    // changeEnrollment would silently fail the .find() lookup with no
    // explanation. Now it's caught here, before touching the data.
    if (Number.isNaN(sectionNum)) {
        console.warn("handleEnrollmentChange: no valid section selected.");
        return;
    }

    byuiCourse.changeEnrollment(sectionNum, increment);
    renderSections(byuiCourse.sections);
}

enrollButton.addEventListener("click", () => handleEnrollmentChange(true));
dropButton.addEventListener("click", () => handleEnrollmentChange(false));
