"use strict";

/*
 * Civentraq Story Studio
 * A lightweight presentation shell that reuses the proven slide engine while
 * keeping navigation and rendering to one predictable cycle.
 */

const CS_ICONS = {
  back: '<path d="M15 18l-6-6 6-6"/><path d="M9 12h10"/>',
  story: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 9h8M8 13h5M8 17h7"/>',
  play: '<path d="M8 5l11 7-11 7z"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.4-4.4M8.2 13.2l7.4 4.4"/>',
  export: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 19h14"/>',
  comment: '<path d="M5 5h14v10H9l-4 4z"/>',
  check: '<path d="M9 12l2 2 4-5"/><circle cx="12" cy="12" r="9"/>',
  history: '<path d="M4 12a8 8 0 1 0 2.3-5.7L4 8"/><path d="M4 4v4h4"/><path d="M12 8v4l3 2"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  undo: '<path d="M9 7l-5 5 5 5"/><path d="M5 12h8a6 6 0 0 1 6 6"/>',
  redo: '<path d="M15 7l5 5-5 5"/><path d="M19 12h-8a6 6 0 0 0-6 6"/>',
  duplicate: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
  fit: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
  panels: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 4v16M16 4v16"/>',
  grid: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 16h16M10 4v16M16 4v16"/>',
  snap: '<path d="M7 4v9a5 5 0 0 0 10 0V4"/><path d="M7 8h4M13 8h4"/>',
  arrange: '<rect x="4" y="4" width="9" height="9" rx="2"/><rect x="11" y="11" width="9" height="9" rx="2"/>',
  notes: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.8 2c-1 .7-1.6 1.1-1.6 2.5M12 17h.01"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M9 9v11"/>',
  title: '<path d="M5 6h14M12 6v12M8 18h8"/>',
  text: '<path d="M5 6h14M5 10h14M5 14h9M5 18h11"/>',
  ai_summary: '<path d="M12 3l1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3z"/><path d="M6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8z"/>',
  kpi: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 15l3-4 3 2 4-5"/>',
  chart: '<path d="M5 19V9M10 19V5M15 19v-7M20 19V8"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 4v16M15 4v16"/>',
  photo: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="2"/><path d="M4 17l5-5 3 3 2-2 6 5"/>',
  comparison: '<path d="M8 5l-4 4 4 4M4 9h13M16 11l4 4-4 4M20 15H7"/>',
  progress: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8h-8z"/>',
  annotation: '<path d="M12 3l9 17H3z"/><path d="M12 9v4M12 17h.01"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>',
  paste: '<path d="M9 5h6M9 3h6v4H9z"/><rect x="5" y="5" width="14" height="16" rx="2"/>',
  group: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="8" y="13" width="8" height="7" rx="1"/>',
  ungroup: '<rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="4" width="7" height="7" rx="1"/><rect x="8" y="14" width="8" height="7" rx="1"/>',
  forward: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  backward: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
};

const csIcon = (name, size = 18) => `<svg class="cs-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CS_ICONS[name] || CS_ICONS.story}</svg>`;
const csGet = id => document.getElementById(id);

const csState = {
  initialized: false,
  active: false,
  syncTimer: 0,
  controls: {},
  observer: null
};

window.CiventraqStoryStudio = {
  activate: csActivate,
  deactivate: csDeactivate,
  showError: csShowError,
  sync: csScheduleSync
};

document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => requestAnimationFrame(csInit));
});

function csInit() {
  if (csState.initialized) return;
  const view = csGet("presentationView");
  const studio = csGet("psStudio");
  const appbar = view?.querySelector(".ps-appbar");
  const toolbar = studio?.querySelector(".ps-toolbar");
  if (!view || !studio || !appbar || !toolbar) return;

  csState.initialized = true;
  csCacheControls();
  view.classList.add("cs-story-studio");
  csBuildTopbar(appbar);
  csBuildRail(studio);
  csBuildStage(studio, toolbar);
  csBuildInspector(studio);
  csBuildGuide();
  csBuildFeedback(view);
  csBind(view);
  csWrapPresentationRender();
  csScheduleSync();

  csState.observer = new MutationObserver(() => {
    if (view.classList.contains("active") && !document.body.classList.contains("home-mode")) csActivate();
    else csDeactivate();
  });
  csState.observer.observe(view, { attributes: true, attributeFilter: ["class"] });

  if (view.classList.contains("active") && !document.body.classList.contains("home-mode")) csActivate();
}

