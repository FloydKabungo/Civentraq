"use strict";

const DEFAULT_PROJECT = {
  id: "project-001",
  name: "Eskom Refinery Maintenance Project",
  client: "Eskom",
  location: "Cape Town",
  startDate: "2026-02-01",
  endDate: "2026-11-30",
  approvedBudget: 10000000,
  status: "Active"
};

const SAMPLE_ROWS = [
  { date: "2026-02-28", category: "Mobilisation", plannedCost: 700000, actualCost: 620000, plannedProgress: 8, actualProgress: 7, labourHours: 900, tasksCompleted: 12, totalTasks: 220, riskLevel: "Low" },
  { date: "2026-03-31", category: "Mechanical", plannedCost: 950000, actualCost: 890000, plannedProgress: 18, actualProgress: 16, labourHours: 1420, tasksCompleted: 28, totalTasks: 220, riskLevel: "Low" },
  { date: "2026-04-30", category: "Electrical", plannedCost: 1150000, actualCost: 1080000, plannedProgress: 29, actualProgress: 26, labourHours: 1680, tasksCompleted: 49, totalTasks: 220, riskLevel: "Medium" },
  { date: "2026-05-31", category: "Piping", plannedCost: 1250000, actualCost: 1300000, plannedProgress: 42, actualProgress: 38, labourHours: 1920, tasksCompleted: 78, totalTasks: 220, riskLevel: "Medium" },
  { date: "2026-06-30", category: "Civil", plannedCost: 1350000, actualCost: 1240000, plannedProgress: 56, actualProgress: 49, labourHours: 2410, tasksCompleted: 111, totalTasks: 220, riskLevel: "High" },
  { date: "2026-07-20", category: "Instrumentation", plannedCost: 1200000, actualCost: 1070000, plannedProgress: 70, actualProgress: 62, labourHours: 4120, tasksCompleted: 148, totalTasks: 220, riskLevel: "High" }
];

const WORK_PACKAGES = [
  { name: "Mechanical installation", owner: "Mechanical team", progress: 78, status: "On track" },
  { name: "Electrical reticulation", owner: "Electrical team", progress: 64, status: "At risk" },
  { name: "Piping fabrication", owner: "Piping team", progress: 58, status: "Delayed" },
  { name: "Instrumentation & controls", owner: "I&C team", progress: 46, status: "At risk" },
  { name: "Civil rehabilitation", owner: "Civil team", progress: 82, status: "On track" }
];

const FIELD_CONFIG = [
  { key: "date", label: "Reporting date", aliases: ["date", "report date", "period", "month"] },
  { key: "category", label: "Cost category / discipline", aliases: ["category", "discipline", "cost category", "work package"] },
  { key: "plannedCost", label: "Planned cost", aliases: ["planned cost", "budget cost", "planned spend", "forecast cost", "plan cost"] },
  { key: "actualCost", label: "Actual cost", aliases: ["actual cost", "actual spend", "spent", "expenditure", "cost actual"] },
  { key: "plannedProgress", label: "Planned progress (%)", aliases: ["planned progress", "plan progress", "scheduled progress", "planned %"] },
  { key: "actualProgress", label: "Actual progress (%)", aliases: ["actual progress", "progress", "complete %", "actual %", "percentage complete"] },
  { key: "labourHours", label: "Labour hours", aliases: ["labour hours", "labor hours", "man hours", "hours"] },
  { key: "tasksCompleted", label: "Tasks completed", aliases: ["tasks completed", "completed tasks", "complete tasks"] },
  { key: "totalTasks", label: "Total tasks", aliases: ["total tasks", "tasks total"] },
  { key: "riskLevel", label: "Risk level", aliases: ["risk level", "risk", "severity"] }
];

let state = {
  project: loadJson("buildmetric_project", DEFAULT_PROJECT),
  projects: loadJson("buildmetric_projects", [DEFAULT_PROJECT]),
  rows: loadJson("buildmetric_rows", SAMPLE_ROWS),
  importHistory: loadJson("buildmetric_imports", []),
  rawRows: [],
  headers: [],
  mapping: {},
  charts: {}
};

