"use strict";

/*
 * Civentraq Presentation Studio
 * A browser-based, project-report slide builder. Presentation data is stored
 * locally and exports are generated from the active Civentraq project data.
 */

const PS_STORAGE_KEY = "civentraq_presentation_studio_v1";
const PS_EDITOR_PREFS_KEY = "civentraq_presentation_editor_prefs_v3";
const PS_THEME_CATALOG = {
  energy: { name: "Energy & refinery", bg: "#eef4f5", surface: "#ffffff", accent: "#0d7b69", accent2: "#2eb7a1", text: "#13262d", muted: "#60747c", dark: "#0b2530" },
  executive: { name: "Executive dark", bg: "#101722", surface: "#182332", accent: "#c6a969", accent2: "#e0c989", text: "#f5f1e8", muted: "#aab5c3", dark: "#0b1018" },
  construction: { name: "Construction", bg: "#f5f1ec", surface: "#ffffff", accent: "#d97017", accent2: "#f0a04b", text: "#27231f", muted: "#776d64", dark: "#2b2723" },
  minimal: { name: "Minimal white", bg: "#ffffff", surface: "#ffffff", accent: "#17697a", accent2: "#47a5b8", text: "#16242a", muted: "#6b7880", dark: "#15333d" },
  safety: { name: "Safety report", bg: "#f5f6f1", surface: "#ffffff", accent: "#e1b814", accent2: "#f4d54e", text: "#17211d", muted: "#68736e", dark: "#15221d" },
  client: { name: "Client branded", bg: "#f3f5f7", surface: "#ffffff", accent: "#0d6b57", accent2: "#45ad99", text: "#17202a", muted: "#6d7a82", dark: "#111b22" }
};

const ps = {
  data: null,
  selectedElementId: null,
  undo: [],
  redo: [],
  chartInstances: [],
  presenterCharts: [],
  exportCharts: [],
  drag: null,
  pendingPhotoElementId: null,
  presenterIndex: 0,
  laser: false,
  saveTimer: null,
  renderTimer: null,
  inspectorTab: "element",
  resizeObserver: null,
  rendering: false,
  renderQueued: false,
  opened: false,
  openingTimer: null,
  renderGeneration: 0,
  lastWorkspaceWidth: 0,
  lastWorkspaceHeight: 0
};

const pse = {};
let psInitialized = false;
document.addEventListener("DOMContentLoaded", initPresentationStudio);

function initPresentationStudio() {
  if (psInitialized) return;
  psInitialized = true;
  cachePresentationElements();
  if (!pse.psSlideCanvas) return;
  ps.data = loadPresentationDeck();
  bindPresentationEvents();
  // The deck is rendered on first open. Keeping the heavy slide/chart render
  // out of the initial home-page load makes navigation immediate and avoids
  // competing with the dashboard charts.
  if (document.getElementById("presentationView")?.classList.contains("active")) {
    openPresentationStudioSafely();
  }
}

function cachePresentationElements() {
  [
    "psStudio", "psSlideCount", "psSlideList", "psAddSlideButton", "psTemplateGrid", "psElementPalette", "psSlideCanvas", "psCanvasShell", "psCanvasWorkspace",
    "psBackButton", "psToggleSlidesButton", "psFitCanvasButton", "psToggleInspectorButton", "psDeckTitle",
    "psUndoButton", "psRedoButton", "psDuplicateSlideButton", "psDeleteSlideButton", "psThemeSelect", "psRatioSelect", "psZoomRange", "psZoomValue", "psSpeakerNotes", "psSaveStatus",
    "psNewDeckButton", "psPresentButton", "psExportButton", "psEmptySelection", "psElementInspector", "psSelectedType", "psSelectedId", "psDuplicateElementButton", "psDeleteElementButton",
    "psTextControls", "psElementText", "psFontSize", "psTextAlign", "psBoldToggle", "psKpiControls", "psKpiMetric", "psKpiLabel", "psChartControls", "psChartTitle", "psChartType", "psChartSource", "psChartPrimary", "psChartSecondary", "psChartLegend", "psChartGrid",
    "psPhotoControls", "psReplacePhotoButton", "psPhotoCaption", "psPhotoFit", "psAiControls", "psAiTone", "psAiLength", "psRegenerateAiButton", "psComparisonControls", "psComparisonTitle", "psPreviousLabel", "psCurrentLabel", "psPreviousValue", "psCurrentValue", "psComparisonUnit", "psAnnotationControls", "psAnnotationStyle",
    "psElementBackground", "psElementColor", "psElementBorder", "psElementRadius", "psElementX", "psElementY", "psElementW", "psElementH", "psThemeGallery", "psSlideTitle", "psSlideBackground", "psSlideHidden",
    "psComparisonMetric", "psDeckPreviousLabel", "psDeckCurrentLabel", "psAddComparisonSlideButton", "psPhotoInput", "psExportModal", "psExportRange", "psExportLayout", "psExportQuality", "psExportFileName", "psExportNotes", "psExportPageNumbers", "psExportWatermark", "psExportWatermarkText", "psExportAppendix", "psExportPreview", "psExportPreviewTitle", "psExportPreviewSlides", "psExportStatus", "psExportStatusText", "psRunExportButton",
    "psPresenter", "psPresenterStage", "psPresenterCounter", "psPresenterPrev", "psPresenterNext", "psPresenterNotesButton", "psPresenterLaserButton", "psPresenterExit", "psPresenterNotes", "psPresenterLaser"
  ].forEach(id => pse[id] = document.getElementById(id));
  pse.psLeftPanel = document.querySelector(".ps-left-panel");
  pse.psInspector = document.getElementById("psInspector");
}

function bindPresentationEvents() {
  const presentationNav = document.querySelector('[data-view="presentation"]');
  presentationNav?.addEventListener("click", openPresentationStudioSafely);
  document.querySelectorAll('.nav-link[data-view]').forEach(button => {
    if (button.dataset.view !== "presentation") button.addEventListener("click", leavePresentationMode);
  });
  pse.psBackButton?.addEventListener("click", exitPresentationStudio);
  pse.psToggleSlidesButton?.addEventListener("click", () => toggleStudioPanel("slides"));
  pse.psToggleInspectorButton?.addEventListener("click", () => toggleStudioPanel("inspector"));
  pse.psFitCanvasButton?.addEventListener("click", fitCanvasToWorkspace);
  pse.psAddSlideButton.addEventListener("click", () => addSlideFromTemplate("blank"));
  pse.psTemplateGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-ps-template]");
    if (button) addSlideFromTemplate(button.dataset.psTemplate);
  });
  pse.psElementPalette.addEventListener("dragstart", event => {
    const button = event.target.closest("[data-ps-element]");
    if (!button) return;
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/civentraq-element", button.dataset.psElement);
  });
  pse.psElementPalette.addEventListener("click", event => {
    const button = event.target.closest("[data-ps-element]");
    if (button) addElementToCurrentSlide(button.dataset.psElement);
  });

  pse.psSlideCanvas.addEventListener("dragover", event => {
    event.preventDefault();
    pse.psSlideCanvas.classList.add("drag-target");
  });
  pse.psSlideCanvas.addEventListener("dragleave", () => pse.psSlideCanvas.classList.remove("drag-target"));
  pse.psSlideCanvas.addEventListener("drop", event => {
    event.preventDefault();
    pse.psSlideCanvas.classList.remove("drag-target");
    const type = event.dataTransfer.getData("text/civentraq-element");
    if (!type) return;
    const rect = pse.psSlideCanvas.getBoundingClientRect();
    addElementToCurrentSlide(type, {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100 - 12, 0, 78),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100 - 8, 0, 82)
    });
  });

  pse.psSlideCanvas.addEventListener("pointerdown", startElementPointerInteraction);
  pse.psSlideCanvas.addEventListener("dblclick", handleCanvasDoubleClick);
  pse.psSlideCanvas.addEventListener("click", handleCanvasClick);
  document.addEventListener("pointermove", moveElementPointerInteraction);
  document.addEventListener("pointerup", endElementPointerInteraction);

  pse.psSlideList.addEventListener("click", event => {
    const thumb = event.target.closest("[data-ps-slide-id]");
    if (!thumb) return;
    ps.data.currentSlideId = thumb.dataset.psSlideId;
    ps.selectedElementId = null;
    savePresentationDeck();
    renderPresentationStudio();
  });
  pse.psSlideList.addEventListener("dragstart", event => {
    const thumb = event.target.closest("[data-ps-slide-id]");
    if (!thumb) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/civentraq-slide", thumb.dataset.psSlideId);
  });
  pse.psSlideList.addEventListener("dragover", event => event.preventDefault());
  pse.psSlideList.addEventListener("drop", event => {
    event.preventDefault();
    const target = event.target.closest("[data-ps-slide-id]");
    const sourceId = event.dataTransfer.getData("text/civentraq-slide");
    if (!target || !sourceId || sourceId === target.dataset.psSlideId) return;
    withHistory(() => {
      const sourceIndex = ps.data.slides.findIndex(slide => slide.id === sourceId);
      const [slide] = ps.data.slides.splice(sourceIndex, 1);
      const targetIndex = ps.data.slides.findIndex(item => item.id === target.dataset.psSlideId);
      ps.data.slides.splice(targetIndex, 0, slide);
    });
    renderPresentationStudio();
  });

  pse.psUndoButton.addEventListener("click", undoPresentation);
  pse.psRedoButton.addEventListener("click", redoPresentation);
  pse.psDuplicateSlideButton.addEventListener("click", duplicateCurrentSlide);
  pse.psDeleteSlideButton.addEventListener("click", deleteCurrentSlide);
  pse.psNewDeckButton.addEventListener("click", resetPresentationDeck);
  pse.psPresentButton.addEventListener("click", openPresenterMode);
  pse.psExportButton.addEventListener("click", openPresentationExport);

  pse.psThemeSelect.addEventListener("change", () => applyTheme(pse.psThemeSelect.value));
  pse.psRatioSelect.addEventListener("change", () => {
    withHistory(() => ps.data.ratio = pse.psRatioSelect.value);
    renderPresentationStudio();
  });
  pse.psZoomRange.addEventListener("input", () => {
    ps.data.zoom = Number(pse.psZoomRange.value);
    applyCanvasZoom();
    schedulePresentationSave();
  });
  pse.psSpeakerNotes.addEventListener("change", () => {
    const slide = currentSlide();
    if (!slide) return;
    withHistory(() => slide.notes = pse.psSpeakerNotes.value);
    renderSlideList();
  });

  document.querySelectorAll("[data-ps-inspector-tab]").forEach(button => button.addEventListener("click", () => setInspectorTab(button.dataset.psInspectorTab)));
  pse.psThemeGallery.addEventListener("click", event => {
    const button = event.target.closest("[data-ps-theme]");
    if (button) applyTheme(button.dataset.psTheme);
  });
  pse.psDuplicateElementButton.addEventListener("click", duplicateSelectedElement);
  pse.psDeleteElementButton.addEventListener("click", deleteSelectedElement);

  bindElementInspectorControls();
  pse.psReplacePhotoButton.addEventListener("click", () => {
    ps.pendingPhotoElementId = ps.selectedElementId;
    pse.psPhotoInput.click();
  });
  pse.psPhotoInput.addEventListener("change", handlePhotoUpload);
  pse.psRegenerateAiButton.addEventListener("click", regenerateSelectedAiSummary);
  pse.psAddComparisonSlideButton.addEventListener("click", createComparisonSlideFromControls);
  document.querySelectorAll("[data-ps-add-annotation]").forEach(button => button.addEventListener("click", () => addAnnotation(button.dataset.psAddAnnotation)));

  document.querySelectorAll("[data-close-ps-export]").forEach(element => element.addEventListener("click", closePresentationExport));
  pse.psRunExportButton.addEventListener("click", runPresentationExport);
  document.querySelectorAll('input[name="psExportFormat"], #psExportRange, #psExportLayout, #psExportQuality, #psExportNotes, #psExportPageNumbers, #psExportWatermark, #psExportAppendix').forEach(control => control.addEventListener("change", updateExportPreview));

  pse.psPresenterPrev.addEventListener("click", () => movePresenter(-1));
  pse.psPresenterNext.addEventListener("click", () => movePresenter(1));
  pse.psPresenterExit.addEventListener("click", closePresenterMode);
  pse.psPresenterNotesButton.addEventListener("click", togglePresenterNotes);
  pse.psPresenterLaserButton.addEventListener("click", togglePresenterLaser);
  pse.psPresenter.addEventListener("mousemove", event => {
    if (!ps.laser) return;
    pse.psPresenterLaser.style.left = `${event.clientX - 6}px`;
    pse.psPresenterLaser.style.top = `${event.clientY - 6}px`;
  });
  document.addEventListener("keydown", handlePresentationKeyboard);
  window.addEventListener("resize", () => requestAnimationFrame(() => { updateStudioPanelButtons(); applyCanvasZoom(); }));

  // A permanently active ResizeObserver previously caused a resize/render loop
  // when the canvas added or removed scrollbars. Observe real workspace-size
  // changes only, and ignore changes while the editor is hidden.
  if ("ResizeObserver" in window && pse.psCanvasWorkspace) {
    ps.resizeObserver = new ResizeObserver(entries => {
      if (!document.getElementById("presentationView")?.classList.contains("active")) return;
      const box = entries[0]?.contentRect;
      const width = Math.round(box?.width || 0);
      const height = Math.round(box?.height || 0);
      if (Math.abs(width - ps.lastWorkspaceWidth) < 3 && Math.abs(height - ps.lastWorkspaceHeight) < 3) return;
      ps.lastWorkspaceWidth = width;
      ps.lastWorkspaceHeight = height;
      requestAnimationFrame(applyCanvasZoom);
    });
    ps.resizeObserver.observe(pse.psCanvasWorkspace);
  }
  if (document.getElementById("presentationView")?.classList.contains("active")) openPresentationStudioSafely();
}


