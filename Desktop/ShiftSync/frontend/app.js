/* =====================================================
   SHIFTSYNC — app.js
   All 12 interactions from the spec implemented
   ===================================================== */

"use strict";

// ===================== DATA =====================

let jobs = [
  {
    id: "j1", title: "Main Stage Audio Setup",
    urgency: "urgent", status: "scheduled",
    desc: "PA system + monitor rig. Min 3 crew required.",
    minCrew: 3, assignedCrew: [], requiredRoles: ["Sound", "AV"]
  },
  {
    id: "j2", title: "Backstage Cabling Run",
    urgency: "flexible", status: "scheduled",
    desc: "Route power + signal cables to all stage positions.",
    minCrew: 1, assignedCrew: [], requiredRoles: ["Rigging"]
  },
  {
    id: "j3", title: "LED Screen Installation Hall B",
    urgency: "standard", status: "inprogress",
    desc: "Mount and calibrate 2x panels. Engineering skills needed.",
    minCrew: 2, assignedCrew: [], requiredRoles: ["AV", "Rigging"]
  },
  {
    id: "j4", title: "Green Room Catering Setup",
    urgency: "flexible", status: "wrapped",
    desc: "Catering stations across all backstage green rooms.",
    minCrew: 2, assignedCrew: [], requiredRoles: ["Catering", "Logistics"]
  }
];

let crewMembers = [
  { id: "c1", name: "Yasir Sultan", initials: "YS", roles: ["Sound", "Lighting"], availability: "free",    color: "#7c5cfc" },
  { id: "c2", name: "Kashan K.",    initials: "KK", roles: ["AV", "Rigging"],    availability: "on_shift", color: "#4f9eff" },
  { id: "c3", name: "Sana J.",      initials: "SJ", roles: ["Logistics", "Catering"], availability: "free", color: "#22c55e" }
];

let activeUrgencyFilter = "all";
let activeSearchTerm = "";

// Avatar colours palette
const COLORS = ["#7c5cfc","#4f9eff","#22c55e","#f59e0b","#ef4444","#34d399","#a78bfa","#60a5fa"];

// ===================== DOM REFS =====================
const backdrop         = document.getElementById("backdrop");
const createJobModal   = document.getElementById("create-job-modal");
const registerCrewModal= document.getElementById("register-crew-modal");
const newJobBtn        = document.getElementById("new-job-btn");
const registerCrewBtn  = document.getElementById("register-crew-btn");
const closeJobModal    = document.getElementById("close-job-modal");
const cancelJobBtn     = document.getElementById("cancel-job-btn");
const submitJobBtn     = document.getElementById("submit-job-btn");
const closeCrewModal   = document.getElementById("close-crew-modal");
const cancelCrewBtn    = document.getElementById("cancel-crew-btn");
const submitCrewBtn    = document.getElementById("submit-crew-btn");
const searchInput      = document.getElementById("search-input");
const jobDesc          = document.getElementById("job-desc");
const charUsed         = document.getElementById("char-used");

// ===================== RENDER =====================

function renderAll() {
  renderBoard();
  renderCrew();
  updateStats();
}

function renderBoard() {
  ["scheduled", "inprogress", "wrapped"].forEach(col => {
    const container = document.getElementById(`cards-${col}`);
    const colJobs = jobs.filter(j => j.status === col);
    container.innerHTML = "";
    colJobs.forEach(job => container.appendChild(buildCard(job)));
    document.getElementById(`count-${col}`).textContent = colJobs.length;
  });
  applyFilters();
}

