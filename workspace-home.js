(() => {
  const HOME_TEMPLATE_NAMES = {
    executive: "Executive control",
    cost: "Commercial focus",
    schedule: "Delivery focus",
    refinery: "Energy & refinery"
  };
  const DATA_CHOICE_NAMES = {
    sample: "Guided sample data",
    blank: "Blank workspace",
    import: "Import after creation"
  };
  const TEMPLATE_DESCRIPTIONS = {
    executive: "A balanced workspace for management reporting and client presentations.",
    cost: "A commercial workspace focused on budget, commitments, cash flow, and forecast.",
    schedule: "A delivery workspace focused on progress, milestones, look-ahead, and recovery.",
    refinery: "A specialist workspace for turnaround, HSE, inspection, and readiness reporting."
  };

  let wizardStep = 1;
  let wizardDataChoice = "sample";
  let wizardTemplateChoice = "executive";

  document.addEventListener("DOMContentLoaded", () => {
    enforceProductBrand();
    bindHomeEvents();
    renderHomeProjects();
    resetWizardDefaults();
    window.CiventraqHome = { open: openHome, openWorkspace, openWizard, render: renderHomeProjects };
  });

  function enforceProductBrand() {
    if (typeof state === "undefined" || !state.customization) return;
    state.customization.brandName = "Civentraq";
    state.customization.brandTagline = "Project Intelligence";
    state.customization.brandInitials = "CV";
    if (typeof saveState === "function") saveState();
    if (typeof applyCustomization === "function") applyCustomization();
  }

  function bindHomeEvents() {
    document.querySelectorAll("[data-start-route]").forEach(button => {
      button.addEventListener("click", () => handleStartRoute(button.dataset.startRoute));
    });
    document.querySelectorAll("[data-start-action]").forEach(button => {
      button.addEventListener("click", () => handleStartAction(button.dataset.startAction));
    });
    document.querySelectorAll("[data-home-template]").forEach(button => {
      button.addEventListener("click", () => openWizard(3, button.dataset.homeTemplate));
    });
    document.querySelectorAll("[data-wizard-close]").forEach(button => button.addEventListener("click", closeWizard));
    document.querySelectorAll("[data-wizard-step]").forEach(button => {
      button.addEventListener("click", () => {
        const target = Number(button.dataset.wizardStep);
        if (target <= wizardStep || validateWizardStep(wizardStep)) setWizardStep(target);
      });
    });
    document.querySelectorAll("[data-data-choice]").forEach(button => {
      button.addEventListener("click", () => {
        wizardDataChoice = button.dataset.dataChoice;
        document.querySelectorAll("[data-data-choice]").forEach(item => item.classList.toggle("selected", item === button));
        updateWizardReview();
      });
    });
    document.querySelectorAll("[data-template-choice]").forEach(button => {
      button.addEventListener("click", () => selectWizardTemplate(button.dataset.templateChoice));
    });

    document.getElementById("wizardBack")?.addEventListener("click", () => setWizardStep(Math.max(1, wizardStep - 1)));
    document.getElementById("wizardNext")?.addEventListener("click", handleWizardNext);
    document.getElementById("homeProjectForm")?.addEventListener("submit", event => event.preventDefault());
    ["homeProjectName", "homeProjectClient", "homeProjectLocation", "homeProjectBudget", "homeProjectStart", "homeProjectEnd"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", updateWizardReview);
    });

    document.getElementById("startSearch")?.addEventListener("input", event => filterHome(event.target.value));
    document.getElementById("projectLibrarySearch")?.addEventListener("input", renderProjectLibrary);
    document.getElementById("projectLibraryFilter")?.addEventListener("change", renderProjectLibrary);

    document.addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && document.body.classList.contains("home-mode")) {
        event.preventDefault();
        document.getElementById("startSearch")?.focus();
      }
      if (event.key === "Escape" && document.getElementById("projectWizard")?.classList.contains("open")) closeWizard();
    });

    const dashboardBrand = document.querySelector(".app-shell .brand");
    dashboardBrand?.addEventListener("click", event => {
      event.preventDefault();
      openHome();
    });

    const oldNewProject = document.getElementById("newProjectButton");
    oldNewProject?.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openHome();
      openWizard(1);
    }, true);
  }

  function handleStartRoute(route) {
    document.querySelectorAll(".start-nav-link").forEach(link => link.classList.toggle("active", link.dataset.startRoute === route));
    if (route === "home") {
      showHomeLanding();
      return;
    }
    if (route === "projects") {
      showProjectLibrary();
      return;
    }
    if (route === "shared") {
      showStartToast("Shared workspaces become available when cloud collaboration is connected.");
      return;
    }
    if (route === "settings") {
      openWorkspace("overview");
      setTimeout(() => document.getElementById("settingsButton")?.click(), 80);
      return;
    }
    openWorkspace(route === "presentation" ? "presentation" : route);
  }

  function handleStartAction(action) {
    if (action === "new-project") openWizard(1);
    else if (action === "import") {
      openWorkspace("imports");
      setTimeout(() => typeof openImportModal === "function" && openImportModal(), 120);
    } else if (action === "template") openWizard(3);
    else if (action === "recent") document.getElementById("recentProjectsSection")?.scrollIntoView({ behavior: "smooth", block: "center" });
    else if (action === "tour") showStartToast("Start with New project, connect data, then choose a report or presentation template.");
  }

  function openHome() {
    document.body.classList.add("home-mode");
    document.getElementById("projectWizard")?.classList.remove("open");
    renderHomeProjects();
    showHomeLanding();
    window.scrollTo(0, 0);
  }

  function openWorkspace(view = "overview") {
    document.body.classList.remove("home-mode");
    const button = document.querySelector(`.nav-link[data-view="${view}"]`) || document.querySelector('.nav-link[data-view="overview"]');
    if (button && typeof switchView === "function") switchView(button.dataset.view, button);
    if (typeof renderAll === "function") renderAll();
  }

  function showHomeLanding() {
    document.getElementById("startHomeContent")?.removeAttribute("hidden");
    document.getElementById("startProjectLibrary")?.setAttribute("hidden", "");
    const hero = document.querySelector(".start-hero");
    if (hero) hero.hidden = false;
  }

  function showProjectLibrary() {
    document.getElementById("startHomeContent")?.setAttribute("hidden", "");
    document.getElementById("startProjectLibrary")?.removeAttribute("hidden");
    const hero = document.querySelector(".start-hero");
    if (hero) hero.hidden = true;
    renderProjectLibrary();
  }

  function projectTone(index) {
    return ["blue", "teal", "orange", "violet"][index % 4];
  }

  function getProjectProgress(project, index) {
    if (typeof state !== "undefined" && state.project?.id === project.id && typeof calculateMetrics === "function") {
      return Math.max(0, Math.min(100, Math.round(calculateMetrics().actualProgress || 0)));
    }
    const seed = [...String(project.name || "Project")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return 18 + ((seed + index * 17) % 67);
  }

  function renderHomeProjects() {
    if (typeof state === "undefined") return;
    const recent = document.getElementById("homeRecentProjects");
    if (recent) {
      const projects = (state.projects || []).slice(0, 3);
      recent.innerHTML = projects.length ? projects.map((project, index) => homeProjectCard(project, index)).join("") : emptyProjectsMarkup();
      recent.querySelectorAll("[data-open-project]").forEach(button => button.addEventListener("click", () => activateProject(button.dataset.openProject)));
    }
    renderProjectLibrary();
  }

  function homeProjectCard(project, index) {
    const progress = getProjectProgress(project, index);
    const updated = index === 0 ? "Updated today" : index === 1 ? "Updated yesterday" : `Updated ${index + 1} days ago`;
    return `<button class="home-project-card" type="button" data-open-project="${escapeAttr(project.id)}" data-tone="${projectTone(index)}">
      <span class="home-project-cover"></span>
      <span class="home-project-body"><strong>${safe(project.name)}</strong><small>${safe(project.status || "Planning")}</small><span class="home-project-meta"><span>${updated}</span><span>${progress}%</span></span><span class="home-project-progress"><span style="width:${progress}%"></span></span></span>
    </button>`;
  }

  function renderProjectLibrary() {
    if (typeof state === "undefined") return;
    const grid = document.getElementById("projectLibraryGrid");
    if (!grid) return;
    const query = (document.getElementById("projectLibrarySearch")?.value || "").trim().toLowerCase();
    const status = document.getElementById("projectLibraryFilter")?.value || "all";
    const projects = (state.projects || []).filter(project => {
      const haystack = `${project.name} ${project.client} ${project.location}`.toLowerCase();
      return (!query || haystack.includes(query)) && (status === "all" || String(project.status || "Planning") === status);
    });
    grid.innerHTML = projects.length ? projects.map((project, index) => {
      const progress = getProjectProgress(project, index);
      return `<button class="project-library-card" type="button" data-open-project="${escapeAttr(project.id)}">
        <span class="home-project-cover"></span>
        <span class="project-library-body"><h3>${safe(project.name)}</h3><p>${safe(project.client)} · ${safe(project.location)}</p><span class="home-project-progress"><span style="width:${progress}%"></span></span><span class="project-library-footer"><span>${progress}% progress</span><span class="project-library-status">${safe(project.status || "Planning")}</span></span></span>
      </button>`;
    }).join("") : emptyProjectsMarkup();
    grid.querySelectorAll("[data-open-project]").forEach(button => button.addEventListener("click", () => activateProject(button.dataset.openProject)));
  }

  function emptyProjectsMarkup() {
    return `<div style="grid-column:1/-1;padding:32px;border:1px dashed #d9dce8;border-radius:15px;text-align:center;color:#71798e;background:#fbfbfd"><strong style="display:block;color:#202a48;margin-bottom:6px">No matching projects</strong><span style="font-size:11px">Create a new project to begin.</span></div>`;
  }

  function activateProject(projectId) {
    if (typeof state === "undefined") return;
    const project = (state.projects || []).find(item => String(item.id) === String(projectId));
    if (!project) return;
    state.project = { ...project };
    if (typeof saveState === "function") saveState();
    if (typeof populateSettings === "function") populateSettings();
    if (typeof renderAll === "function") renderAll();
    openWorkspace("overview");
  }

  function filterHome(queryValue) {
    const query = String(queryValue || "").trim().toLowerCase();
    document.querySelectorAll("#homeRecentProjects .home-project-card, #homeTemplateGrid .home-template-card").forEach(card => {
      card.hidden = Boolean(query) && !card.textContent.toLowerCase().includes(query);
    });
  }

  function openWizard(step = 1, template = null) {
    resetWizardDefaults(false);
    if (template) selectWizardTemplate(template);
    document.getElementById("projectWizard")?.classList.add("open");
    document.getElementById("projectWizard")?.setAttribute("aria-hidden", "false");
    setWizardStep(step);
  }

  function closeWizard() {
    document.getElementById("projectWizard")?.classList.remove("open");
    document.getElementById("projectWizard")?.setAttribute("aria-hidden", "true");
  }

  function resetWizardDefaults(clearFields = true) {
    wizardStep = 1;
    wizardDataChoice = "sample";
    wizardTemplateChoice = "executive";
    document.querySelectorAll("[data-data-choice]").forEach(button => button.classList.toggle("selected", button.dataset.dataChoice === "sample"));
    document.querySelectorAll("[data-template-choice]").forEach(button => button.classList.toggle("selected", button.dataset.templateChoice === "executive"));
    if (clearFields) {
      document.getElementById("homeProjectForm")?.reset();
      const today = new Date();
      const future = new Date(today);
      future.setMonth(future.getMonth() + 10);
      setInputValue("homeProjectStart", today.toISOString().slice(0,10));
      setInputValue("homeProjectEnd", future.toISOString().slice(0,10));
    }
    updateWizardReview();
  }

  function setWizardStep(step) {
    wizardStep = Math.max(1, Math.min(4, Number(step) || 1));
    document.querySelectorAll("[data-wizard-panel]").forEach(panel => panel.classList.toggle("active", Number(panel.dataset.wizardPanel) === wizardStep));
    document.querySelectorAll("[data-wizard-step]").forEach(button => {
      const buttonStep = Number(button.dataset.wizardStep);
      button.classList.toggle("active", buttonStep === wizardStep);
      button.classList.toggle("complete", buttonStep < wizardStep);
    });
    const back = document.getElementById("wizardBack");
    const next = document.getElementById("wizardNext");
    if (back) back.disabled = wizardStep === 1;
    if (next) next.textContent = wizardStep === 4 ? "Create workspace" : "Next →";
    const progress = document.getElementById("wizardProgressText");
    if (progress) progress.textContent = `${wizardStep} of 4`;
    updateWizardReview();
  }

  function hasRequiredProjectDetails() {
    return ["homeProjectName", "homeProjectClient", "homeProjectLocation", "homeProjectBudget", "homeProjectStart", "homeProjectEnd"]
      .every(id => Boolean(valueOf(id)));
  }

  function validateWizardStep(step) {
    if (step !== 1) return true;
    const ids = ["homeProjectName", "homeProjectClient", "homeProjectLocation", "homeProjectBudget", "homeProjectStart", "homeProjectEnd"];
    let valid = true;
    ids.forEach(id => {
      const input = document.getElementById(id);
      if (!input?.checkValidity()) {
        input?.reportValidity();
        valid = false;
      }
    });
    return valid;
  }

  function handleWizardNext() {
    if (wizardStep < 4) {
      if (wizardStep === 3 && !hasRequiredProjectDetails()) {
        setWizardStep(1);
        showStartToast("Add the project details before reviewing the workspace.");
        setTimeout(() => document.getElementById("homeProjectName")?.focus(), 80);
        return;
      }
      if (!validateWizardStep(wizardStep)) return;
      setWizardStep(wizardStep + 1);
      return;
    }
    createProjectFromWizard();
  }

  function selectWizardTemplate(template) {
    wizardTemplateChoice = HOME_TEMPLATE_NAMES[template] ? template : "executive";
    document.querySelectorAll("[data-template-choice]").forEach(button => button.classList.toggle("selected", button.dataset.templateChoice === wizardTemplateChoice));
    const label = document.getElementById("wizardPreviewTemplate");
    const description = document.getElementById("wizardPreviewDescription");
    if (label) label.textContent = HOME_TEMPLATE_NAMES[wizardTemplateChoice];
    if (description) description.textContent = TEMPLATE_DESCRIPTIONS[wizardTemplateChoice];
    document.querySelector(".wizard-preview-canvas")?.setAttribute("data-template", wizardTemplateChoice);
    updateWizardReview();
  }

  function updateWizardReview() {
    const name = valueOf("homeProjectName") || "Untitled project";
    const client = valueOf("homeProjectClient") || "Client";
    const location = valueOf("homeProjectLocation") || "Location";
    const budget = Number(valueOf("homeProjectBudget") || 0);
    const start = valueOf("homeProjectStart");
    const end = valueOf("homeProjectEnd");
    setText("reviewProjectName", name);
    setText("reviewProjectMeta", `${client} · ${location}`);
    setText("reviewProjectBudget", formatCurrency(budget));
    setText("reviewProjectPeriod", start && end ? `${formatShortDate(start)} – ${formatShortDate(end)}` : "Not set");
    setText("reviewDataChoice", DATA_CHOICE_NAMES[wizardDataChoice]);
    setText("reviewTemplateChoice", HOME_TEMPLATE_NAMES[wizardTemplateChoice]);
  }

  function createProjectFromWizard() {
    if (!validateWizardStep(1) || typeof state === "undefined") return;
    const project = {
      id: `project-${Date.now()}`,
      name: valueOf("homeProjectName").trim(),
      client: valueOf("homeProjectClient").trim(),
      location: valueOf("homeProjectLocation").trim(),
      approvedBudget: Number(valueOf("homeProjectBudget")),
      startDate: valueOf("homeProjectStart"),
      endDate: valueOf("homeProjectEnd"),
      status: valueOf("homeProjectStatus") || "Planning",
      description: valueOf("homeProjectDescription").trim(),
      template: wizardTemplateChoice,
      createdAt: new Date().toISOString()
    };
    state.project = project;
    state.projects = [project, ...(state.projects || []).filter(item => item.id !== project.id)];
    state.datasets = [];

    if (wizardDataChoice === "blank") {
      state.rows = [];
      state.importHistory = [];
    } else if (typeof SAMPLE_ROWS !== "undefined") {
      state.rows = SAMPLE_ROWS.map(row => ({ ...row }));
      state.importHistory = [];
    }

    applyTemplateCustomization(wizardTemplateChoice);
    if (typeof ensureDatasetLibrary === "function") ensureDatasetLibrary();
    if (wizardDataChoice === "blank") {
      const performanceDataset = state.datasets?.find(dataset => dataset.id === "project_performance");
      if (performanceDataset) Object.assign(performanceDataset, { status: "empty", source: "No file connected", rows: [], quality: 0, updatedAt: "" });
    }
    if (typeof saveState === "function") saveState();
    if (typeof populateSettings === "function") populateSettings();
    if (typeof renderAll === "function") renderAll();
    if (wizardDataChoice === "blank") {
      const notice = document.getElementById("dataNotice");
      if (notice) notice.innerHTML = `<div><strong>No project data connected.</strong> Add an Excel or CSV dataset when you are ready.</div><button class="text-button" id="noticeImportButton">Upload project data →</button>`;
      document.getElementById("noticeImportButton")?.addEventListener("click", () => typeof openImportModal === "function" && openImportModal());
    }
    closeWizard();
    openWorkspace("overview");
    if (typeof showToast === "function") showToast(`${project.name} workspace created.`);
    if (wizardDataChoice === "import") setTimeout(() => typeof openImportModal === "function" && openImportModal(), 180);
  }

  function applyTemplateCustomization(template) {
    if (!state.customization) return;
    const presetName = template === "cost" ? "executive" : template === "schedule" ? "ocean" : template === "refinery" ? "construction" : "civentraq";
    const preset = typeof THEME_PRESETS !== "undefined" ? THEME_PRESETS[presetName]?.light : null;
    state.customization.preset = presetName;
    state.customization.mode = "light";
    if (preset) Object.assign(state.customization, preset);
    state.customization.chartPalette = template === "cost" ? "vivid" : template === "refinery" ? "vivid" : "brand";
  }

  function showStartToast(message) {
    if (typeof showToast === "function") {
      showToast(message);
      return;
    }
    const toast = document.createElement("div");
    toast.textContent = message;
    Object.assign(toast.style, { position:"fixed", left:"50%", bottom:"25px", transform:"translateX(-50%)", zIndex:"9000", background:"#17254b", color:"white", padding:"11px 16px", borderRadius:"10px", font:"600 11px Inter,sans-serif", boxShadow:"0 12px 30px rgba(0,0,0,.2)" });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  function safe(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
  }
  function escapeAttr(value) { return safe(value); }
  function valueOf(id) { return document.getElementById(id)?.value || ""; }
  function setInputValue(id, value) { const element = document.getElementById(id); if (element) element.value = value; }
  function setText(id, value) { const element = document.getElementById(id); if (element) element.textContent = value; }
  function formatCurrency(value) { return new Intl.NumberFormat("en-ZA", { style:"currency", currency:"ZAR", maximumFractionDigits:0 }).format(Number(value) || 0); }
  function formatShortDate(value) { try { return new Intl.DateTimeFormat("en-ZA", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(`${value}T00:00:00`)); } catch { return value; } }
})();
