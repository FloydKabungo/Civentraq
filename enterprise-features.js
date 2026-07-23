"use strict";

/*
 * Civentraq Enterprise Presentation Features
 * Adds master layouts, review workflows, version history, data lineage,
 * preflight checks, protected share links, onboarding, and advanced editor controls.
 * Data remains browser-local in this static prototype.
 */

const CT_MASTER_KEY = "civentraq_master_templates_v1";
const CT_VERSIONS_KEY = "civentraq_presentation_versions_v1";
const CT_SHARES_KEY = "civentraq_presentation_shares_v1";
const CT_ONBOARDING_KEY = "civentraq_onboarding_complete_v1";
const CT_EDITOR_ADVANCED_KEY = "civentraq_editor_advanced_v1";

const ctDefaultMaster = {
  id: "master-civentraq",
  name: "Civentraq corporate",
  font: "Inter, Arial, sans-serif",
  accent: "#0d7b69",
  text: "#17202a",
  header: "Civentraq · Project Intelligence",
  footer: "Confidential project report",
  logoText: "CV",
  logoData: "",
  lockBranding: true,
  applyToTitle: true,
  showPageNumber: true
};

let ctMasters = ctLoadJson(CT_MASTER_KEY, [ctDefaultMaster]);
if (!Array.isArray(ctMasters) || !ctMasters.length) ctMasters = [ctDefaultMaster];
let ctVersions = ctLoadJson(CT_VERSIONS_KEY, []);
let ctShares = ctLoadJson(CT_SHARES_KEY, []);
let ctClipboard = [];
let ctSkipCanvasClick = false;
let ctLastChecks = [];
let ctAdvancedPrefs = { snap: true, grid: true, gridSize: 2, ...ctLoadJson(CT_EDITOR_ADVANCED_KEY, {}) };

/* ---------- Data-model upgrades (installed before DOMContentLoaded) ---------- */
const ctOriginalNormalizeDeck = normalizePresentationDeck;
normalizePresentationDeck = function ctNormalizeDeck(deck) {
  const normalized = ctOriginalNormalizeDeck(deck);
  normalized.editorVersion = 3;
  if (deck.ratio === "a4p") normalized.ratio = "a4p";
  normalized.masterId = ctMasters.some(master => master.id === deck.masterId) ? deck.masterId : ctMasters[0].id;
  normalized.comments = Array.isArray(deck.comments) ? deck.comments : [];
  normalized.workflow = {
    status: "draft",
    reviewer: "Project Manager",
    updatedAt: new Date().toISOString(),
    history: [],
    ...(deck.workflow || {})
  };
  normalized.slides = normalized.slides.map(slide => ({ ...slide, approved: Boolean(slide.approved) }));
  return normalized;
};

const ctOriginalCreateDefaultDeck = createDefaultPresentationDeck;
createDefaultPresentationDeck = function ctCreateDefaultDeck() {
  const deck = ctOriginalCreateDefaultDeck();
  deck.editorVersion = 3;
  deck.masterId = ctMasters[0].id;
  deck.comments = [];
  deck.workflow = { status: "draft", reviewer: "Project Manager", updatedAt: new Date().toISOString(), history: [] };
  return deck;
};

const ctOriginalDefaultElement = defaultElement;
defaultElement = function ctDefaultElement(type, overrides = {}) {
  const element = ctOriginalDefaultElement(type, overrides);
  element.locked = Boolean(overrides.locked);
  element.groupId = overrides.groupId || "";
  if (["kpi", "chart", "progress", "comparison", "table"].includes(type)) {
    element.sourceMeta = { ...ctCurrentSourceMeta(type, element), ...(overrides.sourceMeta || {}) };
  }
  return element;
};

const ctOriginalNormalizeElement = normalizePresentationElement;
normalizePresentationElement = function ctNormalizeElement(element) {
  const normalized = ctOriginalNormalizeElement(element);
  normalized.locked = Boolean(element.locked);
  normalized.groupId = element.groupId || "";
  if (["kpi", "chart", "progress", "comparison", "table"].includes(normalized.type)) {
    normalized.sourceMeta = { ...ctCurrentSourceMeta(normalized.type, normalized), ...(element.sourceMeta || {}) };
  }
  return normalized;
};

/* ---------- Brand and fictional-demo cleanup ---------- */
const ctOriginalApplyCustomization = applyCustomization;
applyCustomization = function ctApplyCustomization() {
  ctEnforceCiventraqBranding();
  return ctOriginalApplyCustomization();
};

const ctOriginalRenderAll = renderAll;
renderAll = function ctRenderAll() {
  const result = ctOriginalRenderAll();
  setTimeout(ctRenderDashboardLineage, 0);
  return result;
};

function ctEnforceCiventraqBranding() {
  if (typeof state === "undefined" || !state.customization) return;
  state.customization.brandName = "Civentraq";
  state.customization.brandTagline = "Project Intelligence";
  state.customization.brandInitials = "CV";
  if (/alta autocon/i.test(state.customization.companyName || "")) state.customization.companyName = "Demo Engineering Contractor";
  if (/eskom/i.test(state.project?.name || "")) state.project.name = "Cape Industrial Refinery Maintenance Project";
  if (/eskom/i.test(state.project?.client || "")) state.project.client = "Cape Industrial Energy";
  (state.projects || []).forEach(project => {
    if (/eskom/i.test(project.name || "")) project.name = "Cape Industrial Refinery Maintenance Project";
    if (/eskom/i.test(project.client || "")) project.client = "Cape Industrial Energy";
  });
}

/* ---------- Health score and review completion separation ---------- */
function ctDatasetRowValue(dataset, row, key) {
  const mappedHeader = dataset?.mapping?.[key];
  if (mappedHeader && Object.prototype.hasOwnProperty.call(row || {}, mappedHeader)) return row[mappedHeader];
  const template = typeof getDatasetTemplate === "function" ? getDatasetTemplate(dataset?.id) : null;
  const column = template?.columns?.find(item => item.key === key);
  const candidates = [key, column?.label, ...(column?.aliases || [])].filter(Boolean).map(value => String(value).trim().toLowerCase());
  const actualKey = Object.keys(row || {}).find(header => {
    const clean = String(header).trim().toLowerCase();
    return candidates.some(candidate => clean === candidate || clean.includes(candidate) || candidate.includes(clean));
  });
  return actualKey ? row[actualKey] : "";
}

function ctCalculateSafetyHealth() {
  const dataset = typeof getDataset === "function" ? getDataset("hse_incidents_actions") : null;
  if (!dataset || dataset.status === "empty" || !Array.isArray(dataset.rows) || !dataset.rows.length) {
    return { available: false, score: null, deduction: 0, openEvents: 0, criticalEvents: 0, source: "No HSE dataset connected" };
  }
  let severityLoad = 0;
  let openEvents = 0;
  let criticalEvents = 0;
  dataset.rows.forEach(row => {
    const status = String(ctDatasetRowValue(dataset, row, "status") || "").toLowerCase();
    if (/closed|complete|resolved|verified|approved/.test(status)) return;
    const severity = String(ctDatasetRowValue(dataset, row, "severity") || "").toLowerCase();
    const type = String(ctDatasetRowValue(dataset, row, "type") || "").toLowerCase();
    const combined = `${severity} ${type}`;
    if (/positive|good practice|safe observation/.test(combined)) return;
    openEvents += 1;
    if (/fatal|fatality|critical|lost[ -]?time|lti|major injury/.test(combined)) { severityLoad += 40; criticalEvents += 1; }
    else if (/high|recordable|medical treatment|high potential/.test(combined)) severityLoad += 20;
    else if (/medium|moderate|near miss/.test(combined)) severityLoad += 10;
    else if (/low|first aid|minor/.test(combined)) severityLoad += 4;
    else severityLoad += 6;
  });
  const score = Math.max(0, 100 - Math.min(100, severityLoad));
  // Safety contributes up to 15 points of the overall project-health score.
  const deduction = Math.min(15, Math.round((100 - score) * 0.15));
  return { available: true, score, deduction, openEvents, criticalEvents, source: dataset.source || dataset.fileName || "HSE incidents and actions" };
}

const ctOriginalCalculateMetrics = calculateMetrics;
calculateMetrics = function ctCalculateMetrics() {
  const metrics = ctOriginalCalculateMetrics();
  const safety = ctCalculateSafetyHealth();
  const allFactors = [...metrics.allScoreFactors];
  if (safety.deduction > 0) {
    allFactors.push({
      key: "safety",
      title: `Close ${safety.openEvents} open safety event${safety.openEvents === 1 ? "" : "s"}`,
      action: "Verify corrective actions, close overdue HSE items and confirm the improvement in the next approved safety dataset.",
      points: Math.min(metrics.baseHealthScore, safety.deduction),
      priority: safety.criticalEvents > 0 || safety.score < 60 ? "high" : "medium"
    });
  }

  const knownKeys = new Set(allFactors.map(factor => factor.key));
  const reviewedKeys = new Set(getIgnoredInsights().filter(key => knownKeys.has(key)));
  metrics.allScoreFactors = allFactors;
  metrics.ignoredScoreFactors = allFactors.filter(factor => reviewedKeys.has(factor.key));
  metrics.scoreFactors = allFactors.filter(factor => !reviewedKeys.has(factor.key));
  metrics.baseHealthScore = Math.max(0, metrics.baseHealthScore - safety.deduction);
  // Reviewing/ignoring messages never changes this operational score.
  metrics.healthScore = metrics.baseHealthScore;
  const total = allFactors.length;
  const reviewed = metrics.ignoredScoreFactors.length;
  metrics.reviewCompletion = total ? Math.round((reviewed / total) * 100) : 100;
  metrics.reviewedCount = reviewed;
  metrics.totalInsightCount = total;
  metrics.safetyHealth = safety;
  metrics.healthComponents = {
    cost: Math.max(0, Math.round(100 - Math.min(100, Math.max(0, metrics.spendPercent - metrics.actualProgress) * 4 + Math.max(0, ((metrics.predictedFinalCost - state.project.approvedBudget) / Math.max(1, state.project.approvedBudget)) * 100) * 5))),
    schedule: Math.max(0, Math.round(100 - Math.min(100, Math.max(0, -metrics.progressVariance) * 8 + (metrics.daysRemaining < 60 && metrics.actualProgress < 80 ? 15 : 0)))),
    safety: safety.score,
    risk: Math.max(0, 100 - Math.min(100, metrics.riskRows * 20))
  };
  return metrics;
};