function openPresentationStudioSafely() {
  clearTimeout(ps.openingTimer);
  document.body.classList.add("presentation-opening");
  ps.openingTimer = setTimeout(() => {
    try {
      enterPresentationMode();
      renderPresentationStudio();
      ps.opened = true;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        try { fitCanvasToWorkspace(); } catch (_) {}
        document.body.classList.remove("presentation-opening");
        window.CiventraqStoryStudio?.activate?.();
      }));
    } catch (error) {
      document.body.classList.remove("presentation-opening");
      console.error("Presentation Studio failed to open", error);
      window.CiventraqStoryStudio?.showError?.("Presentation Studio could not open. Your project data is safe; reload and try again.");
    }
  }, 0);
}

function loadEditorPreferences() {
  try {
    return { slidesCollapsed: false, inspectorCollapsed: true, ...JSON.parse(localStorage.getItem(PS_EDITOR_PREFS_KEY) || "{}") };
  } catch (error) {
    return { slidesCollapsed: false, inspectorCollapsed: true };
  }
}

function saveEditorPreferences() {
  const prefs = {
    slidesCollapsed: document.body.classList.contains("ps-slides-collapsed"),
    inspectorCollapsed: document.body.classList.contains("ps-inspector-collapsed")
  };
  localStorage.setItem(PS_EDITOR_PREFS_KEY, JSON.stringify(prefs));
}

function enterPresentationMode() {
  const prefs = loadEditorPreferences();
  document.body.classList.add("presentation-mode");
  document.body.classList.toggle("ps-slides-collapsed", Boolean(prefs.slidesCollapsed));
  document.body.classList.toggle("ps-inspector-collapsed", Boolean(prefs.inspectorCollapsed));
  pse.psLeftPanel?.classList.toggle("mobile-open", !prefs.slidesCollapsed);
  pse.psInspector?.classList.toggle("mobile-open", !prefs.inspectorCollapsed);
  updateStudioPanelButtons();
  requestAnimationFrame(() => requestAnimationFrame(applyCanvasZoom));
}

function leavePresentationMode() {
  document.body.classList.remove("presentation-mode");
  pse.psLeftPanel?.classList.remove("mobile-open");
  pse.psInspector?.classList.remove("mobile-open");
}