const els = {};
document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  bindEvents();
  populateSettings();
  renderAll();
}

function cacheElements() {
  [
    "sidebar", "mobileMenu", "projectTitle", "projectMeta", "lastUpdated", "budgetKpi", "spentKpi", "spentSubtext", "remainingKpi", "forecastSubtext",
    "progressKpi", "progressSubtext", "daysKpi", "deadlineSubtext", "labourKpi", "costStatus", "healthScore", "healthLabel", "aiSummary",
    "packageTableBody", "riskList", "riskCount", "projectGrid", "importHistoryBody", "importModal", "settingsModal", "projectModal", "fileInput",
    "dropZone", "filePreview", "mappingSection", "mappingGrid", "processImportButton", "settingsForm", "projectForm", "toast", "dataNotice"
  ].forEach(id => els[id] = document.getElementById(id));
}

function bindEvents() {
  document.querySelectorAll(".nav-link[data-view]").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view, button));
  });

  document.getElementById("importButton").addEventListener("click", openImportModal);
  document.getElementById("noticeImportButton").addEventListener("click", openImportModal);
  document.getElementById("importsUploadButton").addEventListener("click", openImportModal);
  document.getElementById("customizeButton").addEventListener("click", openSettingsModal);
  document.getElementById("settingsButton").addEventListener("click", openSettingsModal);
  document.getElementById("exportButton").addEventListener("click", exportReport);
  document.getElementById("reportsExportButton").addEventListener("click", exportReport);
  document.querySelectorAll(".report-generate").forEach(button => button.addEventListener("click", exportReport));
  document.getElementById("regenerateInsight").addEventListener("click", () => {
    renderInsight(calculateMetrics());
    showToast("Management summary regenerated from the latest data.");
  });
  document.getElementById("newProjectButton").addEventListener("click", () => openModal(els.projectModal));
  document.getElementById("viewAllPackages").addEventListener("click", () => showToast("Full work-package management will be added in the next phase."));

  els.mobileMenu.addEventListener("click", () => els.sidebar.classList.toggle("open"));
  document.addEventListener("click", event => {
    if (window.innerWidth <= 980 && els.sidebar.classList.contains("open") && !els.sidebar.contains(event.target) && event.target !== els.mobileMenu) {
      els.sidebar.classList.remove("open");
    }
  });

  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeImportModal));
  document.querySelectorAll("[data-close-settings]").forEach(el => el.addEventListener("click", () => closeModal(els.settingsModal)));
  document.querySelectorAll("[data-close-project]").forEach(el => el.addEventListener("click", () => closeModal(els.projectModal)));

  els.fileInput.addEventListener("change", event => handleFile(event.target.files[0]));
  ["dragenter", "dragover"].forEach(type => els.dropZone.addEventListener(type, event => {
    event.preventDefault(); els.dropZone.classList.add("dragover");
  }));
  ["dragleave", "drop"].forEach(type => els.dropZone.addEventListener(type, event => {
    event.preventDefault(); els.dropZone.classList.remove("dragover");
  }));
  els.dropZone.addEventListener("drop", event => handleFile(event.dataTransfer.files[0]));
  els.processImportButton.addEventListener("click", processMappedRows);
  els.settingsForm.addEventListener("submit", saveProjectSettings);
  els.projectForm.addEventListener("submit", createProject);
}

function switchView(view, button) {
  document.querySelectorAll(".view").forEach(section => section.classList.remove("active"));
  document.getElementById(`${view}View`).classList.add("active");
  document.querySelectorAll(".nav-link[data-view]").forEach(link => link.classList.remove("active"));
  button.classList.add("active");
  els.sidebar.classList.remove("open");
}

function renderAll() {
  const metrics = calculateMetrics();
  renderProjectHeader();
  renderKpis(metrics);
  renderCharts(metrics);
  renderInsight(metrics);
  renderPackages();
  renderRisks(metrics);
  renderProjects();
  renderImportHistory();
}

