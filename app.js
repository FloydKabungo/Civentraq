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


const DEFAULT_CUSTOMIZATION = {
  preset: "civentraq",
  mode: "light",
  accent: "#0d6b57",
  sidebar: "#111b22",
  background: "#f3f5f7",
  surface: "#ffffff",
  text: "#17202a",
  font: "inter",
  density: "comfortable",
  cardStyle: "soft",
  radius: 18,
  layout: "balanced",
  chartStyle: "smooth",
  chartPalette: "brand",
  legendPosition: "top",
  gridlines: true,
  chartFill: true,
  animations: true,
  brandName: "Civentraq",
  brandTagline: "Project Intelligence",
  brandInitials: "CV",
  companyName: "Alta Autocon",
  companySubtitle: "Engineering workspace",
  companyInitials: "AA",
  reportTitle: "Project Performance Report",
  reportFooter: "Confidential project report",
  logoData: "",
  visible: { notice: true, kpis: true, cost: true, insight: true, progress: true, category: true, packages: true, risks: true }
};

const THEME_PRESETS = {
  civentraq: {
    light: { accent: "#0d6b57", sidebar: "#111b22", background: "#f3f5f7", surface: "#ffffff", text: "#17202a" },
    dark: { accent: "#42c7a2", sidebar: "#091217", background: "#0f171c", surface: "#182229", text: "#eef5f6" }
  },
  ocean: {
    light: { accent: "#1769aa", sidebar: "#102331", background: "#f2f6fa", surface: "#ffffff", text: "#17212a" },
    dark: { accent: "#5eafea", sidebar: "#091722", background: "#0f1b24", surface: "#172630", text: "#eef6fb" }
  },
  construction: {
    light: { accent: "#d56a16", sidebar: "#28221d", background: "#f7f4f0", surface: "#ffffff", text: "#241e19" },
    dark: { accent: "#f09a50", sidebar: "#17120e", background: "#201914", surface: "#2b221b", text: "#fff5ec" }
  },
  executive: {
    light: { accent: "#6750a4", sidebar: "#201b2c", background: "#f5f3f8", surface: "#ffffff", text: "#211d28" },
    dark: { accent: "#b5a2f1", sidebar: "#15111e", background: "#1b1723", surface: "#262131", text: "#f7f2ff" }
  },
  slate: {
    light: { accent: "#4d6470", sidebar: "#182126", background: "#f2f4f5", surface: "#ffffff", text: "#1c252a" },
    dark: { accent: "#8fb1c0", sidebar: "#0c1215", background: "#12191d", surface: "#1d272c", text: "#eef3f5" }
  }
};

let settingsSnapshot = null;
let customizationPreviewTimer = null;

const REPORT_TYPES = {
  full: {
    title: "Complete project report",
    description: "A full client pack covering executive KPIs, cost, schedule, risks, work packages, and improvement actions.",
    slug: "complete-project-report"
  },
  executive: {
    title: "Executive progress report",
    description: "A management-level report covering overall project health, key KPIs, risks, and recommended actions.",
    slug: "executive-progress-report"
  },
  cost: {
    title: "Cost performance report",
    description: "A finance-focused report covering planned versus actual cost, remaining budget, forecast, and spend categories.",
    slug: "cost-performance-report"
  },
  schedule: {
    title: "Schedule variance report",
    description: "A programme-focused report covering planned versus actual progress, delayed work packages, milestones, and recovery actions.",
    slug: "schedule-variance-report"
  }
};

let activeReportType = "full";

let state = {
  project: loadJson("civentraq_project", DEFAULT_PROJECT),
  projects: loadJson("civentraq_projects", [DEFAULT_PROJECT]),
  rows: loadJson("civentraq_rows", SAMPLE_ROWS),
  importHistory: loadJson("civentraq_imports", []),
  ignoredInsights: loadJson("civentraq_ignored_insights", {}),
  customization: mergeCustomization(loadJson("civentraq_customization", DEFAULT_CUSTOMIZATION)),
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
  applyCustomization();
  populateSettings();
  renderAll();
}

function cacheElements() {
  [
    "sidebar", "mobileMenu", "projectTitle", "projectMeta", "lastUpdated", "budgetKpi", "spentKpi", "spentSubtext", "remainingKpi", "forecastSubtext",
    "progressKpi", "progressSubtext", "daysKpi", "deadlineSubtext", "labourKpi", "costStatus", "healthRing", "healthScore", "healthLabel", "aiSummary",
    "scoreGap", "scoreProgress", "scoreUpdateNote", "restoreInsights", "improvementPlan", "healthScoreCaption",
    "packageTableBody", "riskList", "riskCount", "projectGrid", "importHistoryBody", "importModal", "settingsModal", "projectModal", "exportModal", "exportStatus", "fileInput",
    "dropZone", "filePreview", "mappingSection", "mappingGrid", "processImportButton", "settingsForm", "projectForm", "toast", "dataNotice",
    "exportModalTitle", "exportModalDescription", "exportReportType", "brandLogoImage", "brandInitials", "brandName", "brandTagline", "companyAvatar", "companyName", "companySubtitle",
    "resetCustomizationButton", "customThemeMode", "customFont", "customAccent", "customAccentValue", "customSidebar", "customSidebarValue", "customBackground", "customBackgroundValue",
    "customSurface", "customSurfaceValue", "customText", "customTextValue", "customLayout", "customDensity", "customCardStyle", "customRadius", "customRadiusValue", "customChartStyle",
    "customChartPalette", "customLegendPosition", "customGridlines", "customChartFill", "customAnimations", "customBrandName", "customBrandTagline", "customBrandInitials", "customCompanyName",
    "customCompanySubtitle", "customCompanyInitials", "customReportTitle", "customReportFooter", "customLogoInput", "logoPreview", "logoPreviewInitials", "logoPreviewImage", "removeLogoButton", "showAllSectionsButton",
    "showNotice", "showKpis", "showCost", "showInsight", "showProgress", "showCategory", "showPackages", "showRisks"
  ].forEach(id => els[id] = document.getElementById(id));
}

function bindEvents() {
  document.querySelectorAll(".nav-link[data-view]").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view, button));
  });

  document.getElementById("importButton").addEventListener("click", openImportModal);
  document.getElementById("noticeImportButton").addEventListener("click", openImportModal);
  document.getElementById("importsUploadButton").addEventListener("click", openImportModal);
  document.getElementById("customizeButton").addEventListener("click", () => openSettingsModal("theme"));
  document.getElementById("settingsButton").addEventListener("click", () => openSettingsModal("project"));
  bindCustomizationControls();
  document.getElementById("exportButton").addEventListener("click", () => openExportModal("full"));
  document.getElementById("reportsExportButton").addEventListener("click", () => openExportModal("full"));
  document.querySelectorAll(".report-generate").forEach(button => button.addEventListener("click", () => openExportModal(button.dataset.reportType)));
  document.querySelectorAll("[data-close-export]").forEach(el => el.addEventListener("click", () => closeModal(els.exportModal)));
  document.querySelectorAll("[data-export-format]").forEach(button => button.addEventListener("click", () => performExport(button.dataset.exportFormat)));
  document.getElementById("regenerateInsight").addEventListener("click", () => {
    renderInsight(calculateMetrics());
    showToast("Management insights refreshed from the latest project data.");
  });
  els.improvementPlan.addEventListener("click", event => {
    const button = event.target.closest("[data-ignore-insight]");
    if (!button) return;
    ignoreInsight(button.dataset.ignoreInsight, button.closest(".improvement-item"));
  });
  els.restoreInsights.addEventListener("click", restoreIgnoredInsights);
  document.getElementById("newProjectButton").addEventListener("click", () => openModal(els.projectModal));
  document.getElementById("viewAllPackages").addEventListener("click", () => showToast("Full work-package management will be added in the next phase."));

  els.mobileMenu.addEventListener("click", () => els.sidebar.classList.toggle("open"));
  document.addEventListener("click", event => {
    if (window.innerWidth <= 980 && els.sidebar.classList.contains("open") && !els.sidebar.contains(event.target) && event.target !== els.mobileMenu) {
      els.sidebar.classList.remove("open");
    }
  });

  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeImportModal));
  document.querySelectorAll("[data-close-settings]").forEach(el => el.addEventListener("click", () => closeSettingsModal(true)));
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
  applyCustomization();
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

  // The health score starts at 100. Every visible recommendation below is tied
  // to a specific deduction, so the user can see exactly how to improve it.
  const scoreFactors = [];
  let scoreRemaining = 100;
  const addScoreFactor = (factor) => {
    const points = Math.min(scoreRemaining, Math.max(0, Math.round(factor.points)));
    if (!points) return;
    scoreFactors.push({ ...factor, points });
    scoreRemaining -= points;
  };

  const scheduleGap = Math.max(0, -progressVariance);
  addScoreFactor({
    key: "schedule",
    title: `Recover the ${round(scheduleGap)}% schedule variance`,
    action: "Create a recovery programme, re-sequence delayed work packages and assign weekly catch-up targets to each discipline.",
    points: scheduleGap * 2,
    priority: scheduleGap > 5 ? "high" : "medium"
  });

  const overrunAmount = Math.max(0, predictedFinalCost - state.project.approvedBudget);
  const overrunPercent = state.project.approvedBudget ? (overrunAmount / state.project.approvedBudget) * 100 : 0;
  addScoreFactor({
    key: "forecast",
    title: "Bring the final-cost forecast back within budget",
    action: "Freeze non-critical spend, review contingency use and agree corrective cost actions with each package owner.",
    points: overrunAmount > 0 ? Math.max(4, Math.min(18, overrunPercent)) : 0,
    priority: "high"
  });

  const costProgressGap = Math.max(0, spendPercent - actualProgress);
  addScoreFactor({
    key: "cost-efficiency",
    title: `Close the ${round(costProgressGap)}% spend-to-progress gap`,
    action: "Review labour, material and subcontractor costs where expenditure is ahead of completed physical work.",
    points: costProgressGap * 1.5,
    priority: costProgressGap > 8 ? "high" : "medium"
  });

  addScoreFactor({
    key: "risk",
    title: `Close ${riskRows} high-risk reporting period${riskRows === 1 ? "" : "s"}`,
    action: "Assign an owner and due date to every high-risk item, record the mitigation evidence and confirm closure at the next review.",
    points: riskRows * 7,
    priority: "high"
  });

  const deadlineExposed = daysRemaining < 60 && actualProgress < 80;
  addScoreFactor({
    key: "deadline",
    title: "Protect the project completion deadline",
    action: "Prioritise critical-path tasks, remove open blockers and review the two-week lookahead with delivery leads every day.",
    points: deadlineExposed ? 10 : 0,
    priority: "high"
  });

  const baseHealthScore = scoreRemaining;
  const knownKeys = new Set(scoreFactors.map(factor => factor.key));
  const ignoredKeys = new Set(getIgnoredInsights().filter(key => knownKeys.has(key)));
  const ignoredScoreFactors = scoreFactors.filter(factor => ignoredKeys.has(factor.key));
  const activeScoreFactors = scoreFactors.filter(factor => !ignoredKeys.has(factor.key));
  const recoveredPoints = ignoredScoreFactors.reduce((total, factor) => total + factor.points, 0);
  const healthScore = Math.min(100, baseHealthScore + recoveredPoints);

  const categories = {};
  rows.forEach(row => {
    const name = row.category || "Uncategorised";
    categories[name] = (categories[name] || 0) + validNumber(row.actualCost);
  });

  return {
    rows, plannedTotal, actualTotal, labourHours, latest, plannedProgress, actualProgress, progressVariance,
    remainingBudget, spendPercent, predictedFinalCost, daysRemaining, riskRows, costVariance,
    healthScore, baseHealthScore, scoreFactors: activeScoreFactors, allScoreFactors: scoreFactors, ignoredScoreFactors, categories
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
    ? `Estimated final project cost: ${formatMoney(m.predictedFinalCost)}`
    : `Estimated final cost exceeds budget by ${formatMoney(m.predictedFinalCost - state.project.approvedBudget)}`;
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

  const chartTheme = getChartTheme();
  const lineStyle = getLineStyle();
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = cssVar("--muted") || "#697582";

  state.charts.cost = new Chart(document.getElementById("costChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Planned cost", data: plannedCosts, borderColor: chartTheme.secondary, backgroundColor: hexToRgba(chartTheme.secondary, .08), borderDash: [6,5], ...lineStyle, fill: false, pointRadius: 3 },
        { label: "Actual cost", data: actualCosts, borderColor: chartTheme.primary, backgroundColor: hexToRgba(chartTheme.primary, .12), ...lineStyle, fill: state.customization.chartFill, pointRadius: 3 }
      ]
    },
    options: chartOptions(value => compactMoney(value))
  });

  state.charts.progress = new Chart(document.getElementById("progressChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Planned progress", data: m.rows.map(row => validNumber(row.plannedProgress)), backgroundColor: hexToRgba(chartTheme.secondary, .62), borderRadius: 5 },
        { label: "Actual progress", data: m.rows.map(row => validNumber(row.actualProgress)), backgroundColor: hexToRgba(chartTheme.primary, .86), borderRadius: 5 }
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
      datasets: [{ data: Object.values(m.categories), backgroundColor: chartTheme.palette, borderWidth: 0, hoverOffset: 5 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "66%", animation: state.customization.animations ? undefined : false,
      plugins: { legend: { position: state.customization.legendPosition, labels: { usePointStyle: true, boxWidth: 8, padding: 15, font: { size: 10 }, color: cssVar("--muted") } }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${formatMoney(ctx.raw)}` } } }
    }
  });
}

function chartOptions(callback) {
  return {
    responsive: true, maintainAspectRatio: false, animation: state.customization.animations ? undefined : false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: state.customization.legendPosition, align: state.customization.legendPosition === "top" ? "end" : "center", labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: cssVar("--muted") } }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${callback(ctx.raw)}` } } },
    scales: { x: gridOptions(), y: { ...gridOptions(), beginAtZero: true, ticks: { callback } } }
  };
}