function exitPresentationStudio() {
  leavePresentationMode();
  document.querySelector('[data-view="overview"]')?.click();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function toggleStudioPanel(panel) {
  const isSlides = panel === "slides";
  const bodyClass = isSlides ? "ps-slides-collapsed" : "ps-inspector-collapsed";
  const panelNode = isSlides ? pse.psLeftPanel : pse.psInspector;
  if (window.innerWidth <= (isSlides ? 760 : 1120)) {
    const currentlyVisible = Boolean(panelNode?.classList.contains("mobile-open")) && !document.body.classList.contains(bodyClass);
    const showNext = !currentlyVisible;
    panelNode?.classList.toggle("mobile-open", showNext);
    document.body.classList.toggle(bodyClass, !showNext);
  } else {
    document.body.classList.toggle(bodyClass);
  }
  saveEditorPreferences();
  updateStudioPanelButtons();
  setTimeout(applyCanvasZoom, 40);
}

function updateStudioPanelButtons() {
  const slidesVisible = window.innerWidth <= 760
    ? Boolean(pse.psLeftPanel?.classList.contains("mobile-open"))
    : !document.body.classList.contains("ps-slides-collapsed");
  const inspectorVisible = window.innerWidth <= 1120
    ? Boolean(pse.psInspector?.classList.contains("mobile-open"))
    : !document.body.classList.contains("ps-inspector-collapsed");
  pse.psToggleSlidesButton?.setAttribute("aria-pressed", String(slidesVisible));
  pse.psToggleInspectorButton?.setAttribute("aria-pressed", String(inspectorVisible));
}

function fitCanvasToWorkspace() {
  if (!ps.data) return;
  ps.data.zoom = 100;
  pse.psZoomRange.value = 100;
  schedulePresentationSave();
  applyCanvasZoom();
}

function bindElementInspectorControls() {
  const bindingMap = [
    [pse.psElementText, "text"], [pse.psFontSize, "fontSize", Number], [pse.psTextAlign, "align"], [pse.psBoldToggle, "bold", control => control.checked],
    [pse.psKpiMetric, "metric"], [pse.psKpiLabel, "label"], [pse.psChartTitle, "title"], [pse.psChartType, "chartType"], [pse.psChartSource, "source"],
    [pse.psChartPrimary, "primary"], [pse.psChartSecondary, "secondary"], [pse.psChartLegend, "legend", control => control.checked], [pse.psChartGrid, "grid", control => control.checked],
    [pse.psPhotoCaption, "caption"], [pse.psPhotoFit, "fit"], [pse.psAiTone, "tone"], [pse.psAiLength, "length"], [pse.psComparisonTitle, "title"],
    [pse.psPreviousLabel, "previousLabel"], [pse.psCurrentLabel, "currentLabel"], [pse.psPreviousValue, "previousValue", Number], [pse.psCurrentValue, "currentValue", Number], [pse.psComparisonUnit, "unit"],
    [pse.psAnnotationStyle, "style"], [pse.psElementBackground, "background"], [pse.psElementColor, "color"], [pse.psElementBorder, "borderColor"], [pse.psElementRadius, "radius", Number],
    [pse.psElementX, "x", Number], [pse.psElementY, "y", Number], [pse.psElementW, "w", Number], [pse.psElementH, "h", Number]
  ];
  bindingMap.forEach(([control, key, convert]) => {
    if (!control) return;
    control.addEventListener("change", () => {
      const element = selectedElement();
      if (!element) return;
      const value = typeof convert === "function" ? convert(control) : control.value;
      withHistory(() => element[key] = value);
      if (key === "style" && element.type === "annotation") element.background = "transparent";
      renderPresentationStudio();
    });
  });
  pse.psSlideTitle.addEventListener("change", () => {
    const slide = currentSlide(); if (!slide) return;
    withHistory(() => slide.title = pse.psSlideTitle.value || "Untitled slide");
    renderPresentationStudio();
  });
  pse.psSlideBackground.addEventListener("change", () => {
    const slide = currentSlide(); if (!slide) return;
    withHistory(() => slide.background = pse.psSlideBackground.value);
    renderPresentationStudio();
  });
  pse.psSlideHidden.addEventListener("change", () => {
    const slide = currentSlide(); if (!slide) return;
    withHistory(() => slide.hidden = pse.psSlideHidden.checked);
    renderPresentationStudio();
  });
}

function loadPresentationDeck() {
  try {
    const saved = JSON.parse(localStorage.getItem(PS_STORAGE_KEY));
    if (saved?.slides?.length) return normalizePresentationDeck(saved);
  } catch (error) {
    console.warn("Presentation deck could not be loaded", error);
  }
  return createDefaultPresentationDeck();
}

function normalizePresentationDeck(deck) {
  return {
    editorVersion: 2,
    name: deck.name || `${projectName()} presentation`,
    theme: PS_THEME_CATALOG[deck.theme] ? deck.theme : "energy",
    ratio: ["16:9", "4:3", "a4", "a4p"].includes(deck.ratio) ? deck.ratio : "16:9",
    zoom: deck.editorVersion === 2 ? clamp(Number(deck.zoom) || 100, 30, 200) : 100,
    currentSlideId: deck.currentSlideId || deck.slides[0].id,
    comparison: { previousLabel: "Last month", currentLabel: "This month", ...(deck.comparison || {}) },
    slides: deck.slides.map(slide => ({
      id: slide.id || uid("slide"), title: slide.title || "Untitled slide", template: slide.template || "blank", background: slide.background || "", notes: slide.notes || "", hidden: Boolean(slide.hidden),
      elements: (slide.elements || []).map(normalizePresentationElement)
    }))
  };
}

function normalizePresentationElement(element) {
  const base = defaultElement(element.type || "text");
  return { ...base, ...element, id: element.id || uid("element") };
}

function createDefaultPresentationDeck() {
  const metrics = getPresentationMetrics();
  const cover = makeSlide("title", { title: "Cover" });
  const executive = makeSlide("executive", { title: "Executive summary" });
  const cost = makeSlide("chart", { title: "Cost performance", chartSource: "cost" });
  const schedule = makeSlide("chart", { title: "Schedule performance", chartSource: "progress" });
  const comparison = makeSlide("comparison", { title: "Period comparison" });
  const photos = makeSlide("photos", { title: "Site progress photographs" });
  const close = makeSlide("blank", { title: "Decisions and next steps" });
  close.elements = [
    defaultElement("title", { x: 7, y: 11, w: 86, h: 13, text: "Decisions and next steps", fontSize: 34 }),
    defaultElement("annotation", { x: 7, y: 32, w: 40, h: 18, style: "decision", text: "Client decision required: confirm the piping recovery programme by the next reporting meeting." }),
    defaultElement("annotation", { x: 53, y: 32, w: 40, h: 18, style: "warning", text: "Protect the completion milestone by prioritising critical-path work packages." }),
    defaultElement("ai_summary", { x: 7, y: 58, w: 86, h: 23, text: generateAiSummary("executive", "short", metrics) })
  ];
  const slides = [cover, executive, cost, schedule, comparison, photos, close];
  return { editorVersion: 2, name: `${projectName()} presentation`, theme: "energy", ratio: "16:9", zoom: 100, currentSlideId: cover.id, comparison: { previousLabel: "Last month", currentLabel: "This month" }, slides };
}

function makeSlide(template = "blank", options = {}) {
  const m = getPresentationMetrics();
  const slide = { id: uid("slide"), title: options.title || templateLabel(template), template, background: "", notes: "", hidden: false, elements: [] };
  const title = options.title || templateLabel(template);
  if (template === "title") {
    slide.elements = [
      defaultElement("title", { x: 7, y: 20, w: 82, h: 30, text: projectName(), fontSize: 40, color: "#ffffff" }),
      defaultElement("text", { x: 7, y: 53, w: 70, h: 17, text: `${projectClient()} · ${projectLocation()}\nProject performance presentation`, fontSize: 15, color: "#d7e7e5" }),
      defaultElement("text", { x: 7, y: 78, w: 62, h: 8, text: `Reporting date: ${presentationDate()}`, fontSize: 11, color: "#c2d4d3" }),
      defaultElement("annotation", { x: 74, y: 69, w: 19, h: 17, text: `${Math.round(m.actualProgress)}% complete`, style: "success", fontSize: 14 })
    ];
    slide.background = "#0b2530";
  } else if (template === "executive") {
    slide.elements = [
      defaultElement("title", { x: 5, y: 6, w: 90, h: 10, text: title, fontSize: 29 }),
      defaultElement("kpi", { x: 5, y: 20, w: 21, h: 22, metric: "budget", label: "Approved budget" }),
      defaultElement("kpi", { x: 28, y: 20, w: 21, h: 22, metric: "spent", label: "Actual spend" }),
      defaultElement("kpi", { x: 51, y: 20, w: 21, h: 22, metric: "progress", label: "Actual progress" }),
      defaultElement("kpi", { x: 74, y: 20, w: 21, h: 22, metric: "health", label: "Project health" }),
      defaultElement("ai_summary", { x: 5, y: 48, w: 54, h: 34, text: generateAiSummary("executive", "medium", m) }),
      defaultElement("annotation", { x: 62, y: 48, w: 33, h: 15, style: m.progressVariance < 0 ? "warning" : "success", text: m.progressVariance < 0 ? `${Math.abs(Math.round(m.progressVariance))}% schedule variance requires a recovery plan.` : "Project progress is meeting or exceeding the current plan." }),
      defaultElement("annotation", { x: 62, y: 67, w: 33, h: 15, style: m.predictedFinalCost > projectBudget() ? "warning" : "info", text: m.predictedFinalCost > projectBudget() ? "Forecast final cost is above the approved budget." : "Forecast final cost remains within the approved budget." })
    ];
  } else if (template === "chart") {
    const source = options.chartSource || "cost";
    slide.elements = [
      defaultElement("title", { x: 5, y: 6, w: 90, h: 10, text: title, fontSize: 29 }),
      defaultElement("chart", { x: 5, y: 20, w: 62, h: 64, source, title, chartType: source === "category" ? "doughnut" : "line" }),
      defaultElement("ai_summary", { x: 70, y: 20, w: 25, h: 32, tone: "technical", length: "short", text: generateAiSummary("technical", "short", m) }),
      defaultElement("annotation", { x: 70, y: 57, w: 25, h: 27, style: "decision", text: "Use the discussion notes to record the decision required from the client or management team." })
    ];
  } else if (template === "comparison") {
    const current = Math.round(m.actualProgress);
    slide.elements = [
      defaultElement("title", { x: 5, y: 6, w: 90, h: 10, text: title, fontSize: 29 }),
      defaultElement("comparison", { x: 5, y: 22, w: 56, h: 39, title: "Progress comparison", previousLabel: "Last month", currentLabel: "This month", previousValue: Math.max(0, current - 8), currentValue: current, unit: "%" }),
      defaultElement("chart", { x: 64, y: 22, w: 31, h: 39, source: "progress", chartType: "bar", title: "Planned vs actual" }),
      defaultElement("ai_summary", { x: 5, y: 67, w: 90, h: 18, tone: "client", length: "short", text: generateAiSummary("client", "short", m) })
    ];
  } else if (template === "photos") {
    slide.elements = [defaultElement("title", { x: 5, y: 5, w: 90, h: 9, text: title, fontSize: 28 })];
    [[5,18],[52,18],[5,54],[52,54]].forEach((position, index) => slide.elements.push(defaultElement("photo", { x: position[0], y: position[1], w: 43, h: 31, caption: `Site photograph ${index + 1} · Add location and date` })));
  } else {
    slide.elements = [defaultElement("title", { x: 6, y: 7, w: 88, h: 11, text: title, fontSize: 30 })];
  }
  return slide;
}

function defaultElement(type, overrides = {}) {
  const defaults = {
    title: { x: 8, y: 10, w: 70, h: 13, text: "Slide heading", fontSize: 30, bold: true, align: "left", color: "", background: "transparent", borderColor: "transparent", radius: 0 },
    text: { x: 8, y: 30, w: 42, h: 22, text: "Add report text here.", fontSize: 14, bold: false, align: "left", color: "", background: "transparent", borderColor: "transparent", radius: 0 },
    ai_summary: { x: 8, y: 28, w: 46, h: 27, text: generateAiSummary("executive", "short", getPresentationMetrics()), fontSize: 13, bold: false, align: "left", tone: "executive", length: "short", color: "", background: "#ffffff", borderColor: "#dce4e7", radius: 10 },
    kpi: { x: 8, y: 27, w: 22, h: 22, metric: "progress", label: "Actual progress", fontSize: 14, color: "", background: "#ffffff", borderColor: "#dce4e7", radius: 10 },
    chart: { x: 8, y: 25, w: 56, h: 52, title: "Project performance", source: "cost", chartType: "line", primary: "#0d7b69", secondary: "#9aa8ae", legend: true, grid: true, color: "", background: "#ffffff", borderColor: "#dce4e7", radius: 10 },
    table: { x: 8, y: 25, w: 60, h: 48, title: "Work package status", tableSource: "packages", fontSize: 11, color: "", background: "#ffffff", borderColor: "#dce4e7", radius: 10 },
    photo: { x: 8, y: 25, w: 40, h: 34, src: "", caption: "Site progress photograph · Location · Date", fit: "cover", color: "", background: "#e2e9eb", borderColor: "#cdd8dc", radius: 8 },
    comparison: { x: 8, y: 27, w: 52, h: 32, title: "Period comparison", previousLabel: "Previous", currentLabel: "Current", previousValue: 54, currentValue: 62, unit: "%", fontSize: 12, color: "", background: "#ffffff", borderColor: "#dce4e7", radius: 10 },
    progress: { x: 8, y: 27, w: 44, h: 20, label: "Actual progress", metric: "progress", fontSize: 12, color: "", background: "#ffffff", borderColor: "#dce4e7", radius: 10 },
    annotation: { x: 8, y: 27, w: 34, h: 18, text: "Add an important note or decision.", style: "info", fontSize: 12, bold: true, align: "left", color: "", background: "transparent", borderColor: "transparent", radius: 9 }
  };
  return { id: uid("element"), type, ...defaults[type], ...overrides };
}

function renderPresentationStudio() {
  if (!ps.data) return;
  if (ps.rendering) {
    ps.renderQueued = true;
    return;
  }
  ps.rendering = true;
  ps.renderGeneration += 1;
  try {
    if (!currentSlide()) ps.data.currentSlideId = ps.data.slides[0]?.id;
    renderSlideList();
    renderCurrentSlide();
    renderInspector();
    syncPresentationToolbar();
    updateUndoButtons();
    schedulePresentationSave();
  } finally {
    ps.rendering = false;
    if (ps.renderQueued) {
      ps.renderQueued = false;
      requestAnimationFrame(renderPresentationStudio);
    }
  }
}

function renderSlideList() {
  pse.psSlideList.innerHTML = ps.data.slides.map((slide, index) => {
    const theme = themeForSlide(slide);
    return `<button class="ps-slide-thumb ${slide.id === ps.data.currentSlideId ? "active" : ""} ${slide.hidden ? "hidden-slide" : ""}" type="button" draggable="true" data-ps-slide-id="${escapeHtml(slide.id)}">
      <span class="ps-slide-thumb-number">${index + 1}</span>
      <span class="ps-slide-thumb-preview" data-title="${escapeHtml(slide.title)}" style="background:${escapeHtml(slide.background || theme.bg)};--ps-thumb-text:${theme.text};--ps-thumb-accent:${theme.accent};--ps-thumb-surface:${theme.surface}">
        <i class="thumb-band"></i><i class="thumb-box one"></i><i class="thumb-box two"></i><i class="thumb-box three"></i>
      </span>
    </button>`;
  }).join("");
  pse.psSlideCount.textContent = `${ps.data.slides.length} slide${ps.data.slides.length === 1 ? "" : "s"}`;
}

function renderCurrentSlide() {
  destroyCharts(ps.chartInstances);
  ps.chartInstances = [];
  const slide = currentSlide();
  if (!slide) return;
  renderSlideInto(slide, pse.psSlideCanvas, { interactive: true, chartBucket: ps.chartInstances });
  applyCanvasZoom();
}

function renderSlideInto(slide, canvas, options = {}) {
  const theme = themeForSlide(slide);
  canvas.innerHTML = "";
  canvas.dataset.ratio = options.ratio || ps.data.ratio;
  canvas.style.setProperty("--ps-bg", slide.background || theme.bg);
  canvas.style.setProperty("--ps-surface", theme.surface);
  canvas.style.setProperty("--ps-accent", theme.accent);
  canvas.style.setProperty("--ps-accent2", theme.accent2);
  canvas.style.setProperty("--ps-text", theme.text);
  canvas.style.setProperty("--ps-muted", theme.muted);
  canvas.style.background = slide.background || theme.bg;
  slide.elements.forEach(element => {
    const node = createElementNode(element, slide, options);
    canvas.appendChild(node);
  });
  if (options.watermark) {
    const watermark = document.createElement("div");
    watermark.className = "ps-export-watermark";
    watermark.textContent = options.watermark;
    canvas.appendChild(watermark);
  }
  if (options.pageNumber) {
    const page = document.createElement("div");
    page.className = "ps-export-page-number";
    page.textContent = options.pageNumber;
    canvas.appendChild(page);
  }
  const generation = ps.renderGeneration;
  requestAnimationFrame(() => {
    if (options.interactive && generation !== ps.renderGeneration) return;
    if (!canvas.isConnected) return;
    renderSlideCharts(canvas, slide, options.chartBucket || []);
  });
}

function createElementNode(element, slide, options) {
  const node = document.createElement("div");
  node.className = `ps-element ${element.type === "annotation" ? `annotation-${element.style || "info"}` : ""} ${options.interactive && element.id === ps.selectedElementId ? "selected" : ""}`;
  node.dataset.elementId = element.id;
  node.dataset.type = element.type;
  node.style.left = `${element.x}%`;
  node.style.top = `${element.y}%`;
  node.style.width = `${element.w}%`;
  node.style.height = `${element.h}%`;
  node.style.borderRadius = `${Number(element.radius) || 0}px`;
  if (element.background && element.background !== "transparent" && element.type !== "annotation") node.style.background = element.background;
  if (element.borderColor && element.borderColor !== "transparent") node.style.borderColor = element.borderColor;
  if (element.color) node.style.color = element.color;

  const content = document.createElement("div");
  content.className = "ps-element-content";
  content.style.fontSize = `${Number(element.fontSize) || 12}px`;
  content.style.fontWeight = element.bold ? "800" : "500";
  content.style.textAlign = element.align || "left";
  fillElementContent(content, element, slide);
  node.appendChild(content);

  if (options.interactive) {
    const badge = document.createElement("span");
    badge.className = "ps-selection-badge";
    badge.textContent = elementTypeLabel(element.type);
    node.appendChild(badge);
    const handle = document.createElement("span");
    handle.className = "ps-resize-handle";
    handle.dataset.resizeHandle = "true";
    node.appendChild(handle);
  }
  return node;
}

function fillElementContent(content, element) {
  const m = getPresentationMetrics();
  if (["title", "text", "ai_summary", "annotation"].includes(element.type)) {
    content.textContent = element.text || "";
    return;
  }
  if (element.type === "kpi") {
    const metric = presentationMetric(element.metric, m);
    content.innerHTML = `<span class="ps-kpi-label">${escapeHtml(element.label || metric.label)}</span><strong class="ps-kpi-value">${escapeHtml(metric.formatted)}</strong><small class="ps-kpi-sub">${escapeHtml(metric.subtext)}</small>`;
    return;
  }
  if (element.type === "chart") {
    content.innerHTML = `<strong class="ps-chart-title">${escapeHtml(element.title || "Project chart")}</strong><div class="ps-chart-canvas-wrap"><canvas data-ps-chart-id="${escapeHtml(element.id)}"></canvas></div>`;
    return;
  }
  if (element.type === "table") {
    const rows = getPresentationTableRows(element.tableSource);
    content.innerHTML = `<table class="ps-mini-table"><thead><tr><th>Item</th><th>Owner</th><th>Progress</th><th>Status</th></tr></thead><tbody>${rows.map(row => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.owner)}</td><td>${escapeHtml(String(row.progress))}%</td><td class="ps-mini-status">${escapeHtml(row.status)}</td></tr>`).join("")}</tbody></table>`;
    return;
  }
  if (element.type === "photo") {
    const fit = element.fit === "contain" ? "contain" : "cover";
    content.innerHTML = `<div class="ps-photo-image ${element.src ? "" : "empty"}" style="${element.src ? `background-image:url('${cssUrl(element.src)}');background-size:${fit};background-repeat:no-repeat` : ""}"></div><div class="ps-photo-caption">${escapeHtml(element.caption || "Site progress photograph")}</div>`;
    return;
  }
  if (element.type === "comparison") {
    const previous = numberOrZero(element.previousValue);
    const current = numberOrZero(element.currentValue);
    const variance = current - previous;
    const arrow = variance >= 0 ? "↑" : "↓";
    content.innerHTML = `<div class="ps-comparison-side"><span class="ps-comparison-label">${escapeHtml(element.previousLabel || "Previous")}</span><strong class="ps-comparison-value">${escapeHtml(formatComparisonValue(previous, element.unit))}</strong></div><div class="ps-comparison-arrow"><span>${arrow}</span><small>${variance >= 0 ? "+" : ""}${formatComparisonValue(variance, element.unit)}</small></div><div class="ps-comparison-side"><span class="ps-comparison-label">${escapeHtml(element.currentLabel || "Current")}</span><strong class="ps-comparison-value">${escapeHtml(formatComparisonValue(current, element.unit))}</strong></div>`;
    return;
  }
  if (element.type === "progress") {
    const metric = presentationMetric(element.metric || "progress", m);
    const percentage = clamp(metric.raw, 0, 100);
    content.innerHTML = `<div class="ps-progress-copy"><span>${escapeHtml(element.label || metric.label)}</span><strong>${Math.round(percentage)}%</strong></div><div class="ps-progress-track"><span style="width:${percentage}%"></span></div>`;
  }
}

function renderSlideCharts(canvas, slide, bucket) {
  if (typeof Chart === "undefined") return;
  slide.elements.filter(element => element.type === "chart").forEach(element => {
    const chartCanvas = canvas.querySelector(`[data-ps-chart-id="${cssEscape(element.id)}"]`);
    if (!chartCanvas) return;
    try {
      const config = presentationChartConfig(element);
      const chart = new Chart(chartCanvas.getContext("2d"), config);
      bucket.push(chart);
    } catch (error) {
      console.warn("Presentation chart could not render", error);
    }
  });
}

function presentationChartConfig(element) {
  const m = getPresentationMetrics();
  const source = element.source || "cost";
  const primary = element.primary || themeForSlide(currentSlide()).accent;
  const secondary = element.secondary || "#9aa8ae";
  let labels = [];
  let datasets = [];
  if (source === "cost") {
    labels = m.rows.map(row => shortPresentationDate(row.date));
    let planned = 0, actual = 0;
    datasets = [
      { label: "Planned cost", data: m.rows.map(row => planned += numberOrZero(row.plannedCost)), borderColor: secondary, backgroundColor: hexToRgba(secondary, .25), fill: element.chartType === "line", tension: .35 },
      { label: "Actual cost", data: m.rows.map(row => actual += numberOrZero(row.actualCost)), borderColor: primary, backgroundColor: hexToRgba(primary, .55), fill: element.chartType === "line", tension: .35 }
    ];
  } else if (source === "progress") {
    labels = m.rows.map(row => shortPresentationDate(row.date));
    datasets = [
      { label: "Planned progress", data: m.rows.map(row => numberOrZero(row.plannedProgress)), borderColor: secondary, backgroundColor: hexToRgba(secondary, .35), tension: .35 },
      { label: "Actual progress", data: m.rows.map(row => numberOrZero(row.actualProgress)), borderColor: primary, backgroundColor: hexToRgba(primary, .55), tension: .35 }
    ];
  } else if (source === "category") {
    labels = Object.keys(m.categories || {});
    datasets = [{ label: "Actual spend", data: Object.values(m.categories || {}), backgroundColor: chartPalette(primary, secondary, labels.length), borderWidth: 0 }];
  } else if (source === "labour") {
    labels = m.rows.map(row => shortPresentationDate(row.date));
    datasets = [{ label: "Labour hours", data: m.rows.map(row => numberOrZero(row.labourHours)), borderColor: primary, backgroundColor: hexToRgba(primary, .45), tension: .35, fill: element.chartType === "line" }];
  } else {
    labels = ["Low", "Medium", "High", "Critical"];
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    m.rows.forEach(row => counts[String(row.riskLevel || "low").toLowerCase()] = (counts[String(row.riskLevel || "low").toLowerCase()] || 0) + 1);
    datasets = [{ label: "Reporting periods", data: labels.map(label => counts[label.toLowerCase()] || 0), backgroundColor: ["#3aaa77", "#e7bd37", "#e88735", "#c74444"], borderWidth: 0 }];
  }
  const horizontal = element.chartType === "horizontalBar";
  const type = horizontal ? "bar" : element.chartType || "line";
  return {
    type,
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false, indexAxis: horizontal ? "y" : "x",
      plugins: { legend: { display: element.legend !== false, position: "top", labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { size: 8 } } }, tooltip: { callbacks: { label: context => formatChartTooltip(source, context.parsed.y ?? context.parsed.x ?? context.raw) } } },
      scales: ["doughnut", "pie", "radar", "polarArea"].includes(type) ? {} : {
        x: { grid: { display: element.grid !== false, color: "rgba(120,135,145,.12)" }, ticks: { font: { size: 8 }, color: "#718087" } },
        y: { beginAtZero: true, grid: { display: element.grid !== false, color: "rgba(120,135,145,.12)" }, ticks: { font: { size: 8 }, color: "#718087", callback: value => source === "cost" || source === "category" ? compactPresentationMoney(value) : value } }
      }
    }
  };
}

function renderInspector() {
  const slide = currentSlide();
  const element = selectedElement();
  pse.psEmptySelection.hidden = Boolean(element);
  pse.psElementInspector.hidden = !element;
  if (element) {
    pse.psSelectedType.textContent = elementTypeLabel(element.type);
    pse.psSelectedId.textContent = element.id;
    setControlValue(pse.psElementText, element.text || "");
    setControlValue(pse.psFontSize, element.fontSize || 12);
    setControlValue(pse.psTextAlign, element.align || "left");
    pse.psBoldToggle.checked = Boolean(element.bold);
    setControlValue(pse.psKpiMetric, element.metric || "progress");
    setControlValue(pse.psKpiLabel, element.label || "");
    setControlValue(pse.psChartTitle, element.title || "");
    setControlValue(pse.psChartType, element.chartType || "line");
    setControlValue(pse.psChartSource, element.source || "cost");
    setControlValue(pse.psChartPrimary, normalizeColor(element.primary, "#0d7b69"));
    setControlValue(pse.psChartSecondary, normalizeColor(element.secondary, "#9aa8ae"));
    pse.psChartLegend.checked = element.legend !== false;
    pse.psChartGrid.checked = element.grid !== false;
    setControlValue(pse.psPhotoCaption, element.caption || "");
    setControlValue(pse.psPhotoFit, element.fit || "cover");
    setControlValue(pse.psAiTone, element.tone || "executive");
    setControlValue(pse.psAiLength, element.length || "short");
    setControlValue(pse.psComparisonTitle, element.title || "Period comparison");
    setControlValue(pse.psPreviousLabel, element.previousLabel || "Previous");
    setControlValue(pse.psCurrentLabel, element.currentLabel || "Current");
    setControlValue(pse.psPreviousValue, numberOrZero(element.previousValue));
    setControlValue(pse.psCurrentValue, numberOrZero(element.currentValue));
    setControlValue(pse.psComparisonUnit, element.unit || "%");
    setControlValue(pse.psAnnotationStyle, element.style || "info");
    setControlValue(pse.psElementBackground, normalizeColor(element.background, "#ffffff"));
    setControlValue(pse.psElementColor, normalizeColor(element.color, themeForSlide(slide).text));
    setControlValue(pse.psElementBorder, normalizeColor(element.borderColor, "#dce4e7"));
    setControlValue(pse.psElementRadius, Number(element.radius) || 0);
    setControlValue(pse.psElementX, round1(element.x)); setControlValue(pse.psElementY, round1(element.y)); setControlValue(pse.psElementW, round1(element.w)); setControlValue(pse.psElementH, round1(element.h));

    pse.psTextControls.hidden = !["title", "text", "ai_summary", "annotation"].includes(element.type);
    pse.psKpiControls.hidden = element.type !== "kpi" && element.type !== "progress";
    pse.psChartControls.hidden = element.type !== "chart";
    pse.psPhotoControls.hidden = element.type !== "photo";
    pse.psAiControls.hidden = element.type !== "ai_summary";
    pse.psComparisonControls.hidden = element.type !== "comparison";
    pse.psAnnotationControls.hidden = element.type !== "annotation";
  }
  if (slide) {
    setControlValue(pse.psSlideTitle, slide.title || "");
    setControlValue(pse.psSlideBackground, normalizeColor(slide.background, themeForSlide(slide).bg));
    pse.psSlideHidden.checked = Boolean(slide.hidden);
  }
  document.querySelectorAll("[data-ps-theme]").forEach(button => button.classList.toggle("active", button.dataset.psTheme === ps.data.theme));
}

function syncPresentationToolbar() {
  if (pse.psDeckTitle) pse.psDeckTitle.textContent = ps.data.name || `${projectName()} presentation`;
  pse.psThemeSelect.value = ps.data.theme;
  pse.psRatioSelect.value = ps.data.ratio;
  pse.psZoomRange.value = ps.data.zoom;
  pse.psZoomValue.textContent = `${ps.data.zoom}%`;
  pse.psSpeakerNotes.value = currentSlide()?.notes || "";
  pse.psDeleteSlideButton.disabled = ps.data.slides.length <= 1;
}

function applyCanvasZoom() {
  if (!pse.psCanvasShell || !pse.psCanvasWorkspace || !ps.data) return;
  const ratio = ps.data.ratio === "4:3" ? 4 / 3 : ps.data.ratio === "a4" ? 1.414 : ps.data.ratio === "a4p" ? 1 / 1.414 : 16 / 9;
  const horizontalPadding = window.innerWidth < 760 ? 24 : 48;
  const verticalPadding = window.innerWidth < 760 ? 24 : 48;
  const availableWidth = Math.max(280, pse.psCanvasWorkspace.clientWidth - horizontalPadding);
  const availableHeight = Math.max(190, pse.psCanvasWorkspace.clientHeight - verticalPadding);
  const fittedWidth = Math.min(1280, availableWidth, availableHeight * ratio);
  const zoomFactor = clamp(Number(ps.data.zoom) || 100, 30, 200) / 100;
  pse.psCanvasShell.style.width = `${Math.max(260, fittedWidth * zoomFactor)}px`;
  pse.psZoomValue.textContent = `${Math.round(ps.data.zoom)}%`;
}

function setInspectorTab(tab) {
  ps.inspectorTab = tab;
  document.querySelectorAll("[data-ps-inspector-tab]").forEach(button => button.classList.toggle("active", button.dataset.psInspectorTab === tab));
  document.querySelectorAll("[data-ps-inspector-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.psInspectorPanel === tab));
}

function handleCanvasClick(event) {
  const elementNode = event.target.closest(".ps-element");
  if (!elementNode) {
    ps.selectedElementId = null;
    renderCurrentSlide();
    renderInspector();
    return;
  }
  ps.selectedElementId = elementNode.dataset.elementId;
  renderCurrentSlide();
  renderInspector();
}

function handleCanvasDoubleClick(event) {
  const node = event.target.closest(".ps-element");
  if (!node) return;
  const element = findElement(node.dataset.elementId);
  if (!element) return;
  if (element.type === "photo") {
    ps.pendingPhotoElementId = element.id;
    pse.psPhotoInput.click();
    return;
  }
  if (!["title", "text", "ai_summary", "annotation"].includes(element.type)) return;
  const content = node.querySelector(".ps-element-content");
  if (!content) return;
  const before = snapshotDeck();
  node.classList.add("is-editing");
  content.contentEditable = "true";
  content.focus();
  selectAllText(content);
  const finish = () => {
    content.contentEditable = "false";
    node.classList.remove("is-editing");
    element.text = content.textContent.trim();
    commitSnapshot(before);
    savePresentationDeck();
    renderPresentationStudio();
  };
  content.addEventListener("blur", finish, { once: true });
  content.addEventListener("keydown", keyEvent => {
    if (keyEvent.key === "Escape") { keyEvent.preventDefault(); content.blur(); }
  });
}

function startElementPointerInteraction(event) {
  if (event.button !== 0) return;
  const node = event.target.closest(".ps-element");
  if (!node || event.target.closest('[contenteditable="true"]')) return;
  const element = findElement(node.dataset.elementId);
  if (!element) return;
  event.preventDefault();
  ps.selectedElementId = element.id;
  const canvasRect = pse.psSlideCanvas.getBoundingClientRect();
  ps.drag = {
    mode: event.target.closest("[data-resize-handle]") ? "resize" : "move",
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    original: { x: element.x, y: element.y, w: element.w, h: element.h },
    canvasRect,
    before: snapshotDeck(),
    changed: false
  };
  renderInspector();
  node.classList.add("selected");
}

function moveElementPointerInteraction(event) {
  if (!ps.drag || event.pointerId !== ps.drag.pointerId) return;
  const element = selectedElement();
  if (!element) return;
  const dx = ((event.clientX - ps.drag.startX) / ps.drag.canvasRect.width) * 100;
  const dy = ((event.clientY - ps.drag.startY) / ps.drag.canvasRect.height) * 100;
  if (ps.drag.mode === "move") {
    element.x = clamp(ps.drag.original.x + dx, 0, 100 - element.w);
    element.y = clamp(ps.drag.original.y + dy, 0, 100 - element.h);
  } else {
    element.w = clamp(ps.drag.original.w + dx, 5, 100 - element.x);
    element.h = clamp(ps.drag.original.h + dy, 4, 100 - element.y);
  }
  ps.drag.changed = true;
  const node = pse.psSlideCanvas.querySelector(`[data-element-id="${cssEscape(element.id)}"]`);
  if (node) {
    node.style.left = `${element.x}%`; node.style.top = `${element.y}%`; node.style.width = `${element.w}%`; node.style.height = `${element.h}%`;
  }
  setControlValue(pse.psElementX, round1(element.x)); setControlValue(pse.psElementY, round1(element.y)); setControlValue(pse.psElementW, round1(element.w)); setControlValue(pse.psElementH, round1(element.h));
}

function endElementPointerInteraction(event) {
  if (!ps.drag || event.pointerId !== ps.drag.pointerId) return;
  if (ps.drag.changed) commitSnapshot(ps.drag.before);
  ps.drag = null;
  savePresentationDeck();
}

function addSlideFromTemplate(template) {
  const slide = makeSlide(template);
  withHistory(() => {
    const index = ps.data.slides.findIndex(item => item.id === ps.data.currentSlideId);
    ps.data.slides.splice(index + 1, 0, slide);
    ps.data.currentSlideId = slide.id;
  });
  ps.selectedElementId = null;
  renderPresentationStudio();
  psToast(`${templateLabel(template)} slide added.`);
}

function addElementToCurrentSlide(type, position = {}) {
  const slide = currentSlide();
  if (!slide) return;
  const element = defaultElement(type, position);
  withHistory(() => slide.elements.push(element));
  ps.selectedElementId = element.id;
  renderPresentationStudio();
  setInspectorTab("element");
}

function duplicateCurrentSlide() {
  const slide = currentSlide(); if (!slide) return;
  const copy = clone(slide);
  copy.id = uid("slide"); copy.title = `${slide.title} copy`;
  copy.elements = copy.elements.map(element => ({ ...element, id: uid("element") }));
  withHistory(() => {
    const index = ps.data.slides.findIndex(item => item.id === slide.id);
    ps.data.slides.splice(index + 1, 0, copy);
    ps.data.currentSlideId = copy.id;
  });
  ps.selectedElementId = null;
  renderPresentationStudio();
}

function deleteCurrentSlide() {
  if (ps.data.slides.length <= 1) return;
  const index = ps.data.slides.findIndex(slide => slide.id === ps.data.currentSlideId);
  withHistory(() => {
    ps.data.slides.splice(index, 1);
    ps.data.currentSlideId = ps.data.slides[Math.max(0, index - 1)].id;
  });
  ps.selectedElementId = null;
  renderPresentationStudio();
}

function duplicateSelectedElement() {
  const slide = currentSlide(); const element = selectedElement();
  if (!slide || !element) return;
  const copy = { ...clone(element), id: uid("element"), x: clamp(element.x + 3, 0, 100 - element.w), y: clamp(element.y + 3, 0, 100 - element.h) };
  withHistory(() => slide.elements.push(copy));
  ps.selectedElementId = copy.id;
  renderPresentationStudio();
}

function deleteSelectedElement() {
  const slide = currentSlide(); if (!slide || !ps.selectedElementId) return;
  withHistory(() => slide.elements = slide.elements.filter(element => element.id !== ps.selectedElementId));
  ps.selectedElementId = null;
  renderPresentationStudio();
}

function applyTheme(themeId) {
  if (!PS_THEME_CATALOG[themeId]) return;
  withHistory(() => ps.data.theme = themeId);
  renderPresentationStudio();
  psToast(`${PS_THEME_CATALOG[themeId].name} theme applied.`);
}

function addAnnotation(style = "info") {
  const labels = { info: "Add supporting context for this result.", warning: "Attention required: review the highlighted variance.", success: "Milestone achieved and verified.", decision: "Decision required from the client or management team." };
  addElementToCurrentSlide("annotation", { style, text: labels[style] || labels.info, x: 60, y: 67, w: 34, h: 17 });
}

function regenerateSelectedAiSummary() {
  const element = selectedElement();
  if (!element || element.type !== "ai_summary") return;
  withHistory(() => element.text = generateAiSummary(element.tone || "executive", element.length || "short", getPresentationMetrics()));
  renderPresentationStudio();
  psToast("Summary regenerated from the current project data.");
}

function createComparisonSlideFromControls() {
  const metricKey = pse.psComparisonMetric.value;
  const metric = presentationMetric(metricKey, getPresentationMetrics());
  const current = metric.raw;
  const previous = estimatePreviousMetric(metricKey, current);
  const slide = makeSlide("comparison", { title: `${metric.label} comparison` });
  const comparison = slide.elements.find(element => element.type === "comparison");
  comparison.title = `${metric.label} comparison`;
  comparison.previousLabel = pse.psDeckPreviousLabel.value || "Previous period";
  comparison.currentLabel = pse.psDeckCurrentLabel.value || "Current period";
  comparison.previousValue = previous;
  comparison.currentValue = current;
  comparison.unit = metric.unit;
  withHistory(() => {
    const index = ps.data.slides.findIndex(item => item.id === ps.data.currentSlideId);
    ps.data.slides.splice(index + 1, 0, slide);
    ps.data.currentSlideId = slide.id;
  });
  ps.selectedElementId = comparison.id;
  renderPresentationStudio();
  setInspectorTab("element");
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0];
  const element = findElement(ps.pendingPhotoElementId);
  event.target.value = "";
  ps.pendingPhotoElementId = null;
  if (!file || !element || element.type !== "photo") return;
  if (!file.type.startsWith("image/")) return psToast("Choose a PNG, JPG, or WebP image.");
  if (file.size > 8 * 1024 * 1024) return psToast("Use an image smaller than 8 MB for this browser prototype.");
  const reader = new FileReader();
  reader.onload = () => {
    withHistory(() => element.src = reader.result);
    ps.selectedElementId = element.id;
    renderPresentationStudio();
    psToast("Site photograph added.");
  };
  reader.readAsDataURL(file);
}

function resetPresentationDeck() {
  if (!window.confirm("Create a fresh presentation deck from the active project? Your current slide edits will be replaced.")) return;
  ps.undo.push(snapshotDeck());
  ps.redo = [];
  ps.data = createDefaultPresentationDeck();
  ps.selectedElementId = null;
  savePresentationDeck();
  renderPresentationStudio();
  psToast("A new project presentation was created.");
}

function openPresenterMode() {
  const slides = visibleSlides();
  if (!slides.length) return psToast("Unhide at least one slide before presenting.");
  const currentIndex = slides.findIndex(slide => slide.id === ps.data.currentSlideId);
  ps.presenterIndex = Math.max(0, currentIndex);
  pse.psPresenter.classList.add("open");
  pse.psPresenter.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderPresenterSlide();
  if (document.fullscreenEnabled && !navigator.webdriver) pse.psPresenter.requestFullscreen?.().catch(() => {});
}

function renderPresenterSlide() {
  destroyCharts(ps.presenterCharts);
  ps.presenterCharts = [];
  const slides = visibleSlides();
  if (!slides.length) return;
  ps.presenterIndex = clamp(ps.presenterIndex, 0, slides.length - 1);
  const slide = slides[ps.presenterIndex];
  pse.psPresenterStage.innerHTML = "";
  const canvas = document.createElement("div");
  canvas.className = "ps-slide-canvas";
  pse.psPresenterStage.appendChild(canvas);
  renderSlideInto(slide, canvas, { interactive: false, chartBucket: ps.presenterCharts });
  pse.psPresenterCounter.textContent = `${ps.presenterIndex + 1} / ${slides.length}`;
  pse.psPresenterNotes.querySelector("p").textContent = slide.notes || "No speaker notes for this slide.";
}

function movePresenter(direction) {
  const slides = visibleSlides();
  ps.presenterIndex = clamp(ps.presenterIndex + direction, 0, Math.max(0, slides.length - 1));
  renderPresenterSlide();
}

function closePresenterMode() {
  pse.psPresenter.classList.remove("open", "laser-on");
  pse.psPresenter.setAttribute("aria-hidden", "true");
  pse.psPresenterNotes.hidden = true;
  ps.laser = false;
  document.body.style.overflow = "";
  destroyCharts(ps.presenterCharts);
  ps.presenterCharts = [];
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
}

function togglePresenterNotes() {
  pse.psPresenterNotes.hidden = !pse.psPresenterNotes.hidden;
  pse.psPresenterNotesButton.classList.toggle("active", !pse.psPresenterNotes.hidden);
}

function togglePresenterLaser() {
  ps.laser = !ps.laser;
  pse.psPresenter.classList.toggle("laser-on", ps.laser);
  pse.psPresenterLaserButton.classList.toggle("active", ps.laser);
}

function handlePresentationKeyboard(event) {
  if (pse.psPresenter.classList.contains("open")) {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); movePresenter(1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); movePresenter(-1); }
    if (event.key === "Escape") closePresenterMode();
    if (event.key.toLowerCase() === "n") togglePresenterNotes();
    if (event.key.toLowerCase() === "l") togglePresenterLaser();
    return;
  }
  const active = document.activeElement;
  if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redoPresentation() : undoPresentation(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); redoPresentation(); }
  if (event.key === "Delete" && ps.selectedElementId) deleteSelectedElement();
}

function openPresentationExport() {
  updateExportPreview();
  pse.psExportStatus.classList.add("hidden");
  pse.psExportModal.classList.add("open");
  pse.psExportModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePresentationExport() {
  pse.psExportModal.classList.remove("open");
  pse.psExportModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateExportPreview() {
  const slides = exportTargetSlides();
  const deckRatioLabel = ps.data.ratio === "a4p" ? "A4 portrait" : ps.data.ratio === "a4" ? "A4 landscape" : ps.data.ratio;
  const ratio = pse.psExportLayout.value === "deck" ? deckRatioLabel : pse.psExportLayout.value === "standard" ? "4:3" : pse.psExportLayout.value === "a4" ? "A4 landscape" : pse.psExportLayout.value === "a4p" ? "A4 portrait" : "16:9";
  pse.psExportPreview.querySelector("span").textContent = ratio;
  pse.psExportPreviewTitle.textContent = ps.data.name;
  pse.psExportPreviewSlides.textContent = `${slides.length} slide${slides.length === 1 ? "" : "s"}`;
  const theme = PS_THEME_CATALOG[ps.data.theme];
  pse.psExportPreview.style.background = `linear-gradient(135deg,${theme.dark},${theme.accent})`;
}

async function runPresentationExport() {
  const format = document.querySelector('input[name="psExportFormat"]:checked')?.value || "pptx";
  const slides = exportTargetSlides();
  if (!slides.length) return psToast("There are no visible slides to export.");
  const options = {
    format,
    slides: pse.psExportAppendix.checked ? [...slides, makeAppendixSlide()] : slides,
    layout: resolveExportRatio(),
    quality: Number(pse.psExportQuality.value) || 2,
    includeNotes: pse.psExportNotes.checked,
    pageNumbers: pse.psExportPageNumbers.checked,
    watermark: pse.psExportWatermark.checked ? (pse.psExportWatermarkText.value.trim() || "CONFIDENTIAL") : "",
    fileName: sanitizeFileName(pse.psExportFileName.value || "Civentraq-project-presentation")
  };
  pse.psExportStatus.classList.remove("hidden");
  pse.psRunExportButton.disabled = true;
  try {
    setPresentationExportStatus("Rendering slides at presentation quality…");
    const captures = await capturePresentationSlides(options);
    setPresentationExportStatus(`Building ${format.toUpperCase()} file…`);
    if (format === "pptx") await exportPresentationPptx(captures, options);
    else if (format === "pdf") await exportPresentationPdf(captures, options);
    else if (format === "png") await exportPresentationPng(captures, options);
    else await exportPresentationDoc(captures, options);
    setPresentationExportStatus("Export complete.");
    psToast("Presentation exported successfully.");
    setTimeout(closePresentationExport, 700);
  } catch (error) {
    console.error(error);
    setPresentationExportStatus(error.message || "The presentation could not be exported.");
    psToast(error.message || "Export failed. Refresh the page and try again.");
  } finally {
    pse.psRunExportButton.disabled = false;
    cleanupExportClones();
  }
}

async function capturePresentationSlides(options) {
  if (typeof html2canvas === "undefined") throw new Error("The image export library did not load. Check your internet connection and refresh.");
  const captures = [];
  for (let index = 0; index < options.slides.length; index += 1) {
    setPresentationExportStatus(`Rendering slide ${index + 1} of ${options.slides.length}…`);
    const shell = document.createElement("div");
    shell.className = "ps-slide-export-clone";
    const canvas = document.createElement("div");
    canvas.className = "ps-slide-canvas";
    shell.appendChild(canvas);
    document.body.appendChild(shell);
    const charts = [];
    renderSlideInto(options.slides[index], canvas, { interactive: false, chartBucket: charts, ratio: options.layout, watermark: options.watermark, pageNumber: options.pageNumbers ? `${index + 1}` : "" });
    await wait(180);
    const capture = await html2canvas(canvas, { scale: options.quality, useCORS: true, allowTaint: false, backgroundColor: null, logging: false });
    captures.push({ dataUrl: capture.toDataURL("image/png", .96), width: capture.width, height: capture.height, slide: options.slides[index] });
    destroyCharts(charts);
    shell.remove();
  }
  return captures;
}

async function exportPresentationPptx(captures, options) {
  if (typeof PptxGenJS === "undefined") throw new Error("PowerPoint export did not load. Check your internet connection and refresh.");
  const pptx = new PptxGenJS();
  if (options.layout === "4:3") pptx.layout = "LAYOUT_4X3";
  else if (options.layout === "a4") {
    pptx.defineLayout({ name: "A4_LANDSCAPE", width: 11.69, height: 8.27 });
    pptx.layout = "A4_LANDSCAPE";
  } else if (options.layout === "a4p") {
    pptx.defineLayout({ name: "A4_PORTRAIT", width: 8.27, height: 11.69 });
    pptx.layout = "A4_PORTRAIT";
  } else pptx.layout = "LAYOUT_WIDE";
  pptx.author = companyNameForPresentation();
  pptx.company = companyNameForPresentation();
  pptx.subject = projectName();
  pptx.title = ps.data.name;
  pptx.lang = "en-ZA";
  captures.forEach(capture => {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    const dimensions = pptx.layout === "LAYOUT_4X3" ? { w: 10, h: 7.5 } : pptx.layout === "A4_LANDSCAPE" ? { w: 11.69, h: 8.27 } : pptx.layout === "A4_PORTRAIT" ? { w: 8.27, h: 11.69 } : { w: 13.333, h: 7.5 };
    slide.addImage({ data: capture.dataUrl, x: 0, y: 0, w: dimensions.w, h: dimensions.h });
    if (options.includeNotes && capture.slide.notes && typeof slide.addNotes === "function") slide.addNotes(capture.slide.notes);
  });
  await pptx.writeFile({ fileName: `${options.fileName}.pptx` });
}

async function exportPresentationPdf(captures, options) {
  if (!window.jspdf?.jsPDF) throw new Error("PDF export did not load. Check your internet connection and refresh.");
  const { jsPDF } = window.jspdf;
  const first = captures[0];
  const orientation = first.height > first.width ? "portrait" : "landscape";
  const doc = new jsPDF({ orientation, unit: "px", format: [first.width, first.height], compress: true, hotfixes: ["px_scaling"] });
  captures.forEach((capture, index) => {
    if (index) doc.addPage([capture.width, capture.height], capture.height > capture.width ? "portrait" : "landscape");
    doc.addImage(capture.dataUrl, "PNG", 0, 0, capture.width, capture.height, undefined, "FAST");
    if (options.includeNotes && capture.slide.notes) {
      doc.addPage([capture.width, capture.height], capture.height > capture.width ? "portrait" : "landscape");
      doc.setFillColor(250, 251, 252); doc.rect(0, 0, capture.width, capture.height, "F");
      doc.setTextColor(25, 38, 45); doc.setFontSize(22); doc.text(`Speaker notes — ${capture.slide.title || `Slide ${index + 1}`}`, 42, 58, { maxWidth: capture.width - 84 });
      doc.setTextColor(75, 88, 96); doc.setFontSize(12); doc.text(capture.slide.notes, 42, 104, { maxWidth: capture.width - 84, lineHeightFactor: 1.45 });
    }
  });
  doc.save(`${options.fileName}.pdf`);
}

async function exportPresentationPng(captures, options) {
  for (let index = 0; index < captures.length; index += 1) {
    downloadDataUrl(captures[index].dataUrl, `${options.fileName}-slide-${String(index + 1).padStart(2, "0")}.png`);
    await wait(180);
  }
}

async function exportPresentationDoc(captures, options) {
  const pages = captures.map((capture, index) => `<section class="page"><img src="${capture.dataUrl}" alt="Slide ${index + 1}" />${options.includeNotes && capture.slide.notes ? `<div class="notes"><b>Speaker notes:</b> ${escapeHtml(capture.slide.notes)}</div>` : ""}</section>`).join("");
  const pageOrientation = options.layout === "a4p" ? "portrait" : "landscape";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(ps.data.name)}</title><style>@page{size:${pageOrientation};margin:10mm}body{font-family:Arial,sans-serif;margin:0;color:#222}.page{page-break-after:always;margin:0 0 24px}.page:last-child{page-break-after:auto}img{display:block;width:100%;height:auto}.notes{font-size:10pt;padding:10px 0;color:#555}h1{font-size:20pt}</style></head><body><h1>${escapeHtml(ps.data.name)}</h1>${pages}</body></html>`;
  downloadBlob(new Blob(["\ufeff", html], { type: "application/msword" }), `${options.fileName}.doc`);
}

