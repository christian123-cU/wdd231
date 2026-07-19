export function setSectionSelection(sections) {
  const selection = document.querySelector("#sectionNumber");

  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.number;
    option.textContent = section.number;
    selection.appendChild(option);
  });
}