function csCacheControls() {
  [
    "psBackButton", "psDeckTitle", "psPresentButton", "ctReviewButton", "ctShareButton", "psExportButton",
    "ctVersionsButton", "ctChecksButton", "psNewDeckButton", "psToggleSlidesButton", "psFitCanvasButton",
    "psToggleInspectorButton", "psUndoButton", "psRedoButton", "psDuplicateSlideButton", "psDeleteSlideButton",
    "psThemeSelect", "psRatioSelect", "ctSnapButton", "ctGridButton", "ctCopyButton", "ctPasteButton",
    "ctGroupButton", "ctUngroupButton", "ctForwardButton", "ctBackwardButton", "ctLockButton",
    "psZoomRange", "psZoomValue", "psAddSlideButton", "psSlideList", "psSlideCount", "psTemplateGrid",
    "psElementPalette", "psCanvasWorkspace", "psCanvasShell", "psSlideCanvas", "psInspector", "psSaveStatus"
  ].forEach(id => { csState.controls[id] = csGet(id); });
}

function csSetButton(button, icon, label, className = "") {
  if (!button) return null;
  button.className = className;
  button.innerHTML = `${csIcon(icon)}<b>${label}</b>`;
  button.setAttribute("aria-label", label);
  return button;
}

function csBuildTopbar(appbar) {
  const c = csState.controls;
  const left = document.createElement("div");
  left.className = "cs-topbar-left";
  if (c.psBackButton) {
    c.psBackButton.className = "cs-icon-action cs-back";
    c.psBackButton.innerHTML = csIcon("back");
    c.psBackButton.title = "Back to project";
    left.append(c.psBackButton);
  }
  left.insertAdjacentHTML("beforeend", `<div class="cs-studio-identity"><span class="cs-studio-mark">${csIcon("story", 19)}</span><span><strong>Story Studio</strong><small>Clear project presentations</small></span></div>`);

  const middle = document.createElement("div");
  middle.className = "cs-topbar-middle";
  const titleBox = document.createElement("div");
  titleBox.className = "cs-title-box";
  titleBox.innerHTML = "<span>Presentation</span>";
  if (c.psDeckTitle) titleBox.append(c.psDeckTitle);
  middle.append(titleBox);
  middle.insertAdjacentHTML("beforeend", '<span class="cs-save-chip" id="csSaveChip"><i></i><span>Saved</span></span>');

  const right = document.createElement("div");
  right.className = "cs-topbar-right";
  [
    [c.psPresentButton, "play", "Preview", "cs-top-action"],
    [c.ctReviewButton, "comment", "Review", "cs-top-action"],
    [c.ctShareButton, "share", "Share", "cs-top-action"],
    [c.psExportButton, "export", "Export", "cs-top-action primary"]
  ].forEach(([button, icon, label, className]) => {
    if (!button) return;
    const badge = button.querySelector(".ct-app-badge");
    csSetButton(button, icon, label, className);
    if (badge) button.append(badge);
    right.append(button);
  });

  const moreWrap = document.createElement("div");
  moreWrap.className = "cs-popover-wrap";
  moreWrap.innerHTML = `<button id="csMoreButton" class="cs-icon-action" type="button" title="More actions">${csIcon("more")}</button><div id="csMoreMenu" class="cs-popover cs-more-menu" hidden></div>`;
  const menu = moreWrap.lastElementChild;
  [
    [c.ctVersionsButton, "history", "Version history"],
    [c.ctChecksButton, "check", "Presentation checks"],
    [c.psNewDeckButton, "plus", "Start a new deck"]
  ].forEach(([button, icon, label], index) => {
    if (!button) return;
    const badge = button.querySelector(".ct-app-badge");
    csSetButton(button, icon, label, `cs-menu-command${index === 2 ? " danger-separator" : ""}`);
    if (badge) button.append(badge);
    menu.append(button);
  });
  menu.insertAdjacentHTML("beforeend", `<button id="csHelpButton" class="cs-menu-command" type="button">${csIcon("help")}<b>Quick guide</b></button>`);
  right.append(moreWrap);

  appbar.replaceChildren(left, middle, right);
  appbar.className = "ps-appbar cs-topbar";
}

