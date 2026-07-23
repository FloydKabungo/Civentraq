(() => {
  'use strict';

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
    projects: '<path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 7V5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2"/>',
    datasets: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
    reports: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h5M8 13h2v5H8zm4-3h2v8h-2zm4 5h2v3h-2z"/>',
    presentation: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M9 8l6 2-6 2z"/>',
    shared: '<circle cx="8" cy="12" r="3"/><circle cx="17" cy="6" r="3"/><circle cx="17" cy="18" r="3"/><path d="m10.5 10.6 4-2.4m-4 5.2 4 2.4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2 1-1.2 1.8M12 17h.01"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    upload: '<path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/>',
    template: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
    folder: '<path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    activity: '<path d="M3 12h4l2.5-7 5 14 2.5-7h4"/>',
    currency: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-.8-.7-1.8-1-3-1-1.7 0-3 .8-3 2s1 1.8 3 2.3 3 1.2 3 2.7-1.4 2.5-3.3 2.5c-1.2 0-2.4-.4-3.2-1.2M12 5v14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    chart: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/>',
    shield: '<path d="M12 3 4 6v5c0 5.2 3.4 8.6 8 10 4.6-1.4 8-4.8 8-10V6z"/><path d="m9 12 2 2 4-5"/>',
    refresh: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.5 10A7 7 0 0 0 6 7.5L4 11m16 2-2 3.5A7 7 0 0 1 5.5 14"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    download: '<path d="M12 4v11m0 0 4-4m-4 4-4-4"/><path d="M5 20h14"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    comment: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
    logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M14 3h7v18h-7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    sparkles: '<path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3zM19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7zM5 14l.7 1.8L8 16.5l-2.3.7L5 19l-.7-1.8-2.3-.7 2.3-.7z"/>'
  };

  const ROUTE_META = {
    home: { title: 'Home', subtitle: 'Your project intelligence workspace' },
    projects: { title: 'Projects', subtitle: 'Plan, monitor, and present every project from one place' },
    datasets: { title: 'Datasets', subtitle: 'Connect the information that powers your dashboards and reports' },
    reports: { title: 'Reports', subtitle: 'Generate structured reports for management and clients' },
    presentation: { title: 'Presentations', subtitle: 'Build and deliver polished project presentations' },
    shared: { title: 'Shared with me', subtitle: 'Review secure presentations and collaborative workspaces' },
    settings: { title: 'Workspace settings', subtitle: 'Control your Civentraq experience and defaults' }
  };

  const SETTINGS_KEY = 'civentraq_phase1_preferences';
  const NOTIFICATIONS_KEY = 'civentraq_phase1_notifications';
  let currentRoute = 'home';
  let currentSearchItems = [];

  document.addEventListener('DOMContentLoaded', initPolish);

  function initPolish() {
    injectRouteShell();
    injectUtilityUi();
    decorateStaticUi();
    bindPolishEvents();
    addDashboardHomeButton();
    renderNotifications();
    applyPreferences();
    auditButtons();
    document.documentElement.classList.add('ct-phase1-ready');
  }

  function svg(name, cls = '') {
    const paths = ICONS[name] || ICONS.info;
    return `<svg class="ct-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  function injectRouteShell() {
    const scroll = document.querySelector('.start-scroll');
    const footer = document.querySelector('.start-trust-strip');
    if (!scroll || document.getElementById('polishRoutePage')) return;
    const section = document.createElement('section');
    section.className = 'polish-route-page';
    section.id = 'polishRoutePage';
    section.hidden = true;
    section.innerHTML = '<div id="polishRouteContent"></div>';
    scroll.insertBefore(section, footer || null);
  }

  function injectUtilityUi() {
    if (document.getElementById('ctUtilityLayer')) return;
    const layer = document.createElement('div');
    layer.id = 'ctUtilityLayer';
    layer.innerHTML = `
      <div class="ct-command-backdrop" id="ctCommandBackdrop" hidden>
        <section class="ct-command" role="dialog" aria-modal="true" aria-labelledby="ctCommandTitle">
          <header><div>${svg('search')}<input id="ctCommandInput" type="search" placeholder="Search projects, datasets, reports, and actions" autocomplete="off"></div><kbd>Esc</kbd></header>
          <div class="ct-command-body"><p id="ctCommandTitle">Quick search</p><div id="ctCommandResults"></div></div>
          <footer><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Enter</kbd> Open</span></footer>
        </section>
      </div>
      <div class="ct-popover" id="ctNotificationsPopover" hidden></div>
      <div class="ct-popover ct-profile-popover" id="ctProfilePopover" hidden></div>
      <div class="ct-dialog-backdrop" id="ctDialogBackdrop" hidden>
        <section class="ct-dialog" id="ctDialog" role="dialog" aria-modal="true"></section>
      </div>
      <div class="ct-tour" id="ctTour" hidden></div>
      <div class="ct-toast-stack" id="ctToastStack" aria-live="polite"></div>`;
    document.body.appendChild(layer);
  }

  function decorateStaticUi() {
    const startRouteIcons = { home: 'home', projects: 'projects', datasets: 'datasets', reports: 'reports', presentation: 'presentation', shared: 'shared' };
    document.querySelectorAll('[data-start-route]').forEach(button => {
      const route = button.dataset.startRoute;
      const old = button.querySelector(':scope > span');
      if (old && startRouteIcons[route]) old.outerHTML = svg(startRouteIcons[route]);
    });
    const settings = document.querySelector('.start-sidebar-settings span');
    if (settings) settings.outerHTML = svg('settings');

    const searchLabel = document.querySelector('.start-search > span');
    if (searchLabel) searchLabel.outerHTML = svg('search');

    const topIcons = document.querySelectorAll('.start-icon-button');
    if (topIcons[0]) { topIcons[0].innerHTML = svg('help'); topIcons[0].id = 'ctHelpButton'; }
    if (topIcons[1]) { topIcons[1].innerHTML = `${svg('bell')}<i class="ct-notification-dot" id="ctNotificationDot"></i>`; topIcons[1].id = 'ctNotificationsButton'; }
    const profile = document.querySelector('.start-profile');
    if (profile) profile.id = 'ctProfileButton';

    const quick = [
      ['new-project', 'plus'], ['import', 'upload'], ['template', 'template'], ['recent', 'folder']
    ];
    quick.forEach(([action, iconName]) => {
      const button = document.querySelector(`[data-start-action="${action}"]`);
      const iconNode = button?.querySelector('.quick-icon');
      if (iconNode) iconNode.innerHTML = svg(iconName);
      const arrow = button?.querySelector(':scope > b');
      if (arrow) arrow.innerHTML = svg('chevron');
    });

    const dashboardIcons = { overview: 'grid', projects: 'projects', imports: 'upload', datasets: 'datasets', reports: 'reports', presentation: 'presentation' };
    document.querySelectorAll('.sidebar-nav .nav-link[data-view]').forEach(button => {
      const node = button.querySelector('.nav-icon');
      if (node) node.innerHTML = svg(dashboardIcons[button.dataset.view] || 'grid');
    });
    const projectSettingsIcon = document.querySelector('#settingsButton .nav-icon');
    if (projectSettingsIcon) projectSettingsIcon.innerHTML = svg('settings');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.innerHTML = svg('more');

    const kpis = ['currency', 'activity', 'currency', 'check', 'clock', 'users'];
    document.querySelectorAll('.kpi-card .kpi-icon').forEach((node, index) => node.innerHTML = svg(kpis[index] || 'activity'));

    document.querySelectorAll('.text-button').forEach(button => {
      if (!button.querySelector('svg')) button.insertAdjacentHTML('beforeend', svg('arrow'));
    });

    const wizardClose = document.querySelector('.wizard-close');
    if (wizardClose) wizardClose.innerHTML = svg('close');
    document.querySelectorAll('.wizard-choice > span').forEach((node, index) => node.innerHTML = svg(['sparkles', 'grid', 'upload'][index] || 'grid'));
  }

  function bindPolishEvents() {
    document.addEventListener('click', captureStartRoutes, true);
    document.addEventListener('click', captureSpecialStartActions, true);
    document.addEventListener('click', handleActionClicks);
    document.addEventListener('keydown', handleKeyboard);

    const startSearch = document.getElementById('startSearch');
    if (startSearch) {
      startSearch.addEventListener('focus', event => { event.preventDefault(); openCommandPalette(startSearch.value); });
      startSearch.addEventListener('click', event => { event.preventDefault(); openCommandPalette(startSearch.value); });
    }

    document.getElementById('ctCommandInput')?.addEventListener('input', event => renderCommandResults(event.target.value));
    document.getElementById('ctCommandBackdrop')?.addEventListener('click', event => {
      if (event.target.id === 'ctCommandBackdrop') closeCommandPalette();
    });
    document.getElementById('ctHelpButton')?.addEventListener('click', event => { event.stopPropagation(); openHelp(); });
    document.getElementById('ctNotificationsButton')?.addEventListener('click', event => { event.stopPropagation(); toggleNotifications(event.currentTarget); });
    document.getElementById('ctProfileButton')?.addEventListener('click', event => { event.stopPropagation(); toggleProfile(event.currentTarget); });
    document.addEventListener('click', event => {
      if (!event.target.closest('#ctNotificationsPopover,#ctNotificationsButton')) hidePopover('ctNotificationsPopover');
      if (!event.target.closest('#ctProfilePopover,#ctProfileButton')) hidePopover('ctProfilePopover');
    });
  }


  function captureSpecialStartActions(event) {
    const button = event.target.closest('[data-start-action="tour"]');
    if (!button || !document.body.classList.contains('home-mode')) return;
    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); openTour();
  }

  function captureStartRoutes(event) {
    const button = event.target.closest('[data-start-route]');
    if (!button || !document.body.classList.contains('home-mode')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    navigateStart(button.dataset.startRoute || 'home');
  }

  function navigateStart(route) {
    currentRoute = ROUTE_META[route] ? route : 'home';
    document.querySelectorAll('.start-nav-link').forEach(link => link.classList.toggle('active', link.dataset.startRoute === currentRoute));
    const hero = document.querySelector('.start-hero');
    const home = document.getElementById('startHomeContent');
    const oldProjects = document.getElementById('startProjectLibrary');
    const routePage = document.getElementById('polishRoutePage');
    if (currentRoute === 'home') {
      if (hero) hero.hidden = false;
      home?.removeAttribute('hidden');
      oldProjects?.setAttribute('hidden', '');
      if (routePage) routePage.hidden = true;
      document.querySelector('.start-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (hero) hero.hidden = true;
    home?.setAttribute('hidden', '');
    oldProjects?.setAttribute('hidden', '');
    if (routePage) routePage.hidden = false;
    renderRoute(currentRoute);
    document.querySelector('.start-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderRoute(route) {
    const host = document.getElementById('polishRouteContent');
    if (!host) return;
    const meta = ROUTE_META[route];
    host.innerHTML = `<header class="ct-page-header"><div><p>Civentraq workspace</p><h1>${escapeHtml(meta.title)}</h1><span>${escapeHtml(meta.subtitle)}</span></div><div class="ct-page-header-actions" id="ctPageHeaderActions"></div></header><div id="ctRouteBody"></div>`;
    const body = document.getElementById('ctRouteBody');
    if (route === 'projects') renderProjectsPage(body);
    if (route === 'datasets') renderDatasetsPage(body);
    if (route === 'reports') renderReportsPage(body);
    if (route === 'presentation') renderPresentationsPage(body);
    if (route === 'shared') renderSharedPage(body);
    if (route === 'settings') renderSettingsPage(body);
  }

  function pageActions(markup) {
    const host = document.getElementById('ctPageHeaderActions');
    if (host) host.innerHTML = markup;
  }

  function renderProjectsPage(host) {
    const projects = typeof state !== 'undefined' && Array.isArray(state.projects) ? state.projects : [];
    const active = typeof state !== 'undefined' ? state.project?.id : '';
    pageActions(`<button class="ct-button ghost" data-polish-action="import">${svg('upload')} Import data</button><button class="ct-button primary" data-polish-action="new-project">${svg('plus')} New project</button>`);
    host.innerHTML = `
      <section class="ct-summary-row">
        ${summaryCard('projects', projects.length, 'Total projects', 'Across this browser workspace')}
        ${summaryCard('activity', projects.filter(p => String(p.status).toLowerCase() === 'active').length, 'Active', 'Currently being delivered')}
        ${summaryCard('clock', projects.filter(p => String(p.status).toLowerCase() === 'planning').length, 'Planning', 'Preparing to begin')}
        ${summaryCard('check', projects.filter(p => String(p.status).toLowerCase() === 'complete').length, 'Complete', 'Closed and reported')}
      </section>
      <section class="ct-card ct-toolbar-card"><label class="ct-input-with-icon">${svg('search')}<input id="ctProjectsSearch" type="search" placeholder="Search by project, client, or location"></label><div class="ct-segmented" id="ctProjectFilters"><button class="active" data-project-status="all">All</button><button data-project-status="Active">Active</button><button data-project-status="Planning">Planning</button><button data-project-status="Complete">Complete</button></div><button class="ct-icon-only" id="ctProjectViewToggle" title="Change view">${svg('grid')}</button></section>
      <section class="ct-projects-grid" id="ctPolishProjectsGrid"></section>`;
    let status = 'all';
    let query = '';
    const render = () => {
      const filtered = projects.filter(project => {
        const text = `${project.name || ''} ${project.client || ''} ${project.location || ''}`.toLowerCase();
        return (!query || text.includes(query)) && (status === 'all' || project.status === status);
      });
      const grid = document.getElementById('ctPolishProjectsGrid');
      if (!grid) return;
      grid.innerHTML = filtered.length ? filtered.map((project, index) => {
        const progress = getProjectProgress(project, index);
        const isActive = project.id === active;
        return `<article class="ct-project-card ${isActive ? 'is-active' : ''}">
          <div class="ct-project-cover tone-${index % 4}"><div class="ct-cover-grid"></div><span>${svg(project.status === 'Complete' ? 'check' : 'activity')}</span><b>${escapeHtml(project.status || 'Planning')}</b></div>
          <div class="ct-project-card-body"><div class="ct-project-title-row"><div><small>${escapeHtml(project.client || 'Client not set')}</small><h3>${escapeHtml(project.name || 'Untitled project')}</h3></div><button class="ct-icon-only" data-polish-action="project-menu" data-project-id="${escapeAttr(project.id)}">${svg('more')}</button></div>
          <p>${svg('folder')} ${escapeHtml(project.location || 'Location not set')}</p>
          <div class="ct-progress-meta"><span>Overall progress</span><strong>${progress}%</strong></div><div class="ct-progress"><i style="width:${progress}%"></i></div>
          <footer><span>${isActive ? 'Active workspace' : 'Last opened recently'}</span><button class="ct-text-link" data-polish-action="open-project" data-project-id="${escapeAttr(project.id)}">Open project ${svg('arrow')}</button></footer></div>
        </article>`;
      }).join('') : emptyState('projects', 'No matching projects', 'Try another search or create a new project.', 'New project', 'new-project');
    };
    document.getElementById('ctProjectsSearch')?.addEventListener('input', event => { query = event.target.value.trim().toLowerCase(); render(); });
    document.querySelectorAll('#ctProjectFilters button').forEach(button => button.addEventListener('click', () => {
      status = button.dataset.projectStatus;
      document.querySelectorAll('#ctProjectFilters button').forEach(item => item.classList.toggle('active', item === button));
      render();
    }));
    document.getElementById('ctProjectViewToggle')?.addEventListener('click', () => document.getElementById('ctPolishProjectsGrid')?.classList.toggle('list-view'));
    render();
  }

  function renderDatasetsPage(host) {
    const datasets = typeof state !== 'undefined' && Array.isArray(state.datasets) ? state.datasets : [];
    const definitions = typeof DATASET_LIBRARY !== 'undefined' ? Object.values(DATASET_LIBRARY) : [];
    const connected = datasets.filter(item => item && item.rows && item.rows.length).length;
    const totalRows = datasets.reduce((sum, item) => sum + (item?.rows?.length || 0), 0);
    pageActions(`<button class="ct-button ghost" data-polish-action="download-templates">${svg('download')} Templates</button><button class="ct-button primary" data-polish-action="add-dataset">${svg('plus')} Add dataset</button>`);
    host.innerHTML = `
      <section class="ct-summary-row">
        ${summaryCard('datasets', definitions.length || datasets.length, 'Dataset types', 'Available data structures')}
        ${summaryCard('check', connected, 'Connected', 'Ready to power reporting')}
        ${summaryCard('grid', totalRows.toLocaleString(), 'Rows imported', 'Across connected files')}
        ${summaryCard('reports', typeof getReportLibraryEntries === 'function' ? getReportLibraryEntries().length : 44, 'Reports supported', 'Linked to project data')}
      </section>
      <section class="ct-card ct-toolbar-card"><label class="ct-input-with-icon">${svg('search')}<input id="ctDatasetsSearch" type="search" placeholder="Search dataset types and fields"></label><div class="ct-segmented" id="ctDatasetFilters"><button class="active" data-dataset-filter="all">All</button><button data-dataset-filter="connected">Connected</button><button data-dataset-filter="available">Available</button></div><button class="ct-button subtle" data-polish-action="import">${svg('upload')} Quick import</button></section>
      <div class="ct-info-banner">${svg('info')}<div><strong>Datasets are the source of truth.</strong><span>Connect Excel or CSV files once, then reuse the information across dashboards, reports, and presentations.</span></div><button data-polish-action="dataset-guide">How it works</button></div>
      <section class="ct-dataset-grid" id="ctPolishDatasetGrid"></section>`;
    let filter = 'all'; let query = '';
    const render = () => {
      const cards = definitions.length ? definitions : datasets.map(item => ({ id: item.id, title: item.name || item.id, description: 'Connected project dataset', category: 'Project data', fields: [] }));
      const grid = document.getElementById('ctPolishDatasetGrid');
      if (!grid) return;
      const filtered = cards.filter(def => {
        const stored = datasets.find(item => item.id === def.id);
        const isConnected = Boolean(stored?.rows?.length);
        const text = `${def.title || def.name || ''} ${def.description || ''} ${def.category || ''}`.toLowerCase();
        return (!query || text.includes(query)) && (filter === 'all' || (filter === 'connected' ? isConnected : !isConnected));
      });
      grid.innerHTML = filtered.map((def, index) => {
        const stored = datasets.find(item => item.id === def.id);
        const rows = stored?.rows?.length || 0;
        const isConnected = rows > 0;
        return `<article class="ct-dataset-card"><header><span class="ct-dataset-icon tone-${index % 4}">${svg(index % 3 === 0 ? 'datasets' : index % 3 === 1 ? 'grid' : 'activity')}</span><span class="ct-status ${isConnected ? 'success' : 'neutral'}">${isConnected ? 'Connected' : 'Not connected'}</span></header><div><small>${escapeHtml(def.category || 'Project data')}</small><h3>${escapeHtml(def.title || def.name || humanize(def.id))}</h3><p>${escapeHtml(def.description || 'Structured data for project reporting and analysis.')}</p></div><dl><div><dt>Rows</dt><dd>${rows.toLocaleString()}</dd></div><div><dt>Fields</dt><dd>${(def.fields || def.columns || []).length || '—'}</dd></div><div><dt>Updated</dt><dd>${isConnected ? 'Recently' : '—'}</dd></div></dl><footer><button class="ct-button subtle" data-polish-action="dataset-template" data-dataset-id="${escapeAttr(def.id)}">${svg('download')} Template</button><button class="ct-button ${isConnected ? 'ghost' : 'primary'}" data-polish-action="open-dataset" data-dataset-id="${escapeAttr(def.id)}">${isConnected ? 'View data' : 'Connect data'} ${svg('arrow')}</button></footer></article>`;
      }).join('') || emptyState('datasets', 'No matching datasets', 'Try another search.', 'Add dataset', 'add-dataset');
    };
    document.getElementById('ctDatasetsSearch')?.addEventListener('input', event => { query = event.target.value.trim().toLowerCase(); render(); });
    document.querySelectorAll('#ctDatasetFilters button').forEach(button => button.addEventListener('click', () => { filter = button.dataset.datasetFilter; document.querySelectorAll('#ctDatasetFilters button').forEach(item => item.classList.toggle('active', item === button)); render(); }));
    render();
  }

  function renderReportsPage(host) {
    const entries = typeof getReportLibraryEntries === 'function' ? getReportLibraryEntries() : [];
    const reports = entries.length ? entries : fallbackReports();
    pageActions(`<button class="ct-button ghost" data-polish-action="report-settings">${svg('settings')} Report defaults</button><button class="ct-button primary" data-polish-action="export-pack">${svg('download')} Export report pack</button>`);
    host.innerHTML = `
      <section class="ct-report-hero ct-card"><div><span class="ct-eyebrow">Report centre</span><h2>From project data to a clear client story.</h2><p>Choose a report, review the live information, and export it in the format your audience needs.</p><button class="ct-button primary" data-polish-action="open-reports-workspace">Open report workspace ${svg('arrow')}</button></div><div class="ct-report-hero-visual"><span></span><i></i><i></i><i></i><b></b></div></section>
      <section class="ct-card ct-toolbar-card"><label class="ct-input-with-icon">${svg('search')}<input id="ctReportsSearch" type="search" placeholder="Search reports by name or category"></label><div class="ct-segmented ct-scroll-segment" id="ctReportFilters"><button class="active" data-report-filter="all">All</button><button data-report-filter="project">Project</button><button data-report-filter="commercial">Commercial</button><button data-report-filter="hse">HSE</button><button data-report-filter="quality">Quality</button><button data-report-filter="operations">Operations</button></div></section>
      <section class="ct-report-grid" id="ctPolishReportGrid"></section>`;
    let query = ''; let filter = 'all';
    const render = () => {
      const grid = document.getElementById('ctPolishReportGrid'); if (!grid) return;
      const filtered = reports.filter(report => {
        const category = report.category || 'Project';
        const text = `${report.title || report.name || ''} ${report.description || ''} ${category}`.toLowerCase();
        return (!query || text.includes(query)) && (filter === 'all' || category.toLowerCase().includes(filter));
      });
      grid.innerHTML = filtered.map((report, index) => `<article class="ct-report-card"><div class="ct-report-preview tone-${index % 4}"><span>${svg(index % 4 === 0 ? 'chart' : index % 4 === 1 ? 'reports' : index % 4 === 2 ? 'activity' : 'shield')}</span><i></i><i></i><i></i></div><div class="ct-report-card-body"><div><small>${escapeHtml(report.category || 'Project report')}</small><h3>${escapeHtml(report.title || report.name || 'Project report')}</h3><p>${escapeHtml(report.description || 'Structured project report with KPIs, charts, and management commentary.')}</p></div><footer><span>${svg('datasets')} Dataset-powered</span><button class="ct-text-link" data-polish-action="open-report" data-report-id="${escapeAttr(report.id || report.type || 'full')}">Build report ${svg('arrow')}</button></footer></div></article>`).join('') || emptyState('reports', 'No matching reports', 'Try a different report name or category.', 'Open report workspace', 'open-reports-workspace');
    };
    document.getElementById('ctReportsSearch')?.addEventListener('input', event => { query = event.target.value.trim().toLowerCase(); render(); });
    document.querySelectorAll('#ctReportFilters button').forEach(button => button.addEventListener('click', () => { filter = button.dataset.reportFilter; document.querySelectorAll('#ctReportFilters button').forEach(item => item.classList.toggle('active', item === button)); render(); }));
    render();
  }

  function renderPresentationsPage(host) {
    const deck = typeof ps !== 'undefined' ? ps.data : null;
    const slides = deck?.slides?.length || 0;
    pageActions(`<button class="ct-button ghost" data-polish-action="presentation-templates">${svg('template')} Templates</button><button class="ct-button primary" data-polish-action="new-presentation">${svg('plus')} New presentation</button>`);
    host.innerHTML = `
      <section class="ct-presentation-hero"><div><span class="ct-eyebrow">Presentation studio</span><h2>Build the meeting, not just the report.</h2><p>Turn live project information into a polished, editable deck with your company branding.</p><div><button class="ct-button primary" data-polish-action="open-presentation">Open Presentation Studio ${svg('arrow')}</button><button class="ct-button ghost" data-polish-action="present-now">${svg('presentation')} Present now</button></div></div><div class="ct-deck-stack"><span></span><span></span><article><header><i></i><i></i></header><h4>Executive project review</h4><div><b></b><b></b><b></b></div></article></div></section>
      <section class="ct-summary-row ct-presentation-summary">${summaryCard('presentation', slides, 'Slides', 'In the current deck')}${summaryCard('template', 6, 'Layouts', 'Ready-made slide structures')}${summaryCard('comment', getOpenComments(), 'Open comments', 'Awaiting review')}${summaryCard('check', getDeckStatus(), 'Workflow', 'Current approval state')}</section>
      <div class="ct-split-layout"><section><div class="ct-section-title"><div><p>Continue working</p><h2>Recent presentation</h2></div></div><article class="ct-current-deck ct-card"><div class="ct-current-deck-preview"><span></span><i></i><i></i></div><div><small>PROJECT PRESENTATION</small><h3>${escapeHtml(deck?.title || 'Cape Industrial Refinery Maintenance Project')}</h3><p>${slides} slides · Saved locally · Updated recently</p><div><button class="ct-button primary" data-polish-action="open-presentation">Continue editing</button><button class="ct-button subtle" data-polish-action="present-now">Present</button><button class="ct-icon-only" data-polish-action="presentation-menu">${svg('more')}</button></div></div></article></section><aside class="ct-card ct-template-list"><div class="ct-section-title"><div><p>Start quickly</p><h2>Recommended templates</h2></div></div>${['Executive review','Cost performance','Schedule recovery','HSE briefing'].map((name,index)=>`<button data-polish-action="presentation-template" data-template-index="${index}"><span class="tone-${index}">${svg(index===0?'chart':index===1?'currency':index===2?'clock':'shield')}</span><div><strong>${name}</strong><small>${['Management KPIs and decisions','Budget, forecast, and cash flow','Milestones, variance, and actions','Safety performance and controls'][index]}</small></div>${svg('chevron')}</button>`).join('')}</aside></div>`;
  }

  function renderSharedPage(host) {
    const shares = loadJson('civentraq_presentation_shares_v1', []);
    pageActions(`<button class="ct-button ghost" data-polish-action="sharing-help">${svg('help')} Sharing guide</button><button class="ct-button primary" data-polish-action="create-share">${svg('shared')} Create share link</button>`);
    host.innerHTML = `
      <section class="ct-summary-row">${summaryCard('shared', shares.length, 'Published links', 'Read-only presentations')}${summaryCard('eye', shares.reduce((sum,s)=>sum+Number(localStorage.getItem(`ct_share_views_${s.id}`)||0),0), 'Total views', 'Across published links')}${summaryCard('comment', shares.reduce((sum,s)=>sum+loadJson(`ct_share_comments_${s.id}`,[]).length,0), 'Client comments', 'Feedback received')}${summaryCard('lock', shares.filter(s=>s.protected||s.password).length, 'Protected', 'Password-secured links')}</section>
      <section class="ct-card ct-shared-toolbar"><div>${svg('shield')}<div><strong>Share safely</strong><span>Published links are read-only and can include password, expiry, and download controls.</span></div></div><button class="ct-button primary" data-polish-action="create-share">Create secure link</button></section>
      <section class="ct-shared-list">${shares.length ? shares.map((share,index)=>`<article class="ct-card"><span class="ct-shared-icon tone-${index%4}">${svg('presentation')}</span><div><small>${share.expiresAt ? `Expires ${new Date(share.expiresAt).toLocaleDateString('en-ZA')}` : 'No expiry set'}</small><h3>${escapeHtml(share.title || 'Project presentation')}</h3><p>${Number(localStorage.getItem(`ct_share_views_${share.id}`) || 0)} views · ${loadJson(`ct_share_comments_${share.id}`, []).length} comments · ${share.settings?.allowDownload || share.allowDownload ? 'Downloads allowed' : 'View only'}</p></div><span class="ct-status success">Active</span><button class="ct-button subtle" data-polish-action="copy-share" data-share-index="${index}">Copy link</button><button class="ct-icon-only" data-polish-action="share-menu">${svg('more')}</button></article>`).join('') : emptyState('shared','Nothing has been shared yet','Publish a read-only presentation link for a client or manager.','Create share link','create-share')}</section>`;
  }

  function renderSettingsPage(host) {
    const prefs = getPreferences();
    pageActions(`<button class="ct-button ghost" data-polish-action="reset-preferences">Reset defaults</button><button class="ct-button primary" data-polish-action="save-preferences">${svg('check')} Save changes</button>`);
    host.innerHTML = `<div class="ct-settings-layout"><nav class="ct-settings-nav"><button class="active" data-settings-section="general">${svg('settings')} General</button><button data-settings-section="appearance">${svg('sparkles')} Appearance</button><button data-settings-section="reports">${svg('reports')} Reporting</button><button data-settings-section="notifications">${svg('bell')} Notifications</button><button data-settings-section="data">${svg('datasets')} Data & privacy</button></nav><section class="ct-settings-content">
      <div class="ct-settings-panel active" data-settings-panel="general"><div class="ct-settings-heading"><h2>General preferences</h2><p>Choose how Civentraq behaves when you begin work.</p></div>${settingSelect('startPage','Opening page','Choose the first page you see after signing in.',prefs.startPage,[['home','Home'],['projects','Projects'],['presentation','Presentations']])}${settingSelect('defaultProjectView','Default project view','Choose which area opens when you enter a project.',prefs.defaultProjectView,[['overview','Overview'],['reports','Reports'],['presentation','Presentation studio']])}${settingToggle('autosave','Autosave local changes','Save project and presentation changes automatically.',prefs.autosave)}</div>
      <div class="ct-settings-panel" data-settings-panel="appearance"><div class="ct-settings-heading"><h2>Appearance</h2><p>Adjust the start workspace without changing client report branding.</p></div>${settingSelect('density','Interface density','Control how much information appears on screen.',prefs.density,[['comfortable','Comfortable'],['compact','Compact'],['spacious','Spacious']])}${settingToggle('reducedMotion','Reduce motion','Minimise transitions and animated effects.',prefs.reducedMotion)}<div class="ct-setting-row"><div><strong>Accent colour</strong><span>Used across the Civentraq start workspace.</span></div><input class="ct-color-input" id="prefAccent" type="color" value="${escapeAttr(prefs.accent)}"></div></div>
      <div class="ct-settings-panel" data-settings-panel="reports"><div class="ct-settings-heading"><h2>Reporting defaults</h2><p>Set defaults used when generating new reports and decks.</p></div>${settingSelect('reportFormat','Preferred export format','Used as the first option in export dialogs.',prefs.reportFormat,[['pptx','PowerPoint (.pptx)'],['pdf','PDF'],['xlsx','Excel (.xlsx)']])}${settingToggle('includeSources','Show data sources','Include source, refresh date, and reporting period.',prefs.includeSources)}${settingToggle('runChecks','Run presentation checks','Warn about missing titles, sources, and unresolved comments.',prefs.runChecks)}</div>
      <div class="ct-settings-panel" data-settings-panel="notifications"><div class="ct-settings-heading"><h2>Notifications</h2><p>Choose which events appear in your activity centre.</p></div>${settingToggle('notifyImports','Dataset imports','Notify when a data import completes or needs attention.',prefs.notifyImports)}${settingToggle('notifyReviews','Comments and approvals','Notify when a presentation is reviewed or approved.',prefs.notifyReviews)}${settingToggle('notifyRisks','Project risk alerts','Notify when cost, schedule, safety, or risk scores change.',prefs.notifyRisks)}</div>
      <div class="ct-settings-panel" data-settings-panel="data"><div class="ct-settings-heading"><h2>Data & privacy</h2><p>This Phase 1 prototype stores data locally in this browser.</p></div><div class="ct-data-privacy-card">${svg('shield')}<div><strong>Local browser storage</strong><p>Projects, datasets, preferences, and presentations remain on this device until a secure Phase 2 backend is connected.</p></div></div><button class="ct-button danger-outline" data-polish-action="clear-local-data">Clear local prototype data</button></div>
    </section></div>`;
    document.querySelectorAll('[data-settings-section]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-settings-section]').forEach(item => item.classList.toggle('active', item === button));
      document.querySelectorAll('[data-settings-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.settingsPanel === button.dataset.settingsSection));
    }));
  }

  function handleActionClicks(event) {
    const button = event.target.closest('[data-polish-action]');
    if (!button) return;
    const action = button.dataset.polishAction;
    const id = button.dataset.projectId || button.dataset.datasetId || button.dataset.reportId;
    if (action === 'new-project') window.CiventraqHome?.openWizard?.(1);
    else if (action === 'import') openWorkspaceAction('imports', () => window.openImportModal?.());
    else if (action === 'open-project') openProject(id);
    else if (action === 'project-menu') openProjectMenu(button, id);
    else if (action === 'add-dataset') openWorkspaceAction('datasets', () => window.openDatasetPicker?.());
    else if (action === 'open-dataset') openWorkspaceAction('datasets', () => window.openDatasetDetail?.(id));
    else if (action === 'dataset-template') { window.downloadDatasetTemplate?.(id); toast('Dataset template downloaded.'); }
    else if (action === 'download-templates') { window.downloadDatasetTemplatePack?.(); toast('Template workbook prepared.'); }
    else if (action === 'dataset-guide') openDatasetGuide();
    else if (action === 'open-reports-workspace') openWorkspaceAction('reports');
    else if (action === 'open-report') openReport(id);
    else if (action === 'export-pack') openWorkspaceAction('reports', () => document.getElementById('reportsExportButton')?.click());
    else if (action === 'report-settings') openWorkspaceAction('overview', () => window.openSettingsModal?.('report'));
    else if (action === 'open-presentation') openWorkspaceAction('presentation');
    else if (action === 'new-presentation') openWorkspaceAction('presentation', () => document.getElementById('psNewDeckButton')?.click());
    else if (action === 'present-now') openWorkspaceAction('presentation', () => document.getElementById('psPresentButton')?.click());
    else if (action === 'presentation-templates') { openWorkspaceAction('presentation'); toast('Choose a layout from the New slide menu.'); }
    else if (action === 'presentation-template') openWorkspaceAction('presentation', () => { document.getElementById('psAddSlideButton')?.click(); toast('Template gallery opened.'); });
    else if (action === 'presentation-menu') openPresentationMenu(button);
    else if (action === 'create-share') openWorkspaceAction('presentation', () => document.getElementById('ctShareButton')?.click() || document.getElementById('psShareButton')?.click());
    else if (action === 'copy-share') copyShareLink(Number(button.dataset.shareIndex || 0));
    else if (action === 'sharing-help') openSharingHelp();
    else if (action === 'settings-notifications') { hidePopover('ctNotificationsPopover'); navigateStart('settings'); setTimeout(()=>document.querySelector('[data-settings-section="notifications"]')?.click(),50); }
    else if (action === 'save-preferences') savePreferencesFromForm();
    else if (action === 'reset-preferences') resetPreferences();
    else if (action === 'clear-local-data') confirmClearData();
    else if (action === 'tour') openTour();
    else if (action === 'empty-new-project') window.CiventraqHome?.openWizard?.(1);
  }

  function handleKeyboard(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && document.body.classList.contains('home-mode')) {
      event.preventDefault(); openCommandPalette();
    }
    if (event.key === 'Escape') {
      closeCommandPalette(); closeDialog(); hidePopover('ctNotificationsPopover'); hidePopover('ctProfilePopover'); closeTour();
    }
    if (document.getElementById('ctCommandBackdrop')?.hidden === false) navigateCommandWithKeyboard(event);
  }

  function openWorkspaceAction(view, after) {
    window.CiventraqHome?.openWorkspace?.(view);
    if (after) setTimeout(after, 160);
  }

  function openProject(id) {
    if (typeof state === 'undefined') return;
    const project = state.projects?.find(item => String(item.id) === String(id));
    if (project) {
      state.project = { ...project };
      if (typeof saveState === 'function') saveState();
      if (typeof renderAll === 'function') renderAll();
    }
    openWorkspaceAction(getPreferences().defaultProjectView || 'overview');
  }

  function openProjectMenu(button, id) {
    const project = typeof state !== 'undefined' ? state.projects?.find(item => String(item.id) === String(id)) : null;
    openDialog(`<header><div><span class="ct-dialog-icon">${svg('projects')}</span><div><p>Project actions</p><h2>${escapeHtml(project?.name || 'Project')}</h2></div></div><button class="ct-dialog-close" data-dialog-close>${svg('close')}</button></header><div class="ct-action-list"><button data-dialog-command="open">${svg('folder')}<span><strong>Open project</strong><small>Enter the project workspace</small></span>${svg('chevron')}</button><button data-dialog-command="duplicate">${svg('template')}<span><strong>Duplicate project</strong><small>Create a copy with the same setup</small></span>${svg('chevron')}</button><button data-dialog-command="export">${svg('download')}<span><strong>Export project summary</strong><small>Open the report export centre</small></span>${svg('chevron')}</button></div>`, dialog => {
      dialog.querySelector('[data-dialog-command="open"]')?.addEventListener('click', () => { closeDialog(); openProject(id); });
      dialog.querySelector('[data-dialog-command="duplicate"]')?.addEventListener('click', () => { closeDialog(); duplicateProject(project); });
      dialog.querySelector('[data-dialog-command="export"]')?.addEventListener('click', () => { closeDialog(); openProject(id); setTimeout(()=>document.getElementById('exportButton')?.click(),180); });
    });
  }

  function duplicateProject(project) {
    if (!project || typeof state === 'undefined') return;
    const copy = { ...project, id: `project-${Date.now()}`, name: `${project.name} — Copy`, status: 'Planning' };
    state.projects = [copy, ...(state.projects || [])];
    if (typeof saveState === 'function') saveState();
    toast('Project duplicated.');
    renderRoute('projects');
  }

  function openReport(id) {
    openWorkspaceAction('reports', () => {
      const candidate = document.querySelector(`[data-report-type="${cssEscape(id)}"],[data-report-id="${cssEscape(id)}"]`);
      candidate?.click();
    });
  }

  function openCommandPalette(query = '') {
    const backdrop = document.getElementById('ctCommandBackdrop');
    const input = document.getElementById('ctCommandInput');
    if (!backdrop || !input) return;
    backdrop.hidden = false;
    input.value = query || '';
    renderCommandResults(input.value);
    setTimeout(() => input.focus(), 20);
  }
  function closeCommandPalette() { const node = document.getElementById('ctCommandBackdrop'); if (node) node.hidden = true; }

  function commandItems() {
    const items = [
      { type: 'Action', label: 'Create a new project', detail: 'Start the guided project setup', icon: 'plus', action: () => window.CiventraqHome?.openWizard?.(1) },
      { type: 'Action', label: 'Import a dataset', detail: 'Upload Excel or CSV project information', icon: 'upload', action: () => openWorkspaceAction('imports', () => window.openImportModal?.()) },
      { type: 'Action', label: 'Open Presentation Studio', detail: 'Build and present a client-ready deck', icon: 'presentation', action: () => openWorkspaceAction('presentation') }
    ];
    if (typeof state !== 'undefined') (state.projects || []).forEach(project => items.push({ type: 'Project', label: project.name, detail: `${project.client || 'Client'} · ${project.location || 'Location'}`, icon: 'projects', action: () => openProject(project.id) }));
    if (typeof DATASET_LIBRARY !== 'undefined') Object.values(DATASET_LIBRARY).slice(0, 20).forEach(def => items.push({ type: 'Dataset', label: def.title || def.name || humanize(def.id), detail: def.description || 'Project dataset', icon: 'datasets', action: () => { navigateStart('datasets'); setTimeout(()=>document.querySelector(`[data-dataset-id="${cssEscape(def.id)}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),100); } }));
    const reports = typeof getReportLibraryEntries === 'function' ? getReportLibraryEntries().slice(0,20) : fallbackReports();
    reports.forEach(report => items.push({ type: 'Report', label: report.title || report.name, detail: report.description || report.category || 'Project report', icon: 'reports', action: () => openReport(report.id || report.type || 'full') }));
    return items;
  }

  function renderCommandResults(query = '') {
    const host = document.getElementById('ctCommandResults'); if (!host) return;
    const q = query.trim().toLowerCase();
    currentSearchItems = commandItems().filter(item => !q || `${item.label} ${item.detail} ${item.type}`.toLowerCase().includes(q)).slice(0, 10);
    host.innerHTML = currentSearchItems.length ? currentSearchItems.map((item,index)=>`<button class="ct-command-result ${index===0?'active':''}" data-command-index="${index}"><span>${svg(item.icon)}</span><div><strong>${highlight(item.label,q)}</strong><small>${escapeHtml(item.detail)}</small></div><b>${escapeHtml(item.type)}</b></button>`).join('') : `<div class="ct-command-empty">${svg('search')}<strong>No results found</strong><span>Try a project name, dataset, report, or action.</span></div>`;
    host.querySelectorAll('[data-command-index]').forEach(button => button.addEventListener('click', () => runCommand(Number(button.dataset.commandIndex))));
  }
  function runCommand(index) { const item = currentSearchItems[index]; if (!item) return; closeCommandPalette(); item.action(); }
  function navigateCommandWithKeyboard(event) {
    const buttons = [...document.querySelectorAll('.ct-command-result')]; if (!buttons.length) return;
    let active = Math.max(0, buttons.findIndex(button => button.classList.contains('active')));
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); buttons[active]?.classList.remove('active'); active = (active + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length; buttons[active].classList.add('active'); buttons[active].scrollIntoView({block:'nearest'}); }
    if (event.key === 'Enter') { event.preventDefault(); runCommand(active); }
  }

  function openHelp() {
    openDialog(`<header><div><span class="ct-dialog-icon">${svg('help')}</span><div><p>Help centre</p><h2>What do you need help with?</h2></div></div><button class="ct-dialog-close" data-dialog-close>${svg('close')}</button></header><div class="ct-help-grid"><button data-help-action="tour">${svg('sparkles')}<strong>Take the product tour</strong><span>Learn the core workflow in four steps.</span></button><button data-help-action="data">${svg('datasets')}<strong>Understand datasets</strong><span>See how project information powers reports.</span></button><button data-help-action="present">${svg('presentation')}<strong>Build a presentation</strong><span>Open the editor and explore templates.</span></button><button data-help-action="shortcuts">${svg('grid')}<strong>Keyboard shortcuts</strong><span>Work faster in the presentation editor.</span></button></div><footer class="ct-dialog-footer"><span>Phase 1 prototype · Local browser workspace</span><button class="ct-button primary" data-dialog-close>Done</button></footer>`, dialog => {
      dialog.querySelector('[data-help-action="tour"]')?.addEventListener('click',()=>{closeDialog();openTour();});
      dialog.querySelector('[data-help-action="data"]')?.addEventListener('click',()=>{closeDialog();openDatasetGuide();});
      dialog.querySelector('[data-help-action="present"]')?.addEventListener('click',()=>{closeDialog();openWorkspaceAction('presentation');});
      dialog.querySelector('[data-help-action="shortcuts"]')?.addEventListener('click',()=>showShortcuts());
    });
  }

  function openDatasetGuide() {
    openDialog(`<header><div><span class="ct-dialog-icon">${svg('datasets')}</span><div><p>Dataset guide</p><h2>How project data moves through Civentraq</h2></div></div><button class="ct-dialog-close" data-dialog-close>${svg('close')}</button></header><div class="ct-process-steps"><article><span>1</span><div><strong>Upload</strong><p>Import an Excel or CSV export from SAP, planning tools, or site records.</p></div></article><article><span>2</span><div><strong>Match fields</strong><p>Confirm which columns represent cost, progress, labour, dates, and risks.</p></div></article><article><span>3</span><div><strong>Connect once</strong><p>The dataset becomes reusable across dashboards, reports, and presentations.</p></div></article><article><span>4</span><div><strong>Refresh</strong><p>Replace the file later to update every linked visual and report.</p></div></article></div><footer class="ct-dialog-footer"><button class="ct-button ghost" data-dialog-close>Close</button><button class="ct-button primary" data-guide-import>${svg('upload')} Import a dataset</button></footer>`, dialog => dialog.querySelector('[data-guide-import]')?.addEventListener('click',()=>{closeDialog();openWorkspaceAction('imports',()=>window.openImportModal?.());}));
  }

  function toggleNotifications(anchor) {
    const pop = document.getElementById('ctNotificationsPopover'); if (!pop) return;
    hidePopover('ctProfilePopover');
    if (!pop.hidden) { pop.hidden = true; return; }
    renderNotifications(); positionPopover(pop, anchor); pop.hidden = false;
  }
  function renderNotifications() {
    const pop = document.getElementById('ctNotificationsPopover'); if (!pop) return;
    const notes = getNotifications();
    pop.innerHTML = `<header><div><strong>Notifications</strong><span>${notes.filter(n=>!n.read).length} unread</span></div><button data-notification-clear>Mark all read</button></header><div class="ct-notification-list">${notes.length ? notes.map((note,index)=>`<button class="ct-notification ${note.read?'':'unread'}" data-notification-index="${index}"><span>${svg(note.icon||'info')}</span><div><strong>${escapeHtml(note.title)}</strong><p>${escapeHtml(note.message)}</p><small>${escapeHtml(note.time)}</small></div></button>`).join('') : '<div class="ct-popover-empty">No notifications yet.</div>'}</div><footer><button data-polish-action="settings-notifications">Notification settings</button></footer>`;
    pop.querySelector('[data-notification-clear]')?.addEventListener('click',()=>{const updated=notes.map(n=>({...n,read:true}));localStorage.setItem(NOTIFICATIONS_KEY,JSON.stringify(updated));renderNotifications();});
    pop.querySelectorAll('[data-notification-index]').forEach(button=>button.addEventListener('click',()=>{notes[Number(button.dataset.notificationIndex)].read=true;localStorage.setItem(NOTIFICATIONS_KEY,JSON.stringify(notes));renderNotifications();}));
    const dot = document.getElementById('ctNotificationDot'); if (dot) dot.hidden = !notes.some(n=>!n.read);
  }
  function getNotifications() {
    const stored = loadJson(NOTIFICATIONS_KEY, null);
    if (stored) return stored;
    const defaults = [
      { title:'Project health needs attention', message:'Schedule recovery actions are available for review.', time:'Today', icon:'activity', read:false },
      { title:'Presentation autosaved', message:'Your latest deck changes were stored locally.', time:'Today', icon:'presentation', read:false },
      { title:'Dataset templates ready', message:'Industry dataset templates are available in the Dataset centre.', time:'Yesterday', icon:'datasets', read:true }
    ];
    localStorage.setItem(NOTIFICATIONS_KEY,JSON.stringify(defaults)); return defaults;
  }

  function toggleProfile(anchor) {
    const pop = document.getElementById('ctProfilePopover'); if (!pop) return;
    hidePopover('ctNotificationsPopover');
    if (!pop.hidden) { pop.hidden = true; return; }
    pop.innerHTML = `<header><span class="start-avatar">FK</span><div><strong>Floyd Kabungo</strong><small>Civentraq Admin</small></div></header><div><button data-profile-action="settings">${svg('settings')} Workspace settings</button><button data-profile-action="help">${svg('help')} Help centre</button><button data-profile-action="home">${svg('home')} Return home</button></div><footer><button data-profile-action="signout">${svg('logout')} Sign out of prototype</button></footer>`;
    pop.querySelector('[data-profile-action="settings"]')?.addEventListener('click',()=>{pop.hidden=true;navigateStart('settings');});
    pop.querySelector('[data-profile-action="help"]')?.addEventListener('click',()=>{pop.hidden=true;openHelp();});
    pop.querySelector('[data-profile-action="home"]')?.addEventListener('click',()=>{pop.hidden=true;navigateStart('home');});
    pop.querySelector('[data-profile-action="signout"]')?.addEventListener('click',()=>{pop.hidden=true;toast('Sign-in will be connected in Phase 2.');});
    positionPopover(pop,anchor); pop.hidden=false;
  }

  function positionPopover(pop, anchor) {
    const rect = anchor.getBoundingClientRect(); pop.style.top = `${rect.bottom + 10}px`; pop.style.right = `${Math.max(12, window.innerWidth - rect.right)}px`;
  }
  function hidePopover(id) { const node=document.getElementById(id); if(node) node.hidden=true; }

  function openTour() {
    const tour = document.getElementById('ctTour'); if (!tour) return;
    const steps = [
      { icon:'projects', title:'Create the project workspace', text:'Capture project details, choose a template, and decide whether to start blank or with data.' },
      { icon:'datasets', title:'Connect project datasets', text:'Upload Excel or CSV exports and map the fields Civentraq needs.' },
      { icon:'reports', title:'Generate the report story', text:'Review live KPIs, charts, management insights, and specialist reports.' },
      { icon:'presentation', title:'Present with confidence', text:'Build an editable deck, run quality checks, and export to PowerPoint or PDF.' }
    ];
    let index=0;
    const render=()=>{const step=steps[index];tour.innerHTML=`<div class="ct-tour-card"><button data-tour-close>${svg('close')}</button><span class="ct-tour-icon">${svg(step.icon)}</span><small>Step ${index+1} of ${steps.length}</small><h2>${step.title}</h2><p>${step.text}</p><div class="ct-tour-dots">${steps.map((_,i)=>`<i class="${i===index?'active':''}"></i>`).join('')}</div><footer><button class="ct-button ghost" data-tour-back ${index===0?'disabled':''}>Back</button><button class="ct-button primary" data-tour-next>${index===steps.length-1?'Finish':'Next'} ${svg(index===steps.length-1?'check':'arrow')}</button></footer></div>`;tour.querySelector('[data-tour-close]').onclick=closeTour;tour.querySelector('[data-tour-back]').onclick=()=>{index=Math.max(0,index-1);render();};tour.querySelector('[data-tour-next]').onclick=()=>{if(index===steps.length-1){closeTour();return;}index++;render();};};
    tour.hidden=false; render();
  }
  function closeTour(){const node=document.getElementById('ctTour');if(node)node.hidden=true;}

  function openSharingHelp() {
    openDialog(`<header><div><span class="ct-dialog-icon">${svg('shared')}</span><div><p>Client sharing</p><h2>Publish a controlled, read-only presentation</h2></div></div><button class="ct-dialog-close" data-dialog-close>${svg('close')}</button></header><div class="ct-feature-list"><div>${svg('lock')}<span><strong>Password protection</strong><small>Require a password before the client can view the deck.</small></span></div><div>${svg('clock')}<span><strong>Expiry date</strong><small>Automatically close access after the review period.</small></span></div><div>${svg('download')}<span><strong>Download controls</strong><small>Choose whether recipients can download a copy.</small></span></div><div>${svg('eye')}<span><strong>View tracking</strong><small>See how many times the published link was opened.</small></span></div></div><footer class="ct-dialog-footer"><button class="ct-button ghost" data-dialog-close>Close</button><button class="ct-button primary" data-sharing-open>Open sharing centre</button></footer>`,dialog=>dialog.querySelector('[data-sharing-open]')?.addEventListener('click',()=>{closeDialog();openWorkspaceAction('presentation',()=>document.getElementById('ctShareButton')?.click());}));
  }

  function showShortcuts() {
    openDialog(`<header><div><span class="ct-dialog-icon">${svg('grid')}</span><div><p>Presentation Studio</p><h2>Keyboard shortcuts</h2></div></div><button class="ct-dialog-close" data-dialog-close>${svg('close')}</button></header><div class="ct-shortcut-grid">${[['Ctrl / Cmd + C','Copy selected elements'],['Ctrl / Cmd + V','Paste elements'],['Ctrl / Cmd + D','Duplicate selection'],['Delete','Delete selected element'],['Arrow keys','Move selected elements'],['Shift + Arrow','Move in larger steps'],['Ctrl / Cmd + G','Group selected elements'],['Ctrl / Cmd + Z','Undo last change']].map(([key,label])=>`<div><kbd>${key}</kbd><span>${label}</span></div>`).join('')}</div><footer class="ct-dialog-footer"><button class="ct-button primary" data-dialog-close>Done</button></footer>`);
  }

  function openPresentationMenu(button) {
    openDialog(`<header><div><span class="ct-dialog-icon">${svg('presentation')}</span><div><p>Presentation actions</p><h2>Current project deck</h2></div></div><button class="ct-dialog-close" data-dialog-close>${svg('close')}</button></header><div class="ct-action-list"><button data-menu-action="edit">${svg('presentation')}<span><strong>Edit presentation</strong><small>Open the full slide editor</small></span>${svg('chevron')}</button><button data-menu-action="export">${svg('download')}<span><strong>Export presentation</strong><small>PowerPoint, PDF, PNG, or Word</small></span>${svg('chevron')}</button><button data-menu-action="review">${svg('comment')}<span><strong>Review comments</strong><small>Open comments and approval workflow</small></span>${svg('chevron')}</button></div>`,dialog=>{
      dialog.querySelector('[data-menu-action="edit"]')?.addEventListener('click',()=>{closeDialog();openWorkspaceAction('presentation');});
      dialog.querySelector('[data-menu-action="export"]')?.addEventListener('click',()=>{closeDialog();openWorkspaceAction('presentation',()=>document.getElementById('psExportButton')?.click());});
      dialog.querySelector('[data-menu-action="review"]')?.addEventListener('click',()=>{closeDialog();openWorkspaceAction('presentation',()=>document.getElementById('ctReviewButton')?.click());});
    });
  }

  function copyShareLink(index) {
    const shares=loadJson('civentraq_presentation_shares_v1',[]);const share=shares[index];if(!share){toast('Share link is not available.');return;}
    const link=share.url||share.link||`${window.location.href.split('#')[0]}#share=${encodeURIComponent(share.id||'presentation')}`;
    navigator.clipboard?.writeText(link).then(()=>toast('Share link copied.')).catch(()=>toast('Copy the link from the sharing centre.'));
  }

  function openDialog(markup, onOpen) {
    const backdrop=document.getElementById('ctDialogBackdrop');const dialog=document.getElementById('ctDialog');if(!backdrop||!dialog)return;
    dialog.innerHTML=markup;backdrop.hidden=false;
    dialog.querySelectorAll('[data-dialog-close]').forEach(button=>button.addEventListener('click',closeDialog));
    backdrop.onclick=event=>{if(event.target===backdrop)closeDialog();};
    onOpen?.(dialog);
  }
  function closeDialog(){const backdrop=document.getElementById('ctDialogBackdrop');if(backdrop)backdrop.hidden=true;}

  function addDashboardHomeButton() {
    const topbar = document.querySelector('.app-shell .topbar');
    if (!topbar || document.getElementById('ctDashboardHome')) return;
    const button=document.createElement('button');button.id='ctDashboardHome';button.className='ct-dashboard-home';button.type='button';button.title='Back to Civentraq home';button.innerHTML=svg('home');button.addEventListener('click',()=>window.CiventraqHome?.open?.());
    topbar.insertBefore(button,topbar.firstChild);
    const heading=document.querySelector('.project-heading');
    if(heading){const crumb=document.createElement('div');crumb.className='ct-breadcrumb';crumb.innerHTML='<button type="button">Workspace</button><span>/</span><strong>Active project</strong>';crumb.querySelector('button').addEventListener('click',()=>window.CiventraqHome?.open?.());heading.insertBefore(crumb,heading.firstChild);}
  }

  function auditButtons() {
    document.querySelectorAll('button').forEach(button=>{if(!button.getAttribute('type'))button.setAttribute('type','button');});
    document.querySelectorAll('[title]').forEach(node=>{if(!node.getAttribute('aria-label')&&node.tagName==='BUTTON')node.setAttribute('aria-label',node.getAttribute('title'));});
  }

  function getPreferences() {
    return { startPage:'home', defaultProjectView:'overview', autosave:true, density:'comfortable', reducedMotion:false, accent:'#5b4ce2', reportFormat:'pptx', includeSources:true, runChecks:true, notifyImports:true, notifyReviews:true, notifyRisks:true, ...loadJson(SETTINGS_KEY,{}) };
  }
  function savePreferencesFromForm() {
    const prefs=getPreferences();
    document.querySelectorAll('[data-pref]').forEach(control=>{prefs[control.dataset.pref]=control.type==='checkbox'?control.checked:control.value;});
    const accent=document.getElementById('prefAccent');if(accent)prefs.accent=accent.value;
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(prefs));applyPreferences();toast('Workspace preferences saved.');
  }
  function resetPreferences(){localStorage.removeItem(SETTINGS_KEY);applyPreferences();renderRoute('settings');toast('Preferences reset to defaults.');}
  function applyPreferences(){const prefs=getPreferences();document.documentElement.style.setProperty('--ct-accent',prefs.accent);document.body.dataset.ctDensity=prefs.density;document.body.classList.toggle('ct-reduced-motion',Boolean(prefs.reducedMotion));}
  function confirmClearData(){openDialog(`<header><div><span class="ct-dialog-icon danger">${svg('info')}</span><div><p>Clear prototype data</p><h2>This action cannot be undone</h2></div></div><button class="ct-dialog-close" data-dialog-close>${svg('close')}</button></header><div class="ct-warning-box"><strong>Projects, datasets, presentation decks, and preferences stored by Civentraq in this browser will be removed.</strong><p>This does not affect files on your computer or anything in GitHub.</p></div><footer class="ct-dialog-footer"><button class="ct-button ghost" data-dialog-close>Cancel</button><button class="ct-button danger" data-confirm-clear>Clear local data</button></footer>`,dialog=>dialog.querySelector('[data-confirm-clear]')?.addEventListener('click',()=>{Object.keys(localStorage).filter(key=>key.startsWith('civentraq_')).forEach(key=>localStorage.removeItem(key));closeDialog();toast('Local prototype data cleared. Reloading…');setTimeout(()=>location.reload(),700);}));}

  function settingSelect(key,title,description,value,options){return `<label class="ct-setting-row"><div><strong>${title}</strong><span>${description}</span></div><select data-pref="${key}">${options.map(([v,l])=>`<option value="${v}" ${v===value?'selected':''}>${l}</option>`).join('')}</select></label>`;}
  function settingToggle(key,title,description,checked){return `<label class="ct-setting-row"><div><strong>${title}</strong><span>${description}</span></div><span class="ct-switch"><input type="checkbox" data-pref="${key}" ${checked?'checked':''}><i></i></span></label>`;}

  function summaryCard(iconName,value,label,sub){return `<article class="ct-summary-card"><span>${svg(iconName)}</span><div><strong>${escapeHtml(String(value))}</strong><b>${escapeHtml(label)}</b><small>${escapeHtml(sub)}</small></div></article>`;}
  function emptyState(iconName,title,text,buttonLabel,action){return `<div class="ct-empty-state"><span>${svg(iconName)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p><button class="ct-button primary" data-polish-action="${escapeAttr(action)}">${svg('plus')} ${escapeHtml(buttonLabel)}</button></div>`;}
  function fallbackReports(){return [
    {id:'executive',title:'Executive progress report',category:'Project',description:'Budget, progress, risks, and management commentary.'},
    {id:'cost',title:'Cost performance report',category:'Commercial',description:'Planned cost, actual expenditure, remaining budget, and forecast.'},
    {id:'schedule',title:'Schedule variance report',category:'Project',description:'Planned versus actual progress, milestones, and recovery.'},
    {id:'hse',title:'HSE performance report',category:'HSE',description:'Safety leading indicators, incidents, and corrective actions.'},
    {id:'quality',title:'QA/QC and NCR report',category:'Quality',description:'Inspection status, non-conformances, and closure actions.'},
    {id:'shutdown',title:'Turnaround status report',category:'Operations',description:'Shift progress, critical path, permits, and readiness.'}
  ];}
  function getProjectProgress(project,index){if(typeof state!=='undefined'&&state.project?.id===project.id&&typeof calculateMetrics==='function')return Math.max(0,Math.min(100,Math.round(calculateMetrics().actualProgress||0)));const seed=[...String(project.name||'Project')].reduce((s,c)=>s+c.charCodeAt(0),0);return 18+((seed+index*17)%67);}
  function getOpenComments(){if(typeof ps==='undefined'||!ps.data)return 0;const comments=ps.data.comments||[];return comments.filter(c=>!c.resolved).length;}
  function getDeckStatus(){if(typeof ps==='undefined'||!ps.data)return 'Draft';return humanize(ps.data.workflow?.status||ps.data.approval?.status||ps.data.status||'Draft');}
  function humanize(value){return String(value||'').replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}
  function loadJson(key,fallback){try{const parsed=JSON.parse(localStorage.getItem(key));return parsed??fallback;}catch{return fallback;}}
  function toast(message){const stack=document.getElementById('ctToastStack');if(!stack)return;const node=document.createElement('div');node.className='ct-toast';node.innerHTML=`${svg('check')}<span>${escapeHtml(message)}</span>`;stack.appendChild(node);setTimeout(()=>node.classList.add('show'),20);setTimeout(()=>{node.classList.remove('show');setTimeout(()=>node.remove(),250);},3000);}
  function highlight(text,q){const safeText=escapeHtml(text);if(!q)return safeText;const index=text.toLowerCase().indexOf(q);if(index<0)return safeText;return `${escapeHtml(text.slice(0,index))}<mark>${escapeHtml(text.slice(index,index+q.length))}</mark>${escapeHtml(text.slice(index+q.length))}`;}
  function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
  function escapeAttr(value){return escapeHtml(value).replace(/`/g,'&#96;');}
  function cssEscape(value){return window.CSS?.escape?CSS.escape(String(value)):String(value).replace(/[^a-zA-Z0-9_-]/g,'\\$&');}
})();
