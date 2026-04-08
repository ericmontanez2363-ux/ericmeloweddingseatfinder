/**
 * Sage & Ivory Wedding Seat Finder — app.js
 * Each guest has: name, table, companions[]
 * Data lives in localStorage — works as a GitHub Pages static site.
 */

const STORAGE_KEY = "sage_seatfinder_v1";

let guests = [];

/* ─── Init ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  loadGuests();
  renderAdminList();
  updateGuestCount();

  // Auto-focus search
  setTimeout(() => document.getElementById("search-input")?.focus(), 400);

  // Pre-fill from QR: ?name=Maria+Santos
  const params = new URLSearchParams(window.location.search);
  const prefill = params.get("name") || params.get("n");
  if (prefill) {
    document.getElementById("search-input").value = decodeURIComponent(prefill);
    handleSearch();
  }

  // Close admin on backdrop click
  document.getElementById("admin-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeAdmin();
  });

  // Close tables on backdrop click
  document.getElementById("tables-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeTables();
  });
});

/* ─── Storage ───────────────────────────────────────── */
function loadGuests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    guests = raw ? JSON.parse(raw) : getDefaultGuests();
    if (!raw) saveGuests();
  } catch {
    guests = getDefaultGuests();
  }
}

function saveGuests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

function getDefaultGuests() {
  return [
    {
      name: "Maria Santos",
      table: "Table 1",
      companions: ["Jose Reyes", "Ana dela Cruz", "Carmen Flores"]
    },
    {
      name: "Jose Reyes",
      table: "Table 1",
      companions: ["Maria Santos", "Ana dela Cruz", "Carmen Flores"]
    },
    {
      name: "Ana dela Cruz",
      table: "Table 1",
      companions: ["Maria Santos", "Jose Reyes", "Carmen Flores"]
    },
    {
      name: "Carmen Flores",
      table: "Table 1",
      companions: ["Maria Santos", "Jose Reyes", "Ana dela Cruz"]
    },
    {
      name: "Ricardo Torres",
      table: "Table 2",
      companions: ["Luz Villanueva", "Pedro Ramos"]
    },
    {
      name: "Luz Villanueva",
      table: "Table 2",
      companions: ["Ricardo Torres", "Pedro Ramos"]
    },
    {
      name: "Pedro Ramos",
      table: "Table 2",
      companions: ["Ricardo Torres", "Luz Villanueva"]
    },
  ];
}

/* ─── Search ────────────────────────────────────────── */
function handleSearch() {
  const query = document.getElementById("search-input").value.trim();
  const area  = document.getElementById("results-area");
  area.innerHTML = "";

  if (!query) return;

  const matches = guests.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) {
    area.innerHTML = `
      <div class="result-empty">
        <div class="result-empty-icon">❧</div>
        <p class="result-empty-text">No guest found for "<em>${escHtml(query)}</em>"</p>
        <p class="result-empty-sub">Please check your name or ask an usher</p>
      </div>
    `;
    return;
  }

  matches.forEach((g, i) => {
    const companions = (g.companions || []).filter(Boolean);

    const companionPills = companions.length
      ? companions.map(c => `<span class="companion-pill">${escHtml(c)}</span>`).join("")
      : `<span class="no-companions">You have the table to yourself</span>`;

    const card = document.createElement("div");
    card.className = "result-card";
    card.style.animationDelay = `${i * 70}ms`;
    card.innerHTML = `
      <div class="card-top">
        <div class="card-name-block">
          <p class="card-label">Guest</p>
          <p class="card-name">${escHtml(g.name)}</p>
        </div>
        <div class="card-table-badge">${escHtml(g.table)}</div>
      </div>
      <div class="card-companions">
        <p class="companions-label">Seated with</p>
        <div class="companions-list">${companionPills}</div>
      </div>
    `;
    area.appendChild(card);
  });
}

function handleKey(e) {
  if (e.key === "Escape") {
    document.getElementById("search-input").value = "";
    document.getElementById("results-area").innerHTML = "";
  }
}

/* ─── View All Tables ───────────────────────────────── */
function openTables() {
  renderTables();
  document.getElementById("tables-overlay").classList.remove("hidden");
}

function closeTables() {
  document.getElementById("tables-overlay").classList.add("hidden");
}