function csBuildRail(studio) {
  const c = csState.controls;
  const rail = studio.querySelector(".ps-left-panel");
  if (!rail || !c.psSlideList) return;
  const head = document.createElement("div");
  head.className = "cs-rail-head";
  const heading = document.createElement("div");
  heading.innerHTML = "<strong>Storyline</strong>";
  if (c.psSlideCount) heading.append(c.psSlideCount);
  head.append(heading);
  if (c.psAddSlideButton) {
    c.psAddSlideButton.className = "cs-add-slide-button";
    c.psAddSlideButton.innerHTML = `${csIcon("plus", 16)}<span>Slide</span>`;
    head.append(c.psAddSlideButton);
  }

  const foot = document.createElement("div");
  foot.className = "cs-rail-foot";
  const wrap = document.createElement("div");
  wrap.className = "cs-popover-wrap full";
  wrap.innerHTML = `<button id="csLayoutButton" class="cs-secondary-button full" type="button">${csIcon("layout", 17)}<span>Choose a layout</span><i>⌄</i></button><div id="csLayoutMenu" class="cs-popover cs-layout-menu" hidden><div class="cs-popover-heading"><strong>Start with a layout</strong><small>Add a ready-made slide.</small></div></div>`;
  if (c.psTemplateGrid) wrap.lastElementChild.append(c.psTemplateGrid);
  foot.append(wrap);

  rail.replaceChildren(head, c.psSlideList, foot);
  rail.className = "ps-left-panel cs-story-rail";
}