renderInsight = function ctRenderInsight(metrics) {
  ctEnsureDualScoreUi();
  els.healthScore.textContent = metrics.healthScore;
  els.healthRing.style.setProperty("--score", `${metrics.healthScore}%`);
  els.scoreProgress.style.width = `${metrics.healthScore}%`;
  els.healthScoreCaption.textContent = "Project health score";
  els.healthLabel.textContent = getHealthLabel(metrics.healthScore);
  els.aiSummary.textContent = getManagementSummary(metrics);

  const gap = Math.max(0, 100 - metrics.healthScore);
  els.scoreGap.textContent = gap ? `${gap} health point${gap === 1 ? "" : "s"} to recover` : "Project health target achieved";
  els.scoreUpdateNote.textContent = `${metrics.reviewedCount} of ${metrics.totalInsightCount} insight${metrics.totalInsightCount === 1 ? "" : "s"} reviewed`;
  els.restoreInsights.hidden = metrics.ignoredScoreFactors.length === 0;
  els.restoreInsights.textContent = metrics.ignoredScoreFactors.length ? `Restore ${metrics.ignoredScoreFactors.length} reviewed` : "Restore reviewed";

  const reviewValue = document.getElementById("ctReviewScore");
  const reviewBar = document.getElementById("ctReviewProgress");
  const reviewCaption = document.getElementById("ctReviewCaption");
  if (reviewValue) reviewValue.textContent = `${metrics.reviewCompletion}%`;
  if (reviewBar) reviewBar.style.width = `${metrics.reviewCompletion}%`;
  if (reviewCaption) reviewCaption.textContent = metrics.reviewCompletion === 100 ? "All current insights reviewed" : "Review completion";
  const componentValues = metrics.healthComponents || {};
  ["cost", "schedule", "risk"].forEach(key => {
    const target = document.querySelector(`[data-health-component="${key}"] strong`);
    if (target) target.textContent = `${componentValues[key] ?? 100}`;
  });
  const safetyTarget = document.querySelector('[data-health-component="safety"] strong');
  const safetyCaption = document.querySelector('[data-health-component="safety"] small');
  if (safetyTarget) safetyTarget.textContent = componentValues.safety == null ? "—" : `${componentValues.safety}`;
  if (safetyCaption) safetyCaption.textContent = componentValues.safety == null ? "Connect HSE data" : "Safety";

  const title = document.getElementById("scoreRoadmapTitle");
  if (title) title.textContent = "Actions to improve project health";

  if (!metrics.scoreFactors.length) {
    const allReviewed = metrics.ignoredScoreFactors.length > 0;
    els.improvementPlan.innerHTML = `
      <div class="improvement-item complete editor-complete">
        <span class="improvement-index">✓</span>
        <div>
          <strong>${allReviewed ? "All current insights reviewed" : "No active improvement messages"}</strong>
          <p>${allReviewed
            ? `The review list is complete, but project health remains ${metrics.healthScore}/100. The score will improve only when new project data confirms that cost, schedule, safety, and risk conditions have improved.`
            : "Current project data has no health deductions. Keep datasets current and continue monitoring delivery performance."}</p>
        </div>
        <span class="point-gain neutral">${metrics.healthScore}</span>
      </div>`;
    return;
  }

  els.improvementPlan.innerHTML = metrics.scoreFactors.map((factor, index) => `
    <div class="improvement-item ${factor.priority}" data-insight-key="${escapeAttr(factor.key)}">
      <span class="improvement-index">${index + 1}</span>
      <div><strong>${escapeHtml(factor.title)}</strong><p>${escapeHtml(factor.action)}</p></div>
      <div class="improvement-controls">
        <span class="point-gain" title="Potential health recovery after verified project improvement">+${factor.points} potential</span>
        <button class="ignore-insight" type="button" data-ignore-insight="${escapeAttr(factor.key)}">Mark reviewed</button>
      </div>
    </div>`).join("");
};

ignoreInsight = function ctMarkInsightReviewed(key, card) {
  const metrics = calculateMetrics();
  const factor = metrics.scoreFactors.find(item => item.key === key);
  if (!factor) return;
  const reviewed = new Set(getIgnoredInsights());
  reviewed.add(key);
  state.ignoredInsights[state.project.id] = [...reviewed];
  saveState();
  const finish = () => {
    const updated = calculateMetrics();
    renderInsight(updated);
    showToast(`Insight marked as reviewed. Review completion is now ${updated.reviewCompletion}%; project health remains ${updated.healthScore}/100.`);
  };
  if (card) { card.classList.add("is-dismissing"); setTimeout(finish, 230); } else finish();
};

/* ---------- Presentation rendering upgrades ---------- */
const ctOriginalRenderSlideInto = renderSlideInto;
renderSlideInto = function ctRenderSlideInto(slide, canvas, options = {}) {
  ctOriginalRenderSlideInto(slide, canvas, options);
  ctRenderMasterLayer(canvas, slide, options);
  canvas.classList.toggle("ct-grid-enabled", Boolean(options.interactive && ctAdvancedPrefs.grid));
  const master = ctActiveMaster();
  if (master?.font) canvas.style.fontFamily = master.font;
};

const ctOriginalCreateElementNode = createElementNode;
createElementNode = function ctCreateElementNode(element, slide, options) {
  const node = ctOriginalCreateElementNode(element, slide, options);
  const selectedIds = ctSelectedIds();
  node.classList.toggle("selected", Boolean(options.interactive && selectedIds.includes(element.id)));
  node.classList.toggle("locked", Boolean(element.locked));
  if (element.groupId) node.dataset.groupId = element.groupId;
  if (element.locked) {
    node.setAttribute("aria-label", `${elementTypeLabel(element.type)} locked`);
    node.querySelector(".ps-resize-handle")?.remove();
    const lock = document.createElement("span");
    lock.className = "ct-lock-badge";
    lock.textContent = "🔒";
    node.appendChild(lock);
  }
  return node;
};

const ctOriginalFillElementContent = fillElementContent;
fillElementContent = function ctFillElementContent(content, element, slide) {
  ctOriginalFillElementContent(content, element, slide);
  if (["kpi", "chart"].includes(element.type)) {
    const meta = { ...ctCurrentSourceMeta(element.type, element), ...(element.sourceMeta || {}) };
    const lineage = document.createElement("div");
    lineage.className = "ps-data-lineage";
    lineage.title = `Dataset: ${meta.dataset}\nLast refresh: ${meta.lastRefresh}\nReporting period: ${meta.period}\nFilters: ${meta.filters}\nStatus: ${meta.status}`;
    lineage.innerHTML = `<span class="ct-source-status ${String(meta.status).toLowerCase()}"></span>${escapeHtml(meta.dataset)} · ${escapeHtml(meta.status)} · ${escapeHtml(meta.lastRefresh)}`;
    content.appendChild(lineage);
  }
};

const ctOriginalRenderSlideList = renderSlideList;
renderSlideList = function ctRenderSlideList() {
  ctOriginalRenderSlideList();
  const comments = ps.data?.comments || [];
  ps.data?.slides?.forEach(slide => {
    const openCount = comments.filter(comment => comment.slideId === slide.id && !comment.resolved).length;
    if (!openCount) return;
    const thumb = pse.psSlideList.querySelector(`[data-ps-slide-id="${cssEscape(slide.id)}"] .ps-slide-thumb-preview`);
    if (!thumb) return;
    const badge = document.createElement("span");
    badge.className = "ct-comment-badge";
    badge.textContent = openCount;
    badge.title = `${openCount} unresolved comment${openCount === 1 ? "" : "s"}`;
    thumb.appendChild(badge);
  });
};

const ctOriginalRenderInspector = renderInspector;
renderInspector = function ctRenderInspector() {
  ctOriginalRenderInspector();
  const selected = ctSelectedElements();
  const primary = selected[0];
  const multiLabel = document.getElementById("ctMultiSelectionLabel");
  if (multiLabel) multiLabel.textContent = selected.length > 1 ? `${selected.length} elements selected` : "";
  ctUpdateAdvancedToolbar();
  ctRenderDataLineageInspector(primary);
  ctRenderMasterControls();
};

/* ---------- Multi-select, groups, snapping, alignment, locks ---------- */
handleCanvasClick = function ctHandleCanvasClick(event) {
  if (ctSkipCanvasClick) { ctSkipCanvasClick = false; return; }
  const node = event.target.closest(".ps-element");
  if (!node) {
    ps.selectedElementId = null;
    ps.selectedElementIds = [];
    renderCurrentSlide();
    renderInspector();
    return;
  }
  const element = findElement(node.dataset.elementId);
  if (!element) return;
  let ids = ctSelectedIds();
  const groupIds = element.groupId ? currentSlide().elements.filter(item => item.groupId === element.groupId).map(item => item.id) : [element.id];
  if (event.shiftKey || event.ctrlKey || event.metaKey) {
    const allSelected = groupIds.every(id => ids.includes(id));
    ids = allSelected ? ids.filter(id => !groupIds.includes(id)) : [...new Set([...ids, ...groupIds])];
  } else ids = groupIds;
  ps.selectedElementIds = ids;
  ps.selectedElementId = ids[0] || null;
  renderCurrentSlide();
  renderInspector();
};

startElementPointerInteraction = function ctStartElementPointerInteraction(event) {
  if (event.button !== 0) return;
  const node = event.target.closest(".ps-element");
  if (!node || event.target.closest('[contenteditable="true"]')) return;
  const element = findElement(node.dataset.elementId);
  if (!element || element.locked) return;
  event.preventDefault();
  let ids = ctSelectedIds();
  if (!ids.includes(element.id)) {
    ids = element.groupId ? currentSlide().elements.filter(item => item.groupId === element.groupId).map(item => item.id) : [element.id];
  }
  ids = ids.filter(id => !findElement(id)?.locked);
  ps.selectedElementIds = ids;
  ps.selectedElementId = element.id;
  const canvasRect = pse.psSlideCanvas.getBoundingClientRect();
  const originals = Object.fromEntries(ids.map(id => {
    const item = findElement(id);
    return [id, { x: item.x, y: item.y, w: item.w, h: item.h }];
  }));
  ps.drag = {
    mode: event.target.closest("[data-resize-handle]") && ids.length === 1 ? "resize" : "move",
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originals,
    primaryId: element.id,
    canvasRect,
    before: snapshotDeck(),
    changed: false
  };
  renderInspector();
  node.classList.add("selected");
};

moveElementPointerInteraction = function ctMoveElementPointerInteraction(event) {
  if (!ps.drag || event.pointerId !== ps.drag.pointerId) return;
  const primary = findElement(ps.drag.primaryId);
  if (!primary) return;
  const dxRaw = ((event.clientX - ps.drag.startX) / ps.drag.canvasRect.width) * 100;
  const dyRaw = ((event.clientY - ps.drag.startY) / ps.drag.canvasRect.height) * 100;
  const primaryOriginal = ps.drag.originals[primary.id];
  if (ps.drag.mode === "resize") {
    let width = clamp(primaryOriginal.w + dxRaw, 5, 100 - primary.x);
    let height = clamp(primaryOriginal.h + dyRaw, 4, 100 - primary.y);
    if (ctAdvancedPrefs.snap) { width = ctSnap(width); height = ctSnap(height); }
    primary.w = width; primary.h = height;
    ctUpdateElementNode(primary);
  } else {
    let targetX = clamp(primaryOriginal.x + dxRaw, 0, 100 - primary.w);
    let targetY = clamp(primaryOriginal.y + dyRaw, 0, 100 - primary.h);
    if (ctAdvancedPrefs.snap) { targetX = ctSnap(targetX); targetY = ctSnap(targetY); }
    const aligned = ctFindAlignment(primary, targetX, targetY);
    targetX = aligned.x; targetY = aligned.y;
    ctShowAlignmentGuides(aligned.guides);
    const dx = targetX - primaryOriginal.x;
    const dy = targetY - primaryOriginal.y;
    Object.entries(ps.drag.originals).forEach(([id, original]) => {
      const item = findElement(id);
      if (!item) return;
      item.x = clamp(original.x + dx, 0, 100 - item.w);
      item.y = clamp(original.y + dy, 0, 100 - item.h);
      ctUpdateElementNode(item);
    });
  }
  ps.drag.changed = true;
  setControlValue(pse.psElementX, round1(primary.x)); setControlValue(pse.psElementY, round1(primary.y));
  setControlValue(pse.psElementW, round1(primary.w)); setControlValue(pse.psElementH, round1(primary.h));
};