function makeAppendixSlide() {
  const m = getPresentationMetrics();
  const slide = makeSlide("blank", { title: "Data and reporting appendix" });
  slide.elements = [
    defaultElement("title", { x: 5, y: 6, w: 90, h: 10, text: "Data and reporting appendix", fontSize: 29 }),
    defaultElement("text", { x: 5, y: 21, w: 44, h: 55, fontSize: 13, text: `Active project\n${projectName()}\n\nClient\n${projectClient()}\n\nLocation\n${projectLocation()}\n\nReporting date\n${presentationDate()}\n\nDataset rows\n${m.rows.length}` }),
    defaultElement("text", { x: 53, y: 21, w: 42, h: 55, fontSize: 13, text: `Approved budget\n${compactPresentationMoney(projectBudget())}\n\nActual spend\n${compactPresentationMoney(m.actualTotal)}\n\nActual progress\n${Math.round(m.actualProgress)}%\n\nLabour hours\n${Math.round(m.labourHours).toLocaleString("en-ZA")}\n\nSource\nActive Civentraq project-performance dataset` })
  ];
  return slide;
}

function exportTargetSlides() {
  if (pse.psExportRange?.value === "current") return currentSlide() ? [currentSlide()] : [];
  return visibleSlides();
}

function resolveExportRatio() {
  const layout = pse.psExportLayout.value;
  if (layout === "deck") return ps.data.ratio;
  if (layout === "standard") return "4:3";
  if (layout === "a4") return "a4";
  if (layout === "a4p") return "a4p";
  return "16:9";
}