function csBuildStage(studio, toolbar) {
  const c = csState.controls;
  const editor = studio.querySelector(".ps-editor-column");
  const workspace = c.psCanvasWorkspace;
  if (!editor || !workspace) return;

  const left = document.createElement("div");
  left.className = "cs-toolbar-cluster";
  if (c.psToggleSlidesButton) {
    c.psToggleSlidesButton.className = "cs-tool-icon";
    c.psToggleSlidesButton.innerHTML = csIcon("story", 17);
    c.psToggleSlidesButton.title = "Show or hide slides";
    left.append(c.psToggleSlidesButton);
  }
  [
    [c.psUndoButton, "undo", "Undo"],
    [c.psRedoButton, "redo", "Redo"]
  ].forEach(([button, icon, title]) => {
    if (!button) return;
    button.className = "cs-tool-icon";
    button.innerHTML = csIcon(icon, 17);
    button.title = title;
    left.append(button);
  });
  if (c.psDuplicateSlideButton) {
    csSetButton(c.psDuplicateSlideButton, "duplicate", "Duplicate", "cs-tool-button");
    left.append(c.psDuplicateSlideButton);
  }
  if (c.psDeleteSlideButton) {
    c.psDeleteSlideButton.className = "cs-tool-icon danger";
    c.psDeleteSlideButton.innerHTML = csIcon("trash", 17);
    c.psDeleteSlideButton.title = "Delete slide";
    left.append(c.psDeleteSlideButton);
  }

  const centre = document.createElement("div");
  centre.className = "cs-toolbar-centre";
  centre.innerHTML = '<span id="csCurrentSlideLabel" class="cs-current-slide-label">Slide 1</span>';

  const right = document.createElement("div");
  right.className = "cs-toolbar-cluster end";
  if (c.psThemeSelect) right.append(csInlineSelect("Theme", c.psThemeSelect));
  if (c.psRatioSelect) right.append(csInlineSelect("Page", c.psRatioSelect));
  if (c.psFitCanvasButton) {
    c.psFitCanvasButton.className = "cs-tool-icon";
    c.psFitCanvasButton.innerHTML = csIcon("fit", 17);
    c.psFitCanvasButton.title = "Fit page";
    right.append(c.psFitCanvasButton);
  }
  [[c.ctSnapButton, "snap", "Snap"], [c.ctGridButton, "grid", "Grid"]].forEach(([button, icon, label]) => {
    if (!button) return;
    button.className = "cs-tool-toggle";
    button.innerHTML = `${csIcon(icon, 16)}<span>${label}</span>`;
    right.append(button);
  });

  const arrange = document.createElement("div");
  arrange.className = "cs-popover-wrap";
  arrange.innerHTML = `<button id="csArrangeButton" class="cs-tool-button" type="button">${csIcon("arrange", 16)}<span>Arrange</span><i>⌄</i></button><div id="csArrangeMenu" class="cs-popover cs-arrange-menu" hidden></div>`;
  const arrangeMenu = arrange.lastElementChild;
  [
    [c.ctCopyButton, "copy", "Copy"], [c.ctPasteButton, "paste", "Paste"],
    [c.ctGroupButton, "group", "Group"], [c.ctUngroupButton, "ungroup", "Ungroup"],
    [c.ctForwardButton, "forward", "Bring forward"], [c.ctBackwardButton, "backward", "Send backward"],
    [c.ctLockButton, "lock", "Lock / unlock"]
  ].forEach(([button, icon, label]) => {
    if (!button) return;
    csSetButton(button, icon, label, "cs-menu-command");
    arrangeMenu.append(button);
  });
  right.append(arrange);

  if (c.psToggleInspectorButton) {
    c.psToggleInspectorButton.className = "cs-tool-icon";
    c.psToggleInspectorButton.innerHTML = csIcon("panels", 17);
    c.psToggleInspectorButton.title = "Smart controls";
    right.append(c.psToggleInspectorButton);
  }

  toolbar.replaceChildren(left, centre, right);
  toolbar.className = "ps-toolbar cs-stage-toolbar";
  editor.className = "ps-editor-column cs-stage-column";
  workspace.classList.add("cs-stage-workspace");

  if (!workspace.querySelector(".cs-canvas-badge")) {
    const badge = document.createElement("div");
    badge.className = "cs-canvas-badge";
    badge.innerHTML = '<span id="csCanvasTheme">Theme</span><i></i><span id="csCanvasRatio">16:9</span>';
    workspace.prepend(badge);
  }

  if (!csGet("csQuickDock")) {
    const dock = document.createElement("div");
    dock.id = "csQuickDock";
    dock.className = "cs-quick-dock";
    if (c.psElementPalette) {
      c.psElementPalette.className = "ps-element-palette cs-add-palette";
      c.psElementPalette.querySelectorAll("[data-ps-element]").forEach(button => {
        const type = button.dataset.psElement;
        const label = ({ title: "Heading", text: "Text", ai_summary: "Insight", kpi: "KPI", chart: "Chart", table: "Table", photo: "Photo", comparison: "Compare", progress: "Progress", annotation: "Callout" })[type] || type;
        button.innerHTML = `<span class="cs-palette-icon">${csIcon(type, 18)}</span><b>${label}</b>`;
        button.title = `Add ${label.toLowerCase()}`;
      });
      dock.append(c.psElementPalette);
    }
    workspace.append(dock);

    const add = document.createElement("button");
    add.id = "csAddContentButton";
    add.type = "button";
    add.className = "cs-add-content-button";
    add.innerHTML = `${csIcon("plus", 18)}<span>Add content</span>`;
    add.setAttribute("aria-expanded", "false");
    workspace.append(add);
  }

  if (!workspace.querySelector(".cs-stage-status")) {
    const status = document.createElement("div");
    status.className = "cs-stage-status";
    status.innerHTML = '<span id="csSelectionHint">Click an item to edit it</span>';
    const zoom = document.createElement("div");
    zoom.className = "cs-zoom-mini";
    const out = document.createElement("button");
    out.type = "button";
    out.dataset.csZoom = "out";
    out.textContent = "−";
    const inside = document.createElement("span");
    if (c.psZoomRange) inside.append(c.psZoomRange);
    if (c.psZoomValue) inside.append(c.psZoomValue);
    const plus = document.createElement("button");
    plus.type = "button";
    plus.dataset.csZoom = "in";
    plus.textContent = "+";
    zoom.append(out, inside, plus);
    status.append(zoom);
    workspace.append(status);
  }

  const notes = studio.querySelector(".ps-notes-bar");
  if (notes && !csGet("csNotesToggle")) {
    notes.classList.add("cs-notes-bar", "collapsed");
    const toggle = document.createElement("button");
    toggle.id = "csNotesToggle";
    toggle.type = "button";
    toggle.className = "cs-notes-toggle";
    toggle.innerHTML = `${csIcon("notes", 16)}<span>Speaker notes</span><i>⌃</i>`;
    notes.insertAdjacentElement("beforebegin", toggle);
  }
}

