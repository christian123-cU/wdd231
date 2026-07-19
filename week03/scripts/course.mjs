const byuiCourse = {
  title: "Web Frontend Development I",
  code: "WDD231",
  sections: [
    { number: 1, enrolled: 80, capacity: 100, instructor: "Brother Bingham" },
    { number: 2, enrolled: 100, capacity: 100, instructor: "Sister Shultz" },
    { number: 3, enrolled: 100, capacity: 100, instructor: "Sister Smith" },
  ],
  changeEnrollment(sectionNum, increment = true) {
    const section = this.sections.find((s) => s.number === sectionNum);
    if (!section) return;

    if (increment && section.enrolled < section.capacity) {
      section.enrolled++;
    } else if (!increment && section.enrolled > 0) {
      section.enrolled--;
    }
  },
};

export default byuiCourse;