function gridOptions() {
  return { grid: { color: state.customization.gridlines ? (cssVar("--chart-grid") || "rgba(105,117,130,.10)") : "transparent", drawBorder: false }, border: { display: false }, ticks: { font: { size: 10 }, color: cssVar("--muted") } };
}

function renderInsight(m) {
  els.healthScore.textContent = m.healthScore;
  els.healthRing.style.setProperty("--score", `${m.healthScore}%`);
  els.scoreProgress.style.width = `${m.healthScore}%`;
  els.healthScoreCaption.textContent = "Insight review score";

  const allReviewed = m.healthScore === 100 && m.ignoredScoreFactors.length > 0 && !m.scoreFactors.length;
  els.healthLabel.textContent = allReviewed ? "All insights reviewed" : getHealthLabel(m.healthScore);

  const pointsAvailable = 100 - m.healthScore;
  els.aiSummary.textContent = getManagementSummary(m);

  els.scoreGap.textContent = pointsAvailable > 0
    ? `${pointsAvailable} point${pointsAvailable === 1 ? "" : "s"} available`
    : "Target achieved";

  const remainingCount = m.scoreFactors.length;
  els.scoreUpdateNote.textContent = remainingCount
    ? `${remainingCount} suggestion${remainingCount === 1 ? "" : "s"} remaining`
    : "No suggestions remaining";

  els.restoreInsights.hidden = m.ignoredScoreFactors.length === 0;
  els.restoreInsights.textContent = m.ignoredScoreFactors.length
    ? `Restore ${m.ignoredScoreFactors.length} ignored`
    : "Restore ignored";

  if (!m.scoreFactors.length) {
    const hasIgnored = m.ignoredScoreFactors.length > 0;
    els.improvementPlan.innerHTML = `
      <div class="improvement-item complete editor-complete">
        <span class="improvement-index">✓</span>
        <div>
          <strong>${hasIgnored ? "All insight messages reviewed" : "No improvement messages needed"}</strong>
          <p>${hasIgnored
            ? "Nothing is left in the review list. New suggestions will appear when project data changes, or you can restore ignored items."
            : "The current project data has no active score deductions. Keep imports current and continue monitoring cost, schedule and risk."}</p>
        </div>
        <span class="point-gain">100</span>
      </div>`;
    return;
  }

  els.improvementPlan.innerHTML = m.scoreFactors.map((factor, index) => `
    <div class="improvement-item ${factor.priority}" data-insight-key="${escapeAttr(factor.key)}">
      <span class="improvement-index">${index + 1}</span>
      <div>
        <strong>${escapeHtml(factor.title)}</strong>
        <p>${escapeHtml(factor.action)}</p>
      </div>
      <div class="improvement-controls">
        <span class="point-gain">+${factor.points}</span>
        <button class="ignore-insight" type="button" data-ignore-insight="${escapeAttr(factor.key)}" aria-label="Ignore ${escapeAttr(factor.title)}">Ignore</button>
      </div>
    </div>
  `).join("");
}

function ignoreInsight(key, card) {
  const metrics = calculateMetrics();
  const factor = metrics.scoreFactors.find(item => item.key === key);
  if (!factor) return;

  const ignored = new Set(getIgnoredInsights());
  ignored.add(key);
  state.ignoredInsights[state.project.id] = [...ignored];
  saveState();

  const finish = () => {
    renderInsight(calculateMetrics());
    showToast(`Insight ignored. Review score increased by ${factor.points} point${factor.points === 1 ? "" : "s"}.`);
  };

  if (card) {
    card.classList.add("is-dismissing");
    window.setTimeout(finish, 230);
  } else {
    finish();
  }
}

function restoreIgnoredInsights() {
  const count = getIgnoredInsights().length;
  if (!count) return;
  state.ignoredInsights[state.project.id] = [];
  saveState();
  renderInsight(calculateMetrics());
  showToast(`${count} ignored insight${count === 1 ? "" : "s"} restored.`);
}

function getIgnoredInsights() {
  const ignored = state.ignoredInsights[state.project.id];
  return Array.isArray(ignored) ? ignored : [];
}

function resetIgnoredInsights() {
  state.ignoredInsights[state.project.id] = [];
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

function getRiskItems(m) {
  const risks = [];
  if (m.progressVariance < -5) risks.push({ title: "Schedule slippage", detail: `Actual progress is ${Math.abs(round(m.progressVariance))}% below the programme baseline.`, level: "high" });
  if (m.predictedFinalCost > state.project.approvedBudget) risks.push({ title: "Forecast cost overrun", detail: `Projected final cost exceeds the approved budget by ${formatMoney(m.predictedFinalCost - state.project.approvedBudget)}.`, level: "high" });
  if (m.actualProgress > 0 && m.spendPercent - m.actualProgress > 5) risks.push({ title: "Cost ahead of progress", detail: `Budget consumption is ${round(m.spendPercent - m.actualProgress)}% higher than physical progress.`, level: "medium" });
  if (m.daysRemaining < 60 && m.actualProgress < 80) risks.push({ title: "Deadline exposure", detail: `${m.daysRemaining} days remain while the project is only ${round(m.actualProgress)}% complete.`, level: "high" });
  if (!risks.length) risks.push({ title: "No critical warnings", detail: "The current project data is within the configured cost and schedule thresholds.", level: "low" });
  return risks;
}

function renderRisks(m) {
  const risks = getRiskItems(m);
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


function bindCustomizationControls() {
  document.querySelectorAll("[data-settings-tab]").forEach(button => {
    button.addEventListener("click", () => activateSettingsTab(button.dataset.settingsTab));
  });

  document.querySelectorAll("[data-theme-preset]").forEach(button => {
    button.addEventListener("click", () => applyThemePreset(button.dataset.themePreset));
  });

  const previewInputs = [
    "customThemeMode", "customFont", "customAccent", "customSidebar", "customBackground", "customSurface", "customText",
    "customLayout", "customDensity", "customCardStyle", "customRadius", "customChartStyle", "customChartPalette",
    "customLegendPosition", "customGridlines", "customChartFill", "customAnimations", "customBrandName", "customBrandTagline",
    "customBrandInitials", "customCompanyName", "customCompanySubtitle", "customCompanyInitials", "customReportTitle", "customReportFooter",
    "showNotice", "showKpis", "showCost", "showInsight", "showProgress", "showCategory", "showPackages", "showRisks"
  ];
  previewInputs.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", scheduleCustomizationPreview);
    input.addEventListener("change", scheduleCustomizationPreview);
  });

  els.customThemeMode.addEventListener("change", () => {
    const preset = state.customization.preset || "civentraq";
    applyThemePreset(preset, els.customThemeMode.value);
  });
  els.customLogoInput.addEventListener("change", handleLogoUpload);
  els.removeLogoButton.addEventListener("click", removeCustomLogo);
  els.resetCustomizationButton.addEventListener("click", resetCustomization);
  els.showAllSectionsButton.addEventListener("click", showAllDashboardSections);

  const deviceTheme = window.matchMedia?.("(prefers-color-scheme: dark)");
  deviceTheme?.addEventListener?.("change", () => {
    if (state.customization.mode === "system") {
      applyThemePreset(state.customization.preset || "civentraq", "system");
    }
  });
}