function csBuildInspector() {
  const inspector = csState.controls.psInspector;
  if (!inspector || inspector.querySelector(".cs-smart-head")) return;
  inspector.className = "ps-inspector cs-smart-panel";
  const head = document.createElement("div");
  head.className = "cs-smart-head";
  head.innerHTML = `<div><strong>Smart controls</strong><small id="csSmartContext">Select something on the page</small></div><button id="csInspectorClose" class="cs-icon-action small" type="button" aria-label="Close controls">${csIcon("close", 16)}</button>`;
  inspector.insertBefore(head, inspector.firstChild);
  const tabs = inspector.querySelectorAll(".ps-inspector-tabs button");
  ["Edit", "Style", "Data"].forEach((label, index) => { if (tabs[index]) tabs[index].textContent = label; });
}

function csBuildGuide() {
  if (csGet("csGuideModal")) return;
  const guide = document.createElement("div");
  guide.id = "csGuideModal";
  guide.className = "cs-guide-modal";
  guide.hidden = true;
  guide.innerHTML = `<button class="cs-guide-backdrop" data-cs-close-guide aria-label="Close guide"></button><section class="cs-guide-card" role="dialog" aria-modal="true"><button class="cs-guide-close" data-cs-close-guide aria-label="Close guide">${csIcon("close")}</button><span class="cs-guide-icon">${csIcon("story", 26)}</span><p class="cs-kicker">Three simple steps</p><h2>Build a presentation without learning a complicated tool.</h2><div class="cs-guide-steps"><article><b>1</b><div><strong>Choose a slide</strong><p>Use the Storyline or pick a ready-made layout.</p></div></article><article><b>2</b><div><strong>Add what matters</strong><p>Add charts, KPIs, photos, text, and insights.</p></div></article><article><b>3</b><div><strong>Polish and deliver</strong><p>Select an item to edit it, then preview, share, or export.</p></div></article></div><button class="cs-primary-button" data-cs-close-guide>Start building</button></section>`;
  document.body.append(guide);
}

function csBuildFeedback(view) {
  if (csGet("csStudioLoading")) return;
  const loading = document.createElement("div");
  loading.id = "csStudioLoading";
  loading.className = "cs-studio-loading";
  loading.innerHTML = `<span class="cs-loading-mark">${csIcon("story", 24)}</span><div><strong>Opening Story Studio</strong><small>Preparing your slides and project data…</small></div><i></i>`;
  view.append(loading);

  const error = document.createElement("div");
  error.id = "csStudioError";
  error.className = "cs-studio-error";
  error.hidden = true;
  error.innerHTML = `<section><span>${csIcon("annotation", 24)}</span><div><strong>Story Studio could not open</strong><p id="csStudioErrorMessage">Reload the page and try again.</p></div><button id="csErrorBack" type="button">Back to project</button></section>`;
  view.append(error);
}

function csInlineSelect(label, select) {
  const wrapper = document.createElement("label");
  wrapper.className = "cs-inline-select";
  wrapper.innerHTML = `<span>${label}</span>`;
  wrapper.append(select);
  return wrapper;
}