function setPresentationExportStatus(text) {
  pse.psExportStatusText.textContent = text;
}

function cleanupExportClones() {
  document.querySelectorAll(".ps-slide-export-clone").forEach(node => node.remove());
  destroyCharts(ps.exportCharts); ps.exportCharts = [];
}

function currentSlide() {
  return ps.data?.slides?.find(slide => slide.id === ps.data.currentSlideId) || ps.data?.slides?.[0] || null;
}

function visibleSlides() {
  return (ps.data?.slides || []).filter(slide => !slide.hidden);
}

function selectedElement() {
  return findElement(ps.selectedElementId);
}

function findElement(id) {
  if (!id || !ps.data) return null;
  for (const slide of ps.data.slides) {
    const element = slide.elements.find(item => item.id === id);
    if (element) return element;
  }
  return null;
}

function getPresentationMetrics() {
  try {
    if (typeof calculateMetrics === "function") return calculateMetrics();
  } catch (error) {
    console.warn("Using fallback presentation metrics", error);
  }
  const rows = typeof state !== "undefined" && Array.isArray(state.rows) ? state.rows : [];
  const actualTotal = rows.reduce((sum, row) => sum + numberOrZero(row.actualCost), 0);
  const plannedTotal = rows.reduce((sum, row) => sum + numberOrZero(row.plannedCost), 0);
  const labourHours = rows.reduce((sum, row) => sum + numberOrZero(row.labourHours), 0);
  const latest = rows[rows.length - 1] || {};
  const actualProgress = numberOrZero(latest.actualProgress);
  const plannedProgress = numberOrZero(latest.plannedProgress);
  const categories = {};
  rows.forEach(row => categories[row.category || "Uncategorised"] = (categories[row.category || "Uncategorised"] || 0) + numberOrZero(row.actualCost));
  return { rows, actualTotal, plannedTotal, labourHours, latest, actualProgress, plannedProgress, progressVariance: actualProgress - plannedProgress, remainingBudget: projectBudget() - actualTotal, spendPercent: projectBudget() ? actualTotal / projectBudget() * 100 : 0, predictedFinalCost: actualProgress ? actualTotal / (actualProgress / 100) : actualTotal, daysRemaining: 0, riskRows: 0, healthScore: 70, categories };
}

