export function setTitle(course) {
  document.querySelector("#courseTitle").textContent = course.title;
  document.querySelector("#courseCode").textContent = course.code;
}

export function renderSections(sections) {
  const table = document.querySelector("#sectionsTable tbody");
  table.innerHTML = "";

  sections.forEach((section) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${section.number}</td>
      <td>${section.enrolled}</td>
      <td>${section.instructor}</td>
    `;
    table.appendChild(row);
  });
}