function calculateMetrics() {
  const rows = [...state.rows].sort((a, b) => new Date(a.date) - new Date(b.date));
  const plannedTotal = sum(rows, "plannedCost");
  const actualTotal = sum(rows, "actualCost");
  const labourHours = sum(rows, "labourHours");
  const latest = rows[rows.length - 1] || {};
  const plannedProgress = validNumber(latest.plannedProgress);
  const actualProgress = validNumber(latest.actualProgress);
  const progressVariance = actualProgress - plannedProgress;
  const remainingBudget = state.project.approvedBudget - actualTotal;
  const spendPercent = state.project.approvedBudget ? (actualTotal / state.project.approvedBudget) * 100 : 0;
  const predictedFinalCost = actualProgress > 0 ? actualTotal / (actualProgress / 100) : actualTotal;
  const today = new Date();
  const end = new Date(`${state.project.endDate}T23:59:59`);
  const daysRemaining = Math.max(0, Math.ceil((end - today) / 86400000));
  const riskRows = rows.filter(row => ["high", "critical"].includes(String(row.riskLevel || "").toLowerCase())).length;
  const costVariance = actualTotal - plannedTotal;
  const healthScore = Math.max(15, Math.min(96, Math.round(90 - Math.max(0, -progressVariance) * 2 - Math.max(0, spendPercent - actualProgress) * 0.8 - riskRows * 2)));

  const categories = {};
  rows.forEach(row => {
    const name = row.category || "Uncategorised";
    categories[name] = (categories[name] || 0) + validNumber(row.actualCost);
  });

  return {
    rows, plannedTotal, actualTotal, labourHours, latest, plannedProgress, actualProgress, progressVariance,
    remainingBudget, spendPercent, predictedFinalCost, daysRemaining, riskRows, costVariance, healthScore, categories
  };
}

function renderProjectHeader() {
  const p = state.project;
  els.projectTitle.textContent = p.name;
  els.projectMeta.textContent = `${p.location} · ${formatDate(p.startDate)} – ${formatDate(p.endDate)}`;
  els.deadlineSubtext.textContent = `Deadline: ${formatDate(p.endDate)}`;
}

function renderKpis(m) {
  els.budgetKpi.textContent = formatMoney(state.project.approvedBudget);
  els.spentKpi.textContent = formatMoney(m.actualTotal);
  els.spentSubtext.textContent = `${m.spendPercent.toFixed(1)}% of approved budget`;
  els.remainingKpi.textContent = formatMoney(m.remainingBudget);
  els.forecastSubtext.textContent = m.predictedFinalCost <= state.project.approvedBudget
    ? `Forecast: ${formatMoney(m.predictedFinalCost)} final cost`
    : `Forecast overrun: ${formatMoney(m.predictedFinalCost - state.project.approvedBudget)}`;
  els.progressKpi.textContent = `${round(m.actualProgress)}%`;
  const variance = Math.abs(round(m.progressVariance));
  els.progressSubtext.textContent = m.progressVariance < 0
    ? `${variance}% behind the planned ${round(m.plannedProgress)}%`
    : `${variance}% ahead of the planned ${round(m.plannedProgress)}%`;
  els.daysKpi.textContent = m.daysRemaining.toLocaleString("en-ZA");
  els.labourKpi.textContent = round(m.labourHours).toLocaleString("en-ZA");
  els.lastUpdated.textContent = m.rows.length ? formatDate(m.rows[m.rows.length - 1].date) : "No data";

  els.costStatus.className = "status-pill";
  if (m.predictedFinalCost > state.project.approvedBudget * 1.05) {
    els.costStatus.textContent = "Overrun risk";
    els.costStatus.classList.add("danger");
  } else if (m.predictedFinalCost > state.project.approvedBudget) {
    els.costStatus.textContent = "Watch forecast";
    els.costStatus.classList.add("warning");
  } else {
    els.costStatus.textContent = "Within budget";
  }
}

