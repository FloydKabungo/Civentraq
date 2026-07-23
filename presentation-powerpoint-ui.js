"use strict";

/*
 * Civentraq PowerPoint-style editor shell
 * Reorganises the existing Presentation Studio into a familiar ribbon layout
 * without replacing the underlying reporting, governance, or export features.
 */

const PPT_UI_STORAGE_KEY = "civentraq_powerpoint_ui_v1";
const pptUi = {
  activeTab: "home",
  ribbonCollapsed: false,
  notesOpen: false,
  layoutMenuOpen: false
};

/* Extend text elements with the common formatting settings used by the ribbon. */
const pptOriginalDefaultElement = defaultElement;
defaultElement = function pptDefaultElement(type, overrides = {}) {
  const element = pptOriginalDefaultElement(type, overrides);
  return {
    fontFamily: element.fontFamily || "",
    italic: Boolean(element.italic),
    underline: Boolean(element.underline),
    bullet: Boolean(element.bullet),
    lineHeight: Number(element.lineHeight) || 1.25,
    ...element
  };
};

const pptOriginalNormalizeElement = normalizePresentationElement;
normalizePresentationElement = function pptNormalizeElement(element) {
  const normalized = pptOriginalNormalizeElement(element);
  normalized.fontFamily = element.fontFamily || normalized.fontFamily || "";
  normalized.italic = Boolean(element.italic);
  normalized.underline = Boolean(element.underline);
  normalized.bullet = Boolean(element.bullet);
  normalized.lineHeight = Number(element.lineHeight) || Number(normalized.lineHeight) || 1.25;
  return normalized;
};