function buildCard(job) {
  const card = document.createElement("div");
  card.className = "job-card";
  card.dataset.id = job.id;
  card.dataset.urgency = job.urgency;
  card.dataset.title = job.title.toLowerCase();

  const urgencyClass  = { urgent: "tag-urgent", standard: "tag-standard", flexible: "tag-flexible" }[job.urgency];
  const statusLabel   = { scheduled: "SCHEDULED", inprogress: "IN PROGRESS", wrapped: "WRAPPED" }[job.status];
  const statusClass   = { scheduled: "status-scheduled", inprogress: "status-inprogress", wrapped: "status-wrapped" }[job.status];
  const isWrapped     = job.status === "wrapped";
  const deployDisabled = isWrapped ? " disabled" : "";

  card.innerHTML = `
    <div class="card-urgency-tag ${urgencyClass}">${job.urgency.toUpperCase()}</div>
    <div class="card-title">${job.title}</div>
    <div class="card-desc">${job.desc}</div>
    <div class="card-footer">
      <button class="status-badge ${statusClass}" data-id="${job.id}">${statusLabel}</button>
      <span class="assigned-badge">${job.assignedCrew.length} assigned</span>
      <div class="deploy-wrap" style="position:relative;">
        <button class="deploy-btn${deployDisabled}" data-id="${job.id}">+ Deploy</button>
        <div class="deploy-dropdown" id="dd-${job.id}">
          <div class="deploy-dropdown-title">FREE CREW</div>
          ${buildDeployOptions(job)}
        </div>
      </div>
      <button class="delete-btn" data-id="${job.id}" title="Delete job">✕</button>
    </div>
  `;

  // Status badge click
  card.querySelector(".status-badge").addEventListener("click", e => {
    e.stopPropagation();
    cycleStatus(job.id);
  });

  // Deploy button
  const deployBtn = card.querySelector(".deploy-btn");
  if (deployBtn && !isWrapped) {
    deployBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggleDeployDropdown(job.id);
    });
  }

  // Delete button
  card.querySelector(".delete-btn").addEventListener("click", e => {
    e.stopPropagation();
    deleteJob(job.id, card);
  });

  return card;
}

function buildDeployOptions(job) {
  const freeAndNotAssigned = crewMembers.filter(c =>
    c.availability === "free" && !job.assignedCrew.includes(c.id)
  );
  if (!freeAndNotAssigned.length) return `<div style="font-size:12px;color:var(--muted);padding:6px 10px;">No free crew</div>`;
  return freeAndNotAssigned.map(c => `
    <div class="deploy-option" data-job="${job.id}" data-crew="${c.id}">
      <div class="deploy-option-avatar" style="background:${c.color}">${c.initials}</div>
      <span>${c.name}</span>
    </div>
  `).join("");
}

function renderCrew() {
  const list = document.getElementById("crew-list");
  list.innerHTML = "";
  crewMembers.forEach(c => list.appendChild(buildCrewCard(c)));
  document.getElementById("crew-count").textContent = `${crewMembers.length} members`;
  document.getElementById("stat-crew").textContent = crewMembers.length;
}

function buildCrewCard(c) {
  const div = document.createElement("div");
  div.className = "crew-card";
  const statusClass = c.availability === "free" ? "status-free" : "status-on-shift";
  const statusLabel = c.availability === "free" ? "Free" : "On Shift";
  div.innerHTML = `
    <div class="crew-card-top">
      <div class="crew-avatar" style="background:${c.color}">${c.initials}</div>
      <div>
        <div class="crew-name">${c.name}</div>
        <div class="crew-role">${c.roles.join(" · ")}</div>
      </div>
    </div>
    <span class="crew-status-pill ${statusClass}">${statusLabel}</span>
  `;
  return div;
}

function updateStats() {
  document.getElementById("stat-active").textContent  = jobs.filter(j => j.status === "inprogress").length;
  document.getElementById("stat-urgent").textContent  = jobs.filter(j => j.urgency === "urgent").length;
  document.getElementById("stat-wrapped").textContent = jobs.filter(j => j.status === "wrapped").length;
  document.getElementById("stat-crew").textContent    = crewMembers.length;
}

// ===================== FILTERS =====================

function applyFilters() {
  document.querySelectorAll(".job-card").forEach(card => {
    const urgency = card.dataset.urgency;
    const title   = card.dataset.title || "";
    const urgencyMatch = activeUrgencyFilter === "all" || urgency === activeUrgencyFilter;
    const searchMatch  = title.includes(activeSearchTerm.toLowerCase());
    card.classList.toggle("hidden-filter", !(urgencyMatch && searchMatch));
  });
}

// Urgency pill filter (event 5)
document.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    activeUrgencyFilter = pill.dataset.urgency;
    applyFilters();
  });
});

// Search (event 6)
searchInput.addEventListener("input", () => {
  activeSearchTerm = searchInput.value.trim().toLowerCase();
  applyFilters();
});

// ===================== STATUS CYCLE (event 2) =====================

function cycleStatus(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;
  const cycle = { scheduled: "inprogress", inprogress: "wrapped", wrapped: "scheduled" };
  job.status = cycle[job.status];
  renderBoard();
  updateStats();
}

// ===================== DELETE JOB (event 8) =====================

function deleteJob(jobId, cardEl) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;
  const wasActive = job.status === "inprogress";

  cardEl.classList.add("card-removing");
  cardEl.addEventListener("transitionend", () => {
    jobs = jobs.filter(j => j.id !== jobId);
    // Free up assigned crew
    crewMembers.forEach(c => {
      if (job.assignedCrew.includes(c.id)) c.availability = "free";
    });
    renderAll();
  }, { once: true });
}