function presentationMetric(key, m = getPresentationMetrics()) {
  const map = {
    budget: { label: "Approved budget", raw: projectBudget(), formatted: compactPresentationMoney(projectBudget()), unit: "R", subtext: "Client-approved project value" },
    spent: { label: "Actual spend", raw: m.actualTotal, formatted: compactPresentationMoney(m.actualTotal), unit: "R", subtext: `${(m.spendPercent || 0).toFixed(1)}% of budget` },
    remaining: { label: "Remaining budget", raw: m.remainingBudget, formatted: compactPresentationMoney(m.remainingBudget), unit: "R", subtext: "Available before forecast adjustments" },
    progress: { label: "Actual progress", raw: m.actualProgress, formatted: `${Math.round(m.actualProgress)}%`, unit: "%", subtext: `${Math.abs(Math.round(m.progressVariance))}% ${m.progressVariance < 0 ? "behind" : "ahead of"} plan` },
    variance: { label: "Schedule variance", raw: m.progressVariance, formatted: `${m.progressVariance >= 0 ? "+" : ""}${Math.round(m.progressVariance)}%`, unit: "%", subtext: "Actual less planned progress" },
    days: { label: "Days remaining", raw: m.daysRemaining, formatted: Math.round(m.daysRemaining || 0).toLocaleString("en-ZA"), unit: "days", subtext: "Until approved completion date" },
    labour: { label: "Labour hours", raw: m.labourHours, formatted: Math.round(m.labourHours || 0).toLocaleString("en-ZA"), unit: "hours", subtext: "Recorded hours to date" },
    health: { label: "Project health", raw: m.healthScore, formatted: `${Math.round(m.healthScore || 0)}/100`, unit: "", subtext: "Operational project-health score" }
  };
  return map[key] || map.progress;
}