const pptOriginalCreateElementNode = createElementNode;
createElementNode = function pptCreateElementNode(element, slide, options) {
  const node = pptOriginalCreateElementNode(element, slide, options);
  const content = node.querySelector(".ps-element-content");
  if (!content) return node;
  content.style.fontFamily = element.fontFamily || "inherit";
  content.style.fontStyle = element.italic ? "italic" : "normal";
  content.style.textDecoration = element.underline ? "underline" : "none";
  content.style.lineHeight = String(Number(element.lineHeight) || 1.25);
  if (element.bullet && ["title", "text", "ai_summary", "annotation"].includes(element.type)) {
    const lines = String(element.text || "").split(/\n+/).map(line => line.trim()).filter(Boolean);
    content.classList.add("ps-bulleted-content");
    content.innerHTML = `<ul>${(lines.length ? lines : ["Add text"]).map(line => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
  }
  return node;
};

const pptOriginalRenderStudio = renderPresentationStudio;
renderPresentationStudio = function pptRenderStudio() {
  const result = pptOriginalRenderStudio();
  requestAnimationFrame(pptSyncRibbonState);
  return result;
};

document.addEventListener("DOMContentLoaded", initPowerPointPresentationUi);

function initPowerPointPresentationUi() {
  const view = document.getElementById("presentationView");
  const studio = document.getElementById("psStudio");
  const appbar = view?.querySelector(".ps-appbar");
  if (!view || !studio || !appbar || document.getElementById("psPptRibbon")) return;

  restorePptUiPreferences();
  buildPowerPointAppbar(appbar);
  buildPowerPointRibbon(view, studio);
  simplifySlidesPanel();
  buildPowerPointStatusBar();
  bindPowerPointUiEvents();
  applyInitialPowerPointState();
  pptSyncRibbonState();
  try { if (typeof ctUpdateAdvancedToolbar === "function") ctUpdateAdvancedToolbar(); } catch (_) {}
  try { if (typeof ctRenderWorkflowStatus === "function") ctRenderWorkflowStatus(); } catch (_) {}
  requestAnimationFrame(() => requestAnimationFrame(applyCanvasZoom));
}

function buildPowerPointAppbar(appbar) {
  appbar.classList.add("ps-ppt-appbar");
  const actions = appbar.querySelector(".ps-appbar-actions");
  if (!actions) return;

  const share = document.getElementById("ctShareButton");
  const present = document.getElementById("psPresentButton");
  const exportButton = document.getElementById("psExportButton");
  const newDeck = document.getElementById("psNewDeckButton");
  const ribbonCommands = [
    "psToggleSlidesButton", "psFitCanvasButton", "psToggleInspectorButton",
    "ctVersionsButton", "ctReviewButton", "ctChecksButton"
  ].map(id => document.getElementById(id)).filter(Boolean);
  const stash = document.createElement("div");
  stash.id = "psPptCommandStash";
  stash.hidden = true;
  ribbonCommands.forEach(button => stash.appendChild(button));
  actions.replaceChildren(stash);

  const quick = document.createElement("div");
  quick.className = "ps-ppt-quick-actions";
  quick.innerHTML = `
    <button class="ps-ppt-icon-action" id="psPptUndoTop" type="button" title="Undo (Ctrl+Z)" aria-label="Undo">↶</button>
    <button class="ps-ppt-icon-action" id="psPptRedoTop" type="button" title="Redo (Ctrl+Y)" aria-label="Redo">↷</button>`;
  actions.appendChild(quick);

  if (newDeck) {
    newDeck.className = "ps-appbar-button text";
    newDeck.textContent = "File";
    newDeck.title = "Create a new presentation";
    actions.appendChild(newDeck);
  }
  if (share) {
    share.className = "ps-appbar-button";
    share.innerHTML = `<span aria-hidden="true">↗</span> Share`;
    actions.appendChild(share);
  }
  if (present) {
    present.className = "ps-appbar-button";
    present.innerHTML = `<span aria-hidden="true">▶</span> Present`;
    actions.appendChild(present);
  }
  if (exportButton) {
    exportButton.className = "ps-appbar-button primary";
    exportButton.innerHTML = `<span aria-hidden="true">⇩</span> Export`;
    actions.appendChild(exportButton);
  }
}

function buildPowerPointRibbon(view, studio) {
  const ribbon = document.createElement("section");
  ribbon.className = "ps-ppt-ribbon";
  ribbon.id = "psPptRibbon";
  ribbon.setAttribute("aria-label", "Presentation editing ribbon");
  ribbon.innerHTML = `
    <div class="ps-ppt-tab-row" role="tablist" aria-label="Presentation tools">
      <button class="ps-ppt-tab active" type="button" data-ppt-tab="home" role="tab" aria-selected="true">Home</button>
      <button class="ps-ppt-tab" type="button" data-ppt-tab="insert" role="tab" aria-selected="false">Insert</button>
      <button class="ps-ppt-tab" type="button" data-ppt-tab="design" role="tab" aria-selected="false">Design</button>
      <button class="ps-ppt-tab" type="button" data-ppt-tab="review" role="tab" aria-selected="false">Review</button>
      <button class="ps-ppt-tab" type="button" data-ppt-tab="view" role="tab" aria-selected="false">View</button>
      <span class="ps-ppt-context-label" id="psPptContextLabel">No object selected</span>
      <button class="ps-ppt-collapse" id="psPptCollapseRibbon" type="button" title="Collapse the ribbon" aria-label="Collapse the ribbon">⌃</button>
    </div>
    <div class="ps-ppt-ribbon-panels">
      <div class="ps-ppt-ribbon-panel active" data-ppt-panel="home"></div>
      <div class="ps-ppt-ribbon-panel" data-ppt-panel="insert"></div>
      <div class="ps-ppt-ribbon-panel" data-ppt-panel="design"></div>
      <div class="ps-ppt-ribbon-panel" data-ppt-panel="review"></div>
      <div class="ps-ppt-ribbon-panel" data-ppt-panel="view"></div>
    </div>`;
  view.insertBefore(ribbon, studio);

  populateHomeRibbon(ribbon.querySelector('[data-ppt-panel="home"]'));
  populateInsertRibbon(ribbon.querySelector('[data-ppt-panel="insert"]'));
  populateDesignRibbon(ribbon.querySelector('[data-ppt-panel="design"]'));
  populateReviewRibbon(ribbon.querySelector('[data-ppt-panel="review"]'));
  populateViewRibbon(ribbon.querySelector('[data-ppt-panel="view"]'));

  const oldToolbar = studio.querySelector(".ps-toolbar");
  oldToolbar?.classList.add("ps-toolbar-retired");
}

function populateHomeRibbon(panel) {
  panel.innerHTML = `
    <div class="ps-ppt-group ps-ppt-group-clipboard"><div class="ps-ppt-command-row" id="psPptClipboardRow"></div><span class="ps-ppt-group-label">Clipboard</span></div>
    <div class="ps-ppt-group ps-ppt-group-slides"><div class="ps-ppt-command-row" id="psPptSlidesRow"></div><span class="ps-ppt-group-label">Slides</span></div>
    <div class="ps-ppt-group ps-ppt-group-font">
      <div class="ps-ppt-font-controls">
        <select id="psRibbonFontFamily" title="Font family" aria-label="Font family"><option value="Inter, Arial, sans-serif">Inter</option><option value="'Roboto Condensed', Arial, sans-serif">Roboto Condensed</option><option value="Arial, sans-serif">Arial</option><option value="Georgia, serif">Georgia</option><option value="'Courier New', monospace">Courier New</option></select>
        <input id="psRibbonFontSize" type="number" min="7" max="96" step="1" value="14" title="Font size" aria-label="Font size" />
        <button type="button" id="psRibbonGrowFont" title="Increase font size">A<span>＋</span></button>
        <button type="button" id="psRibbonShrinkFont" title="Decrease font size">A<span>−</span></button>
      </div>
      <div class="ps-ppt-format-row">
        <button type="button" id="psRibbonBold" title="Bold (Ctrl+B)"><b>B</b></button>
        <button type="button" id="psRibbonItalic" title="Italic (Ctrl+I)"><i>I</i></button>
        <button type="button" id="psRibbonUnderline" title="Underline (Ctrl+U)"><u>U</u></button>
        <label class="ps-ppt-color-command" title="Text colour"><span>A</span><input id="psRibbonTextColor" type="color" value="#17202a" /></label>
      </div>
      <span class="ps-ppt-group-label">Font</span>
    </div>
    <div class="ps-ppt-group ps-ppt-group-paragraph">
      <div class="ps-ppt-format-row">
        <button type="button" id="psRibbonBullets" title="Bullets">•≡</button>
        <button type="button" data-ppt-align="left" title="Align left">≡</button>
        <button type="button" data-ppt-align="center" title="Centre">≡</button>
        <button type="button" data-ppt-align="right" title="Align right">≡</button>
      </div>
      <div class="ps-ppt-line-height"><label>Spacing<select id="psRibbonLineHeight"><option value="1">1.0</option><option value="1.15">1.15</option><option value="1.25" selected>1.25</option><option value="1.5">1.5</option><option value="2">2.0</option></select></label></div>
      <span class="ps-ppt-group-label">Paragraph</span>
    </div>
    <div class="ps-ppt-group ps-ppt-group-arrange"><div class="ps-ppt-command-row" id="psPptArrangeRow"></div><span class="ps-ppt-group-label">Arrange</span></div>
    <div class="ps-ppt-group ps-ppt-group-shape">
      <div class="ps-ppt-shape-controls">
        <label title="Fill colour">Fill<input id="psRibbonFillColor" type="color" value="#ffffff" /></label>
        <label title="Outline colour">Outline<input id="psRibbonOutlineColor" type="color" value="#dce4e7" /></label>
        <label>Corner<select id="psRibbonRadius"><option value="0">Square</option><option value="6">Soft</option><option value="10" selected>Rounded</option><option value="18">Pill</option></select></label>
      </div>
      <span class="ps-ppt-group-label">Shape format</span>
    </div>`;

  const clipboardRow = panel.querySelector("#psPptClipboardRow");
  moveRibbonCommand("ctPasteButton", clipboardRow, "Paste", "▣", true);
  moveRibbonCommand("ctCopyButton", clipboardRow, "Copy", "⧉", true);

  const slidesRow = panel.querySelector("#psPptSlidesRow");
  const newSlide = document.createElement("div");
  newSlide.className = "ps-ppt-split-command";
  newSlide.innerHTML = `<button class="ps-ppt-command large" id="psPptNewSlide" type="button" title="Add a new slide"><span class="ps-ppt-command-icon">＋</span><b>New slide</b></button><button class="ps-ppt-split-arrow" id="psPptLayoutButton" type="button" title="Choose a slide layout">⌄</button><div class="ps-ppt-layout-menu" id="psPptLayoutMenu"><strong>Choose a layout</strong></div>`;
  slidesRow.appendChild(newSlide);
  const templateGrid = document.getElementById("psTemplateGrid");
  if (templateGrid) document.getElementById("psPptLayoutMenu").appendChild(templateGrid);
  moveRibbonCommand("psDuplicateSlideButton", slidesRow, "Duplicate", "⧉");
  moveRibbonCommand("psDeleteSlideButton", slidesRow, "Delete", "⌫");

  const arrangeRow = panel.querySelector("#psPptArrangeRow");
  moveRibbonCommand("ctGroupButton", arrangeRow, "Group", "▦");
  moveRibbonCommand("ctUngroupButton", arrangeRow, "Ungroup", "▤");
  moveRibbonCommand("ctForwardButton", arrangeRow, "Forward", "↑");
  moveRibbonCommand("ctBackwardButton", arrangeRow, "Backward", "↓");
  moveRibbonCommand("ctLockButton", arrangeRow, "Lock", "🔒");
}

function populateInsertRibbon(panel) {
  panel.innerHTML = `
    <div class="ps-ppt-group ps-ppt-insert-group"><div class="ps-ppt-insert-gallery" id="psPptInsertGallery"></div><span class="ps-ppt-group-label">Add to slide</span></div>
    <div class="ps-ppt-group ps-ppt-ai-group">
      <button class="ps-ppt-command large" id="psPptAiSummaryButton" type="button"><span class="ps-ppt-command-icon">✦</span><b>AI summary</b></button>
      <button class="ps-ppt-command large" id="psPptComparisonButton" type="button"><span class="ps-ppt-command-icon">↔</span><b>Comparison</b></button>
      <span class="ps-ppt-group-label">Report intelligence</span>
    </div>`;
  const palette = document.getElementById("psElementPalette");
  if (palette) panel.querySelector("#psPptInsertGallery").appendChild(palette);
}

function populateDesignRibbon(panel) {
  panel.innerHTML = `
    <div class="ps-ppt-group ps-ppt-theme-group"><div class="ps-ppt-theme-strip" id="psPptThemeStrip"></div><span class="ps-ppt-group-label">Themes</span></div>
    <div class="ps-ppt-group ps-ppt-variants-group">
      <div class="ps-ppt-design-controls" id="psPptDesignControls"></div>
      <span class="ps-ppt-group-label">Variants</span>
    </div>
    <div class="ps-ppt-group ps-ppt-page-group">
      <label class="ps-ppt-control-stack">Slide size<span id="psPptRatioHolder"></span></label>
      <label class="ps-ppt-control-stack">Background<input id="psRibbonSlideBackground" type="color" value="#ffffff" /></label>
      <button class="ps-ppt-command" id="psPptMasterButton" type="button"><span class="ps-ppt-command-icon">▣</span><b>Slide master</b></button>
      <span class="ps-ppt-group-label">Customise</span>
    </div>`;
  const strip = panel.querySelector("#psPptThemeStrip");
  Object.entries(PS_THEME_CATALOG).forEach(([id, theme]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ps-ppt-theme-card";
    button.dataset.pptTheme = id;
    button.title = theme.name;
    button.innerHTML = `<span style="--theme-bg:${theme.bg};--theme-accent:${theme.accent};--theme-dark:${theme.dark}"><i></i><i></i><i></i></span><b>${escapeHtml(theme.name.replace(" & refinery", ""))}</b>`;
    strip.appendChild(button);
  });

  const themeSelect = document.getElementById("psThemeSelect");
  const ratioSelect = document.getElementById("psRatioSelect");
  if (themeSelect) {
    themeSelect.closest("label")?.classList.add("ps-original-control-holder");
    panel.querySelector("#psPptDesignControls").appendChild(themeSelect);
  }
  if (ratioSelect) {
    ratioSelect.closest("label")?.classList.add("ps-original-control-holder");
    panel.querySelector("#psPptRatioHolder").appendChild(ratioSelect);
  }
}

function populateReviewRibbon(panel) {
  panel.innerHTML = `
    <div class="ps-ppt-group"><div class="ps-ppt-command-row" id="psPptReviewRow"></div><span class="ps-ppt-group-label">Review and approval</span></div>
    <div class="ps-ppt-group">
      <button class="ps-ppt-command large" id="psPptAddComment" type="button"><span class="ps-ppt-command-icon">☵</span><b>New comment</b></button>
      <button class="ps-ppt-command large" id="psPptDataSources" type="button"><span class="ps-ppt-command-icon">⛓</span><b>Data sources</b></button>
      <span class="ps-ppt-group-label">Collaboration</span>
    </div>`;
  const row = panel.querySelector("#psPptReviewRow");
  moveRibbonCommand("ctVersionsButton", row, "Versions", "◷", true);
  moveRibbonCommand("ctReviewButton", row, "Comments & approval", "☵", true);
  moveRibbonCommand("ctChecksButton", row, "Presentation checks", "✓", true);
}

function populateViewRibbon(panel) {
  panel.innerHTML = `
    <div class="ps-ppt-group"><div class="ps-ppt-command-row" id="psPptPanelsRow"></div><span class="ps-ppt-group-label">Show</span></div>
    <div class="ps-ppt-group"><div class="ps-ppt-command-row" id="psPptGridRow"></div><span class="ps-ppt-group-label">Guides</span></div>
    <div class="ps-ppt-group ps-ppt-zoom-group"><div id="psPptZoomHolder"></div><span class="ps-ppt-group-label">Zoom</span></div>`;
  const panels = panel.querySelector("#psPptPanelsRow");
  moveRibbonCommand("psToggleSlidesButton", panels, "Slides", "▤");
  moveRibbonCommand("psToggleInspectorButton", panels, "Format pane", "◫");
  moveRibbonCommand("psFitCanvasButton", panels, "Fit to window", "⛶");
  const grid = panel.querySelector("#psPptGridRow");
  moveRibbonCommand("ctSnapButton", grid, "Snap", "⌖");
  moveRibbonCommand("ctGridButton", grid, "Gridlines", "▦");
  const zoom = document.querySelector(".ps-zoom-control");
  if (zoom) panel.querySelector("#psPptZoomHolder").appendChild(zoom);
}

function moveRibbonCommand(id, target, label, icon, large = false) {
  const button = document.getElementById(id);
  if (!button || !target) return;
  button.className = `ps-ppt-command${large ? " large" : ""}`;
  const badge = id === "ctReviewButton" ? '<span id="ctReviewBadge" class="ct-app-badge"></span>' : id === "ctChecksButton" ? '<span id="ctChecksBadge" class="ct-app-badge"></span>' : "";
  button.innerHTML = `<span class="ps-ppt-command-icon" aria-hidden="true">${icon}</span><b>${label}</b>${badge}`;
  target.appendChild(button);
}

function simplifySlidesPanel() {
  const panel = document.querySelector(".ps-left-panel");
  if (!panel) return;
  panel.classList.add("ps-ppt-slides-panel");
  panel.querySelectorAll(".ps-left-section").forEach(section => section.classList.add("ps-moved-section"));
  const heading = panel.querySelector(".ps-panel-heading");
  const originalAdd = document.getElementById("psAddSlideButton");
  if (heading && originalAdd) {
    originalAdd.remove();
    const quickAdd = document.createElement("button");
    quickAdd.className = "ps-icon-button";
    quickAdd.id = "psPptQuickAddSlide";
    quickAdd.type = "button";
    quickAdd.title = "New slide";
    quickAdd.textContent = "＋";
    heading.appendChild(quickAdd);
  }
  const footer = document.createElement("div");
  footer.className = "ps-ppt-slides-footer";
  footer.innerHTML = `<button id="psPptQuickAddSlideBottom" type="button"><span>＋</span> New slide</button>`;
  panel.appendChild(footer);
}

function buildPowerPointStatusBar() {
  const editor = document.querySelector(".ps-editor-column");
  const notes = document.querySelector(".ps-notes-bar");
  if (!editor || !notes) return;
  notes.id = "psPptNotesBar";
  notes.classList.add("ps-ppt-notes-bar");
  const label = notes.querySelector("label");
  if (label) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "psPptNotesToggle";
    toggle.className = "ps-ppt-notes-toggle";
    toggle.innerHTML = `<span>▤</span> Notes`;
    notes.insertBefore(toggle, label);
  }

  const status = document.createElement("footer");
  status.className = "ps-ppt-statusbar";
  status.id = "psPptStatusbar";
  status.innerHTML = `
    <div><span id="psPptStatusSlide">Slide 1 of 1</span><button id="psPptStatusComments" type="button">☵ Comments</button><span id="psPptStatusWorkflow">Draft</span></div>
    <div><button id="psPptStatusFit" type="button" title="Fit slide to window">⛶</button><button id="psPptStatusMinus" type="button" title="Zoom out">−</button><input id="psPptStatusZoom" type="range" min="30" max="200" step="5" value="100" aria-label="Zoom" /><button id="psPptStatusPlus" type="button" title="Zoom in">＋</button><output id="psPptStatusZoomValue">100%</output></div>`;
  editor.appendChild(status);
}

function bindPowerPointUiEvents() {
  document.querySelectorAll("[data-ppt-tab]").forEach(button => button.addEventListener("click", () => setPptRibbonTab(button.dataset.pptTab)));
  document.getElementById("psPptCollapseRibbon")?.addEventListener("click", togglePptRibbon);
  document.getElementById("psPptUndoTop")?.addEventListener("click", () => document.getElementById("psUndoButton")?.click());
  document.getElementById("psPptRedoTop")?.addEventListener("click", () => document.getElementById("psRedoButton")?.click());
  document.getElementById("psPptNewSlide")?.addEventListener("click", () => addSlideFromTemplate("blank"));
  document.getElementById("psPptQuickAddSlide")?.addEventListener("click", () => addSlideFromTemplate("blank"));
  document.getElementById("psPptQuickAddSlideBottom")?.addEventListener("click", () => addSlideFromTemplate("blank"));
  document.getElementById("psPptLayoutButton")?.addEventListener("click", event => { event.stopPropagation(); togglePptLayoutMenu(); });
  document.addEventListener("click", event => { if (!event.target.closest(".ps-ppt-split-command")) closePptLayoutMenu(); });

  document.getElementById("psPptAiSummaryButton")?.addEventListener("click", () => addElementToCurrentSlide("ai_summary"));
  document.getElementById("psPptComparisonButton")?.addEventListener("click", () => addElementToCurrentSlide("comparison"));
  document.getElementById("psPptMasterButton")?.addEventListener("click", openPptMasterPane);
  document.getElementById("psPptAddComment")?.addEventListener("click", () => document.getElementById("ctReviewButton")?.click());
  document.getElementById("psPptDataSources")?.addEventListener("click", openPptDataPane);

  document.querySelectorAll("[data-ppt-theme]").forEach(button => button.addEventListener("click", () => applyTheme(button.dataset.pptTheme)));
  document.getElementById("psRibbonSlideBackground")?.addEventListener("input", event => applyPptSlideBackground(event.target.value));
  document.getElementById("psRibbonFontFamily")?.addEventListener("change", event => applyPptTextPatch({ fontFamily: event.target.value }));
  document.getElementById("psRibbonFontSize")?.addEventListener("change", event => applyPptTextPatch({ fontSize: clamp(Number(event.target.value), 7, 96) }));
  document.getElementById("psRibbonGrowFont")?.addEventListener("click", () => stepPptFont(2));
  document.getElementById("psRibbonShrinkFont")?.addEventListener("click", () => stepPptFont(-2));
  document.getElementById("psRibbonBold")?.addEventListener("click", () => togglePptTextProperty("bold"));
  document.getElementById("psRibbonItalic")?.addEventListener("click", () => togglePptTextProperty("italic"));
  document.getElementById("psRibbonUnderline")?.addEventListener("click", () => togglePptTextProperty("underline"));
  document.getElementById("psRibbonBullets")?.addEventListener("click", () => togglePptTextProperty("bullet"));
  document.getElementById("psRibbonTextColor")?.addEventListener("input", event => applyPptTextPatch({ color: event.target.value }));
  document.getElementById("psRibbonLineHeight")?.addEventListener("change", event => applyPptTextPatch({ lineHeight: Number(event.target.value) || 1.25 }));
  document.querySelectorAll("[data-ppt-align]").forEach(button => button.addEventListener("click", () => applyPptTextPatch({ align: button.dataset.pptAlign })));
  document.getElementById("psRibbonFillColor")?.addEventListener("input", event => applyPptElementPatch({ background: event.target.value }));
  document.getElementById("psRibbonOutlineColor")?.addEventListener("input", event => applyPptElementPatch({ borderColor: event.target.value }));
  document.getElementById("psRibbonRadius")?.addEventListener("change", event => applyPptElementPatch({ radius: Number(event.target.value) || 0 }));

  document.getElementById("psPptNotesToggle")?.addEventListener("click", togglePptNotes);
  document.getElementById("psPptStatusComments")?.addEventListener("click", () => document.getElementById("ctReviewButton")?.click());
  document.getElementById("psPptStatusFit")?.addEventListener("click", fitCanvasToWorkspace);
  document.getElementById("psPptStatusMinus")?.addEventListener("click", () => setPptZoom((ps.data.zoom || 100) - 10));
  document.getElementById("psPptStatusPlus")?.addEventListener("click", () => setPptZoom((ps.data.zoom || 100) + 10));
  document.getElementById("psPptStatusZoom")?.addEventListener("input", event => setPptZoom(Number(event.target.value), false));
  document.getElementById("psPptStatusZoom")?.addEventListener("change", () => schedulePresentationSave());

  document.getElementById("psToggleInspectorButton")?.addEventListener("click", () => setTimeout(pptSyncRibbonState, 30));
  document.getElementById("psToggleSlidesButton")?.addEventListener("click", () => setTimeout(pptSyncRibbonState, 30));
  document.getElementById("psSlideCanvas")?.addEventListener("click", () => setTimeout(pptSyncRibbonState, 0));
  document.getElementById("psSlideList")?.addEventListener("click", () => setTimeout(pptSyncRibbonState, 0));

  document.addEventListener("keydown", handlePptRibbonShortcuts, true);
  window.addEventListener("resize", () => requestAnimationFrame(pptSyncRibbonState));
}

function applyInitialPowerPointState() {
  const firstRun = !localStorage.getItem(PPT_UI_STORAGE_KEY);
  if (firstRun) {
    document.body.classList.add("ps-inspector-collapsed");
    pptUi.ribbonCollapsed = false;
    pptUi.notesOpen = false;
    persistPptUiPreferences();
    try { saveEditorPreferences(); } catch (_) {}
  }
  document.body.classList.toggle("ps-ppt-ribbon-collapsed", Boolean(pptUi.ribbonCollapsed));
  document.getElementById("psPptNotesBar")?.classList.toggle("open", Boolean(pptUi.notesOpen));
  const zoom = document.getElementById("psZoomRange");
  if (zoom) { zoom.min = "30"; zoom.max = "200"; zoom.step = "5"; }
  setPptRibbonTab(pptUi.activeTab || "home", false);
}

function setPptRibbonTab(tab, save = true) {
  pptUi.activeTab = ["home", "insert", "design", "review", "view"].includes(tab) ? tab : "home";
  document.querySelectorAll("[data-ppt-tab]").forEach(button => {
    const active = button.dataset.pptTab === pptUi.activeTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-ppt-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.pptPanel === pptUi.activeTab));
  if (document.body.classList.contains("ps-ppt-ribbon-collapsed")) document.body.classList.remove("ps-ppt-ribbon-collapsed");
  if (save) persistPptUiPreferences();
  requestAnimationFrame(applyCanvasZoom);
}

function togglePptRibbon() {
  document.body.classList.toggle("ps-ppt-ribbon-collapsed");
  pptUi.ribbonCollapsed = document.body.classList.contains("ps-ppt-ribbon-collapsed");
  const button = document.getElementById("psPptCollapseRibbon");
  if (button) { button.textContent = pptUi.ribbonCollapsed ? "⌄" : "⌃"; button.title = pptUi.ribbonCollapsed ? "Expand the ribbon" : "Collapse the ribbon"; }
  persistPptUiPreferences();
  requestAnimationFrame(applyCanvasZoom);
}

function togglePptLayoutMenu() {
  pptUi.layoutMenuOpen = !pptUi.layoutMenuOpen;
  document.getElementById("psPptLayoutMenu")?.classList.toggle("open", pptUi.layoutMenuOpen);
}
function closePptLayoutMenu() { pptUi.layoutMenuOpen = false; document.getElementById("psPptLayoutMenu")?.classList.remove("open"); }

function openPptMasterPane() {
  if (document.body.classList.contains("ps-inspector-collapsed")) toggleStudioPanel("inspector");
  setInspectorTab("design");
  setTimeout(() => document.getElementById("ctMasterSection")?.scrollIntoView({ block: "start", behavior: "smooth" }), 40);
}
function openPptDataPane() {
  if (document.body.classList.contains("ps-inspector-collapsed")) toggleStudioPanel("inspector");
  setInspectorTab("data");
  setTimeout(() => document.getElementById("ctLineageInspector")?.scrollIntoView({ block: "start", behavior: "smooth" }), 40);
}

function togglePptNotes() {
  pptUi.notesOpen = !pptUi.notesOpen;
  document.getElementById("psPptNotesBar")?.classList.toggle("open", pptUi.notesOpen);
  persistPptUiPreferences();
  requestAnimationFrame(applyCanvasZoom);
}

function pptSelectedElements() {
  if (typeof ctSelectedElements === "function") {
    const items = ctSelectedElements();
    if (items.length) return items;
  }
  const element = selectedElement();
  return element ? [element] : [];
}
function pptTextElements() { return pptSelectedElements().filter(element => ["title", "text", "ai_summary", "annotation"].includes(element.type)); }

function applyPptElementPatch(patch) {
  const elements = pptSelectedElements();
  if (!elements.length) return psToast("Select an item on the slide first.");
  withHistory(() => elements.filter(item => !item.locked).forEach(item => Object.assign(item, patch)));
  renderPresentationStudio();
}
function applyPptTextPatch(patch) {
  const elements = pptTextElements();
  if (!elements.length) return psToast("Select a heading, text box, AI summary, or callout first.");
  withHistory(() => elements.filter(item => !item.locked).forEach(item => Object.assign(item, patch)));
  renderPresentationStudio();
}
function togglePptTextProperty(key) {
  const elements = pptTextElements();
  if (!elements.length) return psToast("Select text on the slide first.");
  const next = !elements.every(element => Boolean(element[key]));
  applyPptTextPatch({ [key]: next });
}
function stepPptFont(change) {
  const elements = pptTextElements();
  if (!elements.length) return psToast("Select text on the slide first.");
  withHistory(() => elements.filter(item => !item.locked).forEach(item => item.fontSize = clamp((Number(item.fontSize) || 14) + change, 7, 96)));
  renderPresentationStudio();
}
function applyPptSlideBackground(value) {
  const slide = currentSlide();
  if (!slide) return;
  withHistory(() => slide.background = value);
  renderPresentationStudio();
}
function setPptZoom(value, save = true) {
  if (!ps.data) return;
  ps.data.zoom = clamp(Number(value) || 100, 30, 200);
  if (pse.psZoomRange) pse.psZoomRange.value = ps.data.zoom;
  applyCanvasZoom();
  if (save) schedulePresentationSave();
  pptSyncRibbonState();
}

function pptSyncRibbonState() {
  if (!ps.data || !document.getElementById("psPptRibbon")) return;
  const selected = pptSelectedElements();
  const primary = selected[0];
  const textItems = pptTextElements();
  const primaryText = textItems[0];
  const noSelection = selected.length === 0;
  const context = document.getElementById("psPptContextLabel");
  if (context) context.textContent = noSelection ? "No object selected" : selected.length > 1 ? `${selected.length} objects selected` : elementTypeLabel(primary.type);

  setPptControl("psRibbonFontFamily", primaryText?.fontFamily || (typeof ctActiveMaster === "function" ? ctActiveMaster()?.font : "") || "Inter, Arial, sans-serif", !primaryText);
  setPptControl("psRibbonFontSize", Number(primaryText?.fontSize) || 14, !primaryText);
  setPptControl("psRibbonTextColor", normalizeColor(primaryText?.color, themeForSlide(currentSlide()).text), !primaryText);
  setPptControl("psRibbonLineHeight", String(Number(primaryText?.lineHeight) || 1.25), !primaryText);
  setPptToggle("psRibbonBold", textItems.length > 0 && textItems.every(item => item.bold), !primaryText);
  setPptToggle("psRibbonItalic", textItems.length > 0 && textItems.every(item => item.italic), !primaryText);
  setPptToggle("psRibbonUnderline", textItems.length > 0 && textItems.every(item => item.underline), !primaryText);
  setPptToggle("psRibbonBullets", textItems.length > 0 && textItems.every(item => item.bullet), !primaryText);
  document.querySelectorAll("[data-ppt-align]").forEach(button => { button.classList.toggle("active", Boolean(primaryText) && primaryText.align === button.dataset.pptAlign); button.disabled = !primaryText; });
  ["psRibbonGrowFont", "psRibbonShrinkFont"].forEach(id => { const control = document.getElementById(id); if (control) control.disabled = !primaryText; });

  setPptControl("psRibbonFillColor", normalizeColor(primary?.background, "#ffffff"), noSelection);
  setPptControl("psRibbonOutlineColor", normalizeColor(primary?.borderColor, "#dce4e7"), noSelection);
  setPptControl("psRibbonRadius", String(Number(primary?.radius) || 0), noSelection);
  setPptControl("psRibbonSlideBackground", normalizeColor(currentSlide()?.background, themeForSlide(currentSlide()).bg), false);

  document.querySelectorAll("[data-ppt-theme]").forEach(button => button.classList.toggle("active", button.dataset.pptTheme === ps.data.theme));

  const index = Math.max(0, ps.data.slides.findIndex(slide => slide.id === ps.data.currentSlideId));
  const slideStatus = document.getElementById("psPptStatusSlide");
  if (slideStatus) slideStatus.textContent = `Slide ${index + 1} of ${ps.data.slides.length}`;
  const workflow = document.getElementById("psPptStatusWorkflow");
  if (workflow) workflow.textContent = (ps.data.workflow?.status || "draft").replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  const statusZoom = document.getElementById("psPptStatusZoom");
  const statusZoomValue = document.getElementById("psPptStatusZoomValue");
  if (statusZoom) statusZoom.value = String(ps.data.zoom || 100);
  if (statusZoomValue) statusZoomValue.textContent = `${Math.round(ps.data.zoom || 100)}%`;

  const topUndo = document.getElementById("psPptUndoTop");
  const topRedo = document.getElementById("psPptRedoTop");
  if (topUndo) topUndo.disabled = !ps.undo.length;
  if (topRedo) topRedo.disabled = !ps.redo.length;
  const collapse = document.getElementById("psPptCollapseRibbon");
  if (collapse) collapse.textContent = document.body.classList.contains("ps-ppt-ribbon-collapsed") ? "⌄" : "⌃";
}

function setPptControl(id, value, disabled) {
  const control = document.getElementById(id);
  if (!control) return;
  if (document.activeElement !== control) control.value = value;
  control.disabled = Boolean(disabled);
}
function setPptToggle(id, active, disabled) {
  const control = document.getElementById(id);
  if (!control) return;
  control.classList.toggle("active", Boolean(active));
  control.disabled = Boolean(disabled);
}

function handlePptRibbonShortcuts(event) {
  if (!document.body.classList.contains("presentation-mode")) return;
  if (event.altKey && !event.ctrlKey && !event.metaKey) {
    const key = event.key.toLowerCase();
    const map = { h: "home", n: "insert", g: "design", r: "review", w: "view" };
    if (map[key]) { event.preventDefault(); setPptRibbonTab(map[key]); return; }
  }
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
    const key = event.key.toLowerCase();
    if (key === "b") { event.preventDefault(); togglePptTextProperty("bold"); }
    if (key === "i") { event.preventDefault(); togglePptTextProperty("italic"); }
    if (key === "u") { event.preventDefault(); togglePptTextProperty("underline"); }
  }
  if (event.key === "F6") { event.preventDefault(); togglePptRibbon(); }
}

function restorePptUiPreferences() {
  try {
    Object.assign(pptUi, JSON.parse(localStorage.getItem(PPT_UI_STORAGE_KEY) || "{}"));
  } catch (_) {}
}
function persistPptUiPreferences() {
  localStorage.setItem(PPT_UI_STORAGE_KEY, JSON.stringify({ activeTab: pptUi.activeTab, ribbonCollapsed: pptUi.ribbonCollapsed, notesOpen: pptUi.notesOpen }));
}
