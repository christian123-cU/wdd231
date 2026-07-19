/**
 * course.mjs
 * ----------
 * The data model for WDD231: course info, its sections, and the one
 * piece of business logic the app needs (enrolling/dropping a student).
 *
 * This module knows NOTHING about the DOM. That separation is intentional —
 * data/logic and rendering are different concerns, and keeping them apart
 * means this object could be reused (e.g. in a future unit test, or a
 * different UI) without dragging document.querySelector calls along with it.
 *
 * Exported as the DEFAULT export: there is exactly one "primary" thing
 * this file is responsible for.
 */

const byuiCourse = {
  title: "Web Frontend Development I",
  code: "WDD231",
  sections: [
    { number: 1, enrolled: 80, capacity: 100, instructor: "Brother Bingham" },
    { number: 2, enrolled: 100, capacity: 100, instructor: "Sister Shultz" },
    { number: 3, enrolled: 100, capacity: 100, instructor: "Sister Smith" },
  ],

  /**
   * Enrolls or drops a single student from a section.
   *
   * Previously, if the section
   * was already full (or already at 0), the click silently did nothing
   * with no feedback anywhere — a user (or grader) clicking "Enroll"
   * on a full section would see nothing happen and assume the app was
   * broken. Now each edge case is explicit and reported.
   *
   * @param {number} sectionNum - The section's `number` to modify.
   * @param {boolean} [increment=true] - true = enroll one student, false = drop one.
   * @returns {boolean} true if the enrolled count actually changed.
   */
  changeEnrollment(sectionNum, increment = true) {
    const section = this.sections.find((s) => s.number === sectionNum);

    if (!section) {
      console.warn(`changeEnrollment: no section numbered ${sectionNum} exists.`);
      return false;
    }

    if (increment) {
      if (section.enrolled >= section.capacity) {
        console.warn(`Section ${sectionNum} is already at capacity (${section.capacity}).`);
        return false;
      }
      section.enrolled++;
      return true;
    }

    // increment === false: dropping a student
    if (section.enrolled <= 0) {
      console.warn(`Section ${sectionNum} has no students left to drop.`);
      return false;
    }
    section.enrolled--;
    return true;

    // NOTE: we deliberately do NOT call renderSections() from in here.
    // The original single-file script updated the DOM directly inside
    // this method. Once the code is split into modules, this file has
    // no import of output.mjs — and it shouldn't need one. The event
    // listeners in modules.mjs call renderSections() themselves right
    // after this method runs, keeping "change the data" and "repaint
    // the screen" as two separate steps.
  },
};

export default byuiCourse;