function generateAiSummary(tone = "executive", length = "short", m = getPresentationMetrics()) {
  const progressStatus = m.progressVariance < 0 ? `${Math.abs(Math.round(m.progressVariance))} percentage points behind plan` : `${Math.abs(Math.round(m.progressVariance))} percentage points ahead of plan`;
  const costStatus = m.predictedFinalCost > projectBudget() ? `forecast to exceed the approved budget by ${compactPresentationMoney(m.predictedFinalCost - projectBudget())}` : `forecast to finish within the approved ${compactPresentationMoney(projectBudget())} budget`;
  const riskText = m.riskRows ? `${m.riskRows} high-risk reporting period${m.riskRows === 1 ? "" : "s"} require closure.` : "No high-risk reporting periods are currently recorded.";
  const base = {
    executive: `The project is ${Math.round(m.actualProgress)}% complete and ${progressStatus}. Actual expenditure is ${compactPresentationMoney(m.actualTotal)}, with the final cost ${costStatus}. Management attention should remain on schedule recovery, critical work packages, and protecting the remaining contingency.`,
    client: `Project delivery has reached ${Math.round(m.actualProgress)}% against a planned ${Math.round(m.plannedProgress)}%. Spending currently stands at ${compactPresentationMoney(m.actualTotal)} and the latest forecast is ${costStatus}. The team is implementing focused actions to improve the programme position and maintain transparent client reporting.`,
    technical: `Physical progress is ${Math.round(m.actualProgress)}% versus ${Math.round(m.plannedProgress)}% planned, producing a ${Math.round(m.progressVariance)} percentage-point variance. Cumulative actual cost is ${compactPresentationMoney(m.actualTotal)} against ${compactPresentationMoney(m.plannedTotal)} planned. ${riskText} Forecast final cost is ${compactPresentationMoney(m.predictedFinalCost)}.`,
    concise: `${Math.round(m.actualProgress)}% complete; ${progressStatus}. Actual spend is ${compactPresentationMoney(m.actualTotal)} and the project is ${costStatus}.`
  };
  let text = base[tone] || base.executive;
  if (length === "short") return text.split(". ").slice(0, 2).join(". ").replace(/\.$/, "") + ".";
  if (length === "detailed") text += ` Recorded labour is ${Math.round(m.labourHours || 0).toLocaleString("en-ZA")} hours, with ${Math.round(m.daysRemaining || 0)} days remaining to the approved completion date. Recommended next steps are to confirm package-level recovery targets, close high-priority risks, and validate the cost-to-complete forecast at the next management review.`;
  return text;
}