endElementPointerInteraction = function ctEndElementPointerInteraction(event) {
  if (!ps.drag || event.pointerId !== ps.drag.pointerId) return;
  if (ps.drag.changed) { commitSnapshot(ps.drag.before); ctSkipCanvasClick = true; }
  ps.drag = null;
  ctClearAlignmentGuides();
  savePresentationDeck();
};

const ctOriginalHandleKeyboard = handlePresentationKeyboard;
handlePresentationKeyboard = function ctHandleKeyboard(event) {
  if (pse.psPresenter?.classList.contains("open")) return ctOriginalHandleKeyboard(event);
  const active = document.activeElement;
  if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
  const key = event.key.toLowerCase();
  const command = event.ctrlKey || event.metaKey;
  if (command && key === "c") { event.preventDefault(); ctCopySelected(); return; }
  if (command && key === "v") { event.preventDefault(); ctPasteElements(); return; }
  if (command && key === "d") { event.preventDefault(); ctDuplicateSelection(); return; }
  if (command && key === "g" && !event.shiftKey) { event.preventDefault(); ctGroupSelected(); return; }
  if (command && key === "g" && event.shiftKey) { event.preventDefault(); ctUngroupSelected(); return; }
  if (command && key === "a") { event.preventDefault(); ctSelectAllElements(); return; }
  if (key === "delete" || key === "backspace") { if (ctSelectedIds().length) { event.preventDefault(); ctDeleteSelection(); } return; }
  if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) { event.preventDefault(); ctNudgeSelection(key, event.shiftKey ? 5 : 1); return; }
  if (key === "l") { event.preventDefault(); ctToggleLock(); return; }
  if (key === "]") { event.preventDefault(); ctBringForward(); return; }
  if (key === "[") { event.preventDefault(); ctSendBackward(); return; }
  ctOriginalHandleKeyboard(event);
};

/* ---------- Export quality and preflight ---------- */
const ctOriginalOpenExport = openPresentationExport;
openPresentationExport = async function ctOpenExport() {
  ctLastChecks = await ctRunPresentationChecks(false);
  ctUpdateExportChecklist(ctLastChecks);
  ctOriginalOpenExport();
};

capturePresentationSlides = async function ctCapturePresentationSlides(options) {
  if (typeof html2canvas === "undefined") throw new Error("The image export library did not load. Check your internet connection and refresh.");
  if (document.fonts?.ready) await document.fonts.ready;
  const captures = [];
  for (let index = 0; index < options.slides.length; index += 1) {
    setPresentationExportStatus(`Rendering slide ${index + 1} of ${options.slides.length}…`);
    const shell = document.createElement("div");
    shell.className = "ps-slide-export-clone ct-export-exact";
    const canvas = document.createElement("div");
    canvas.className = "ps-slide-canvas";
    shell.appendChild(canvas);
    document.body.appendChild(shell);
    const charts = [];
    renderSlideInto(options.slides[index], canvas, { interactive: false, chartBucket: charts, ratio: options.layout, watermark: options.watermark, pageNumber: options.pageNumbers ? `${index + 1}` : "" });
    await ctWaitForImages(canvas);
    await ctNextFrames(3);
    await wait(180);
    const capture = await html2canvas(canvas, {
      scale: options.quality,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      windowWidth: 1600,
      windowHeight: 1000,
      imageTimeout: 12000
    });
    captures.push({ dataUrl: capture.toDataURL("image/png", .98), width: capture.width, height: capture.height, slide: options.slides[index] });
    destroyCharts(charts);
    shell.remove();
  }
  return captures;
};

/* ---------- Initialise injected user interface ---------- */
ctInjectInterface();
document.addEventListener("DOMContentLoaded", ctInitEnterpriseFeatures);

function ctInitEnterpriseFeatures() {
  ctEnforceCiventraqBranding();
  ctMigrateDemoNames();
  ctEnsureDualScoreUi();
  ctLockProductBrandControls();
  ctBindEnterpriseEvents();
  ctRenderDashboardLineage();
  ctRenderWorkflowStatus();
  ctUpdateAdvancedToolbar();
  ctRenderMasterControls();
  ctMaybeOpenShareViewer();
  if (!location.hash.startsWith("#ctshare=")) setTimeout(ctMaybeOpenOnboarding, 650);
  try { saveState(); } catch (_) {}
  try { renderAll(); } catch (_) {}
}

function ctInjectInterface() {
  const firstToolbarGroup = document.querySelector(".ps-toolbar .ps-toolbar-group");
  if (firstToolbarGroup && !document.getElementById("ctGroupButton")) {
    firstToolbarGroup.insertAdjacentHTML("beforeend", `
      <span class="ps-toolbar-divider"></span>
      <span id="ctMultiSelectionLabel" class="ct-multi-label"></span>
      <button class="ps-toolbar-button" id="ctCopyButton" type="button" title="Copy (Ctrl+C)">⧉</button>
      <button class="ps-toolbar-button" id="ctPasteButton" type="button" title="Paste (Ctrl+V)">▣</button>
      <button class="ps-toolbar-button" id="ctGroupButton" type="button" title="Group (Ctrl+G)">Group</button>
      <button class="ps-toolbar-button" id="ctUngroupButton" type="button" title="Ungroup (Ctrl+Shift+G)">Ungroup</button>
      <button class="ps-toolbar-button" id="ctForwardButton" type="button" title="Bring forward (])">↑</button>
      <button class="ps-toolbar-button" id="ctBackwardButton" type="button" title="Send backward ([)">↓</button>
      <button class="ps-toolbar-button" id="ctLockButton" type="button" title="Lock/unlock (L)">🔒</button>
      <button class="ps-toolbar-button active" id="ctSnapButton" type="button" title="Snap to grid">Snap</button>
      <button class="ps-toolbar-button active" id="ctGridButton" type="button" title="Show grid">Grid</button>`);
  }

  const zoomControl = document.querySelector(".ps-zoom-control");
  if (zoomControl && !document.getElementById("ctZoomOut")) {
    zoomControl.insertAdjacentHTML("afterbegin", `<button class="ct-zoom-button" id="ctZoomOut" type="button" title="Zoom out">−</button>`);
    zoomControl.insertAdjacentHTML("beforeend", `<button class="ct-zoom-button" id="ctZoomIn" type="button" title="Zoom in">＋</button>`);
  }

  const appActions = document.querySelector(".ps-appbar-actions");
  if (appActions && !document.getElementById("ctVersionsButton")) {
    const exportButton = document.getElementById("psExportButton");
    exportButton?.insertAdjacentHTML("beforebegin", `
      <button class="ps-appbar-button" id="ctVersionsButton" type="button">Versions</button>
      <button class="ps-appbar-button" id="ctReviewButton" type="button">Review <span id="ctReviewBadge" class="ct-app-badge"></span></button>
      <button class="ps-appbar-button" id="ctShareButton" type="button">Share</button>
      <button class="ps-appbar-button" id="ctChecksButton" type="button">Checks <span id="ctChecksBadge" class="ct-app-badge"></span></button>`);
  }

  const designPanel = document.querySelector('[data-ps-inspector-panel="design"]');
  if (designPanel && !document.getElementById("ctMasterSection")) {
    designPanel.insertAdjacentHTML("afterbegin", `
      <section class="ct-master-section" id="ctMasterSection">
        <div class="ps-inspector-title"><strong>Master slide template</strong><small>Reusable, locked company branding for every report.</small></div>
        <div class="ps-control-group">
          <label>Master template<select id="ctMasterSelect"></select></label>
          <label>Template name<input id="ctMasterName" maxlength="50" /></label>
          <label>Font<select id="ctMasterFont"><option value="Inter, Arial, sans-serif">Inter</option><option value="'Roboto Condensed', Arial, sans-serif">Roboto Condensed</option><option value="Arial, sans-serif">Arial</option><option value="Georgia, serif">Georgia</option></select></label>
          <label>Header<input id="ctMasterHeader" maxlength="90" /></label>
          <label>Footer<input id="ctMasterFooter" maxlength="110" /></label>
          <div class="ps-control-row"><label>Accent<input id="ctMasterAccent" type="color" /></label><label>Text<input id="ctMasterText" type="color" /></label></div>
          <label>Logo initials<input id="ctMasterLogoText" maxlength="5" /></label>
          <label class="ct-file-label">Master logo<input id="ctMasterLogo" type="file" accept="image/png,image/jpeg,image/webp" /></label>
          <label class="ps-toggle-line"><span>Lock master branding</span><input id="ctMasterLock" type="checkbox" checked /></label>
          <label class="ps-toggle-line"><span>Apply to title slide</span><input id="ctMasterTitle" type="checkbox" checked /></label>
          <label class="ps-toggle-line"><span>Show page number</span><input id="ctMasterPage" type="checkbox" checked /></label>
          <div class="ct-master-actions"><button class="button secondary" id="ctNewMaster" type="button">New</button><button class="button secondary" id="ctDeleteMaster" type="button">Delete</button><button class="button primary" id="ctSaveMaster" type="button">Save master</button></div>
        </div>
      </section>`);
  }

  const dataPanel = document.querySelector('[data-ps-inspector-panel="data"]');
  if (dataPanel && !document.getElementById("ctLineageInspector")) {
    dataPanel.insertAdjacentHTML("afterbegin", `
      <section class="ct-lineage-inspector" id="ctLineageInspector">
        <div class="ps-inspector-title"><strong>Data source</strong><small>Lineage shown on every chart and KPI.</small></div>
        <div class="ps-control-group">
          <label>Dataset<input id="ctLineageDataset" /></label>
          <label>Last refresh<input id="ctLineageRefresh" /></label>
          <label>Reporting period<input id="ctLineagePeriod" /></label>
          <label>Applied filters<input id="ctLineageFilters" /></label>
          <label>Status<select id="ctLineageStatus"><option>Live</option><option>Uploaded</option><option>Sample</option></select></label>
          <button class="button secondary full" id="ctApplyLineage" type="button">Apply data source details</button>
        </div>
      </section>`);
  }

  if (!document.getElementById("ctEnterpriseModals")) {
    const holder = document.createElement("div");
    holder.id = "ctEnterpriseModals";
    holder.innerHTML = ctModalMarkup();
    document.body.appendChild(holder);
  }
}