function activateSettingsTab(name) {
  document.querySelectorAll("[data-settings-tab]").forEach(button => button.classList.toggle("active", button.dataset.settingsTab === name));
  document.querySelectorAll("[data-settings-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.settingsPanel === name));
}

function mergeCustomization(value) {
  const input = value && typeof value === "object" ? value : {};
  return {
    ...structuredClone(DEFAULT_CUSTOMIZATION),
    ...input,
    visible: { ...DEFAULT_CUSTOMIZATION.visible, ...(input.visible || {}) }
  };
}

function resolvedMode(mode = state.customization.mode) {
  if (mode === "system") return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  return mode === "dark" ? "dark" : "light";
}

function applyThemePreset(name, requestedMode = null) {
  const presetName = THEME_PRESETS[name] ? name : "civentraq";
  const modeValue = requestedMode || els.customThemeMode?.value || state.customization.mode || "light";
  const palette = THEME_PRESETS[presetName][resolvedMode(modeValue)];
  state.customization = mergeCustomization({
    ...state.customization,
    ...palette,
    preset: presetName,
    mode: modeValue
  });
  populateCustomizationFields();
  applyCustomization();
  renderCharts(calculateMetrics());
}

function scheduleCustomizationPreview() {
  clearTimeout(customizationPreviewTimer);
  customizationPreviewTimer = setTimeout(() => {
    state.customization = readCustomizationForm();
    applyCustomization();
    renderCharts(calculateMetrics());
  }, 70);
}

function readCustomizationForm() {
  const visible = {};
  ["Notice", "Kpis", "Cost", "Insight", "Progress", "Category", "Packages", "Risks"].forEach(key => {
    const id = `show${key}`;
    const property = key.charAt(0).toLowerCase() + key.slice(1);
    visible[property] = Boolean(document.getElementById(id)?.checked);
  });
  return mergeCustomization({
    ...state.customization,
    mode: els.customThemeMode.value,
    font: els.customFont.value,
    accent: els.customAccent.value,
    sidebar: els.customSidebar.value,
    background: els.customBackground.value,
    surface: els.customSurface.value,
    text: els.customText.value,
    layout: els.customLayout.value,
    density: els.customDensity.value,
    cardStyle: els.customCardStyle.value,
    radius: Number(els.customRadius.value),
    chartStyle: els.customChartStyle.value,
    chartPalette: els.customChartPalette.value,
    legendPosition: els.customLegendPosition.value,
    gridlines: els.customGridlines.checked,
    chartFill: els.customChartFill.checked,
    animations: els.customAnimations.checked,
    brandName: els.customBrandName.value.trim() || DEFAULT_CUSTOMIZATION.brandName,
    brandTagline: els.customBrandTagline.value.trim() || DEFAULT_CUSTOMIZATION.brandTagline,
    brandInitials: normaliseInitials(els.customBrandInitials.value, DEFAULT_CUSTOMIZATION.brandInitials),
    companyName: els.customCompanyName.value.trim() || DEFAULT_CUSTOMIZATION.companyName,
    companySubtitle: els.customCompanySubtitle.value.trim() || DEFAULT_CUSTOMIZATION.companySubtitle,
    companyInitials: normaliseInitials(els.customCompanyInitials.value, DEFAULT_CUSTOMIZATION.companyInitials),
    reportTitle: els.customReportTitle.value.trim() || DEFAULT_CUSTOMIZATION.reportTitle,
    reportFooter: els.customReportFooter.value.trim() || DEFAULT_CUSTOMIZATION.reportFooter,
    visible
  });
}

function populateCustomizationFields() {
  const c = mergeCustomization(state.customization);
  const values = {
    customThemeMode: c.mode, customFont: c.font, customAccent: c.accent, customSidebar: c.sidebar,
    customBackground: c.background, customSurface: c.surface, customText: c.text, customLayout: c.layout,
    customDensity: c.density, customCardStyle: c.cardStyle, customRadius: c.radius, customChartStyle: c.chartStyle,
    customChartPalette: c.chartPalette, customLegendPosition: c.legendPosition, customBrandName: c.brandName,
    customBrandTagline: c.brandTagline, customBrandInitials: c.brandInitials, customCompanyName: c.companyName,
    customCompanySubtitle: c.companySubtitle, customCompanyInitials: c.companyInitials, customReportTitle: c.reportTitle,
    customReportFooter: c.reportFooter
  };
  Object.entries(values).forEach(([id, value]) => { if (document.getElementById(id)) document.getElementById(id).value = value; });
  els.customGridlines.checked = c.gridlines;
  els.customChartFill.checked = c.chartFill;
  els.customAnimations.checked = c.animations;
  Object.entries(c.visible).forEach(([key, value]) => {
    const id = `show${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    if (document.getElementById(id)) document.getElementById(id).checked = value;
  });
  updateCustomizationOutputs();
  updateLogoPreview();
  document.querySelectorAll("[data-theme-preset]").forEach(button => button.classList.toggle("active", button.dataset.themePreset === c.preset));
}

function updateCustomizationOutputs() {
  ["Accent", "Sidebar", "Background", "Surface", "Text"].forEach(name => {
    const input = document.getElementById(`custom${name}`);
    const output = document.getElementById(`custom${name}Value`);
    if (input && output) output.textContent = input.value.toUpperCase();
  });
  if (els.customRadiusValue) els.customRadiusValue.textContent = `${els.customRadius.value}px`;
}

function applyCustomization() {
  state.customization = mergeCustomization(state.customization);
  const c = state.customization;
  const root = document.documentElement;
  const muted = mixHex(c.text, c.background, resolvedMode(c.mode) === "dark" ? .52 : .58);
  const border = mixHex(c.text, c.surface, resolvedMode(c.mode) === "dark" ? .78 : .88);
  const primarySoft = mixHex(c.accent, c.surface, resolvedMode(c.mode) === "dark" ? .78 : .86);
  root.style.setProperty("--bg", c.background);
  root.style.setProperty("--surface", c.surface);
  root.style.setProperty("--surface-2", mixHex(c.surface, c.background, .55));
  root.style.setProperty("--text", c.text);
  root.style.setProperty("--muted", muted);
  root.style.setProperty("--border", border);
  root.style.setProperty("--primary", c.accent);
  root.style.setProperty("--primary-dark", darkenHex(c.accent, 22));
  root.style.setProperty("--primary-soft", primarySoft);
  root.style.setProperty("--sidebar", c.sidebar);
  root.style.setProperty("--sidebar-muted", mixHex("#ffffff", c.sidebar, .58));
  root.style.setProperty("--chart-grid", hexToRgba(muted, resolvedMode(c.mode) === "dark" ? .22 : .13));
  root.style.setProperty("--radius", `${c.radius}px`);
  root.style.setProperty("--app-font", fontStack(c.font));
  root.style.setProperty("--sidebar-width", c.layout === "presentation" ? "232px" : "252px");
  document.body.dataset.density = c.density;
  document.body.dataset.cardStyle = c.cardStyle;
  document.body.dataset.layout = c.layout;
  document.body.dataset.motion = c.animations ? "on" : "off";
  document.body.dataset.appearance = resolvedMode(c.mode);
  applyBranding();
  applySectionVisibility();
  updateCustomizationOutputs();
}

function applyBranding() {
  const c = state.customization;
  if (!els.brandName) return;
  els.brandName.textContent = c.brandName;
  els.brandTagline.textContent = c.brandTagline;
  els.brandInitials.textContent = c.brandInitials;
  els.companyName.textContent = c.companyName;
  els.companySubtitle.textContent = c.companySubtitle;
  els.companyAvatar.textContent = c.companyInitials;
  document.title = `${c.brandName} | ${c.brandTagline}`;
  const hasLogo = Boolean(c.logoData);
  els.brandLogoImage.hidden = !hasLogo;
  els.brandInitials.hidden = hasLogo;
  if (hasLogo) els.brandLogoImage.src = c.logoData;
  updateLogoPreview();
}

function applySectionVisibility() {
  const visible = state.customization.visible;
  document.querySelectorAll("[data-custom-panel]").forEach(element => {
    element.classList.toggle("custom-hidden", visible[element.dataset.customPanel] === false);
  });
  document.querySelectorAll(".dashboard-grid").forEach(grid => {
    const visibleChildren = [...grid.children].filter(child => !child.classList.contains("custom-hidden"));
    grid.classList.toggle("single-visible", visibleChildren.length === 1);
    grid.classList.toggle("custom-hidden", visibleChildren.length === 0);
  });
}

function closeSettingsModal(restorePreview = true) {
  if (restorePreview && settingsSnapshot) {
    state.customization = mergeCustomization(settingsSnapshot);
    applyCustomization();
    renderCharts(calculateMetrics());
  }
  settingsSnapshot = null;
  closeModal(els.settingsModal);
}

function resetCustomization() {
  const preservedLogo = state.customization.logoData;
  state.customization = mergeCustomization({ ...DEFAULT_CUSTOMIZATION, logoData: preservedLogo });
  populateCustomizationFields();
  applyCustomization();
  renderCharts(calculateMetrics());
  showToast("Dashboard design reset to the Civentraq default.");
}

function showAllDashboardSections() {
  state.customization = readCustomizationForm();
  Object.keys(state.customization.visible).forEach(key => state.customization.visible[key] = true);
  populateCustomizationFields();
  applyCustomization();
}

function handleLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!["image/png", "image/jpeg"].includes(file.type)) { showToast("Please choose a PNG or JPG logo."); return; }
  if (file.size > 1500000) { showToast("Please use a logo smaller than 1.5 MB."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    state.customization = readCustomizationForm();
    state.customization.logoData = String(reader.result || "");
    applyCustomization();
    updateLogoPreview();
  };
  reader.readAsDataURL(file);
}

function removeCustomLogo() {
  state.customization = readCustomizationForm();
  state.customization.logoData = "";
  els.customLogoInput.value = "";
  applyCustomization();
  updateLogoPreview();
}

function updateLogoPreview() {
  if (!els.logoPreviewInitials) return;
  const c = state.customization;
  els.logoPreviewInitials.textContent = c.brandInitials;
  const hasLogo = Boolean(c.logoData);
  els.logoPreviewImage.hidden = !hasLogo;
  els.logoPreviewInitials.hidden = hasLogo;
  els.removeLogoButton.hidden = !hasLogo;
  if (hasLogo) els.logoPreviewImage.src = c.logoData;
}

function normaliseInitials(value, fallback) {
  return String(value || fallback).replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || fallback;
}

function fontStack(font) {
  if (font === "roboto") return '"Roboto Condensed", Arial, sans-serif';
  if (font === "system") return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  if (font === "classic") return 'Georgia, "Times New Roman", serif';
  return 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

function getLineStyle() {
  if (state.customization.chartStyle === "straight") return { tension: 0, stepped: false };
  if (state.customization.chartStyle === "stepped") return { tension: 0, stepped: true };
  return { tension: .35, stepped: false };
}

function getChartTheme() {
  const c = state.customization;
  if (c.chartPalette === "vivid") {
    return { primary: "#1677ff", secondary: "#f59e0b", palette: ["#1677ff", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#84cc16", "#ec4899"] };
  }
  if (c.chartPalette === "mono") {
    const shades = [0, .18, .34, .48, .62, .74, .84].map(amount => mixHex(c.accent, c.surface, amount));
    return { primary: c.accent, secondary: shades[3], palette: shades };
  }
  const palette = [c.accent, mixHex(c.accent, c.surface, .23), mixHex(c.accent, c.surface, .42), mixHex(c.accent, c.surface, .58), mixHex(c.accent, c.surface, .72), mixHex(c.text, c.surface, .55), mixHex(c.accent, c.text, .45)];
  return { primary: c.accent, secondary: mixHex(c.text, c.surface, .56), palette };
}

function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

function hexToRgb(hex) {
  const clean = String(hex || "#000000").replace("#", "");
  const value = clean.length === 3 ? clean.split("").map(char => char + char).join("") : clean.padEnd(6, "0").slice(0, 6);
  const number = Number.parseInt(value, 16);
  return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
}

function rgbToHex({ r, g, b }) {
  return `#${[r,g,b].map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2,"0")).join("")}`;
}

function mixHex(first, second, amount = .5) {
  const a = hexToRgb(first); const b = hexToRgb(second); const t = Math.max(0, Math.min(1, amount));
  return rgbToHex({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t });
}

function darkenHex(hex, percent) { return mixHex(hex, "#000000", Math.max(0, Math.min(100, percent)) / 100); }
function hexToRgba(hex, alpha = 1) { const { r,g,b } = hexToRgb(hex); return `rgba(${r},${g},${b},${alpha})`; }
function stripHex(hex) { return String(hex || "#000000").replace("#", "").toUpperCase(); }

function getPptPalette() {
  const c = state.customization;
  return {
    dark: stripHex(c.sidebar), primary: stripHex(c.accent), primarySoft: stripHex(mixHex(c.accent, c.surface, .84)),
    soft: stripHex(mixHex(c.accent, c.surface, .84)), bg: stripHex(c.background), white: stripHex(c.surface), text: stripHex(c.text),
    muted: stripHex(mixHex(c.text, c.background, .58)), border: stripHex(mixHex(c.text, c.surface, .86)), danger: "A33D3D", warning: "A9650E"
  };
}

function getPdfPalette() {
  const c = getPptPalette();
  const array = hex => { const {r,g,b} = hexToRgb(`#${hex}`); return [r,g,b]; };
  return { dark: array(c.dark), primary: array(c.primary), soft: array(c.soft), bg: array(c.bg), white: array(c.white), text: array(c.text), muted: array(c.muted), border: array(c.border), danger: array(c.danger), warning: array(c.warning) };
}

function addPdfLogo(doc, x, y, width, height) {
  if (!state.customization.logoData) return;
  try {
    const format = state.customization.logoData.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
    doc.addImage(state.customization.logoData, format, x, y, width, height, undefined, "FAST");
  } catch (error) {
    console.warn("The custom logo could not be added to the PDF.", error);
  }
}

function openImportModal() {
  resetImportModal();
  openModal(els.importModal);
}
function closeImportModal() { closeModal(els.importModal); }
function openSettingsModal(tab = "project") {
  settingsSnapshot = structuredClone(state.customization);
  populateSettings();
  activateSettingsTab(tab);
  openModal(els.settingsModal);
}
function openExportModal(reportType = "full") {
  activeReportType = REPORT_TYPES[reportType] ? reportType : "full";
  const report = REPORT_TYPES[activeReportType];
  const displayTitle = activeReportType === "full" ? state.customization.reportTitle : report.title;
  setExportBusy(false);
  els.exportModalTitle.textContent = `Export ${displayTitle.toLowerCase()}`;
  els.exportModalDescription.textContent = report.description;
  els.exportReportType.textContent = displayTitle;
  openModal(els.exportModal);
}
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
  resetIgnoredInsights();
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
  const previousProject = JSON.stringify(state.project);
  state.project = {
    ...state.project,
    name: document.getElementById("settingProjectName").value.trim(),
    client: document.getElementById("settingClient").value.trim(),
    location: document.getElementById("settingLocation").value.trim(),
    approvedBudget: Number(document.getElementById("settingBudget").value),
    startDate: document.getElementById("settingStart").value,
    endDate: document.getElementById("settingEnd").value
  };
  state.customization = readCustomizationForm();
  state.projects = state.projects.map(project => project.id === oldId ? state.project : project);
  if (previousProject !== JSON.stringify(state.project)) resetIgnoredInsights();
  settingsSnapshot = null;
  saveState();
  renderAll();
  closeSettingsModal(false);
  showToast("Dashboard design and project settings saved.");
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
  populateCustomizationFields();
}

async function performExport(format) {
  const names = { pptx: "PowerPoint presentation", pdf: "PDF report", xlsx: "Excel report pack", png: "dashboard image", csv: "reporting data" };
  const label = names[format] || "report";
  setExportBusy(true, `Creating ${label}…`);

  try {
    await waitForPaint();
    if (format === "pptx") await exportPowerPoint(activeReportType);
    else if (format === "pdf") await exportPdfReport(activeReportType);
    else if (format === "xlsx") exportExcelReport(activeReportType);
    else if (format === "png") await exportDashboardPng(activeReportType);
    else if (format === "csv") exportCsvReport(activeReportType);
    else throw new Error("That export format is not available.");

    closeModal(els.exportModal);
    showToast(`${label.charAt(0).toUpperCase() + label.slice(1)} downloaded.`);
  } catch (error) {
    console.error(error);
    setExportBusy(false, error.message || `The ${label} could not be created.`, true);
  }
}

function setExportBusy(isBusy, message = "Preparing your file…", isError = false) {
  document.querySelectorAll("[data-export-format]").forEach(button => button.disabled = isBusy);
  if (!els.exportStatus) return;
  if (!isBusy && !isError) {
    els.exportStatus.classList.add("hidden");
    els.exportStatus.classList.remove("error");
    return;
  }
  els.exportStatus.classList.remove("hidden");
  els.exportStatus.classList.toggle("error", isError);
  els.exportStatus.innerHTML = isError
    ? `<span>${escapeHtml(message)}</span>`
    : `<span class="export-spinner" aria-hidden="true"></span><span>${escapeHtml(message)}</span>`;
}

async function exportPowerPoint(reportType = activeReportType) {
  if (typeof PptxGenJS === "undefined") throw new Error("PowerPoint export could not load. Check your internet connection and refresh.");
  if (reportType === "cost" || reportType === "schedule") return exportSpecializedPowerPoint(reportType);

  const m = calculateMetrics();
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = state.customization.brandName;
  pptx.company = state.customization.companyName;
  pptx.subject = `${state.project.name} project performance report`;
  pptx.title = `${state.project.name} - Project Report`;
  pptx.lang = "en-ZA";
  pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-ZA" };

  const C = getPptPalette();
  const addFooter = (slide, number) => {
    slide.addText(`${state.customization.brandName} | ${state.customization.brandTagline}`, { x: .55, y: 7.12, w: 4, h: .18, fontSize: 8, color: "7B8992", margin: 0 });
    slide.addText(`${number}`, { x: 12.25, y: 7.1, w: .45, h: .2, fontSize: 8, color: "7B8992", align: "right", margin: 0 });
  };
  const addSlideTitle = (slide, title, subtitle, number) => {
    slide.background = { color: C.bg };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: .14, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
    slide.addText(title, { x: .55, y: .34, w: 8.2, h: .38, fontFace: "Aptos Display", fontSize: 23, bold: true, color: C.text, margin: 0 });
    slide.addText(subtitle, { x: .55, y: .78, w: 10.5, h: .23, fontSize: 9.5, color: C.muted, margin: 0 });
    addFooter(slide, number);
  };
  const addKpi = (slide, x, y, w, label, value, note) => {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 1.16, rectRadius: .08, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
    slide.addText(label.toUpperCase(), { x: x + .18, y: y + .14, w: w - .36, h: .17, fontSize: 7.5, bold: true, color: C.muted, charSpacing: .7, margin: 0 });
    slide.addText(value, { x: x + .18, y: y + .39, w: w - .36, h: .31, fontSize: 18, bold: true, color: C.text, margin: 0, breakLine: false });
    slide.addText(note, { x: x + .18, y: y + .82, w: w - .36, h: .2, fontSize: 7.2, color: C.muted, margin: 0, fit: "shrink" });
  };

  // Cover slide
  let slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: .22, h: 7.5, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
  if (state.customization.logoData) {
    slide.addImage({ data: state.customization.logoData, x: .7, y: .62, w: .58, h: .58 });
  } else {
    slide.addShape(pptx.ShapeType.roundRect, { x: .7, y: .62, w: .58, h: .58, rectRadius: .08, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
    slide.addText(state.customization.brandInitials, { x: .7, y: .78, w: .58, h: .16, fontSize: 12, bold: true, color: C.white, align: "center", margin: 0 });
  }
  slide.addText(state.customization.brandName, { x: 1.42, y: .68, w: 3.2, h: .28, fontSize: 20, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText(state.customization.brandTagline.toUpperCase(), { x: 1.43, y: .99, w: 3.2, h: .16, fontSize: 7.5, bold: true, charSpacing: 1.2, color: C.muted, margin: 0, fit: "shrink" });
  slide.addText(state.customization.reportTitle.toUpperCase(), { x: .72, y: 2.0, w: 5.6, h: .22, fontSize: 10, bold: true, charSpacing: 1.1, color: C.primary, margin: 0, fit: "shrink" });
  slide.addText(state.project.name, { x: .7, y: 2.35, w: 8.9, h: 1.02, fontFace: "Aptos Display", fontSize: 34, bold: true, color: C.white, margin: 0, breakLine: false, fit: "shrink" });
  slide.addText(`${state.project.client} | ${state.project.location}`, { x: .72, y: 3.56, w: 6.5, h: .27, fontSize: 15, color: "DDE7EA", margin: 0 });
  slide.addText(`${formatDate(state.project.startDate)} - ${formatDate(state.project.endDate)}`, { x: .72, y: 3.96, w: 6.5, h: .22, fontSize: 10.5, color: "9FB0B7", margin: 0 });
  slide.addShape(pptx.ShapeType.ellipse, { x: 10.25, y: 2.16, w: 2.05, h: 2.05, line: { color: C.primary, pt: 4 }, fill: { color: "162930" } });
  slide.addText(`${m.healthScore}`, { x: 10.48, y: 2.64, w: 1.58, h: .55, fontSize: 31, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText("/100", { x: 10.7, y: 3.22, w: 1.15, h: .18, fontSize: 9, bold: true, color: "9FB0B7", align: "center", margin: 0 });
  slide.addText(getHealthLabel(m.healthScore), { x: 9.4, y: 4.46, w: 3.7, h: .28, fontSize: 15, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText(`Generated ${formatDate(new Date().toISOString().slice(0, 10))}`, { x: .72, y: 6.72, w: 4, h: .2, fontSize: 8.5, color: "82949C", margin: 0 });
  slide.addText(state.customization.reportFooter, { x: 8.7, y: 6.72, w: 3.6, h: .2, fontSize: 8.5, color: C.muted, align: "right", margin: 0, fit: "shrink" });

  // Executive summary
  slide = pptx.addSlide();
  addSlideTitle(slide, "Executive project overview", `${state.project.name} | Latest reporting period: ${formatDate(m.latest.date || state.project.startDate)}`, 2);
  addKpi(slide, .55, 1.22, 3.85, "Approved budget", formatMoney(state.project.approvedBudget), "Client-approved project value");
  addKpi(slide, 4.73, 1.22, 3.85, "Actual spend", formatMoney(m.actualTotal), `${m.spendPercent.toFixed(1)}% of approved budget`);
  addKpi(slide, 8.91, 1.22, 3.85, "Estimated final cost", formatMoney(m.predictedFinalCost), m.predictedFinalCost <= state.project.approvedBudget ? "Currently within budget" : "Forecast over approved budget");
  addKpi(slide, .55, 2.61, 3.85, "Actual progress", `${round(m.actualProgress)}%`, `${Math.abs(round(m.progressVariance))}% ${m.progressVariance < 0 ? "behind" : "ahead of"} plan`);
  addKpi(slide, 4.73, 2.61, 3.85, "Days remaining", `${m.daysRemaining}`, `Deadline: ${formatDate(state.project.endDate)}`);
  addKpi(slide, 8.91, 2.61, 3.85, "Labour hours", round(m.labourHours).toLocaleString("en-ZA"), "Recorded hours to date");
  slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 4.08, w: 7.75, h: 2.42, rectRadius: .08, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
  slide.addText("MANAGEMENT INSIGHT", { x: .8, y: 4.33, w: 2.6, h: .18, fontSize: 8, bold: true, charSpacing: 1, color: C.primary, margin: 0 });
  slide.addText(getManagementSummary(m), { x: .8, y: 4.69, w: 7.2, h: 1.4, fontSize: 12.2, color: C.text, margin: 0, valign: "top", breakLine: false, fit: "shrink" });
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.58, y: 4.08, w: 4.18, h: 2.42, rectRadius: .08, line: { color: C.dark, transparency: 100 }, fill: { color: C.dark } });
  slide.addText("PATH TO 100", { x: 8.86, y: 4.33, w: 1.8, h: .18, fontSize: 8, bold: true, charSpacing: 1, color: C.primary, margin: 0 });
  const topActions = m.scoreFactors.slice(0, 3);
  if (topActions.length) {
    topActions.forEach((factor, index) => {
      const y = 4.72 + index * .53;
      slide.addText(`${index + 1}`, { x: 8.88, y, w: .3, h: .25, fontSize: 8, bold: true, color: C.dark, align: "center", valign: "mid", fill: { color: C.primary }, margin: 0.04 });
      slide.addText(factor.title, { x: 9.3, y: y - .01, w: 2.65, h: .25, fontSize: 9, bold: true, color: C.white, margin: 0, fit: "shrink" });
      slide.addText(`+${factor.points}`, { x: 12.08, y, w: .42, h: .2, fontSize: 8, bold: true, color: C.primary, align: "right", margin: 0 });
    });
  } else {
    slide.addText("Maintain current cost, schedule, and risk controls to protect the maximum score.", { x: 8.88, y: 4.78, w: 3.45, h: .9, fontSize: 11, color: C.white, margin: 0 });
  }

  // Cost slide
  slide = pptx.addSlide();
  addSlideTitle(slide, "Cost performance", "Cumulative planned versus actual expenditure", 3);
  slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 1.18, w: 9.0, h: 5.55, rectRadius: .06, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
  const costImage = getChartImage("costChart");
  if (costImage) slide.addImage({ data: costImage, x: .82, y: 1.52, w: 8.46, h: 4.76 });
  addKpi(slide, 9.82, 1.18, 2.96, "Actual spend", formatMoney(m.actualTotal), `${m.spendPercent.toFixed(1)}% consumed`);
  addKpi(slide, 9.82, 2.63, 2.96, "Remaining budget", formatMoney(m.remainingBudget), "Budget balance");
  addKpi(slide, 9.82, 4.08, 2.96, "Final-cost forecast", formatMoney(m.predictedFinalCost), m.predictedFinalCost <= state.project.approvedBudget ? "Within approved budget" : "Corrective action required");
  slide.addShape(pptx.ShapeType.roundRect, { x: 9.82, y: 5.53, w: 2.96, h: 1.2, rectRadius: .06, line: { color: m.predictedFinalCost > state.project.approvedBudget ? "E6B7B7" : "B9DCD2", pt: 1 }, fill: { color: m.predictedFinalCost > state.project.approvedBudget ? "FDEAEA" : C.primarySoft } });
  slide.addText(m.predictedFinalCost > state.project.approvedBudget ? "COST ACTION" : "COST STATUS", { x: 10.02, y: 5.72, w: 1.4, h: .17, fontSize: 7.5, bold: true, color: m.predictedFinalCost > state.project.approvedBudget ? C.danger : C.primary, margin: 0 });
  slide.addText(m.predictedFinalCost > state.project.approvedBudget ? "Review non-critical spend and contingency use." : "Current forecast remains within the approved budget.", { x: 10.02, y: 6.0, w: 2.52, h: .42, fontSize: 9.2, color: C.text, margin: 0, fit: "shrink" });

  // Schedule and category slide
  slide = pptx.addSlide();
  addSlideTitle(slide, "Schedule and expenditure distribution", "Planned progress, actual progress, and category-level cost", 4);
  slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 1.18, w: 6.08, h: 5.55, rectRadius: .06, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
  slide.addText("Schedule performance", { x: .82, y: 1.43, w: 2.8, h: .25, fontSize: 14, bold: true, color: C.text, margin: 0 });
  const progressImage = getChartImage("progressChart");
  if (progressImage) slide.addImage({ data: progressImage, x: .78, y: 1.82, w: 5.62, h: 4.4 });
  slide.addShape(pptx.ShapeType.roundRect, { x: 6.91, y: 1.18, w: 5.87, h: 5.55, rectRadius: .06, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
  slide.addText("Spend by category", { x: 7.18, y: 1.43, w: 2.8, h: .25, fontSize: 14, bold: true, color: C.text, margin: 0 });
  const categoryImage = getChartImage("categoryChart");
  if (categoryImage) slide.addImage({ data: categoryImage, x: 7.27, y: 1.82, w: 5.15, h: 4.35 });
  slide.addText(`Schedule variance: ${round(m.progressVariance)}%`, { x: .82, y: 6.31, w: 2.9, h: .2, fontSize: 9, bold: true, color: m.progressVariance < 0 ? C.warning : C.primary, margin: 0 });
  slide.addText(`Largest spend category: ${Object.entries(m.categories).sort((a,b) => b[1]-a[1])[0]?.[0] || "N/A"}`, { x: 7.18, y: 6.31, w: 4.6, h: .2, fontSize: 9, bold: true, color: C.primary, margin: 0 });

  // Delivery actions slide
  slide = pptx.addSlide();
  addSlideTitle(slide, "Delivery status and recovery actions", "Work-package progress, active risks, and actions required to improve the insight score", 5);
  const tableRows = [
    ["Work package", "Owner", "Progress", "Status"],
    ...WORK_PACKAGES.map(item => [item.name, item.owner, `${item.progress}%`, item.status])
  ];
  slide.addTable(tableRows, {
    x: .55, y: 1.25, w: 6.15, h: 3.25, border: { type: "solid", color: C.border, pt: 1 },
    fill: C.white, color: C.text, fontSize: 9, margin: .08, rowH: .48,
    bold: false, autoFit: false, colW: [2.35, 1.65, .8, 1.05],
    colorRows: false,
    fillRows: false
  });
  slide.addText("Priority risks", { x: .55, y: 4.82, w: 2.2, h: .25, fontSize: 14, bold: true, color: C.text, margin: 0 });
  getRiskItems(m).slice(0, 3).forEach((risk, index) => {
    const y = 5.18 + index * .47;
    slide.addShape(pptx.ShapeType.ellipse, { x: .58, y: y + .04, w: .11, h: .11, line: { color: risk.level === "high" ? C.danger : C.warning, transparency: 100 }, fill: { color: risk.level === "high" ? C.danger : C.warning } });
    slide.addText(risk.title, { x: .8, y, w: 1.8, h: .2, fontSize: 9, bold: true, color: C.text, margin: 0 });
    slide.addText(risk.detail, { x: 2.42, y, w: 4.05, h: .26, fontSize: 8.3, color: C.muted, margin: 0, fit: "shrink" });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 7.0, y: 1.25, w: 5.78, h: 5.55, rectRadius: .06, line: { color: C.dark, transparency: 100 }, fill: { color: C.dark } });
  slide.addText("PATH TO 100", { x: 7.35, y: 1.58, w: 2.0, h: .22, fontSize: 9, bold: true, charSpacing: 1.1, color: C.primary, margin: 0 });
  const actions = m.scoreFactors.length ? m.scoreFactors : [{ title: "Maintain the 100 score", action: "Keep weekly reporting current, close risks early, and protect the approved cost and schedule baseline.", points: 0 }];
  actions.slice(0, 5).forEach((factor, index) => {
    const y = 2.03 + index * .9;
    slide.addShape(pptx.ShapeType.roundRect, { x: 7.34, y, w: .42, h: .42, rectRadius: .04, line: { color: "315057", transparency: 100 }, fill: { color: "1E3B42" } });
    slide.addText(`${index + 1}`, { x: 7.34, y: y + .11, w: .42, h: .12, fontSize: 8, bold: true, color: C.primary, align: "center", margin: 0 });
    slide.addText(factor.title, { x: 7.92, y, w: 3.8, h: .26, fontSize: 10, bold: true, color: C.white, margin: 0, fit: "shrink" });
    slide.addText(factor.action, { x: 7.92, y: y + .32, w: 4.28, h: .4, fontSize: 8.1, color: "B5C3C8", margin: 0, fit: "shrink" });
    slide.addText(factor.points ? `+${factor.points}` : "✓", { x: 12.1, y: y + .07, w: .36, h: .2, fontSize: 9, bold: true, color: C.primary, align: "right", margin: 0 });
  });

  await pptx.writeFile({ fileName: exportFileName("pptx") });
}

async function exportPdfReport(reportType = activeReportType) {
  if (!window.jspdf?.jsPDF) throw new Error("PDF export could not load. Check your internet connection and refresh.");
  if (reportType === "cost" || reportType === "schedule") return exportSpecializedPdf(reportType);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  const m = calculateMetrics();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const C = getPdfPalette();

  const addHeader = (title, subtitle) => {
    doc.setFillColor(...C.primary); doc.rect(0, 0, pageWidth, 4, "F");
    doc.setTextColor(...C.text); doc.setFont("helvetica", "bold"); doc.setFontSize(19); doc.text(pdfText(title), 12, 16);
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.text(pdfText(subtitle), 12, 22);
    addPdfLogo(doc, pageWidth - 25, 8, 13, 13);
  };
  const addFooter = () => {
    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page++) {
      doc.setPage(page);
      doc.setDrawColor(...C.border); doc.line(12, pageHeight - 10, pageWidth - 12, pageHeight - 10);
      doc.setTextColor(...C.muted); doc.setFontSize(7); doc.text(pdfText(`${state.customization.brandName} | ${state.customization.brandTagline}`), 12, pageHeight - 5.7);
      doc.text(`Page ${page} of ${pages}`, pageWidth - 12, pageHeight - 5.7, { align: "right" });
    }
  };
  const drawKpi = (x, y, w, label, value, note) => {
    doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(x, y, w, 24, 3, 3, "FD");
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "bold"); doc.setFontSize(6.8); doc.text(pdfText(label.toUpperCase()), x + 4, y + 6);
    doc.setTextColor(...C.text); doc.setFontSize(15); doc.text(pdfText(value), x + 4, y + 14);
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.text(doc.splitTextToSize(pdfText(note), w - 8), x + 4, y + 19);
  };

  // Executive page
  doc.setFillColor(...C.bg); doc.rect(0,0,pageWidth,pageHeight,"F");
  addHeader("Executive project overview", `${state.project.name} | ${state.project.client} | ${state.project.location}`);
  const kpiW = (pageWidth - 32) / 3;
  drawKpi(12, 30, kpiW, "Approved budget", formatMoney(state.project.approvedBudget), "Client-approved project value");
  drawKpi(16 + kpiW, 30, kpiW, "Actual spend", formatMoney(m.actualTotal), `${m.spendPercent.toFixed(1)}% of approved budget`);
  drawKpi(20 + kpiW * 2, 30, kpiW, "Estimated final cost", formatMoney(m.predictedFinalCost), m.predictedFinalCost <= state.project.approvedBudget ? "Currently within budget" : "Forecast exceeds approved budget");
  drawKpi(12, 58, kpiW, "Actual progress", `${round(m.actualProgress)}%`, `${Math.abs(round(m.progressVariance))}% ${m.progressVariance < 0 ? "behind" : "ahead of"} planned progress`);
  drawKpi(16 + kpiW, 58, kpiW, "Days remaining", `${m.daysRemaining}`, `Deadline: ${formatDate(state.project.endDate)}`);
  drawKpi(20 + kpiW * 2, 58, kpiW, "Labour hours", round(m.labourHours).toLocaleString("en-ZA"), "Recorded hours to date");

  doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(12, 91, 181, 86, 3, 3, "FD");
  doc.setTextColor(...C.primary); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("MANAGEMENT INSIGHT", 18, 101);
  doc.setTextColor(...C.text); doc.setFont("helvetica", "normal"); doc.setFontSize(10.5);
  doc.text(doc.splitTextToSize(pdfText(getManagementSummary(m)), 169), 18, 111);
  doc.setFillColor(...C.soft); doc.roundedRect(18, 145, 169, 23, 2, 2, "F");
  doc.setTextColor(...C.primary); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("LATEST PROJECT STATUS", 23, 153);
  doc.setTextColor(...C.text); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
  doc.text(pdfText(`Reporting period: ${formatDate(m.latest.date || state.project.startDate)} | Schedule variance: ${round(m.progressVariance)}% | Cost forecast: ${formatMoney(m.predictedFinalCost)}`), 23, 160);

  doc.setFillColor(...C.dark); doc.roundedRect(199, 91, 86, 86, 3, 3, "F");
  doc.setTextColor(103,217,183); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("PROJECT HEALTH", 206, 102);
  doc.setTextColor(...C.white); doc.setFontSize(30); doc.text(`${m.healthScore}`, 206, 121);
  doc.setTextColor(159,176,183); doc.setFontSize(9); doc.text("/100", 227, 121);
  doc.setTextColor(...C.white); doc.setFontSize(11); doc.text(pdfText(getHealthLabel(m.healthScore)), 206, 130);
  doc.setTextColor(103,217,183); doc.setFontSize(8); doc.text("PATH TO 100", 206, 143);
  const actions = m.scoreFactors.length ? m.scoreFactors.slice(0, 4) : [{ title: "Maintain the maximum score", points: 0 }];
  actions.forEach((factor, index) => {
    const y = 151 + index * 6.1;
    doc.setTextColor(181,197,202); doc.setFont("helvetica", "normal"); doc.setFontSize(7.2); doc.text(pdfText(`${index + 1}. ${factor.title}`), 206, y, { maxWidth: 65 });
    doc.setTextColor(103,217,183); doc.setFont("helvetica", "bold"); doc.text(factor.points ? `+${factor.points}` : "OK", 278, y, { align: "right" });
  });

  // Charts page
  doc.addPage("a4", "landscape"); doc.setFillColor(...C.bg); doc.rect(0,0,pageWidth,pageHeight,"F");
  addHeader("Project performance charts", "Cost, schedule, and expenditure distribution from the latest imported project data");
  doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(12, 29, 181, 78, 3, 3, "FD");
  doc.setTextColor(...C.text); doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text("Cost performance", 18, 38);
  const costImage = getChartImage("costChart"); if (costImage) doc.addImage(costImage, "PNG", 18, 42, 169, 59);
  doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(12, 113, 132, 65, 3, 3, "FD");
  doc.setTextColor(...C.text); doc.setFontSize(10); doc.text("Schedule performance", 18, 122);
  const progressImage = getChartImage("progressChart"); if (progressImage) doc.addImage(progressImage, "PNG", 18, 126, 120, 46);
  doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(150, 113, 135, 65, 3, 3, "FD");
  doc.setTextColor(...C.text); doc.setFontSize(10); doc.text("Spend by category", 156, 122);
  const categoryImage = getChartImage("categoryChart"); if (categoryImage) doc.addImage(categoryImage, "PNG", 167, 126, 100, 46);
  drawKpi(199, 29, 86, "Schedule variance", `${round(m.progressVariance)}%`, m.progressVariance < 0 ? "Actual progress is behind plan" : "Actual progress is on or ahead of plan");
  drawKpi(199, 58, 86, "Remaining budget", formatMoney(m.remainingBudget), "Balance against approved project budget");
  drawKpi(199, 87, 86, "High-risk periods", `${m.riskRows}`, "Reporting periods marked high or critical");

  // Data and actions pages
  doc.addPage("a4", "landscape"); doc.setFillColor(255,255,255); doc.rect(0,0,pageWidth,pageHeight,"F");
  addHeader("Reporting data and delivery actions", "Detailed reporting periods, work packages, active risks, and score improvement plan");
  const reportingBody = state.rows.map(row => [
    formatDate(row.date), row.category, formatMoney(row.plannedCost), formatMoney(row.actualCost), `${round(row.plannedProgress)}%`, `${round(row.actualProgress)}%`, round(row.labourHours).toLocaleString("en-ZA"), row.riskLevel || "-"
  ]);
  if (typeof doc.autoTable === "function") {
    doc.autoTable({
      startY: 29,
      head: [["Reporting date", "Category", "Planned cost", "Actual cost", "Planned %", "Actual %", "Labour hours", "Risk"]],
      body: reportingBody,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 7, cellPadding: 2, textColor: C.text, lineColor: C.border, lineWidth: .2 },
      headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248,250,251] },
      margin: { left: 12, right: 12 }
    });
    let startY = doc.lastAutoTable.finalY + 8;
    if (startY > 128) { doc.addPage("a4", "landscape"); addHeader("Delivery controls", "Work packages, active risks, and the actions required to improve the management insight score"); startY = 29; }
    doc.autoTable({
      startY,
      head: [["Work package", "Owner", "Progress", "Status"]],
      body: WORK_PACKAGES.map(item => [item.name, item.owner, `${item.progress}%`, item.status]),
      theme: "grid",
      tableWidth: 126,
      styles: { fontSize: 7.5, cellPadding: 2.2, textColor: C.text, lineColor: C.border, lineWidth: .2 },
      headStyles: { fillColor: C.dark, textColor: C.white },
      margin: { left: 12 }
    });
    const risks = getRiskItems(m);
    doc.autoTable({
      startY,
      head: [["Priority risk", "Detail"]],
      body: risks.map(risk => [risk.title, risk.detail]),
      theme: "grid",
      tableWidth: 137,
      styles: { fontSize: 7.3, cellPadding: 2.2, textColor: C.text, lineColor: C.border, lineWidth: .2 },
      headStyles: { fillColor: C.warning, textColor: C.white },
      margin: { left: 148 }
    });
    const actionY = Math.max(doc.lastAutoTable.finalY + 8, startY + 52);
    if (actionY > 161) { doc.addPage("a4", "landscape"); addHeader("Path to 100", "Recommended management actions based on current project data"); }
    doc.autoTable({
      startY: actionY > 161 ? 29 : actionY,
      head: [["Action", "Recommended response", "Score recovery"]],
      body: (m.scoreFactors.length ? m.scoreFactors : [{ title: "Maintain the 100 score", action: "Keep data current, close risks early, and protect the approved project baseline.", points: 0 }]).map(factor => [factor.title, factor.action, factor.points ? `+${factor.points}` : "Maintain"]),
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 2.4, textColor: C.text, lineColor: C.border, lineWidth: .2 },
      headStyles: { fillColor: C.primary, textColor: C.white },
      columnStyles: { 2: { halign: "center", cellWidth: 30, fontStyle: "bold" } },
      margin: { left: 12, right: 12 }
    });
  } else {
    doc.setTextColor(...C.text); doc.setFontSize(9); doc.text("Detailed table export was unavailable, but the executive and chart pages were generated successfully.", 12, 35);
  }

  addFooter();
  doc.save(exportFileName("pdf"));
}

function exportExcelReport(reportType = activeReportType) {
  if (typeof XLSX === "undefined") throw new Error("Excel export could not load. Check your internet connection and refresh.");
  if (reportType === "cost" || reportType === "schedule") return exportSpecializedExcel(reportType);

  const m = calculateMetrics();
  const wb = XLSX.utils.book_new();
  wb.Props = { Title: `${state.project.name} Project Report`, Subject: `${state.customization.brandName} project intelligence report`, Author: state.customization.brandName, Company: state.customization.companyName, CreatedDate: new Date() };

  const summaryRows = [
    [`${state.customization.brandName.toUpperCase()} PROJECT REPORT`],
    ["Project", state.project.name], ["Client", state.project.client], ["Location", state.project.location],
    ["Project period", `${formatDate(state.project.startDate)} - ${formatDate(state.project.endDate)}`], ["Generated", formatDate(new Date().toISOString().slice(0,10))],
    [], ["EXECUTIVE KPIS"],
    ["Approved budget", state.project.approvedBudget], ["Actual spend", m.actualTotal], ["Remaining budget", m.remainingBudget], ["Estimated final cost", m.predictedFinalCost],
    ["Planned progress", m.plannedProgress / 100], ["Actual progress", m.actualProgress / 100], ["Schedule variance", m.progressVariance / 100], ["Days remaining", m.daysRemaining], ["Labour hours", m.labourHours],
    ["Management insight score", m.healthScore], ["Insight status", m.healthScore === 100 && m.ignoredScoreFactors.length ? "All insights reviewed" : getHealthLabel(m.healthScore)],
    [], ["MANAGEMENT INSIGHT"], [getManagementSummary(m)],
    [], ["PATH TO 100"], ["Action", "Recommended response", "Score recovery"],
    ...(m.scoreFactors.length ? m.scoreFactors : [{ title: "Maintain the 100 score", action: "Keep data current, close risks early, and protect the approved project baseline.", points: 0 }]).map(f => [f.title, f.action, f.points])
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  summarySheet["!cols"] = [{ wch: 30 }, { wch: 88 }, { wch: 16 }];
  ["B9","B10","B11","B12"].forEach(cell => { if (summarySheet[cell]) summarySheet[cell].z = 'R #,##0.00'; });
  ["B13","B14","B15"].forEach(cell => { if (summarySheet[cell]) summarySheet[cell].z = '0.0%'; });
  XLSX.utils.book_append_sheet(wb, summarySheet, "Executive Summary");

  const dataSheet = XLSX.utils.json_to_sheet(state.rows.map(row => ({
    "Reporting date": row.date, "Category / discipline": row.category, "Planned cost": row.plannedCost, "Actual cost": row.actualCost,
    "Planned progress (%)": row.plannedProgress, "Actual progress (%)": row.actualProgress, "Labour hours": row.labourHours,
    "Tasks completed": row.tasksCompleted, "Total tasks": row.totalTasks, "Risk level": row.riskLevel
  })));
  dataSheet["!cols"] = [{wch:16},{wch:24},{wch:16},{wch:16},{wch:20},{wch:19},{wch:15},{wch:17},{wch:14},{wch:14}];
  XLSX.utils.book_append_sheet(wb, dataSheet, "Reporting Data");

  const packageSheet = XLSX.utils.json_to_sheet(WORK_PACKAGES.map(item => ({ "Work package": item.name, Owner: item.owner, "Progress (%)": item.progress, Status: item.status })));
  packageSheet["!cols"] = [{wch:30},{wch:22},{wch:15},{wch:14}];
  XLSX.utils.book_append_sheet(wb, packageSheet, "Work Packages");

  const riskSheet = XLSX.utils.json_to_sheet(getRiskItems(m).map(risk => ({ Risk: risk.title, Detail: risk.detail, Level: risk.level })));
  riskSheet["!cols"] = [{wch:28},{wch:88},{wch:12}];
  XLSX.utils.book_append_sheet(wb, riskSheet, "Risks");

  const actionSheet = XLSX.utils.json_to_sheet((m.scoreFactors.length ? m.scoreFactors : [{ title: "Maintain the 100 score", action: "Keep data current, close risks early, and protect the approved project baseline.", points: 0 }]).map(f => ({ Action: f.title, "Recommended response": f.action, "Score recovery": f.points, Priority: f.priority || "maintain" })));
  actionSheet["!cols"] = [{wch:42},{wch:100},{wch:16},{wch:14}];
  XLSX.utils.book_append_sheet(wb, actionSheet, "Path to 100");

  XLSX.writeFile(wb, exportFileName("xlsx"), { compression: true });
}

function exportCsvReport(reportType = activeReportType) {
  if (reportType === "cost" || reportType === "schedule") return exportSpecializedCsv(reportType);
  const rows = [
    [`${state.customization.brandName} project report`], ["Project", state.project.name], ["Client", state.project.client], ["Location", state.project.location],
    ["Start date", state.project.startDate], ["Completion date", state.project.endDate], ["Approved budget", state.project.approvedBudget], [],
    ["Reporting date", "Category / discipline", "Planned cost", "Actual cost", "Planned progress (%)", "Actual progress (%)", "Labour hours", "Tasks completed", "Total tasks", "Risk level"],
    ...state.rows.map(row => [row.date, row.category, row.plannedCost, row.actualCost, row.plannedProgress, row.actualProgress, row.labourHours, row.tasksCompleted, row.totalTasks, row.riskLevel])
  ];
  const csv = rows.map(row => row.map(csvValue).join(",")).join("\r\n");
  downloadBlob(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), exportFileName("csv"));
}

async function exportDashboardPng(reportType = activeReportType) {
  if (typeof html2canvas === "undefined") throw new Error("Image export could not load. Check your internet connection and refresh.");
  if (reportType === "cost" || reportType === "schedule") return exportSpecializedPng(reportType);
  const overviewButton = document.querySelector('[data-view="overview"]');
  switchView("overview", overviewButton);
  await waitForPaint();

  const target = document.querySelector(".main-content");
  const topbar = document.querySelector(".topbar");
  const oldPosition = topbar.style.position;
  const oldTop = topbar.style.top;
  topbar.style.position = "static";
  topbar.style.top = "auto";
  try {
    const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: state.customization.background, logging: false, scrollX: 0, scrollY: -window.scrollY, windowWidth: target.scrollWidth });
    const blob = await canvasToBlob(canvas);
    downloadBlob(blob, exportFileName("png"));
  } finally {
    topbar.style.position = oldPosition;
    topbar.style.top = oldTop;
  }
}


function getCostReportSummary(m) {
  const variance = m.actualTotal - m.plannedTotal;
  const forecastGap = m.predictedFinalCost - state.project.approvedBudget;
  const parts = [
    `Actual expenditure is ${formatMoney(m.actualTotal)}, representing ${m.spendPercent.toFixed(1)}% of the approved budget.`,
    variance > 0
      ? `Actual cost is ${formatMoney(variance)} above the cumulative cost plan.`
      : `Actual cost is ${formatMoney(Math.abs(variance))} below the cumulative cost plan.`,
    forecastGap > 0
      ? `The estimated final cost exceeds the approved budget by ${formatMoney(forecastGap)} and requires corrective cost action.`
      : `The estimated final cost remains ${formatMoney(Math.abs(forecastGap))} within the approved budget.`
  ];
  return parts.join(" ");
}

function getScheduleReportSummary(m) {
  const variance = round(m.progressVariance);
  const delayedPackages = WORK_PACKAGES.filter(item => ["delayed", "at risk"].includes(item.status.toLowerCase()));
  const parts = [
    `Actual progress is ${round(m.actualProgress)}% against a planned ${round(m.plannedProgress)}%.`,
    variance < 0
      ? `The programme is ${Math.abs(variance)}% behind plan and a recovery programme should be agreed with package owners.`
      : variance > 0
        ? `The programme is ${variance}% ahead of plan.`
        : "The programme is exactly aligned with the approved plan.",
    `${m.daysRemaining} days remain until ${formatDate(state.project.endDate)}.`,
    `${delayedPackages.length} work package${delayedPackages.length === 1 ? " is" : "s are"} currently marked delayed or at risk.`
  ];
  return parts.join(" ");
}

function getCostActions(m) {
  const actions = [];
  if (m.predictedFinalCost > state.project.approvedBudget) actions.push(["Control final cost", "Freeze non-critical spend, review contingency usage, and agree corrective cost targets with package owners."]);
  if (m.actualTotal > m.plannedTotal) actions.push(["Recover cost variance", "Investigate reporting periods and disciplines where actual expenditure exceeded the cumulative plan."]);
  if (m.spendPercent > m.actualProgress + 5) actions.push(["Align spend with physical progress", "Review labour, material, and subcontractor costs where payment is ahead of completed work."]);
  const largest = Object.entries(m.categories).sort((a, b) => b[1] - a[1])[0];
  if (largest) actions.push([`Review ${largest[0]} spend`, `${largest[0]} is the largest expenditure category at ${formatMoney(largest[1])}; confirm commitments, accruals, and remaining scope.`]);
  if (!actions.length) actions.push(["Maintain cost control", "Continue weekly cost reviews, validate commitments, and protect the approved budget baseline."]);
  return actions;
}

function getScheduleActions(m) {
  const actions = [];
  if (m.progressVariance < 0) actions.push(["Issue a recovery programme", "Re-sequence delayed activities, assign weekly catch-up targets, and confirm the revised critical path."]);
  WORK_PACKAGES.filter(item => ["delayed", "at risk"].includes(item.status.toLowerCase())).slice(0, 3).forEach(item => {
    actions.push([`Recover ${item.name}`, `${item.owner} should confirm blockers, resources, and a dated recovery target for the package currently at ${item.progress}%.`]);
  });
  if (m.riskRows > 0) actions.push(["Close schedule risks", "Assign owners and due dates to high-risk reporting periods and confirm mitigation evidence at the next review."]);
  if (!actions.length) actions.push(["Protect the programme", "Maintain the two-week lookahead, review critical-path activities, and close blockers before they affect milestones."]);
  return actions;
}

async function exportSpecializedPowerPoint(reportType) {
  const m = calculateMetrics();
  const report = REPORT_TYPES[reportType];
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = state.customization.brandName;
  pptx.company = state.customization.companyName;
  pptx.subject = `${state.project.name} ${report.title}`;
  pptx.title = `${state.project.name} - ${report.title}`;
  pptx.lang = "en-ZA";
  pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-ZA" };

  const C = getPptPalette();
  const addFooter = (slide, number) => {
    slide.addText(`${state.customization.brandName} | ${report.title}`, { x: .55, y: 7.12, w: 5.2, h: .18, fontSize: 8, color: "7B8992", margin: 0 });
    slide.addText(`${number}`, { x: 12.25, y: 7.1, w: .45, h: .2, fontSize: 8, color: "7B8992", align: "right", margin: 0 });
  };
  const addTitle = (slide, title, subtitle, number) => {
    slide.background = { color: C.bg };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: .14, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
    slide.addText(title, { x: .55, y: .34, w: 9.6, h: .38, fontFace: "Aptos Display", fontSize: 23, bold: true, color: C.text, margin: 0 });
    slide.addText(subtitle, { x: .55, y: .78, w: 11.5, h: .23, fontSize: 9.5, color: C.muted, margin: 0 });
    addFooter(slide, number);
  };
  const addKpi = (slide, x, y, w, label, value, note) => {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 1.12, rectRadius: .07, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
    slide.addText(label.toUpperCase(), { x: x + .17, y: y + .14, w: w - .34, h: .16, fontSize: 7.2, bold: true, color: C.muted, charSpacing: .65, margin: 0 });
    slide.addText(value, { x: x + .17, y: y + .38, w: w - .34, h: .3, fontSize: 17, bold: true, color: C.text, margin: 0, fit: "shrink" });
    slide.addText(note, { x: x + .17, y: y + .8, w: w - .34, h: .19, fontSize: 7.2, color: C.muted, margin: 0, fit: "shrink" });
  };

  let slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: .22, h: 7.5, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
  if (state.customization.logoData) slide.addImage({ data: state.customization.logoData, x: .72, y: .55, w: .56, h: .56 });
  slide.addText(state.customization.brandName.toUpperCase(), { x: state.customization.logoData ? 1.43 : .72, y: .75, w: state.customization.logoData ? 3.5 : 4.2, h: .3, fontSize: 19, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText(report.title.toUpperCase(), { x: .72, y: 2.05, w: 7.2, h: .28, fontSize: 11, bold: true, charSpacing: 1.3, color: C.primary, margin: 0 });
  slide.addText(state.project.name, { x: .7, y: 2.45, w: 9.4, h: 1.1, fontFace: "Aptos Display", fontSize: 34, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText(`${state.project.client} | ${state.project.location}`, { x: .72, y: 3.75, w: 7, h: .3, fontSize: 15, color: "DDE7EA", margin: 0 });
  slide.addText(`${formatDate(state.project.startDate)} - ${formatDate(state.project.endDate)}`, { x: .72, y: 4.16, w: 6.5, h: .22, fontSize: 10.5, color: "9FB0B7", margin: 0 });
  slide.addText(report.description, { x: .72, y: 5.05, w: 8.3, h: .72, fontSize: 12, color: "B7C6CB", margin: 0, fit: "shrink" });
  slide.addText(`Generated ${formatDate(new Date().toISOString().slice(0, 10))}`, { x: .72, y: 6.72, w: 4, h: .2, fontSize: 8.5, color: "82949C", margin: 0 });

  if (reportType === "cost") {
    slide = pptx.addSlide();
    addTitle(slide, "Cost performance overview", `${state.project.name} | Cumulative financial position`, 2);
    addKpi(slide, .55, 1.2, 2.9, "Approved budget", formatMoney(state.project.approvedBudget), "Client-approved value");
    addKpi(slide, 3.67, 1.2, 2.9, "Actual spend", formatMoney(m.actualTotal), `${m.spendPercent.toFixed(1)}% consumed`);
    addKpi(slide, 6.79, 1.2, 2.9, "Remaining budget", formatMoney(m.remainingBudget), "Current balance");
    addKpi(slide, 9.91, 1.2, 2.87, "Final-cost forecast", formatMoney(m.predictedFinalCost), m.predictedFinalCost <= state.project.approvedBudget ? "Within approved budget" : "Forecast over budget");
    slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 2.62, w: 9.0, h: 3.95, rectRadius: .06, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
    const costImage = getChartImage("costChart");
    if (costImage) slide.addImage({ data: costImage, x: .83, y: 2.93, w: 8.45, h: 3.25 });
    slide.addShape(pptx.ShapeType.roundRect, { x: 9.82, y: 2.62, w: 2.96, h: 3.95, rectRadius: .06, line: { color: C.dark, transparency: 100 }, fill: { color: C.dark } });
    slide.addText("COST COMMENTARY", { x: 10.08, y: 2.94, w: 2.35, h: .2, fontSize: 8, bold: true, color: C.primary, charSpacing: .8, margin: 0 });
    slide.addText(getCostReportSummary(m), { x: 10.08, y: 3.34, w: 2.42, h: 2.55, fontSize: 10.2, color: C.white, margin: 0, fit: "shrink" });

    slide = pptx.addSlide();
    addTitle(slide, "Cost distribution and controls", "Actual expenditure by discipline with management actions", 3);
    slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 1.18, w: 5.8, h: 5.55, rectRadius: .06, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
    const categoryImage = getChartImage("categoryChart");
    if (categoryImage) slide.addImage({ data: categoryImage, x: 1.0, y: 1.55, w: 4.9, h: 3.9 });
    const categoryRows = [["Discipline", "Actual spend", "% of total"], ...Object.entries(m.categories).sort((a,b)=>b[1]-a[1]).map(([name,value]) => [name, formatMoney(value), `${m.actualTotal ? ((value/m.actualTotal)*100).toFixed(1) : "0.0"}%`])];
    slide.addTable(categoryRows, { x: 6.65, y: 1.18, w: 6.13, h: 2.7, border: { type: "solid", color: C.border, pt: 1 }, fill: C.white, color: C.text, fontSize: 8.4, margin: .07, colW: [2.7, 1.75, 1.35] });
    slide.addText("Recommended cost actions", { x: 6.65, y: 4.14, w: 3.4, h: .28, fontSize: 14, bold: true, color: C.text, margin: 0 });
    getCostActions(m).slice(0, 3).forEach((action, index) => {
      const y = 4.58 + index * .65;
      slide.addText(`${index + 1}`, { x: 6.67, y, w: .32, h: .25, fontSize: 8, bold: true, color: C.white, align: "center", fill: { color: C.primary }, margin: .04 });
      slide.addText(action[0], { x: 7.12, y: y - .01, w: 2.2, h: .23, fontSize: 9.4, bold: true, color: C.text, margin: 0, fit: "shrink" });
      slide.addText(action[1], { x: 9.28, y: y - .01, w: 3.18, h: .42, fontSize: 8.1, color: C.muted, margin: 0, fit: "shrink" });
    });
  } else {
    slide = pptx.addSlide();
    addTitle(slide, "Schedule variance overview", `${state.project.name} | Planned versus actual programme`, 2);
    addKpi(slide, .55, 1.2, 2.9, "Planned progress", `${round(m.plannedProgress)}%`, "Approved programme");
    addKpi(slide, 3.67, 1.2, 2.9, "Actual progress", `${round(m.actualProgress)}%`, "Physical completion");
    addKpi(slide, 6.79, 1.2, 2.9, "Schedule variance", `${round(m.progressVariance)}%`, m.progressVariance < 0 ? "Behind approved plan" : "On or ahead of plan");
    addKpi(slide, 9.91, 1.2, 2.87, "Days remaining", `${m.daysRemaining}`, `Deadline: ${formatDate(state.project.endDate)}`);
    slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 2.62, w: 9.0, h: 3.95, rectRadius: .06, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
    const progressImage = getChartImage("progressChart");
    if (progressImage) slide.addImage({ data: progressImage, x: .83, y: 2.93, w: 8.45, h: 3.25 });
    slide.addShape(pptx.ShapeType.roundRect, { x: 9.82, y: 2.62, w: 2.96, h: 3.95, rectRadius: .06, line: { color: C.dark, transparency: 100 }, fill: { color: C.dark } });
    slide.addText("SCHEDULE COMMENTARY", { x: 10.08, y: 2.94, w: 2.35, h: .2, fontSize: 8, bold: true, color: C.primary, charSpacing: .8, margin: 0 });
    slide.addText(getScheduleReportSummary(m), { x: 10.08, y: 3.34, w: 2.42, h: 2.55, fontSize: 10.2, color: C.white, margin: 0, fit: "shrink" });

    slide = pptx.addSlide();
    addTitle(slide, "Work-package status and recovery plan", "Package-level progress, delivery status, and corrective actions", 3);
    const packageRows = [["Work package", "Owner", "Progress", "Status"], ...WORK_PACKAGES.map(item => [item.name, item.owner, `${item.progress}%`, item.status])];
    slide.addTable(packageRows, { x: .55, y: 1.2, w: 6.2, h: 3.45, border: { type: "solid", color: C.border, pt: 1 }, fill: C.white, color: C.text, fontSize: 8.6, margin: .075, colW: [2.45, 1.65, .82, 1.05] });
    slide.addText("Schedule recovery actions", { x: 7.06, y: 1.2, w: 3.6, h: .28, fontSize: 14, bold: true, color: C.text, margin: 0 });
    getScheduleActions(m).slice(0, 5).forEach((action, index) => {
      const y = 1.68 + index * .88;
      slide.addShape(pptx.ShapeType.roundRect, { x: 7.06, y, w: .42, h: .42, rectRadius: .04, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
      slide.addText(`${index + 1}`, { x: 7.06, y: y + .11, w: .42, h: .12, fontSize: 8, bold: true, color: C.white, align: "center", margin: 0 });
      slide.addText(action[0], { x: 7.64, y, w: 2.45, h: .24, fontSize: 9.6, bold: true, color: C.text, margin: 0, fit: "shrink" });
      slide.addText(action[1], { x: 10.0, y, w: 2.45, h: .56, fontSize: 8.1, color: C.muted, margin: 0, fit: "shrink" });
    });
  }

  await pptx.writeFile({ fileName: exportFileName("pptx", reportType) });
}

async function exportSpecializedPdf(reportType) {
  const { jsPDF } = window.jspdf;
  const m = calculateMetrics();
  const report = REPORT_TYPES[reportType];
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const C = getPdfPalette();
  const header = (title, subtitle) => {
    doc.setFillColor(...C.bg); doc.rect(0,0,W,H,"F");
    doc.setFillColor(...C.primary); doc.rect(0,0,W,4,"F");
    doc.setTextColor(...C.text); doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.text(pdfText(title),12,16);
    doc.setTextColor(...C.muted); doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.text(pdfText(subtitle),12,22);
    addPdfLogo(doc, W - 25, 8, 13, 13);
  };
  const kpi = (x,y,w,label,value,note) => {
    doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(x,y,w,24,3,3,"FD");
    doc.setTextColor(...C.muted); doc.setFont("helvetica","bold"); doc.setFontSize(6.8); doc.text(pdfText(label.toUpperCase()),x+4,y+6);
    doc.setTextColor(...C.text); doc.setFontSize(14.5); doc.text(pdfText(value),x+4,y+14);
    doc.setTextColor(...C.muted); doc.setFont("helvetica","normal"); doc.setFontSize(6.4); doc.text(doc.splitTextToSize(pdfText(note),w-8),x+4,y+19);
  };
  const footer = () => {
    const count = doc.getNumberOfPages();
    for (let i=1;i<=count;i++) { doc.setPage(i); doc.setDrawColor(...C.border); doc.line(12,H-10,W-12,H-10); doc.setTextColor(...C.muted); doc.setFontSize(7); doc.text(pdfText(`${state.customization.brandName} | ${report.title}`),12,H-5.5); doc.text(`Page ${i} of ${count}`,W-12,H-5.5,{align:"right"}); }
  };

  header(report.title, `${state.project.name} | ${state.project.client} | ${state.project.location}`);
  const kw = (W - 32) / 4;
  if (reportType === "cost") {
    kpi(12,30,kw,"Approved budget",formatMoney(state.project.approvedBudget),"Client-approved value");
    kpi(16+kw,30,kw,"Actual spend",formatMoney(m.actualTotal),`${m.spendPercent.toFixed(1)}% consumed`);
    kpi(20+kw*2,30,kw,"Remaining budget",formatMoney(m.remainingBudget),"Current balance");
    kpi(24+kw*3,30,kw,"Final-cost forecast",formatMoney(m.predictedFinalCost),m.predictedFinalCost <= state.project.approvedBudget ? "Within budget" : "Over budget");
    doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(12,60,190,112,3,3,"FD");
    const img = getChartImage("costChart"); if (img) doc.addImage(img,"PNG",18,70,178,91);
    doc.setFillColor(...C.dark); doc.roundedRect(208,60,77,112,3,3,"F");
    doc.setTextColor(103,217,183); doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.text("COST COMMENTARY",215,73);
    doc.setTextColor(...C.white); doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.text(doc.splitTextToSize(pdfText(getCostReportSummary(m)),63),215,84);
  } else {
    kpi(12,30,kw,"Planned progress",`${round(m.plannedProgress)}%`,"Approved programme");
    kpi(16+kw,30,kw,"Actual progress",`${round(m.actualProgress)}%`,"Physical completion");
    kpi(20+kw*2,30,kw,"Schedule variance",`${round(m.progressVariance)}%`,m.progressVariance < 0 ? "Behind plan" : "On or ahead of plan");
    kpi(24+kw*3,30,kw,"Days remaining",`${m.daysRemaining}`,`Deadline: ${formatDate(state.project.endDate)}`);
    doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(12,60,190,112,3,3,"FD");
    const img = getChartImage("progressChart"); if (img) doc.addImage(img,"PNG",18,70,178,91);
    doc.setFillColor(...C.dark); doc.roundedRect(208,60,77,112,3,3,"F");
    doc.setTextColor(103,217,183); doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.text("SCHEDULE COMMENTARY",215,73);
    doc.setTextColor(...C.white); doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.text(doc.splitTextToSize(pdfText(getScheduleReportSummary(m)),63),215,84);
  }

  doc.addPage("a4","landscape");
  header(reportType === "cost" ? "Detailed cost analysis" : "Detailed schedule analysis", reportType === "cost" ? "Reporting-period expenditure, category distribution, and corrective cost actions" : "Reporting-period variance, work-package status, and recovery actions");
  if (typeof doc.autoTable === "function") {
    if (reportType === "cost") {
      let cumulativePlan=0, cumulativeActual=0;
      const rows = m.rows.map(row => { cumulativePlan += validNumber(row.plannedCost); cumulativeActual += validNumber(row.actualCost); return [formatDate(row.date),row.category,formatMoney(row.plannedCost),formatMoney(row.actualCost),formatMoney(validNumber(row.actualCost)-validNumber(row.plannedCost)),formatMoney(cumulativePlan),formatMoney(cumulativeActual)]; });
      doc.autoTable({ startY:29, head:[["Period","Discipline","Planned","Actual","Period variance","Cumulative plan","Cumulative actual"]], body:rows, theme:"grid", styles:{fontSize:7.2,cellPadding:2,textColor:C.text,lineColor:C.border,lineWidth:.2}, headStyles:{fillColor:C.primary,textColor:C.white}, margin:{left:12,right:12} });
      const y=Math.min(doc.lastAutoTable.finalY+8,145);
      doc.autoTable({ startY:y, head:[["Cost action","Recommended response"]], body:getCostActions(m), theme:"grid", styles:{fontSize:8,cellPadding:2.4,textColor:C.text,lineColor:C.border,lineWidth:.2}, headStyles:{fillColor:C.dark,textColor:C.white}, margin:{left:12,right:12} });
    } else {
      const rows = m.rows.map(row => [formatDate(row.date),`${round(row.plannedProgress)}%`,`${round(row.actualProgress)}%`,`${round(validNumber(row.actualProgress)-validNumber(row.plannedProgress))}%`,round(row.tasksCompleted).toLocaleString("en-ZA"),round(row.totalTasks).toLocaleString("en-ZA"),row.riskLevel||"-"]);
      doc.autoTable({ startY:29, head:[["Period","Planned progress","Actual progress","Variance","Tasks completed","Total tasks","Risk"]], body:rows, theme:"grid", styles:{fontSize:7.4,cellPadding:2,textColor:C.text,lineColor:C.border,lineWidth:.2}, headStyles:{fillColor:C.primary,textColor:C.white}, margin:{left:12,right:12} });
      const y=Math.min(doc.lastAutoTable.finalY+8,115);
      doc.autoTable({ startY:y, tableWidth:130, head:[["Work package","Owner","Progress","Status"]], body:WORK_PACKAGES.map(item=>[item.name,item.owner,`${item.progress}%`,item.status]), theme:"grid", styles:{fontSize:7.5,cellPadding:2,textColor:C.text,lineColor:C.border,lineWidth:.2}, headStyles:{fillColor:C.dark,textColor:C.white}, margin:{left:12} });
      doc.autoTable({ startY:y, tableWidth:135, head:[["Recovery action","Recommended response"]], body:getScheduleActions(m), theme:"grid", styles:{fontSize:7.3,cellPadding:2,textColor:C.text,lineColor:C.border,lineWidth:.2}, headStyles:{fillColor:C.primary,textColor:C.white}, margin:{left:150} });
    }
  }
  footer();
  doc.save(exportFileName("pdf", reportType));
}

function exportSpecializedExcel(reportType) {
  const m = calculateMetrics();
  const report = REPORT_TYPES[reportType];
  const wb = XLSX.utils.book_new();
  wb.Props = { Title: `${state.project.name} - ${report.title}`, Subject: report.description, Author: state.customization.brandName, Company: state.customization.companyName, CreatedDate: new Date() };

  if (reportType === "cost") {
    const summary = XLSX.utils.aoa_to_sheet([
      [`${state.customization.brandName.toUpperCase()} COST PERFORMANCE REPORT`], ["Project",state.project.name], ["Client",state.project.client], ["Location",state.project.location], ["Generated",new Date().toISOString().slice(0,10)], [],
      ["COST KPIS"], ["Approved budget",state.project.approvedBudget], ["Planned cost to date",m.plannedTotal], ["Actual spend",m.actualTotal], ["Cost variance",m.costVariance], ["Remaining budget",m.remainingBudget], ["Estimated final cost",m.predictedFinalCost], ["Budget consumed",m.spendPercent/100], [],
      ["COST COMMENTARY"], [getCostReportSummary(m)], [], ["RECOMMENDED ACTIONS"], ["Action","Recommended response"], ...getCostActions(m)
    ]);
    summary["!cols"]=[{wch:32},{wch:95}];
    ["B8","B9","B10","B11","B12","B13"].forEach(cell=>{if(summary[cell]) summary[cell].z='R #,##0.00';}); if(summary["B14"]) summary["B14"].z='0.0%';
    XLSX.utils.book_append_sheet(wb,summary,"Cost Summary");
    let cp=0,ca=0;
    const trend=XLSX.utils.json_to_sheet(m.rows.map(row=>{cp+=validNumber(row.plannedCost);ca+=validNumber(row.actualCost);return {"Reporting date":row.date,"Discipline":row.category,"Planned cost":row.plannedCost,"Actual cost":row.actualCost,"Period variance":validNumber(row.actualCost)-validNumber(row.plannedCost),"Cumulative planned":cp,"Cumulative actual":ca};}));
    trend["!cols"]=[{wch:16},{wch:24},{wch:16},{wch:16},{wch:17},{wch:20},{wch:20}]; XLSX.utils.book_append_sheet(wb,trend,"Cost Trend");
    const categories=XLSX.utils.json_to_sheet(Object.entries(m.categories).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({Discipline:name,"Actual spend":value,"Share of total":m.actualTotal?value/m.actualTotal:0}))); categories["!cols"]=[{wch:28},{wch:18},{wch:18}]; XLSX.utils.book_append_sheet(wb,categories,"Cost by Category");
  } else {
    const summary = XLSX.utils.aoa_to_sheet([
      [`${state.customization.brandName.toUpperCase()} SCHEDULE VARIANCE REPORT`], ["Project",state.project.name], ["Client",state.project.client], ["Location",state.project.location], ["Generated",new Date().toISOString().slice(0,10)], [],
      ["SCHEDULE KPIS"], ["Planned progress",m.plannedProgress/100], ["Actual progress",m.actualProgress/100], ["Schedule variance",m.progressVariance/100], ["Days remaining",m.daysRemaining], ["Completion deadline",state.project.endDate], [],
      ["SCHEDULE COMMENTARY"], [getScheduleReportSummary(m)], [], ["RECOVERY ACTIONS"], ["Action","Recommended response"], ...getScheduleActions(m)
    ]);
    summary["!cols"]=[{wch:32},{wch:95}]; ["B8","B9","B10"].forEach(cell=>{if(summary[cell]) summary[cell].z='0.0%';}); XLSX.utils.book_append_sheet(wb,summary,"Schedule Summary");
    const trend=XLSX.utils.json_to_sheet(m.rows.map(row=>({"Reporting date":row.date,"Planned progress (%)":row.plannedProgress,"Actual progress (%)":row.actualProgress,"Schedule variance (%)":validNumber(row.actualProgress)-validNumber(row.plannedProgress),"Tasks completed":row.tasksCompleted,"Total tasks":row.totalTasks,"Risk level":row.riskLevel}))); trend["!cols"]=[{wch:16},{wch:21},{wch:20},{wch:21},{wch:17},{wch:14},{wch:14}]; XLSX.utils.book_append_sheet(wb,trend,"Schedule Trend");
    const packages=XLSX.utils.json_to_sheet(WORK_PACKAGES.map(item=>({"Work package":item.name,Owner:item.owner,"Progress (%)":item.progress,Status:item.status}))); packages["!cols"]=[{wch:32},{wch:23},{wch:16},{wch:14}]; XLSX.utils.book_append_sheet(wb,packages,"Work Packages");
  }
  XLSX.writeFile(wb,exportFileName("xlsx",reportType),{compression:true});
}

function exportSpecializedCsv(reportType) {
  const m = calculateMetrics();
  let rows;
  if (reportType === "cost") {
    let cp=0,ca=0;
    rows=[[`${state.customization.brandName} cost performance report`],["Project",state.project.name],["Client",state.project.client],["Approved budget",state.project.approvedBudget],[],["Reporting date","Discipline","Planned cost","Actual cost","Period variance","Cumulative planned","Cumulative actual"]];
    m.rows.forEach(row=>{cp+=validNumber(row.plannedCost);ca+=validNumber(row.actualCost);rows.push([row.date,row.category,row.plannedCost,row.actualCost,validNumber(row.actualCost)-validNumber(row.plannedCost),cp,ca]);});
  } else {
    rows=[[`${state.customization.brandName} schedule variance report`],["Project",state.project.name],["Client",state.project.client],["Completion deadline",state.project.endDate],[],["Reporting date","Planned progress (%)","Actual progress (%)","Schedule variance (%)","Tasks completed","Total tasks","Risk level"]];
    m.rows.forEach(row=>rows.push([row.date,row.plannedProgress,row.actualProgress,validNumber(row.actualProgress)-validNumber(row.plannedProgress),row.tasksCompleted,row.totalTasks,row.riskLevel]));
  }
  const csv=rows.map(row=>row.map(csvValue).join(",")).join("\r\n");
  downloadBlob(new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8"}),exportFileName("csv",reportType));
}

async function exportSpecializedPng(reportType) {
  const overviewButton = document.querySelector('[data-view="overview"]');
  switchView("overview", overviewButton);
  await waitForPaint();
  const m = calculateMetrics();
  const report = REPORT_TYPES[reportType];
  const chartA = reportType === "cost" ? getChartImage("costChart") : getChartImage("progressChart");
  const chartB = reportType === "cost" ? getChartImage("categoryChart") : "";
  const actions = reportType === "cost" ? getCostActions(m) : getScheduleActions(m);
  const summary = reportType === "cost" ? getCostReportSummary(m) : getScheduleReportSummary(m);
  const kpis = reportType === "cost"
    ? [["Approved budget",formatMoney(state.project.approvedBudget)],["Actual spend",formatMoney(m.actualTotal)],["Remaining budget",formatMoney(m.remainingBudget)],["Final-cost forecast",formatMoney(m.predictedFinalCost)]]
    : [["Planned progress",`${round(m.plannedProgress)}%`],["Actual progress",`${round(m.actualProgress)}%`],["Schedule variance",`${round(m.progressVariance)}%`],["Days remaining",`${m.daysRemaining}`]];
  const detailRows = reportType === "cost"
    ? Object.entries(m.categories).sort((a,b)=>b[1]-a[1]).map(([name,value])=>`<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(formatMoney(value))}</td><td>${m.actualTotal?((value/m.actualTotal)*100).toFixed(1):"0.0"}%</td></tr>`).join("")
    : WORK_PACKAGES.map(item=>`<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.owner)}</td><td>${item.progress}%</td><td>${escapeHtml(item.status)}</td></tr>`).join("");
  const capture=document.createElement("section");
  capture.style.cssText=`position:fixed;left:-20000px;top:0;width:1200px;padding:48px;background:${state.customization.background};color:${state.customization.text};font-family:${fontStack(state.customization.font)};z-index:-1`;
  capture.innerHTML=`
    <div style="border-top:8px solid ${state.customization.accent};background:${state.customization.surface};padding:34px 38px;border-radius:18px;box-shadow:0 10px 30px rgba(20,32,43,.08)">
      <div style="display:flex;justify-content:space-between;gap:28px;align-items:flex-start">
        <div style="display:flex;gap:14px;align-items:flex-start">${state.customization.logoData ? `<img src="${state.customization.logoData}" style="width:54px;height:54px;object-fit:contain;border-radius:10px;background:#fff;padding:4px">` : ""}<div><div style="font-size:14px;font-weight:800;color:${state.customization.accent};letter-spacing:.12em">${escapeHtml(state.customization.brandName.toUpperCase())}</div><h1 style="font-size:38px;margin:10px 0 8px">${escapeHtml(report.title)}</h1><div style="font-size:18px;color:#55626d">${escapeHtml(state.project.name)} · ${escapeHtml(state.project.client)} · ${escapeHtml(state.project.location)}</div></div></div>
        <div style="text-align:right;color:#55626d;font-size:14px">Generated ${escapeHtml(formatDate(new Date().toISOString().slice(0,10)))}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:30px 0">${kpis.map(([label,value])=>`<div style="border:1px solid #dfe5e9;border-radius:13px;padding:18px"><div style="font-size:12px;font-weight:800;color:#55626d;text-transform:uppercase">${escapeHtml(label)}</div><div style="font-size:27px;font-weight:800;margin-top:9px">${escapeHtml(value)}</div></div>`).join("")}</div>
      <div style="display:grid;grid-template-columns:${chartB?"1.55fr 1fr":"1fr"};gap:18px">
        <div style="border:1px solid #dfe5e9;border-radius:14px;padding:18px"><h2 style="margin:0 0 12px;font-size:20px">${reportType==="cost"?"Planned versus actual expenditure":"Planned versus actual progress"}</h2>${chartA?`<img src="${chartA}" style="width:100%;height:360px;object-fit:contain">`:""}</div>
        ${chartB?`<div style="border:1px solid #dfe5e9;border-radius:14px;padding:18px"><h2 style="margin:0 0 12px;font-size:20px">Spend by category</h2><img src="${chartB}" style="width:100%;height:360px;object-fit:contain"></div>`:""}
      </div>
      <div style="margin-top:18px;background:${state.customization.sidebar};color:#fff;border-radius:14px;padding:24px"><div style="color:${state.customization.accent};font-size:12px;font-weight:800;letter-spacing:.1em">MANAGEMENT COMMENTARY</div><p style="font-size:17px;line-height:1.55;margin:12px 0 0">${escapeHtml(summary)}</p></div>
      <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:18px;margin-top:18px">
        <div style="border:1px solid #dfe5e9;border-radius:14px;padding:18px"><h2 style="margin:0 0 14px">${reportType==="cost"?"Cost by discipline":"Work-package status"}</h2><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr>${reportType==="cost"?"<th style='text-align:left;padding:9px;border-bottom:2px solid #dfe5e9'>Discipline</th><th style='text-align:left;padding:9px;border-bottom:2px solid #dfe5e9'>Spend</th><th style='text-align:left;padding:9px;border-bottom:2px solid #dfe5e9'>Share</th>":"<th style='text-align:left;padding:9px;border-bottom:2px solid #dfe5e9'>Work package</th><th style='text-align:left;padding:9px;border-bottom:2px solid #dfe5e9'>Owner</th><th style='text-align:left;padding:9px;border-bottom:2px solid #dfe5e9'>Progress</th><th style='text-align:left;padding:9px;border-bottom:2px solid #dfe5e9'>Status</th>"}</tr></thead><tbody>${detailRows}</tbody></table></div>
        <div style="border:1px solid #dfe5e9;border-radius:14px;padding:18px"><h2 style="margin:0 0 14px">Recommended actions</h2>${actions.map((action,index)=>`<div style="display:grid;grid-template-columns:30px 1fr;gap:10px;margin:0 0 14px"><div style="width:28px;height:28px;border-radius:8px;background:${state.customization.accent};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800">${index+1}</div><div><strong>${escapeHtml(action[0])}</strong><div style="color:#55626d;line-height:1.4;margin-top:3px">${escapeHtml(action[1])}</div></div></div>`).join("")}</div>
      </div>
    </div>`;
  document.body.appendChild(capture);
  try {
    await waitForPaint();
    const canvas=await html2canvas(capture,{scale:2,useCORS:true,backgroundColor:state.customization.background,logging:false,width:1200,windowWidth:1200});
    const blob=await canvasToBlob(canvas);
    downloadBlob(blob,exportFileName("png",reportType));
  } finally { capture.remove(); }
}

function getHealthLabel(score) {
  if (score < 50) return "Critical attention";
  if (score < 70) return "High attention";
  if (score < 85) return "Needs attention";
  if (score < 100) return "Healthy";
  return "Excellent";
}

function getManagementSummary(m) {
  const statements = [];
  if (m.progressVariance < -5) statements.push(`Actual progress is ${Math.abs(round(m.progressVariance))}% behind the approved programme.`);
  else if (m.progressVariance < 0) statements.push(`Progress is slightly behind the approved programme by ${Math.abs(round(m.progressVariance))}%.`);
  else statements.push("Project delivery is meeting or exceeding the approved programme.");

  if (m.predictedFinalCost > state.project.approvedBudget) statements.push(`Current performance indicates a possible final cost overrun of ${formatMoney(m.predictedFinalCost - state.project.approvedBudget)}.`);
  else statements.push(`Expenditure remains within budget, with a current final-cost forecast of ${formatMoney(m.predictedFinalCost)}.`);

  if (m.riskRows > 0) statements.push(`${m.riskRows} high-risk reporting period${m.riskRows === 1 ? " has" : "s have"} been detected and should be reviewed with the project team.`);
  else statements.push("No high-risk reporting periods are present in the imported data.");

  const pointsAvailable = 100 - m.healthScore;
  if (pointsAvailable > 0) {
    statements.push(`There ${m.scoreFactors.length === 1 ? "is" : "are"} ${m.scoreFactors.length} insight message${m.scoreFactors.length === 1 ? "" : "s"} left to review, worth up to ${pointsAvailable} point${pointsAvailable === 1 ? "" : "s"}.`);
  } else if (m.ignoredScoreFactors.length > 0) {
    statements.push("All currently generated insight messages have been reviewed or ignored. The underlying project data has not changed, and new data may create new suggestions.");
  } else {
    statements.push("The project has reached the maximum insight score. Continue the current reporting and control routine to protect it.");
  }
  return statements.join(" ");
}

function getChartImage(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return "";
  try { return canvas.toDataURL("image/png", 1); }
  catch { return ""; }
}

function exportFileName(extension, reportType = activeReportType) {
  const project = state.project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
  const report = REPORT_TYPES[reportType] || REPORT_TYPES.full;
  const date = new Date().toISOString().slice(0, 10);
  return `civentraq-${project}-${report.slug}-${date}.${extension}`;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = fileName; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("The dashboard image could not be created.")), "image/png", 1));
}

function waitForPaint() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function csvValue(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function pdfText(value) {
  return String(value ?? "").replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/•/g, "-");
}

function saveState() {
  localStorage.setItem("civentraq_project", JSON.stringify(state.project));
  localStorage.setItem("civentraq_projects", JSON.stringify(state.projects));
  localStorage.setItem("civentraq_rows", JSON.stringify(state.rows));
  localStorage.setItem("civentraq_imports", JSON.stringify(state.importHistory));
  localStorage.setItem("civentraq_ignored_insights", JSON.stringify(state.ignoredInsights));
  localStorage.setItem("civentraq_customization", JSON.stringify(state.customization));
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