function csBind(view) {
  [["csMoreButton", "csMoreMenu"], ["csLayoutButton", "csLayoutMenu"], ["csArrangeButton", "csArrangeMenu"]].forEach(([buttonId, menuId]) => {
    csGet(buttonId)?.addEventListener("click", event => {
      event.stopPropagation();
      const menu = csGet(menuId);
      const open = Boolean(menu?.hidden);
      csClosePopovers();
      if (menu) menu.hidden = !open;
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".cs-popover-wrap")) csClosePopovers();
    const dock = csGet("csQuickDock");
    if (dock && !event.target.closest("#csQuickDock") && !event.target.closest("#csAddContentButton")) csToggleAddDock(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      csClosePopovers();
      csToggleAddDock(false);
      if (document.body.classList.contains("cs-inspector-open")) csSetInspector(false);
    }
  });

  csGet("csHelpButton")?.addEventListener("click", () => {
    csClosePopovers();
    const guide = csGet("csGuideModal");
    if (guide) guide.hidden = false;
  });
  document.querySelectorAll("[data-cs-close-guide]").forEach(button => button.addEventListener("click", () => {
    const guide = csGet("csGuideModal");
    if (guide) guide.hidden = true;
  }));

  csGet("csAddContentButton")?.addEventListener("click", event => {
    event.stopPropagation();
    csToggleAddDock(!csGet("csQuickDock")?.classList.contains("open"));
  });
  csGet("csQuickDock")?.addEventListener("click", event => {
    if (event.target.closest("[data-ps-element]")) csToggleAddDock(false);
  });

  csGet("csInspectorClose")?.addEventListener("click", event => {
    event.preventDefault();
    csSetInspector(false);
  });
  csState.controls.psToggleInspectorButton?.addEventListener("click", () => {
    setTimeout(() => csSetInspector(!document.body.classList.contains("ps-inspector-collapsed")), 0);
  });

  csGet("csNotesToggle")?.addEventListener("click", () => {
    const notes = view.querySelector(".cs-notes-bar");
    const collapsed = notes?.classList.toggle("collapsed");
    csGet("csNotesToggle")?.classList.toggle("active", !collapsed);
    const arrow = csGet("csNotesToggle")?.querySelector("i");
    if (arrow) arrow.textContent = collapsed ? "⌃" : "⌄";
    setTimeout(csFit, 50);
  });

  document.querySelectorAll("[data-cs-zoom]").forEach(button => button.addEventListener("click", () => {
    const direction = button.dataset.csZoom === "in" ? 10 : -10;
    if (typeof ctSetZoom === "function" && typeof ps !== "undefined") ctSetZoom((ps.data?.zoom || 100) + direction);
    else if (csState.controls.psZoomRange) {
      const range = csState.controls.psZoomRange;
      range.value = String(Math.max(Number(range.min) || 30, Math.min(Number(range.max) || 200, Number(range.value) + direction)));
      range.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }));

  csState.controls.psSlideCanvas?.addEventListener("pointerdown", event => {
    if (event.target.closest(".ps-element")) csSetInspector(true);
  });
  csState.controls.psSlideCanvas?.addEventListener("click", event => {
    setTimeout(() => { if (event.target.closest(".ps-element")) csSetInspector(true); }, 0);
  });

  csGet("csErrorBack")?.addEventListener("click", () => csState.controls.psBackButton?.click());

  view.addEventListener("click", csScheduleSync);
  view.addEventListener("input", csScheduleSync);
  view.addEventListener("change", csScheduleSync);
  window.addEventListener("resize", () => {
    clearTimeout(window.__csStoryResize);
    window.__csStoryResize = setTimeout(csFit, 120);
  });
}

function csWrapPresentationRender() {
  if (typeof renderPresentationStudio !== "function" || renderPresentationStudio.csStoryWrapped) return;
  const original = renderPresentationStudio;
  renderPresentationStudio = function csStoryRender(...args) {
    const result = original.apply(this, args);
    requestAnimationFrame(csScheduleSync);
    return result;
  };
  renderPresentationStudio.csStoryWrapped = true;
}

function csActivate() {
  const view = csGet("presentationView");
  if (!view || document.body.classList.contains("home-mode")) return;
  csState.active = true;
  document.body.classList.add("presentation-mode");
  document.documentElement.classList.add("presentation-active");
  view.classList.add("cs-story-studio");
  if (!localStorage.getItem("civentraq_story_ui_clean_v1")) {
    document.body.classList.remove("ps-slides-collapsed");
    document.body.classList.add("ps-inspector-collapsed");
    localStorage.setItem("civentraq_story_ui_clean_v1", "ready");
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    csFit();
    document.body.classList.remove("presentation-opening");
    csScheduleSync();
  }));
}