function ctBindEnterpriseEvents() {
  const on = (id, event, fn) => document.getElementById(id)?.addEventListener(event, fn);
  on("ctCopyButton", "click", ctCopySelected); on("ctPasteButton", "click", ctPasteElements);
  on("ctGroupButton", "click", ctGroupSelected); on("ctUngroupButton", "click", ctUngroupSelected);
  on("ctForwardButton", "click", ctBringForward); on("ctBackwardButton", "click", ctSendBackward);
  on("ctLockButton", "click", ctToggleLock);
  on("ctSnapButton", "click", () => { ctAdvancedPrefs.snap = !ctAdvancedPrefs.snap; ctSaveAdvancedPrefs(); ctUpdateAdvancedToolbar(); });
  on("ctGridButton", "click", () => { ctAdvancedPrefs.grid = !ctAdvancedPrefs.grid; ctSaveAdvancedPrefs(); renderCurrentSlide(); ctUpdateAdvancedToolbar(); });
  on("ctZoomOut", "click", () => ctSetZoom((ps.data.zoom || 100) - 10));
  on("ctZoomIn", "click", () => ctSetZoom((ps.data.zoom || 100) + 10));
  on("ctVersionsButton", "click", ctOpenVersions);
  on("ctReviewButton", "click", ctOpenReview);
  on("ctShareButton", "click", ctOpenShare);
  on("ctChecksButton", "click", () => ctRunPresentationChecks(true));

  on("ctMasterSelect", "change", event => { ps.data.masterId = event.target.value; savePresentationDeck(); ctRenderMasterControls(); renderPresentationStudio(); });
  on("ctSaveMaster", "click", ctSaveMasterFromControls); on("ctNewMaster", "click", ctCreateMaster); on("ctDeleteMaster", "click", ctDeleteMaster);
  on("ctMasterLogo", "change", ctHandleMasterLogo);
  on("ctApplyLineage", "click", ctApplyLineageControls);

  document.querySelectorAll("[data-ct-close]").forEach(button => button.addEventListener("click", () => ctCloseModal(button.dataset.ctClose)));
  on("ctSaveVersion", "click", ctSaveNamedVersion); on("ctVersionList", "click", ctHandleVersionAction);
  on("ctAddComment", "click", ctAddComment); on("ctCommentList", "click", ctHandleCommentAction);
  on("ctRequestChanges", "click", () => ctSetApproval("changes_requested")); on("ctApproveDeck", "click", () => ctSetApproval("approved")); on("ctFinalIssue", "click", () => ctSetApproval("final")); on("ctReturnDraft", "click", () => ctSetApproval("draft"));
  on("ctPublishShare", "click", ctPublishShare); on("ctShareList", "click", ctHandleShareAction);
  on("ctChecksList", "click", ctHandleCheckAction);
  on("ctOnboardingNext", "click", ctOnboardingNext); on("ctOnboardingBack", "click", ctOnboardingBack); on("ctOnboardingSkip", "click", ctSkipOnboarding);
  on("ctOnboardingUpload", "click", () => { document.getElementById("importButton")?.click(); });
  on("ctViewerPrev", "click", () => ctMoveShareViewer(-1)); on("ctViewerNext", "click", () => ctMoveShareViewer(1));
  on("ctViewerExit", "click", ctCloseShareViewer); on("ctViewerDownload", "click", ctDownloadSharedDeck); on("ctViewerAddComment", "click", ctAddViewerComment);

  ["ctLineageDataset", "ctLineageRefresh", "ctLineagePeriod", "ctLineageFilters", "ctLineageStatus"].forEach(id => on(id, "change", ctApplyLineageControls));
  window.addEventListener("hashchange", ctMaybeOpenShareViewer);
}

/* ---------- Health UI ---------- */
function ctEnsureDualScoreUi() {
  const score = document.querySelector(".insight-score");
  if (!score || document.getElementById("ctReviewScore")) return;
  score.insertAdjacentHTML("afterend", `
    <div class="ct-review-meter">
      <div><strong id="ctReviewScore">0%</strong><span id="ctReviewCaption">Review completion</span></div>
      <div class="ct-review-track"><span id="ctReviewProgress"></span></div>
      <small>Reviewing an insight hides the message; it never changes the operational project-health score.</small>
    </div>
    <div class="ct-health-components" aria-label="Project health dimensions">
      <div data-health-component="cost"><strong>100</strong><small>Cost</small></div>
      <div data-health-component="schedule"><strong>100</strong><small>Schedule</small></div>
      <div data-health-component="safety"><strong>—</strong><small>Connect HSE data</small></div>
      <div data-health-component="risk"><strong>100</strong><small>Risk</small></div>
    </div>`);
}

/* ---------- Master templates ---------- */
function ctActiveMaster() {
  return ctMasters.find(master => master.id === ps.data?.masterId) || ctMasters[0] || ctDefaultMaster;
}

function ctRenderMasterLayer(canvas, slide, options) {
  const master = ctActiveMaster();
  if (!master || (!master.applyToTitle && slide.template === "title")) return;
  const layer = document.createElement("div");
  layer.className = "ct-master-layer";
  layer.style.setProperty("--ct-master-accent", master.accent || "#0d7b69");
  layer.style.setProperty("--ct-master-text", master.text || "#17202a");
  const slideIndex = (ps.data?.slides || []).findIndex(item => item.id === slide.id) + 1;
  const logo = master.logoData ? `<img src="${master.logoData}" alt="" />` : `<span>${escapeHtml(master.logoText || "CV")}</span>`;
  layer.innerHTML = `<div class="ct-master-header"><div class="ct-master-logo">${logo}</div><b>${escapeHtml(master.header || "")}</b></div><div class="ct-master-footer"><span>${escapeHtml(master.footer || "")}</span>${master.showPageNumber ? `<span>${slideIndex || ""}</span>` : ""}</div>`;
  canvas.appendChild(layer);
}

function ctRenderMasterControls() {
  const select = document.getElementById("ctMasterSelect");
  if (!select || !ps.data) return;
  select.innerHTML = ctMasters.map(master => `<option value="${escapeHtml(master.id)}">${escapeHtml(master.name)}</option>`).join("");
  if (!ctMasters.some(master => master.id === ps.data.masterId)) ps.data.masterId = ctMasters[0].id;
  select.value = ps.data.masterId;
  const master = ctActiveMaster();
  ctSetValue("ctMasterName", master.name); ctSetValue("ctMasterFont", master.font); ctSetValue("ctMasterHeader", master.header); ctSetValue("ctMasterFooter", master.footer);
  ctSetValue("ctMasterAccent", master.accent); ctSetValue("ctMasterText", master.text); ctSetValue("ctMasterLogoText", master.logoText);
  ctSetChecked("ctMasterLock", master.lockBranding); ctSetChecked("ctMasterTitle", master.applyToTitle); ctSetChecked("ctMasterPage", master.showPageNumber);
  const deleteButton = document.getElementById("ctDeleteMaster"); if (deleteButton) deleteButton.disabled = ctMasters.length <= 1;
}

function ctSaveMasterFromControls() {
  const master = ctActiveMaster();
  if (!master) return;
  Object.assign(master, {
    name: ctValue("ctMasterName") || "Company master",
    font: ctValue("ctMasterFont") || "Inter, Arial, sans-serif",
    header: ctValue("ctMasterHeader"), footer: ctValue("ctMasterFooter"), accent: ctValue("ctMasterAccent") || "#0d7b69", text: ctValue("ctMasterText") || "#17202a",
    logoText: ctValue("ctMasterLogoText") || "CV", lockBranding: ctChecked("ctMasterLock"), applyToTitle: ctChecked("ctMasterTitle"), showPageNumber: ctChecked("ctMasterPage")
  });
  ctPersistMasters(); renderPresentationStudio(); psToast("Master template saved and applied to the deck.");
}

function ctCreateMaster() {
  const source = ctActiveMaster();
  const master = { ...clone(source), id: uid("master"), name: `${source.name} copy` };
  ctMasters.push(master); ps.data.masterId = master.id; ctPersistMasters(); savePresentationDeck(); ctRenderMasterControls(); renderPresentationStudio();
}

function ctDeleteMaster() {
  if (ctMasters.length <= 1) return;
  const master = ctActiveMaster();
  if (!confirm(`Delete the master template “${master.name}”?`)) return;
  ctMasters = ctMasters.filter(item => item.id !== master.id); ps.data.masterId = ctMasters[0].id; ctPersistMasters(); savePresentationDeck(); ctRenderMasterControls(); renderPresentationStudio();
}

function ctHandleMasterLogo(event) {
  const file = event.target.files?.[0]; event.target.value = "";
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader(); reader.onload = () => { ctActiveMaster().logoData = reader.result; ctPersistMasters(); renderPresentationStudio(); }; reader.readAsDataURL(file);
}
function ctPersistMasters() { localStorage.setItem(CT_MASTER_KEY, JSON.stringify(ctMasters)); }

/* ---------- Selection and editor commands ---------- */
function ctSelectedIds() {
  if (!Array.isArray(ps.selectedElementIds)) ps.selectedElementIds = ps.selectedElementId ? [ps.selectedElementId] : [];
  return ps.selectedElementIds.filter(id => findElement(id));
}
function ctSelectedElements() { return ctSelectedIds().map(findElement).filter(Boolean); }
function ctSelectAllElements() { ps.selectedElementIds = currentSlide()?.elements.filter(item => !item.locked).map(item => item.id) || []; ps.selectedElementId = ps.selectedElementIds[0] || null; renderPresentationStudio(); }
function ctCopySelected() { const items = ctSelectedElements(); if (!items.length) return; ctClipboard = clone(items); psToast(`${items.length} element${items.length === 1 ? "" : "s"} copied.`); ctUpdateAdvancedToolbar(); }
function ctPasteElements() {
  const slide = currentSlide(); if (!slide || !ctClipboard.length) return;
  const groupMap = new Map();
  const copies = ctClipboard.map(item => {
    let groupId = "";
    if (item.groupId) { if (!groupMap.has(item.groupId)) groupMap.set(item.groupId, uid("group")); groupId = groupMap.get(item.groupId); }
    return { ...clone(item), id: uid("element"), x: clamp(item.x + 3, 0, 100 - item.w), y: clamp(item.y + 3, 0, 100 - item.h), groupId };
  });
  withHistory(() => slide.elements.push(...copies)); ps.selectedElementIds = copies.map(item => item.id); ps.selectedElementId = copies[0]?.id || null; renderPresentationStudio();
}
function ctDuplicateSelection() { ctCopySelected(); ctPasteElements(); }
function ctDeleteSelection() { const ids = new Set(ctSelectedIds()); if (!ids.size) return; withHistory(() => currentSlide().elements = currentSlide().elements.filter(item => !ids.has(item.id) || item.locked)); ps.selectedElementIds = []; ps.selectedElementId = null; renderPresentationStudio(); }
function ctGroupSelected() { const items = ctSelectedElements(); if (items.length < 2) return psToast("Select at least two elements to group."); const groupId = uid("group"); withHistory(() => items.forEach(item => item.groupId = groupId)); renderPresentationStudio(); psToast("Elements grouped."); }
function ctUngroupSelected() { const items = ctSelectedElements(); if (!items.some(item => item.groupId)) return; withHistory(() => items.forEach(item => item.groupId = "")); renderPresentationStudio(); psToast("Elements ungrouped."); }
function ctBringForward() { ctMoveZ(1); }
function ctSendBackward() { ctMoveZ(-1); }
function ctMoveZ(direction) {
  const slide = currentSlide(); const ids = new Set(ctSelectedIds()); if (!slide || !ids.size) return;
  withHistory(() => {
    if (direction > 0) { for (let i = slide.elements.length - 2; i >= 0; i--) if (ids.has(slide.elements[i].id) && !ids.has(slide.elements[i + 1].id)) [slide.elements[i], slide.elements[i + 1]] = [slide.elements[i + 1], slide.elements[i]]; }
    else { for (let i = 1; i < slide.elements.length; i++) if (ids.has(slide.elements[i].id) && !ids.has(slide.elements[i - 1].id)) [slide.elements[i], slide.elements[i - 1]] = [slide.elements[i - 1], slide.elements[i]]; }
  }); renderPresentationStudio();
}
function ctToggleLock() { const items = ctSelectedElements(); if (!items.length) return; const shouldLock = items.some(item => !item.locked); withHistory(() => items.forEach(item => item.locked = shouldLock)); renderPresentationStudio(); psToast(shouldLock ? "Selection locked." : "Selection unlocked."); }
function ctNudgeSelection(key, amount) { const items = ctSelectedElements().filter(item => !item.locked); if (!items.length) return; const before = snapshotDeck(); items.forEach(item => { if (key === "arrowleft") item.x = clamp(item.x - amount, 0, 100 - item.w); if (key === "arrowright") item.x = clamp(item.x + amount, 0, 100 - item.w); if (key === "arrowup") item.y = clamp(item.y - amount, 0, 100 - item.h); if (key === "arrowdown") item.y = clamp(item.y + amount, 0, 100 - item.h); }); commitSnapshot(before); savePresentationDeck(); renderPresentationStudio(); }
function ctSetZoom(value) { ps.data.zoom = clamp(value, 30, 200); if (pse.psZoomRange) pse.psZoomRange.value = ps.data.zoom; applyCanvasZoom(); schedulePresentationSave(); }
function ctSaveAdvancedPrefs() { localStorage.setItem(CT_EDITOR_ADVANCED_KEY, JSON.stringify(ctAdvancedPrefs)); }
function ctUpdateAdvancedToolbar() {
  document.getElementById("ctSnapButton")?.classList.toggle("active", ctAdvancedPrefs.snap);
  document.getElementById("ctGridButton")?.classList.toggle("active", ctAdvancedPrefs.grid);
  const items = ctSelectedElements();
  const lock = document.getElementById("ctLockButton"); if (lock) { const allLocked = items.length && items.every(item => item.locked); lock.classList.toggle("active", allLocked); const icon = lock.querySelector(".ps-ppt-command-icon"); const label = lock.querySelector("b"); if (icon) icon.textContent = allLocked ? "🔓" : "🔒"; else lock.textContent = allLocked ? "🔓" : "🔒"; if (label) label.textContent = allLocked ? "Unlock" : "Lock"; }
  ["ctGroupButton", "ctUngroupButton", "ctForwardButton", "ctBackwardButton", "ctCopyButton"].forEach(id => { const button = document.getElementById(id); if (button) button.disabled = !items.length; });
  const paste = document.getElementById("ctPasteButton"); if (paste) paste.disabled = !ctClipboard.length;
}
function ctSnap(value) { const size = Number(ctAdvancedPrefs.gridSize) || 2; return Math.round(value / size) * size; }
function ctUpdateElementNode(element) { const node = pse.psSlideCanvas.querySelector(`[data-element-id="${cssEscape(element.id)}"]`); if (!node) return; node.style.left = `${element.x}%`; node.style.top = `${element.y}%`; node.style.width = `${element.w}%`; node.style.height = `${element.h}%`; }
function ctFindAlignment(primary, x, y) {
  const threshold = .65; const guides = []; const others = currentSlide().elements.filter(item => item.id !== primary.id && !ctSelectedIds().includes(item.id));
  let outX = x, outY = y;
  const targetX = [x, x + primary.w / 2, x + primary.w]; const targetY = [y, y + primary.h / 2, y + primary.h];
  for (const other of others) {
    const xs = [other.x, other.x + other.w / 2, other.x + other.w]; const ys = [other.y, other.y + other.h / 2, other.y + other.h];
    targetX.forEach((target, ti) => xs.forEach(candidate => { if (Math.abs(target - candidate) <= threshold) { outX += candidate - target; guides.push({ axis: "x", value: candidate }); } }));
    targetY.forEach((target, ti) => ys.forEach(candidate => { if (Math.abs(target - candidate) <= threshold) { outY += candidate - target; guides.push({ axis: "y", value: candidate }); } }));
    if (guides.length) break;
  }
  return { x: clamp(outX, 0, 100 - primary.w), y: clamp(outY, 0, 100 - primary.h), guides };
}
function ctShowAlignmentGuides(guides) { ctClearAlignmentGuides(); guides.slice(0, 2).forEach(guide => { const line = document.createElement("div"); line.className = `ct-alignment-guide ${guide.axis}`; if (guide.axis === "x") line.style.left = `${guide.value}%`; else line.style.top = `${guide.value}%`; pse.psSlideCanvas.appendChild(line); }); }
function ctClearAlignmentGuides() { pse.psSlideCanvas?.querySelectorAll(".ct-alignment-guide").forEach(node => node.remove()); }