// ===================== DEPLOY DROPDOWN (event 4) =====================

function toggleDeployDropdown(jobId) {
  closeAllDropdowns();
  const dd = document.getElementById(`dd-${jobId}`);
  if (dd) {
    dd.classList.toggle("open");
    // Attach listeners to options
    dd.querySelectorAll(".deploy-option").forEach(opt => {
      opt.addEventListener("click", e => {
        e.stopPropagation();
        assignCrew(opt.dataset.job, opt.dataset.crew);
      });
    });
  }
}

function closeAllDropdowns() {
  document.querySelectorAll(".deploy-dropdown.open").forEach(d => d.classList.remove("open"));
}

function assignCrew(jobId, crewId) {
  const job  = jobs.find(j => j.id === jobId);
  const crew = crewMembers.find(c => c.id === crewId);
  if (!job || !crew) return;
  job.assignedCrew.push(crewId);
  crew.availability = "on_shift";
  closeAllDropdowns();
  renderAll();
}

// Close dropdowns when clicking outside
document.addEventListener("click", () => closeAllDropdowns());

// ===================== MODALS =====================

// Event 1: New Job modal
newJobBtn.addEventListener("click", () => openModal(createJobModal));
closeJobModal.addEventListener("click", () => closeModal(createJobModal));
cancelJobBtn.addEventListener("click", () => closeModal(createJobModal));

// Event 3: Register Crew modal
registerCrewBtn.addEventListener("click", () => openModal(registerCrewModal));
closeCrewModal.addEventListener("click", () => closeModal(registerCrewModal));
cancelCrewBtn.addEventListener("click", () => closeModal(registerCrewModal));

// Close on backdrop click
backdrop.addEventListener("click", () => {
  closeModal(createJobModal);
  closeModal(registerCrewModal);
});

function openModal(modal) {
  backdrop.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  // If both hidden, hide backdrop
  if (createJobModal.classList.contains("hidden") && registerCrewModal.classList.contains("hidden")) {
    backdrop.classList.add("hidden");
  }
}

// ---- Char counter ----
jobDesc.addEventListener("input", () => {
  charUsed.textContent = jobDesc.value.length;
});

// ===================== CREATE JOB (event 1 submit) =====================

submitJobBtn.addEventListener("click", () => {
  const title   = document.getElementById("job-title").value.trim();
  const urgency = document.getElementById("job-urgency").value;
  const minCrew = parseInt(document.getElementById("job-mincrew").value) || 1;
  const desc    = jobDesc.value.trim();

  if (!title) { alert("Job title is required."); return; }
  if (!desc)  { alert("Description is required."); return; }

  const roles = [...document.querySelectorAll("#create-job-modal input[type=checkbox]:checked")]
                 .map(cb => cb.value);

  const newJob = {
    id: "j" + Date.now(),
    title, urgency, desc, minCrew,
    status: "scheduled",
    assignedCrew: [],
    requiredRoles: roles
  };
  jobs.push(newJob);

  // Reset form
  document.getElementById("job-title").value = "";
  document.getElementById("job-urgency").value = "standard";
  document.getElementById("job-mincrew").value = "2";
  jobDesc.value = "";
  charUsed.textContent = "0";
  document.querySelectorAll("#create-job-modal input[type=checkbox]").forEach(cb => cb.checked = false);

  closeModal(createJobModal);
  renderAll();
});

// ===================== REGISTER CREW (event 3 submit) =====================

submitCrewBtn.addEventListener("click", () => {
  const name  = document.getElementById("crew-name").value.trim();
  const email = document.getElementById("crew-email").value.trim();
  const roles = [...document.querySelectorAll("input[name=crewrole]:checked")].map(cb => cb.value);

  if (!name)  { alert("Full name is required."); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Valid email required."); return; }
  if (!roles.length) { alert("Select at least one role."); return; }

  const initials = name.split(" ").map(p => p[0].toUpperCase()).join("").slice(0, 2);
  const color    = COLORS[crewMembers.length % COLORS.length];

  const newCrew = {
    id: "c" + Date.now(),
    name, initials, roles, color,
    availability: "free"
  };
  crewMembers.push(newCrew);

  // Reset form
  document.getElementById("crew-name").value  = "";
  document.getElementById("crew-email").value = "";
  document.querySelectorAll("input[name=crewrole]").forEach(cb => cb.checked = false);

  closeModal(registerCrewModal);
  renderAll();
  // Event 7: stat chip auto-updated via renderAll -> updateStats
});

// ===================== INIT =====================
renderAll();