function csDeactivate() {
  if (!csState.active) return;
  csState.active = false;
  document.body.classList.remove("presentation-mode", "presentation-opening", "cs-inspector-open");
  document.documentElement.classList.remove("presentation-active");
  csToggleAddDock(false);
  csClosePopovers();
}

function csSetInspector(open) {
  document.body.classList.toggle("cs-inspector-open", Boolean(open));
  document.body.classList.toggle("ps-inspector-collapsed", !open);
  csState.controls.psInspector?.classList.toggle("mobile-open", Boolean(open));
  try { if (typeof saveEditorPreferences === "function") saveEditorPreferences(); } catch (_) {}
  setTimeout(csFit, 50);
  csScheduleSync();
}

function csFit() {
  if (!csState.active) return;
  try {
    if (typeof fitCanvasToWorkspace === "function") fitCanvasToWorkspace();
    else if (typeof applyCanvasZoom === "function") applyCanvasZoom();
  } catch (error) {
    console.warn("Story Studio fit was skipped", error);
  }
}

function csToggleAddDock(open) {
  const dock = csGet("csQuickDock");
  const button = csGet("csAddContentButton");
  dock?.classList.toggle("open", Boolean(open));
  button?.classList.toggle("active", Boolean(open));
  button?.setAttribute("aria-expanded", String(Boolean(open)));
}

function csClosePopovers() {
  ["csMoreMenu", "csLayoutMenu", "csArrangeMenu"].forEach(id => {
    const menu = csGet(id);
    if (menu) menu.hidden = true;
  });
}

function csScheduleSync() {
  clearTimeout(csState.syncTimer);
  csState.syncTimer = setTimeout(csSync, 30);
}

function csSync() {
  if (!csState.initialized || typeof ps === "undefined" || !ps.data) return;
  const slides = ps.data.slides || [];
  const index = Math.max(0, slides.findIndex(slide => slide.id === ps.data.currentSlideId));
  const slide = slides[index];
  const selected = slide?.elements?.find(element => element.id === ps.selectedElementId);
  const typeName = type => ({ title: "Heading", text: "Text", ai_summary: "AI insight", kpi: "KPI card", chart: "Chart", table: "Table", photo: "Photo", comparison: "Comparison", progress: "Progress", annotation: "Callout" })[type] || "Element";

  const current = csGet("csCurrentSlideLabel");
  if (current) current.textContent = slides.length ? `Slide ${index + 1} of ${slides.length}` : "No slides";
  const hint = csGet("csSelectionHint");
  if (hint) hint.textContent = selected ? `${typeName(selected.type)} selected — use Smart controls to edit` : "Click an item to edit it";
  const context = csGet("csSmartContext");
  if (context) context.textContent = selected ? `Editing ${typeName(selected.type).toLowerCase()}` : "Select something on the page";
  const saved = csGet("csSaveChip")?.querySelector("span");
  if (saved) saved.textContent = (csState.controls.psSaveStatus?.textContent || "Saved").replace(" locally", "");

  const themeKey = ps.data.theme || csState.controls.psThemeSelect?.value || "energy";
  const themeName = typeof PS_THEME_CATALOG !== "undefined" ? (PS_THEME_CATALOG[themeKey]?.name || themeKey) : themeKey;
  if (csGet("csCanvasTheme")) csGet("csCanvasTheme").textContent = themeName;
  if (csGet("csCanvasRatio")) csGet("csCanvasRatio").textContent = ps.data.ratio || "16:9";

  csState.controls.psToggleSlidesButton?.classList.toggle("active", !document.body.classList.contains("ps-slides-collapsed"));
  csState.controls.psToggleInspectorButton?.classList.toggle("active", !document.body.classList.contains("ps-inspector-collapsed"));
}

function csShowError(message) {
  document.body.classList.remove("presentation-opening");
  const error = csGet("csStudioError");
  const text = csGet("csStudioErrorMessage");
  if (text) text.textContent = message || "Reload the page and try again.";
  if (error) error.hidden = false;
}