/* ---------- Data lineage ---------- */
function ctCurrentSourceMeta(type, element = {}) {
  let rows = [];
  try { rows = state.rows || []; } catch (_) {}
  const first = rows[0]?.date; const last = rows[rows.length - 1]?.date;
  let imported = false; try { imported = Boolean(state.importHistory?.length); } catch (_) {}
  const sourceMap = { category: "Cost and cash flow", cost: "Project performance", progress: "Schedule and milestones", labour: "Labour and productivity", risk: "Risk and issues" };
  const dataset = type === "table" ? "Work package status" : sourceMap[element.source || "progress"] || "Project performance";
  return {
    dataset,
    lastRefresh: last ? formatDate(last) : "No refresh",
    period: first && last ? `${formatDate(first)} – ${formatDate(last)}` : "Current reporting period",
    filters: "All project records",
    status: imported ? "Uploaded" : "Sample"
  };
}
function ctRenderDataLineageInspector(element) {
  const section = document.getElementById("ctLineageInspector"); if (!section) return;
  const supports = element && ["kpi", "chart", "progress", "comparison", "table"].includes(element.type);
  section.classList.toggle("disabled", !supports);
  section.querySelectorAll("input,select,button").forEach(control => control.disabled = !supports);
  if (!supports) return;
  const meta = { ...ctCurrentSourceMeta(element.type, element), ...(element.sourceMeta || {}) };
  ctSetValue("ctLineageDataset", meta.dataset); ctSetValue("ctLineageRefresh", meta.lastRefresh); ctSetValue("ctLineagePeriod", meta.period); ctSetValue("ctLineageFilters", meta.filters); ctSetValue("ctLineageStatus", meta.status);
}
function ctApplyLineageControls() {
  const element = selectedElement(); if (!element || !["kpi", "chart", "progress", "comparison", "table"].includes(element.type)) return;
  withHistory(() => element.sourceMeta = { dataset: ctValue("ctLineageDataset"), lastRefresh: ctValue("ctLineageRefresh"), period: ctValue("ctLineagePeriod"), filters: ctValue("ctLineageFilters"), status: ctValue("ctLineageStatus") });
  renderPresentationStudio();
}
function ctRenderDashboardLineage() {
  let meta; try { meta = ctCurrentSourceMeta("chart", { source: "progress" }); } catch (_) { return; }
  document.querySelectorAll(".kpi-card,.chart-panel").forEach(card => {
    let line = card.querySelector(".ct-dashboard-lineage"); if (!line) { line = document.createElement("div"); line.className = "ct-dashboard-lineage"; card.appendChild(line); }
    line.title = `Dataset: ${meta.dataset}\nLast refresh: ${meta.lastRefresh}\nReporting period: ${meta.period}\nFilters: ${meta.filters}\nStatus: ${meta.status}`;
    line.innerHTML = `<span class="ct-source-status ${meta.status.toLowerCase()}"></span><b>${escapeHtml(meta.dataset)}</b><span>${escapeHtml(meta.status)}</span><span>${escapeHtml(meta.lastRefresh)}</span>`;
  });
}

/* ---------- Versions ---------- */
function ctOpenVersions() { ctRenderVersions(); ctOpenModal("ctVersionsModal"); }
function ctRenderVersions() {
  const list = document.getElementById("ctVersionList"); if (!list) return;
  list.innerHTML = ctVersions.length ? ctVersions.map(version => `<article class="ct-version-card" data-version-id="${escapeHtml(version.id)}"><div><span class="ct-version-status ${version.status}">${escapeHtml(ctStatusLabel(version.status))}</span><strong>${escapeHtml(version.name)}</strong><small>${new Date(version.createdAt).toLocaleString("en-ZA")} · ${escapeHtml(version.author || "Local user")}</small></div><div class="ct-card-actions"><button data-version-action="compare">Compare</button><button data-version-action="duplicate">Duplicate</button><button data-version-action="restore">Restore</button><button data-version-action="delete" class="danger">Delete</button></div></article>`).join("") : `<div class="ct-empty-state"><strong>No saved versions</strong><p>Save a named milestone such as Draft 1, Client review, Approved report, or Final issued report.</p></div>`;
}
function ctSaveNamedVersion() {
  const name = ctValue("ctVersionName") || `Version ${ctVersions.length + 1}`; const status = ctValue("ctVersionStatus") || "draft"; const author = ctValue("ctVersionAuthor") || "Local user";
  ctVersions.unshift({ id: uid("version"), name, status, author, createdAt: new Date().toISOString(), snapshot: clone(ps.data) });
  localStorage.setItem(CT_VERSIONS_KEY, JSON.stringify(ctVersions)); ctRenderVersions(); psToast(`Version “${name}” saved.`);
}
function ctHandleVersionAction(event) {
  const button = event.target.closest("[data-version-action]"); const card = event.target.closest("[data-version-id]"); if (!button || !card) return;
  const version = ctVersions.find(item => item.id === card.dataset.versionId); if (!version) return;
  const action = button.dataset.versionAction;
  if (action === "restore") { if (!confirm(`Restore “${version.name}”? The current deck remains available through Undo until refresh.`)) return; ps.undo.push(snapshotDeck()); ps.data = normalizePresentationDeck(clone(version.snapshot)); ps.selectedElementId = null; ps.selectedElementIds = []; savePresentationDeck(); renderPresentationStudio(); ctCloseModal("ctVersionsModal"); }
  if (action === "duplicate") { ctVersions.unshift({ ...clone(version), id: uid("version"), name: `${version.name} copy`, createdAt: new Date().toISOString() }); localStorage.setItem(CT_VERSIONS_KEY, JSON.stringify(ctVersions)); ctRenderVersions(); }
  if (action === "delete") { ctVersions = ctVersions.filter(item => item.id !== version.id); localStorage.setItem(CT_VERSIONS_KEY, JSON.stringify(ctVersions)); ctRenderVersions(); }
  if (action === "compare") ctShowVersionComparison(version);
}
function ctShowVersionComparison(version) {
  const current = ps.data; const previous = version.snapshot;
  const currentElements = current.slides.reduce((sum, slide) => sum + slide.elements.length, 0); const previousElements = previous.slides.reduce((sum, slide) => sum + slide.elements.length, 0);
  const changedSlides = current.slides.filter(slide => JSON.stringify(slide) !== JSON.stringify(previous.slides.find(item => item.id === slide.id))).length;
  document.getElementById("ctVersionCompareBody").innerHTML = `<div class="ct-compare-grid"><div><small>Saved version</small><strong>${escapeHtml(version.name)}</strong><span>${previous.slides.length} slides</span><span>${previousElements} elements</span><span>Theme: ${escapeHtml(previous.theme)}</span></div><div><small>Current deck</small><strong>${escapeHtml(current.name)}</strong><span>${current.slides.length} slides</span><span>${currentElements} elements</span><span>Theme: ${escapeHtml(current.theme)}</span></div></div><div class="ct-diff-summary"><b>${changedSlides} slide${changedSlides === 1 ? "" : "s"} changed</b><span>${current.slides.length - previous.slides.length >= 0 ? "+" : ""}${current.slides.length - previous.slides.length} slides</span><span>${currentElements - previousElements >= 0 ? "+" : ""}${currentElements - previousElements} elements</span><span>${(current.comments || []).length - (previous.comments || []).length >= 0 ? "+" : ""}${(current.comments || []).length - (previous.comments || []).length} comments</span></div>`;
  ctOpenModal("ctVersionCompareModal");
}