function renderCharts(m) {
  if (typeof Chart === "undefined") {
    showToast("Charts could not load. Check your internet connection and refresh.");
    return;
  }

  Object.values(state.charts).forEach(chart => chart?.destroy());
  const labels = m.rows.map(row => shortDate(row.date));
  let plannedCumulative = 0;
  let actualCumulative = 0;
  const plannedCosts = m.rows.map(row => plannedCumulative += validNumber(row.plannedCost));
  const actualCosts = m.rows.map(row => actualCumulative += validNumber(row.actualCost));

  Chart.defaults.font.family = "Inter, sans-serif";
  Chart.defaults.color = "#697582";

  state.charts.cost = new Chart(document.getElementById("costChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Planned cost", data: plannedCosts, borderColor: "#8c99a2", backgroundColor: "rgba(140,153,162,.08)", borderDash: [6,5], tension: .35, fill: false, pointRadius: 3 },
        { label: "Actual cost", data: actualCosts, borderColor: "#0d6b57", backgroundColor: "rgba(13,107,87,.10)", tension: .35, fill: true, pointRadius: 3 }
      ]
    },
    options: chartOptions(value => compactMoney(value))
  });

  state.charts.progress = new Chart(document.getElementById("progressChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Planned progress", data: m.rows.map(row => validNumber(row.plannedProgress)), backgroundColor: "rgba(140,153,162,.55)", borderRadius: 5 },
        { label: "Actual progress", data: m.rows.map(row => validNumber(row.actualProgress)), backgroundColor: "rgba(13,107,87,.82)", borderRadius: 5 }
      ]
    },
    options: {
      ...chartOptions(value => `${value}%`),
      scales: { x: gridOptions(), y: { ...gridOptions(), beginAtZero: true, max: 100, ticks: { callback: value => `${value}%` } } }
    }
  });

  state.charts.category = new Chart(document.getElementById("categoryChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(m.categories),
      datasets: [{ data: Object.values(m.categories), backgroundColor: ["#0d6b57", "#3f8f7c", "#72aa9c", "#a7c9c1", "#d2e5e0", "#7c8991"], borderWidth: 0, hoverOffset: 5 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "66%",
      plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, padding: 15, font: { size: 10 } } }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${formatMoney(ctx.raw)}` } } }
    }
  });
}

function chartOptions(callback) {
  return {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "top", align: "end", labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 } } }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${callback(ctx.raw)}` } } },
    scales: { x: gridOptions(), y: { ...gridOptions(), beginAtZero: true, ticks: { callback } } }
  };
}

function gridOptions() {
  return { grid: { color: "rgba(105,117,130,.10)", drawBorder: false }, border: { display: false }, ticks: { font: { size: 10 } } };
}

function renderInsight(m) {
  els.healthScore.textContent = m.healthScore;
  let label = "Healthy";
  if (m.healthScore < 60) label = "High attention";
  else if (m.healthScore < 80) label = "Needs attention";
  els.healthLabel.textContent = label;

  const statements = [];
  if (m.progressVariance < -5) statements.push(`Actual progress is ${Math.abs(round(m.progressVariance))}% behind the approved programme.`);
  else if (m.progressVariance < 0) statements.push(`Progress is slightly behind the approved programme by ${Math.abs(round(m.progressVariance))}%.`);
  else statements.push(`Project delivery is meeting or exceeding the approved programme.`);

  if (m.predictedFinalCost > state.project.approvedBudget) statements.push(`Current performance indicates a possible final cost overrun of ${formatMoney(m.predictedFinalCost - state.project.approvedBudget)}.`);
  else statements.push(`Expenditure remains within budget, with a current final-cost forecast of ${formatMoney(m.predictedFinalCost)}.`);

  if (m.riskRows > 0) statements.push(`${m.riskRows} high-risk reporting period${m.riskRows === 1 ? " has" : "s have"} been detected and should be reviewed with the project team.`);
  else statements.push(`No high-risk reporting periods are present in the imported data.`);

  els.aiSummary.textContent = statements.join(" ");
}