function renderTables() {
  const grid = document.getElementById("tables-grid");
  if (!grid) return;

  if (guests.length === 0) {
    grid.innerHTML = `
      <div class="tables-empty">
        <div class="tables-empty-icon">❧</div>
        <p class="tables-empty-text">No guests added yet</p>
      </div>
    `;
    return;
  }

  // Group guests by table, sort table names naturally
  const tableMap = {};
  guests.forEach(g => {
    const key = g.table || "Unassigned";
    if (!tableMap[key]) tableMap[key] = [];
    tableMap[key].push(g.name);
  });

  const sorted = Object.keys(tableMap).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  grid.innerHTML = sorted.map((table, i) => {
    const names = tableMap[table];
    const rows = names
      .map(n => `
        <div class="table-guest-row">
          <div class="table-guest-dot"></div>
          <span class="table-guest-name">${escHtml(n)}</span>
        </div>
      `)
      .join("");

    return `
      <div class="table-card" style="animation-delay:${i * 50}ms">
        <div class="table-card-header">
          <span class="table-card-name">${escHtml(table)}</span>
          <span class="table-card-count">${names.length} guest${names.length !== 1 ? "s" : ""}</span>
        </div>
        <div class="table-card-guests">${rows}</div>
      </div>
    `;
  }).join("");
}

/* ─── Admin ─────────────────────────────────────────── */
function openAdmin() {
  document.getElementById("admin-overlay").classList.remove("hidden");
  renderAdminList();
}

function closeAdmin() {
  document.getElementById("admin-overlay").classList.add("hidden");
}

function addGuest() {
  const nameEl       = document.getElementById("admin-name");
  const tableEl      = document.getElementById("admin-table");
  const companionsEl = document.getElementById("admin-companions");

  const name  = nameEl.value.trim();
  const table = tableEl.value.trim();
  const companions = companionsEl.value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (!name || !table) {
    if (!name) flashInvalid(nameEl);
    if (!table) flashInvalid(tableEl);
    return;
  }

  guests.push({ name, table, companions });
  saveGuests();
  renderAdminList();
  updateGuestCount();

  nameEl.value = "";
  tableEl.value = "";
  companionsEl.value = "";
  nameEl.focus();

  handleSearch();
}

function deleteGuest(i) {
  guests.splice(i, 1);
  saveGuests();
  renderAdminList();
  updateGuestCount();
  handleSearch();
}

function renderAdminList() {
  const list = document.getElementById("admin-list");
  if (!list) return;

  if (guests.length === 0) {
    list.innerHTML = `<p style="font-size:0.78rem;color:var(--ink-muted);padding:0.8rem 0">No guests yet — add one above</p>`;
    return;
  }

  list.innerHTML = guests.map((g, i) => `
    <div class="admin-row">
      <div class="admin-row-info">
        <div class="admin-row-name">${escHtml(g.name)}</div>
        <div class="admin-row-meta">${escHtml(g.table)}${g.companions?.length ? " · " + g.companions.length + " companion" + (g.companions.length > 1 ? "s" : "") : ""}</div>
      </div>
      <button class="btn-del" onclick="deleteGuest(${i})" title="Remove">✕</button>
    </div>
  `).join("");
}

function updateGuestCount() {
  const el = document.getElementById("guest-count");
  if (el) el.textContent = `(${guests.length})`;
}

/* ─── Export / Import ───────────────────────────────── */
function exportData() {
  const blob = new Blob([JSON.stringify(guests, null, 2)], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: "wedding-guests.json"
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error();
      guests = data.filter(g => g.name && g.table);
      saveGuests();
      renderAdminList();
      updateGuestCount();
      handleSearch();
    } catch {
      alert("Import failed — please use a valid wedding-guests.json file.");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
}

function clearAll() {
  if (!confirm("Remove all guests? This cannot be undone.")) return;
  guests = [];
  saveGuests();
  renderAdminList();
  updateGuestCount();
  handleSearch();
}

/* ─── Helpers ───────────────────────────────────────── */
function escHtml(s) {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function flashInvalid(el) {
  el.style.borderColor = "#b94040";
  setTimeout(() => (el.style.borderColor = ""), 1200);
}