/* ---------- Comments and approvals ---------- */
function ctOpenReview() { ctRenderReview(); ctOpenModal("ctReviewModal"); }
function ctRenderReview() {
  const workflow = ps.data.workflow || { status: "draft", history: [] }; ctSetValue("ctReviewerName", workflow.reviewer || "Project Manager");
  const status = document.getElementById("ctApprovalStatus"); if (status) { status.className = `ct-approval-status ${workflow.status}`; status.textContent = ctStatusLabel(workflow.status); }
  const comments = (ps.data.comments || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const list = document.getElementById("ctCommentList"); if (list) list.innerHTML = comments.length ? comments.map(comment => `<article class="ct-comment-card ${comment.resolved ? "resolved" : ""}" data-comment-id="${escapeHtml(comment.id)}"><div><strong>${escapeHtml(comment.author)}</strong><small>${escapeHtml(ps.data.slides.find(slide => slide.id === comment.slideId)?.title || "Deleted slide")} · ${new Date(comment.createdAt).toLocaleString("en-ZA")}</small><p>${escapeHtml(comment.text)}</p></div><div class="ct-card-actions"><button data-comment-action="goto">Go to slide</button><button data-comment-action="resolve">${comment.resolved ? "Reopen" : "Resolve"}</button><button data-comment-action="delete" class="danger">Delete</button></div></article>`).join("") : `<div class="ct-empty-state"><strong>No comments</strong><p>Add review notes to the current slide or selected element.</p></div>`;
  const history = document.getElementById("ctApprovalHistory"); if (history) history.innerHTML = (workflow.history || []).slice().reverse().map(item => `<li><b>${escapeHtml(ctStatusLabel(item.status))}</b><span>${escapeHtml(item.reviewer)} · ${new Date(item.at).toLocaleString("en-ZA")}</span></li>`).join("") || `<li><span>No approval activity yet.</span></li>`;
  ctRenderWorkflowStatus();
}
function ctAddComment() {
  const text = ctValue("ctCommentText").trim(); if (!text) return;
  const author = ctValue("ctReviewerName") || "Project Manager"; const slide = currentSlide(); if (!slide) return;
  ps.data.comments ||= []; ps.data.comments.push({ id: uid("comment"), slideId: slide.id, elementId: ps.selectedElementId || "", text, author, createdAt: new Date().toISOString(), resolved: false });
  ps.data.workflow.reviewer = author; savePresentationDeck(); ctSetValue("ctCommentText", ""); ctRenderReview(); renderSlideList(); psToast("Comment added.");
}
function ctHandleCommentAction(event) {
  const button = event.target.closest("[data-comment-action]"); const card = event.target.closest("[data-comment-id]"); if (!button || !card) return;
  const comment = ps.data.comments.find(item => item.id === card.dataset.commentId); if (!comment) return;
  if (button.dataset.commentAction === "resolve") comment.resolved = !comment.resolved;
  if (button.dataset.commentAction === "delete") ps.data.comments = ps.data.comments.filter(item => item.id !== comment.id);
  if (button.dataset.commentAction === "goto") { ps.data.currentSlideId = comment.slideId; ps.selectedElementId = comment.elementId || null; ps.selectedElementIds = comment.elementId ? [comment.elementId] : []; ctCloseModal("ctReviewModal"); renderPresentationStudio(); return; }
  savePresentationDeck(); ctRenderReview(); renderSlideList();
}
function ctSetApproval(status) {
  const reviewer = ctValue("ctReviewerName") || "Project Manager"; const note = ctValue("ctApprovalNote") || "";
  ps.data.workflow ||= { history: [] }; ps.data.workflow.status = status; ps.data.workflow.reviewer = reviewer; ps.data.workflow.updatedAt = new Date().toISOString(); ps.data.workflow.history ||= []; ps.data.workflow.history.push({ status, reviewer, note, at: new Date().toISOString() });
  savePresentationDeck(); ctRenderReview(); ctRenderWorkflowStatus();
  if (["approved", "final"].includes(status)) { const versionName = status === "final" ? "Final issued report" : "Approved report"; ctVersions.unshift({ id: uid("version"), name: versionName, status, author: reviewer, createdAt: new Date().toISOString(), snapshot: clone(ps.data) }); localStorage.setItem(CT_VERSIONS_KEY, JSON.stringify(ctVersions)); }
  psToast(`Presentation marked ${ctStatusLabel(status).toLowerCase()}.`);
}
function ctRenderWorkflowStatus() {
  const badge = document.getElementById("ctReviewBadge"); if (!badge || !ps.data) return;
  const open = (ps.data.comments || []).filter(comment => !comment.resolved).length; badge.textContent = open || ""; badge.hidden = !open;
  const status = ps.data.workflow?.status || "draft"; document.getElementById("ctReviewButton")?.setAttribute("data-status", status);
}

/* ---------- Share links and read-only viewer ---------- */
function ctOpenShare() { ctRenderShareList(); ctOpenModal("ctShareModal"); }
async function ctPublishShare() {
  const password = ctValue("ctSharePassword"); const expiryDays = Number(ctValue("ctShareExpiry")) || 7; const allowDownload = ctChecked("ctShareDownloads"); const allowComments = ctChecked("ctShareComments");
  const shareId = uid("share"); const expiresAt = new Date(Date.now() + expiryDays * 86400000).toISOString();
  const deck = clone(ps.data); let photosRemoved = 0;
  deck.slides.forEach(slide => slide.elements.forEach(element => { if (element.type === "photo" && typeof element.src === "string" && element.src.length > 220000) { element.src = ""; photosRemoved += 1; } }));
  const payload = { shareId, deck, master: ctActiveMaster(), settings: { expiresAt, allowDownload, allowComments, protected: Boolean(password) }, publishedAt: new Date().toISOString() };
  const encrypted = await ctEncryptSharePayload(payload, password || "");
  const link = `${location.origin}${location.pathname}#ctshare=${encrypted}`;
  if (link.length > 120000) return psToast("This deck is too large for a browser share link. Remove or compress photographs, then publish again.");
  ctShares.unshift({ id: shareId, name: ps.data.name, link, createdAt: new Date().toISOString(), expiresAt, allowDownload, allowComments, protected: Boolean(password), photosRemoved });
  localStorage.setItem(CT_SHARES_KEY, JSON.stringify(ctShares));
  ctSetValue("ctShareLink", link); document.getElementById("ctShareResult").hidden = false; ctRenderShareList();
  try { await navigator.clipboard.writeText(link); psToast(`Read-only link copied${photosRemoved ? `; ${photosRemoved} large photo${photosRemoved === 1 ? " was" : "s were"} replaced with placeholders` : ""}.`); } catch (_) { psToast("Share link created. Copy it from the field."); }
}
function ctRenderShareList() {
  const list = document.getElementById("ctShareList"); if (!list) return;
  list.innerHTML = ctShares.length ? ctShares.map(share => { const views = Number(localStorage.getItem(`ct_share_views_${share.id}`) || 0); const comments = ctLoadJson(`ct_share_comments_${share.id}`, []).length; return `<article class="ct-share-card" data-share-id="${escapeHtml(share.id)}"><div><strong>${escapeHtml(share.name)}</strong><small>Expires ${new Date(share.expiresAt).toLocaleDateString("en-ZA")} · ${share.protected ? "Password protected" : "No password"}</small><span>${views} local view${views === 1 ? "" : "s"} · ${comments} local client comment${comments === 1 ? "" : "s"}${share.photosRemoved ? ` · ${share.photosRemoved} photo placeholder${share.photosRemoved === 1 ? "" : "s"}` : ""}</span></div><div class="ct-card-actions"><button data-share-action="copy">Copy link</button><button data-share-action="open">Open</button><button data-share-action="delete" class="danger">Revoke locally</button></div></article>`; }).join("") : `<div class="ct-empty-state"><strong>No published links</strong><p>Create a password-protected, expiring read-only link. In this static prototype, view counts and client comments are stored only in the browser that opens the link.</p></div>`;
}
async function ctHandleShareAction(event) {
  const button = event.target.closest("[data-share-action]"); const card = event.target.closest("[data-share-id]"); if (!button || !card) return;
  const share = ctShares.find(item => item.id === card.dataset.shareId); if (!share) return;
  if (button.dataset.shareAction === "copy") { try { await navigator.clipboard.writeText(share.link); psToast("Share link copied."); } catch (_) { prompt("Copy share link", share.link); } }
  if (button.dataset.shareAction === "open") window.open(share.link, "_blank", "noopener");
  if (button.dataset.shareAction === "delete") { ctShares = ctShares.filter(item => item.id !== share.id); localStorage.setItem(CT_SHARES_KEY, JSON.stringify(ctShares)); ctRenderShareList(); }
}
async function ctMaybeOpenShareViewer() {
  if (!location.hash.startsWith("#ctshare=")) return;
  const token = location.hash.slice("#ctshare=".length); let password = "";
  if (token.startsWith("p.")) password = prompt("Enter the presentation password") || "";
  try {
    const payload = await ctDecryptSharePayload(token, password);
    if (new Date(payload.settings.expiresAt) < new Date()) throw new Error("This presentation link has expired.");
    ps.data = normalizePresentationDeck(payload.deck); if (payload.master && !ctMasters.some(item => item.id === payload.master.id)) ctMasters.push(payload.master); ps.data.masterId = payload.master?.id || ps.data.masterId;
    window.ctActiveSharePayload = payload; window.ctShareViewerIndex = 0;
    localStorage.setItem(`ct_share_views_${payload.shareId}`, String(Number(localStorage.getItem(`ct_share_views_${payload.shareId}`) || 0) + 1));
    ctOpenShareViewer(payload);
  } catch (error) { alert(error.message || "The share link could not be opened."); location.hash = ""; }
}
function ctOpenShareViewer(payload) {
  const viewer = document.getElementById("ctShareViewer"); viewer.classList.add("open"); viewer.setAttribute("aria-hidden", "false"); document.body.classList.add("ct-share-viewing");
  document.getElementById("ctViewerTitle").textContent = payload.deck.name; document.getElementById("ctViewerDownload").hidden = !payload.settings.allowDownload; document.getElementById("ctViewerCommentBox").hidden = !payload.settings.allowComments; ctRenderShareViewerSlide();
}
function ctRenderShareViewerSlide() {
  const payload = window.ctActiveSharePayload; if (!payload) return; const slides = payload.deck.slides.filter(slide => !slide.hidden); window.ctShareViewerIndex = clamp(window.ctShareViewerIndex || 0, 0, slides.length - 1); const slide = slides[window.ctShareViewerIndex];
  const stage = document.getElementById("ctShareViewerStage"); stage.innerHTML = ""; const canvas = document.createElement("div"); canvas.className = "ps-slide-canvas"; stage.appendChild(canvas); renderSlideInto(slide, canvas, { interactive: false, chartBucket: [] }); document.getElementById("ctViewerCounter").textContent = `${window.ctShareViewerIndex + 1} / ${slides.length}`;
}
function ctMoveShareViewer(direction) { window.ctShareViewerIndex = (window.ctShareViewerIndex || 0) + direction; ctRenderShareViewerSlide(); }
function ctCloseShareViewer() { document.getElementById("ctShareViewer")?.classList.remove("open"); document.body.classList.remove("ct-share-viewing"); location.hash = ""; }
async function ctDownloadSharedDeck() { const payload = window.ctActiveSharePayload; if (!payload?.settings.allowDownload) return; const options = { slides: payload.deck.slides.filter(slide => !slide.hidden), layout: payload.deck.ratio, quality: 2, includeNotes: false, pageNumbers: true, watermark: "", fileName: sanitizeFileName(payload.deck.name) }; const captures = await capturePresentationSlides(options); await exportPresentationPptx(captures, options); }
function ctAddViewerComment() { const payload = window.ctActiveSharePayload; const text = ctValue("ctViewerComment").trim(); if (!payload?.settings.allowComments || !text) return; const comments = ctLoadJson(`ct_share_comments_${payload.shareId}`, []); comments.push({ text, slideIndex: window.ctShareViewerIndex || 0, createdAt: new Date().toISOString(), author: ctValue("ctViewerName") || "Client reviewer" }); localStorage.setItem(`ct_share_comments_${payload.shareId}`, JSON.stringify(comments)); ctSetValue("ctViewerComment", ""); document.getElementById("ctViewerCommentStatus").textContent = "Comment saved in this browser."; }

async function ctEncryptSharePayload(payload, password) {
  const protectedFlag = password ? "p" : "n"; const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12)); const data = new TextEncoder().encode(JSON.stringify(payload)); const packed = await ctCompress(data); const key = await ctDeriveKey(password || "civentraq-public-link", salt, ["encrypt"]); const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, packed); return `${protectedFlag}.${ctB64(salt)}.${ctB64(iv)}.${ctB64(new Uint8Array(encrypted))}`;
}
async function ctDecryptSharePayload(token, password) { const [flag, saltText, ivText, encryptedText] = token.split("."); if (!encryptedText) throw new Error("Invalid presentation link."); const key = await ctDeriveKey((flag === "p" ? password : "civentraq-public-link") || "", ctFromB64(saltText), ["decrypt"]); let decrypted; try { decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ctFromB64(ivText) }, key, ctFromB64(encryptedText)); } catch (_) { throw new Error("The password is incorrect or the link is damaged."); } const unpacked = await ctDecompress(new Uint8Array(decrypted)); return JSON.parse(new TextDecoder().decode(unpacked)); }
async function ctDeriveKey(password, salt, usages) { const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]); return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, usages); }
async function ctCompress(bytes) { if (typeof CompressionStream === "undefined") return bytes; const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip")); return new Uint8Array(await new Response(stream).arrayBuffer()); }
async function ctDecompress(bytes) { if (typeof DecompressionStream === "undefined" || !(bytes[0] === 31 && bytes[1] === 139)) return bytes; const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip")); return new Uint8Array(await new Response(stream).arrayBuffer()); }
function ctB64(bytes) { let string = ""; bytes.forEach(byte => string += String.fromCharCode(byte)); return btoa(string).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }
function ctFromB64(text) { const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4); const string = atob(padded); return Uint8Array.from(string, char => char.charCodeAt(0)); }

/* ---------- Onboarding ---------- */
let ctOnboardingStep = 0;
function ctMaybeOpenOnboarding() { if (localStorage.getItem(CT_ONBOARDING_KEY)) return; ctOnboardingStep = 0; ctPopulateOnboarding(); ctOpenModal("ctOnboardingModal"); }
function ctPopulateOnboarding() { ctSetValue("ctOnboardProject", state.project.name); ctSetValue("ctOnboardClient", state.project.client); ctSetValue("ctOnboardLocation", state.project.location); ctSetValue("ctOnboardBudget", state.project.approvedBudget); ctRenderOnboardingStep(); }
function ctRenderOnboardingStep() {
  document.querySelectorAll("[data-ct-onboard-step]").forEach((panel, index) => panel.classList.toggle("active", Number(panel.dataset.ctOnboardStep) === ctOnboardingStep));
  document.querySelectorAll(".ct-onboard-progress span").forEach((dot, index) => dot.classList.toggle("active", index <= ctOnboardingStep));
  const back = document.getElementById("ctOnboardingBack"); if (back) back.disabled = ctOnboardingStep === 0;
  const next = document.getElementById("ctOnboardingNext"); if (next) next.textContent = ctOnboardingStep === 4 ? "Generate presentation" : "Continue";
  if (ctOnboardingStep === 1) document.getElementById("ctOnboardUploadStatus").textContent = state.importHistory.length ? `${state.importHistory.length} file import${state.importHistory.length === 1 ? "" : "s"} available` : "Sample data is currently active";
  if (ctOnboardingStep === 2) document.getElementById("ctOnboardMappingStatus").innerHTML = `<b>${state.rows.length} rows ready</b><span>Reporting date, actual cost, actual progress, labour hours, and risk are available for reporting.</span>`;
}
function ctOnboardingNext() {
  if (ctOnboardingStep === 0) { state.project.name = ctValue("ctOnboardProject") || state.project.name; state.project.client = ctValue("ctOnboardClient") || state.project.client; state.project.location = ctValue("ctOnboardLocation") || state.project.location; state.project.approvedBudget = Number(ctValue("ctOnboardBudget")) || state.project.approvedBudget; saveState(); renderAll(); }
  if (ctOnboardingStep < 4) { ctOnboardingStep += 1; ctRenderOnboardingStep(); return; }
  const template = document.querySelector('input[name="ctOnboardTemplate"]:checked')?.value || "full"; ps.data = createDefaultPresentationDeck();
  if (template !== "full") { const keep = { executive: ["title", "executive", "blank"], cost: ["title", "chart", "blank"], schedule: ["title", "chart", "blank"], photos: ["title", "photos", "blank"] }[template]; ps.data.slides = ps.data.slides.filter(slide => keep.includes(slide.template)); ps.data.currentSlideId = ps.data.slides[0].id; }
  savePresentationDeck(); localStorage.setItem(CT_ONBOARDING_KEY, "true"); ctCloseModal("ctOnboardingModal"); document.querySelector('[data-view="presentation"]')?.click(); psToast("Your first presentation workspace is ready.");
}
function ctOnboardingBack() { if (ctOnboardingStep > 0) { ctOnboardingStep -= 1; ctRenderOnboardingStep(); } }
function ctSkipOnboarding() { localStorage.setItem(CT_ONBOARDING_KEY, "true"); ctCloseModal("ctOnboardingModal"); }

/* ---------- Automatic presentation checks ---------- */
async function ctRunPresentationChecks(showModal = true) {
  const issues = [];
  const add = (severity, type, message, slideId = "") => issues.push({ id: uid("check"), severity, type, message, slideId });
  const slides = ps.data?.slides || [];
  slides.forEach(slide => {
    const useful = slide.elements.filter(element => {
      if (["title", "text", "ai_summary", "annotation"].includes(element.type)) return Boolean((element.text || "").trim());
      if (element.type === "photo") return Boolean(element.src);
      return true;
    });
    if (!useful.length) add("error", "Empty slide", `“${slide.title}” has no presentation content.`, slide.id);
    slide.elements.filter(element => element.type === "chart").forEach(element => { if (!(element.title || "").trim()) add("error", "Missing chart title", `A chart on “${slide.title}” has no title.`, slide.id); });
    slide.elements.filter(element => ["chart", "kpi"].includes(element.type)).forEach(element => { const meta = element.sourceMeta; if (!meta?.dataset || !meta?.lastRefresh) add("warning", "Missing data source", `A ${element.type} on “${slide.title}” is missing source details.`, slide.id); });
  });
  const latest = state.rows?.[state.rows.length - 1]?.date; if (latest) { const age = Math.floor((Date.now() - new Date(latest).getTime()) / 86400000); if (age > 45) add(age > 90 ? "error" : "warning", "Old dataset", `The project-performance dataset was last refreshed ${age} days ago.`); }
  const unresolved = (ps.data.comments || []).filter(comment => !comment.resolved); if (unresolved.length) add("warning", "Unresolved comments", `${unresolved.length} review comment${unresolved.length === 1 ? " is" : "s are"} still unresolved.`);
  const colors = new Set(); slides.forEach(slide => slide.elements.forEach(element => [element.background, element.color, element.borderColor].filter(value => value && value !== "transparent").forEach(value => colors.add(value.toLowerCase())))); if (colors.size > 10) add("warning", "Inconsistent colours", `${colors.size} custom colours are used. Consider applying the master template palette.`);
  for (const slide of slides) for (const element of slide.elements.filter(item => item.type === "photo" && item.src)) { const dims = await ctImageDimensions(element.src); if (dims && (dims.width < 900 || dims.height < 500)) add("warning", "Low-resolution photo", `A photo on “${slide.title}” is only ${dims.width} × ${dims.height}px.`, slide.id); }
  const overflows = await ctDetectTextOverflow(slides); overflows.forEach(item => add("error", "Text overflowing", `${item.type} content is clipped on “${item.slideTitle}”.`, item.slideId));
  ctLastChecks = issues; ctRenderChecks(issues); ctUpdateCheckBadge(issues); if (showModal) ctOpenModal("ctChecksModal"); return issues;
}
function ctRenderChecks(issues) { const list = document.getElementById("ctChecksList"); if (!list) return; list.innerHTML = issues.length ? issues.map(issue => `<article class="ct-check-card ${issue.severity}" data-check-slide="${escapeHtml(issue.slideId)}"><span>${issue.severity === "error" ? "!" : "⚠"}</span><div><strong>${escapeHtml(issue.type)}</strong><p>${escapeHtml(issue.message)}</p></div>${issue.slideId ? '<button data-check-action="goto">Fix</button>' : ""}</article>`).join("") : `<div class="ct-check-success"><span>✓</span><strong>Presentation ready</strong><p>No empty slides, missing titles, stale sources, low-resolution photos, text overflow, colour inconsistencies, or unresolved comments were found.</p></div>`; }
function ctHandleCheckAction(event) { const button = event.target.closest("[data-check-action]"); const card = event.target.closest("[data-check-slide]"); if (!button || !card?.dataset.checkSlide) return; ps.data.currentSlideId = card.dataset.checkSlide; ctCloseModal("ctChecksModal"); renderPresentationStudio(); }
function ctUpdateCheckBadge(issues) { const badge = document.getElementById("ctChecksBadge"); const errors = issues.filter(item => item.severity === "error").length; const warnings = issues.length - errors; if (badge) { badge.textContent = errors || warnings || ""; badge.hidden = !issues.length; badge.classList.toggle("error", Boolean(errors)); } }
function ctUpdateExportChecklist(issues) { const list = document.querySelector(".ps-export-checklist"); if (!list) return; const errors = issues.filter(item => item.severity === "error").length; const warnings = issues.filter(item => item.severity === "warning").length; list.innerHTML = `<p class="${errors ? "fail" : "pass"}"><span>${errors ? "!" : "✓"}</span>${errors ? `${errors} issue${errors === 1 ? "" : "s"} must be reviewed` : "No blocking presentation issues"}</p><p class="${warnings ? "warn" : "pass"}"><span>${warnings ? "⚠" : "✓"}</span>${warnings ? `${warnings} warning${warnings === 1 ? "" : "s"} found` : "No presentation warnings"}</p><p><span>✓</span>Fonts and charts render at export size</p><p><span>✓</span>Master branding and data sources included</p>`; }
async function ctDetectTextOverflow(slides) { const results = []; for (const slide of slides) { const shell = document.createElement("div"); shell.className = "ps-slide-export-clone ct-overflow-check"; const canvas = document.createElement("div"); canvas.className = "ps-slide-canvas"; shell.appendChild(canvas); document.body.appendChild(shell); const charts = []; renderSlideInto(slide, canvas, { interactive: false, chartBucket: charts }); await ctNextFrames(2); canvas.querySelectorAll(".ps-element").forEach(node => { const content = node.querySelector(".ps-element-content"); if (content && (content.scrollHeight > content.clientHeight + 3 || content.scrollWidth > content.clientWidth + 3)) results.push({ slideId: slide.id, slideTitle: slide.title, type: elementTypeLabel(node.dataset.type) }); }); destroyCharts(charts); shell.remove(); } return results; }

/* ---------- Photo dimensions ---------- */
handlePhotoUpload = function ctHandlePhotoUpload(event) {
  const file = event.target.files?.[0]; const element = findElement(ps.pendingPhotoElementId); event.target.value = ""; ps.pendingPhotoElementId = null;
  if (!file || !element || element.type !== "photo") return; if (!file.type.startsWith("image/")) return psToast("Choose a PNG, JPG, or WebP image."); if (file.size > 8 * 1024 * 1024) return psToast("Use an image smaller than 8 MB for this browser prototype.");
  const reader = new FileReader(); reader.onload = async () => { const dimensions = await ctImageDimensions(reader.result); withHistory(() => { element.src = reader.result; element.imageWidth = dimensions?.width || 0; element.imageHeight = dimensions?.height || 0; element.sourceMeta = { dataset: "Site photographs", lastRefresh: presentationDate(), period: "Current report", filters: element.caption || "No caption", status: "Uploaded" }; }); ps.selectedElementId = element.id; ps.selectedElementIds = [element.id]; renderPresentationStudio(); psToast(dimensions && dimensions.width < 900 ? "Photo added. Presentation checks may flag the image as low resolution." : "Site photograph added."); }; reader.readAsDataURL(file);
};

/* ---------- Helpers ---------- */
function ctLockProductBrandControls() { ["customBrandName", "customBrandTagline", "customBrandInitials"].forEach(id => { const control = document.getElementById(id); if (!control) return; control.disabled = true; control.title = "Civentraq is the fixed product brand. Use workspace and report branding for the client or contractor."; const label = control.closest("label"); if (label && !label.querySelector(".ct-locked-note")) label.insertAdjacentHTML("beforeend", '<small class="ct-locked-note">Civentraq product identity is locked</small>'); }); }
function ctMigrateDemoNames() { ctEnforceCiventraqBranding(); if (typeof saveState === "function") saveState(); }
function ctStatusLabel(status) { return ({ draft: "Draft", client_review: "Client review", changes_requested: "Changes requested", approved: "Approved", final: "Final issued" })[status] || status.replace(/_/g, " "); }
function ctOpenModal(id) { const modal = document.getElementById(id); if (!modal) return; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("ct-modal-open"); }
function ctCloseModal(id) { const modal = document.getElementById(id); if (!modal) return; modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); if (!document.querySelector(".ct-modal.open")) document.body.classList.remove("ct-modal-open"); }
function ctValue(id) { return document.getElementById(id)?.value || ""; } function ctSetValue(id, value) { const node = document.getElementById(id); if (node && document.activeElement !== node) node.value = value ?? ""; }
function ctChecked(id) { return Boolean(document.getElementById(id)?.checked); } function ctSetChecked(id, value) { const node = document.getElementById(id); if (node) node.checked = Boolean(value); }
function ctLoadJson(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch (_) { return fallback; } }
function ctNextFrames(count = 1) { return new Promise(resolve => { const step = () => count-- <= 0 ? resolve() : requestAnimationFrame(step); step(); }); }
function ctWaitForImages(root) { return Promise.all([...root.querySelectorAll("img")].map(image => image.complete ? Promise.resolve() : image.decode?.().catch(() => {}) || new Promise(resolve => { image.onload = image.onerror = resolve; }))); }
function ctImageDimensions(src) { return new Promise(resolve => { const image = new Image(); image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight }); image.onerror = () => resolve(null); image.src = src; }); }

