// ===========================================================
// Nairobi Chamber of Commerce — Directory page behavior
// ===========================================================

const directoryEl = document.querySelector("#directory");
const resultsCountEl = document.querySelector("#resultsCount");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");

const tierLabels = {
  1: { label: "Member", className: "tier-member" },
  2: { label: "Silver Member", className: "tier-silver" },
  3: { label: "Gold Member", className: "tier-gold" },
};

// ---- Fetch member data ------------------------------------
async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();
    return data.members;
  } catch (error) {
    console.error("Could not load member directory:", error);
    directoryEl.innerHTML = `<p role="alert">Sorry, the member directory could not be loaded right now. Please try again later.</p>`;
    return [];
  }
}

// ---- Build a single card -----------------------------------
function createMemberCard(member) {
  const card = document.createElement("article");
  card.className = "member-card";

  const tier = tierLabels[member.membership] ?? tierLabels[1];

  card.innerHTML = `
    <img src="images/${member.image}" alt="${member.name} logo" width="64" height="64" loading="lazy">
    <div class="card-body">
      <span class="tier-badge ${tier.className}">${tier.label}</span>
      <h2>${member.name}</h2>
      <p class="tagline">${member.tagline}</p>
      <p class="card-meta">${member.category} &middot; Est. ${member.founded}</p>
      <address>${member.address}</address>
      <p class="card-meta"><a href="tel:${member.phone.replace(/\s+/g, "")}">${member.phone}</a></p>
      <a class="card-link" href="${member.url}" target="_blank" rel="noopener">Visit website</a>
    </div>
  `;

  return card;
}

// ---- Render all cards ---------------------------------------
function displayMembers(members) {
  directoryEl.innerHTML = "";
  members
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((member) => directoryEl.appendChild(createMemberCard(member)));

  resultsCountEl.textContent = `${members.length} businesses in the directory`;
}

// ---- View toggle (grid / list) -------------------------------
function setView(view) {
  const isGrid = view === "grid";
  directoryEl.classList.toggle("grid-view", isGrid);
  directoryEl.classList.toggle("list-view", !isGrid);
  gridBtn.setAttribute("aria-pressed", String(isGrid));
  listBtn.setAttribute("aria-pressed", String(!isGrid));
  localStorage.setItem("directoryView", view);
}

gridBtn.addEventListener("click", () => setView("grid"));
listBtn.addEventListener("click", () => setView("list"));

// ---- Init -------------------------------------------------------
(async function init() {
  const savedView = localStorage.getItem("directoryView") || "grid";
  setView(savedView);
  const members = await getMembers();
  displayMembers(members);
})();