function getPresentationTableRows() {
  if (typeof WORK_PACKAGES !== "undefined" && Array.isArray(WORK_PACKAGES)) return WORK_PACKAGES.slice(0, 5);
  return [
    { name: "Mechanical installation", owner: "Mechanical", progress: 78, status: "On track" },
    { name: "Electrical reticulation", owner: "Electrical", progress: 64, status: "At risk" },
    { name: "Piping fabrication", owner: "Piping", progress: 58, status: "Delayed" },
    { name: "Instrumentation", owner: "I&C", progress: 46, status: "At risk" }
  ];
}

function themeForSlide() {
  if (ps.data?.theme === "client") {
    try {
      const customization = typeof state !== "undefined" ? state.customization : null;
      return { ...PS_THEME_CATALOG.client, bg: customization?.background || "#f3f5f7", surface: customization?.surface || "#ffffff", accent: customization?.accent || "#0d6b57", accent2: customization?.accent || "#45ad99", text: customization?.text || "#17202a", dark: customization?.sidebar || "#111b22" };
    } catch (_) {}
  }
  return PS_THEME_CATALOG[ps.data?.theme] || PS_THEME_CATALOG.energy;
}

function projectName() { try { return state.project.name || "Active engineering project"; } catch (_) { return "Active engineering project"; } }
function projectClient() { try { return state.project.client || "Client"; } catch (_) { return "Client"; } }
function projectLocation() { try { return state.project.location || "Project site"; } catch (_) { return "Project site"; } }
function projectBudget() { try { return Number(state.project.approvedBudget) || 0; } catch (_) { return 0; } }
function companyNameForPresentation() { try { return state.customization.companyName || "Civentraq"; } catch (_) { return "Civentraq"; } }
function presentationDate() { return new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" }); }
function shortPresentationDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value || "") : date.toLocaleDateString("en-ZA", { month: "short" }); }
function compactPresentationMoney(value) { const n = numberOrZero(value); if (Math.abs(n) >= 1e9) return `R${(n / 1e9).toFixed(2)}bn`; if (Math.abs(n) >= 1e6) return `R${(n / 1e6).toFixed(2)}m`; if (Math.abs(n) >= 1e3) return `R${(n / 1e3).toFixed(1)}k`; return `R${Math.round(n).toLocaleString("en-ZA")}`; }
function formatChartTooltip(source, value) { return source === "cost" || source === "category" ? compactPresentationMoney(value) : source === "progress" ? `${value}%` : Number(value).toLocaleString("en-ZA"); }
function chartPalette(primary, secondary, count) { const base = [primary, secondary, "#e6a23c", "#6f7fd1", "#d65f77", "#58a6a6", "#9a6bb5", "#7f9568"]; return Array.from({ length: count }, (_, index) => base[index % base.length]); }
function hexToRgba(hex, alpha) { const normalized = normalizeColor(hex, "#0d7b69").slice(1); const value = parseInt(normalized, 16); return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${alpha})`; }
function formatComparisonValue(value, unit = "") { if (unit === "R") return compactPresentationMoney(value); if (unit === "%") return `${round1(value)}%`; if (unit) return `${round1(value)} ${unit}`; return round1(value).toLocaleString("en-ZA"); }
function estimatePreviousMetric(key, current) { if (key === "progress") return Math.max(0, current - 8); if (key === "spent") return Math.max(0, current * .82); if (key === "variance") return current - 3; if (key === "labour") return Math.max(0, current * .78); if (key === "health") return Math.max(0, current - 7); return current * .9; }
function templateLabel(template) { return ({ title: "Title slide", executive: "Executive summary", chart: "Chart focus", comparison: "Period comparison", photos: "Photo report", blank: "Blank slide" })[template] || "Blank slide"; }
function elementTypeLabel(type) { return ({ title: "Heading", text: "Text box", ai_summary: "AI summary", kpi: "KPI card", chart: "Chart", table: "Table", photo: "Photo", comparison: "Comparison", progress: "Progress bar", annotation: "Annotation" })[type] || "Element"; }

function withHistory(mutator) {
  const before = snapshotDeck();
  mutator();
  commitSnapshot(before);
  savePresentationDeck();
}

function snapshotDeck() { return JSON.stringify(ps.data); }
function commitSnapshot(before) {
  const after = snapshotDeck();
  if (before === after) return;
  ps.undo.push(before);
  if (ps.undo.length > 60) ps.undo.shift();
  ps.redo = [];
  updateUndoButtons();
}
function undoPresentation() {
  if (!ps.undo.length) return;
  ps.redo.push(snapshotDeck());
  ps.data = normalizePresentationDeck(JSON.parse(ps.undo.pop()));
  ps.selectedElementId = null;
  savePresentationDeck(); renderPresentationStudio();
}
function redoPresentation() {
  if (!ps.redo.length) return;
  ps.undo.push(snapshotDeck());
  ps.data = normalizePresentationDeck(JSON.parse(ps.redo.pop()));
  ps.selectedElementId = null;
  savePresentationDeck(); renderPresentationStudio();
}
function updateUndoButtons() { if (pse.psUndoButton) pse.psUndoButton.disabled = !ps.undo.length; if (pse.psRedoButton) pse.psRedoButton.disabled = !ps.redo.length; }

function schedulePresentationSave() {
  clearTimeout(ps.saveTimer);
  if (pse.psSaveStatus) pse.psSaveStatus.textContent = "Saving…";
  ps.saveTimer = setTimeout(savePresentationDeck, 250);
}
function savePresentationDeck() {
  try {
    localStorage.setItem(PS_STORAGE_KEY, JSON.stringify(ps.data));
    if (pse.psSaveStatus) pse.psSaveStatus.textContent = "Saved locally";
  } catch (error) {
    console.warn("Presentation could not be saved", error);
    if (pse.psSaveStatus) pse.psSaveStatus.textContent = "Storage full — remove large photos";
  }
}

function psToast(message) {
  try { if (typeof showToast === "function") return showToast(message); } catch (_) {}
  console.log(message);
}
function destroyCharts(bucket) { bucket.splice(0).forEach(chart => { try { chart.destroy(); } catch (_) {} }); }
function setControlValue(control, value) { if (control && document.activeElement !== control) control.value = value ?? ""; }
function normalizeColor(value, fallback) { return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback; }
function numberOrZero(value) { const n = Number(value); return Number.isFinite(n) ? n : 0; }
function round1(value) { return Math.round(numberOrZero(value) * 10) / 10; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, numberOrZero(value))); }
function uid(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
function cssEscape(value) { return window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&"); }
function cssUrl(value) { return String(value || "").replace(/["'()\\]/g, char => `\\${char}`); }
function selectAllText(element) { const range = document.createRange(); range.selectNodeContents(element); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
function sanitizeFileName(value) { return String(value || "presentation").trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "presentation"; }
function downloadDataUrl(url, filename) { const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); }
function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); downloadDataUrl(url, filename); setTimeout(() => URL.revokeObjectURL(url), 1500); }