function ctModalMarkup() {
  return `
  <div class="ct-modal" id="ctVersionsModal" aria-hidden="true"><div class="ct-modal-backdrop" data-ct-close="ctVersionsModal"></div><section class="ct-modal-card large"><button class="ct-modal-close" data-ct-close="ctVersionsModal">×</button><header><p>Report governance</p><h2>Version history</h2><span>Save, restore, duplicate, and compare report milestones.</span></header><div class="ct-version-create"><input id="ctVersionName" placeholder="e.g. Draft 1" /><select id="ctVersionStatus"><option value="draft">Draft</option><option value="client_review">Client review</option><option value="approved">Approved report</option><option value="final">Final issued report</option></select><input id="ctVersionAuthor" placeholder="Author" value="Project Manager" /><button class="button primary" id="ctSaveVersion">Save version</button></div><div class="ct-list" id="ctVersionList"></div></section></div>
  <div class="ct-modal" id="ctVersionCompareModal" aria-hidden="true"><div class="ct-modal-backdrop" data-ct-close="ctVersionCompareModal"></div><section class="ct-modal-card"><button class="ct-modal-close" data-ct-close="ctVersionCompareModal">×</button><header><p>Version comparison</p><h2>What changed</h2></header><div id="ctVersionCompareBody"></div></section></div>
  <div class="ct-modal" id="ctReviewModal" aria-hidden="true"><div class="ct-modal-backdrop" data-ct-close="ctReviewModal"></div><section class="ct-modal-card extra-large"><button class="ct-modal-close" data-ct-close="ctReviewModal">×</button><header class="ct-review-header"><div><p>Comments and approvals</p><h2>Review workflow</h2><span>Comment on slides, request changes, and approve the final report.</span></div><div class="ct-approval-status draft" id="ctApprovalStatus">Draft</div></header><div class="ct-review-layout"><div><div class="ct-comment-compose"><input id="ctReviewerName" value="Project Manager" placeholder="Reviewer name" /><textarea id="ctCommentText" rows="3" placeholder="Add a comment to the current slide or selected element..."></textarea><button class="button primary" id="ctAddComment">Add comment</button></div><div class="ct-list" id="ctCommentList"></div></div><aside class="ct-approval-panel"><label>Approval note<textarea id="ctApprovalNote" rows="4" placeholder="Reason, conditions, or next steps"></textarea></label><button id="ctRequestChanges" class="button secondary">Request changes</button><button id="ctApproveDeck" class="button primary">Approve report</button><button id="ctFinalIssue" class="button primary">Issue final report</button><button id="ctReturnDraft" class="button secondary">Return to draft</button><h3>Approval history</h3><ul id="ctApprovalHistory"></ul></aside></div></section></div>
  <div class="ct-modal" id="ctShareModal" aria-hidden="true"><div class="ct-modal-backdrop" data-ct-close="ctShareModal"></div><section class="ct-modal-card large"><button class="ct-modal-close" data-ct-close="ctShareModal">×</button><header><p>Client sharing</p><h2>Publish read-only presentation</h2><span>Create an encrypted, expiring link with download and comment controls.</span></header><div class="ct-share-form"><label>Password (optional)<input id="ctSharePassword" type="password" placeholder="Protect this link" /></label><label>Expires after<select id="ctShareExpiry"><option value="1">1 day</option><option value="7" selected>7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label><label class="ct-toggle"><input id="ctShareDownloads" type="checkbox" checked /><span>Allow PowerPoint download</span></label><label class="ct-toggle"><input id="ctShareComments" type="checkbox" checked /><span>Allow client comments</span></label><button class="button primary" id="ctPublishShare">Publish link</button></div><div class="ct-share-result" id="ctShareResult" hidden><label>Share link<input id="ctShareLink" readonly /></label><small>Encrypted presentation data is stored in the URL. Large embedded photographs may be replaced with placeholders to keep the link usable.</small></div><div class="ct-prototype-note">Static prototype limitation: remote view tracking and comment synchronisation require a secure backend. This version records views and client comments only in the browser that opens the link.</div><div class="ct-list" id="ctShareList"></div></section></div>
  <div class="ct-modal" id="ctChecksModal" aria-hidden="true"><div class="ct-modal-backdrop" data-ct-close="ctChecksModal"></div><section class="ct-modal-card large"><button class="ct-modal-close" data-ct-close="ctChecksModal">×</button><header><p>Automatic presentation checks</p><h2>Presentation readiness</h2><span>Review empty slides, titles, image quality, overflow, sources, freshness, colours, and comments before export.</span></header><div class="ct-checks-list" id="ctChecksList"></div></section></div>
  <div class="ct-modal ct-onboarding-modal" id="ctOnboardingModal" aria-hidden="true"><div class="ct-modal-backdrop"></div><section class="ct-modal-card large"><header><p>Welcome to Civentraq</p><h2>Build your first client-ready report</h2><span>Create project → Upload dataset → Check columns → Choose template → Generate presentation</span></header><div class="ct-onboard-progress"><span></span><span></span><span></span><span></span><span></span></div><div class="ct-onboard-step" data-ct-onboard-step="0"><h3>1. Create project</h3><div class="ct-form-grid"><label>Project name<input id="ctOnboardProject" /></label><label>Client<input id="ctOnboardClient" /></label><label>Location<input id="ctOnboardLocation" /></label><label>Approved budget<input id="ctOnboardBudget" type="number" /></label></div></div><div class="ct-onboard-step" data-ct-onboard-step="1"><h3>2. Upload dataset</h3><p>Use Excel, CSV, or a SAP-exported spreadsheet. You can continue with sample data for the demo.</p><button class="button secondary" id="ctOnboardingUpload">Open data importer</button><strong id="ctOnboardUploadStatus"></strong></div><div class="ct-onboard-step" data-ct-onboard-step="2"><h3>3. Check column matching</h3><div class="ct-onboard-status" id="ctOnboardMappingStatus"></div><p>Civentraq validates reporting dates, costs, progress, labour, and risk fields before building reports.</p></div><div class="ct-onboard-step" data-ct-onboard-step="3"><h3>4. Choose report template</h3><div class="ct-template-choice"><label><input type="radio" name="ctOnboardTemplate" value="full" checked /><span><b>Complete project pack</b><small>Executive, cost, schedule, comparison, photos, and decisions</small></span></label><label><input type="radio" name="ctOnboardTemplate" value="executive" /><span><b>Executive brief</b><small>Cover, KPIs, insight, and decisions</small></span></label><label><input type="radio" name="ctOnboardTemplate" value="cost" /><span><b>Cost report</b><small>Budget, forecast, and expenditure presentation</small></span></label><label><input type="radio" name="ctOnboardTemplate" value="schedule" /><span><b>Schedule report</b><small>Progress, variance, and recovery presentation</small></span></label><label><input type="radio" name="ctOnboardTemplate" value="photos" /><span><b>Photo report</b><small>Progress photography and site commentary</small></span></label></div></div><div class="ct-onboard-step" data-ct-onboard-step="4"><h3>5. Generate presentation</h3><p>Civentraq will build an editable deck using the fictional Cape Industrial Refinery Maintenance Project demo, your selected template, current dataset, master branding, and management insights.</p><div class="ct-ready-card"><span>✓</span><b>Ready to generate</b></div></div><footer><button class="button secondary" id="ctOnboardingSkip">Skip for now</button><div><button class="button secondary" id="ctOnboardingBack">Back</button><button class="button primary" id="ctOnboardingNext">Continue</button></div></footer></section></div>
  <div class="ct-share-viewer" id="ctShareViewer" aria-hidden="true"><header><div><span class="ct-viewer-logo">CV</span><strong id="ctViewerTitle">Civentraq presentation</strong></div><div><button id="ctViewerDownload">Download</button><button id="ctViewerExit">Close</button></div></header><main id="ctShareViewerStage"></main><nav><button id="ctViewerPrev">←</button><span id="ctViewerCounter">1 / 1</span><button id="ctViewerNext">→</button></nav><aside id="ctViewerCommentBox"><strong>Client comment</strong><input id="ctViewerName" placeholder="Your name" /><textarea id="ctViewerComment" rows="3" placeholder="Comment on this slide..."></textarea><button id="ctViewerAddComment">Save comment</button><small id="ctViewerCommentStatus"></small></aside></div>`;
}