function renderPackages() {
  els.packageTableBody.innerHTML = WORK_PACKAGES.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.name)}</strong></td>
      <td>${escapeHtml(item.owner)}</td>
      <td><div class="progress-cell"><div class="progress-track"><div class="progress-fill" style="width:${item.progress}%"></div></div><span>${item.progress}%</span></div></td>
      <td><span class="table-status ${slug(item.status)}">${escapeHtml(item.status)}</span></td>
    </tr>
  `).join("");
}

function renderRisks(m) {
  const risks = [];
  if (m.progressVariance < -5) risks.push({ title: "Schedule slippage", detail: `Actual progress is ${Math.abs(round(m.progressVariance))}% below the programme baseline.`, level: "high" });
  if (m.predictedFinalCost > state.project.approvedBudget) risks.push({ title: "Forecast cost overrun", detail: `Projected final cost exceeds the approved budget by ${formatMoney(m.predictedFinalCost - state.project.approvedBudget)}.`, level: "high" });
  if (m.actualProgress > 0 && m.spendPercent - m.actualProgress > 5) risks.push({ title: "Cost ahead of progress", detail: `Budget consumption is ${round(m.spendPercent - m.actualProgress)}% higher than physical progress.`, level: "medium" });
  if (m.daysRemaining < 60 && m.actualProgress < 80) risks.push({ title: "Deadline exposure", detail: `${m.daysRemaining} days remain while the project is only ${round(m.actualProgress)}% complete.`, level: "high" });
  if (!risks.length) risks.push({ title: "No critical warnings", detail: "The current project data is within the configured cost and schedule thresholds.", level: "low" });

  els.riskCount.textContent = risks.filter(r => r.level !== "low").length;
  els.riskList.innerHTML = risks.slice(0, 4).map(risk => `
    <div class="risk-item"><span class="risk-dot ${risk.level === "high" ? "high" : ""}"></span><div><strong>${risk.title}</strong><p>${risk.detail}</p></div></div>
  `).join("");
}

function renderProjects() {
  const metrics = calculateMetrics();
  els.projectGrid.innerHTML = state.projects.map(project => {
    const active = project.id === state.project.id;
    return `
      <article class="project-card ${active ? "active-project" : ""}">
        <div class="project-card-top"><span class="status-pill">${escapeHtml(project.status || "Planning")}</span><small>${escapeHtml(project.client)}</small></div>
        <h3>${escapeHtml(project.name)}</h3>
        <p>${escapeHtml(project.location)} · ${formatDate(project.startDate)} – ${formatDate(project.endDate)}</p>
        <div class="project-stats">
          <div><strong>${formatMoney(project.approvedBudget)}</strong><small>Approved budget</small></div>
          <div><strong>${active ? `${round(metrics.actualProgress)}%` : "0%"}</strong><small>Progress</small></div>
          <div><strong>${active ? metrics.daysRemaining : "—"}</strong><small>Days left</small></div>
        </div>
      </article>`;
  }).join("");
}

function renderImportHistory() {
  if (!state.importHistory.length) {
    els.importHistoryBody.innerHTML = '<tr><td colspan="4" class="empty-cell">No files imported yet.</td></tr>';
    return;
  }
  els.importHistoryBody.innerHTML = state.importHistory.map(item => `
    <tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.date)}</td><td>${item.rows}</td><td><span class="table-status">Processed</span></td></tr>
  `).join("");
}

function openImportModal() {
  resetImportModal();
  openModal(els.importModal);
}
function closeImportModal() { closeModal(els.importModal); }
function openSettingsModal() { populateSettings(); openModal(els.settingsModal); }
function openModal(modal) { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
function closeModal(modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }

function resetImportModal() {
  state.rawRows = []; state.headers = []; state.mapping = {};
  els.fileInput.value = "";
  els.filePreview.classList.add("hidden");
  els.mappingSection.classList.add("hidden");
  els.processImportButton.disabled = true;
}

async function handleFile(file) {
  if (!file) return;
  const extension = file.name.split(".").pop().toLowerCase();
  if (!["xlsx", "xls", "csv"].includes(extension)) {
    showToast("Please choose an XLSX, XLS, or CSV file.");
    return;
  }
  if (typeof XLSX === "undefined") {
    showToast("Spreadsheet reader could not load. Check your internet connection.");
    return;
  }

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    if (!rows.length) throw new Error("The first worksheet contains no data rows.");
    state.rawRows = rows;
    state.headers = Object.keys(rows[0]);
    state.currentFile = file;
    state.mapping = suggestMapping(state.headers);
    renderMapping();
    els.filePreview.innerHTML = `<strong>${escapeHtml(file.name)}</strong><br>${rows.length.toLocaleString("en-ZA")} rows found · ${state.headers.length} columns · Worksheet: ${escapeHtml(workbook.SheetNames[0])}`;
    els.filePreview.classList.remove("hidden");
    els.mappingSection.classList.remove("hidden");
    els.processImportButton.disabled = false;
  } catch (error) {
    console.error(error);
    showToast(error.message || "The file could not be read.");
  }
}

function suggestMapping(headers) {
  const result = {};
  FIELD_CONFIG.forEach(field => {
    const best = headers.find(header => {
      const clean = normalise(header);
      return field.aliases.some(alias => clean === alias || clean.includes(alias) || alias.includes(clean));
    });
    result[field.key] = best || "";
  });
  return result;
}

function renderMapping() {
  const options = ['<option value="">Not available</option>', ...state.headers.map(header => `<option value="${escapeAttr(header)}">${escapeHtml(header)}</option>`)].join("");
  els.mappingGrid.innerHTML = FIELD_CONFIG.map(field => `
    <label class="mapping-field">${field.label}<select data-map-key="${field.key}">${options}</select></label>
  `).join("");
  document.querySelectorAll("[data-map-key]").forEach(select => {
    const key = select.dataset.mapKey;
    select.value = state.mapping[key] || "";
    select.addEventListener("change", () => state.mapping[key] = select.value);
  });
}

function processMappedRows() {
  const required = ["date", "actualCost", "actualProgress"];
  const missing = required.filter(key => !state.mapping[key]);
  if (missing.length) {
    showToast("Match at least Reporting date, Actual cost, and Actual progress.");
    return;
  }

  const mapped = state.rawRows.map((raw, index) => {
    const value = key => state.mapping[key] ? raw[state.mapping[key]] : "";
    return {
      date: parseDate(value("date"), index),
      category: String(value("category") || "Uncategorised"),
      plannedCost: parseNumber(value("plannedCost")),
      actualCost: parseNumber(value("actualCost")),
      plannedProgress: parsePercent(value("plannedProgress")),
      actualProgress: parsePercent(value("actualProgress")),
      labourHours: parseNumber(value("labourHours")),
      tasksCompleted: parseNumber(value("tasksCompleted")),
      totalTasks: parseNumber(value("totalTasks")),
      riskLevel: String(value("riskLevel") || "")
    };
  }).filter(row => row.date && (row.actualCost || row.actualProgress || row.plannedCost));

  if (!mapped.length) {
    showToast("No usable project rows were found after mapping.");
    return;
  }

  state.rows = mapped;
  state.importHistory.unshift({
    name: state.currentFile?.name || "Imported file",
    date: new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date()),
    rows: mapped.length
  });
  state.importHistory = state.importHistory.slice(0, 10);
  saveState();
  els.dataNotice.innerHTML = `<div><strong>Imported data is active.</strong> ${escapeHtml(state.currentFile?.name || "Your file")} is powering this dashboard.</div><button class="text-button" id="noticeImportButton">Replace data →</button>`;
  document.getElementById("noticeImportButton").addEventListener("click", openImportModal);
  closeImportModal();
  renderAll();
  switchView("overview", document.querySelector('[data-view="overview"]'));
  showToast(`Dashboard created from ${mapped.length} imported rows.`);
}

function saveProjectSettings(event) {
  event.preventDefault();
  const oldId = state.project.id;
  state.project = {
    ...state.project,
    name: document.getElementById("settingProjectName").value.trim(),
    client: document.getElementById("settingClient").value.trim(),
    location: document.getElementById("settingLocation").value.trim(),
    approvedBudget: Number(document.getElementById("settingBudget").value),
    startDate: document.getElementById("settingStart").value,
    endDate: document.getElementById("settingEnd").value
  };
  state.projects = state.projects.map(project => project.id === oldId ? state.project : project);
  saveState(); renderAll(); closeModal(els.settingsModal); showToast("Project settings saved.");
}

function createProject(event) {
  event.preventDefault();
  const project = {
    id: `project-${Date.now()}`,
    name: document.getElementById("newProjectName").value.trim(),
    client: document.getElementById("newProjectClient").value.trim(),
    location: document.getElementById("newProjectLocation").value.trim(),
    approvedBudget: Number(document.getElementById("newProjectBudget").value),
    startDate: document.getElementById("newProjectStart").value,
    endDate: document.getElementById("newProjectEnd").value,
    status: "Planning"
  };
  state.projects.unshift(project);
  saveState(); renderProjects(); els.projectForm.reset(); closeModal(els.projectModal); showToast("New project created. Project switching comes in the database phase.");
}

function populateSettings() {
  const p = state.project;
  document.getElementById("settingProjectName").value = p.name;
  document.getElementById("settingClient").value = p.client;
  document.getElementById("settingLocation").value = p.location;
  document.getElementById("settingBudget").value = p.approvedBudget;
  document.getElementById("settingStart").value = p.startDate;
  document.getElementById("settingEnd").value = p.endDate;
}

function exportReport() {
  showToast("Opening the print dialog. Select ‘Save as PDF’ to create the client report.");
  setTimeout(() => window.print(), 400);
}

function saveState() {
  localStorage.setItem("buildmetric_project", JSON.stringify(state.project));
  localStorage.setItem("buildmetric_projects", JSON.stringify(state.projects));
  localStorage.setItem("buildmetric_rows", JSON.stringify(state.rows));
  localStorage.setItem("buildmetric_imports", JSON.stringify(state.importHistory));
}

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}

function sum(rows, key) { return rows.reduce((total, row) => total + validNumber(row[key]), 0); }
function validNumber(value) { const number = Number(value); return Number.isFinite(number) ? number : 0; }
function round(value) { return Math.round(validNumber(value)); }
function parseNumber(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value || "").replace(/\s/g, "").replace(/R/gi, "").replace(/,/g, "").replace(/\(([^)]+)\)/, "-$1").replace(/[^0-9.-]/g, "");
  return Number(cleaned) || 0;
}
function parsePercent(value) {
  const number = parseNumber(value);
  return number > 0 && number <= 1 && String(value).includes(".") ? number * 100 : number;
}
function parseDate(value, index) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10);
  const candidate = new Date(value);
  if (!Number.isNaN(candidate.valueOf())) return candidate.toISOString().slice(0, 10);
  const fallback = new Date(); fallback.setMonth(fallback.getMonth() - index); return fallback.toISOString().slice(0, 10);
}
function formatMoney(value) {
  const n = validNumber(value);
  if (Math.abs(n) >= 1000000) return `R${(n / 1000000).toFixed(2)}m`;
  if (Math.abs(n) >= 1000) return `R${(n / 1000).toFixed(1)}k`;
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}
function compactMoney(value) { return formatMoney(value); }
function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? String(value) : new Intl.DateTimeFormat("en-ZA", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}
function shortDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? String(value) : new Intl.DateTimeFormat("en-ZA", { month: "short", year: "2-digit" }).format(date);
}
function normalise(value) { return String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " "); }
function slug(value) { return String(value || "").toLowerCase().replace(/\s+/g, "-"); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
function escapeAttr(value) { return escapeHtml(value); }
function showToast(message) {
  els.toast.textContent = message; els.toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 3200);
}
