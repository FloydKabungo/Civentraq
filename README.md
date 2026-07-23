# Civentraq MVP

Civentraq is a browser-based project intelligence prototype for construction and engineering teams. It converts Excel, CSV, and SAP-exported spreadsheet data into client-ready KPIs, charts, risks, and management summaries.

## What works now

- Responsive engineering project dashboard
- Editable project name, client, location, dates, and approved budget
- Full Dashboard Studio with live previews
- Five colour-theme presets plus custom accent, sidebar, page, card, and text colours
- Light, dark, and device-matched appearance modes
- Adjustable fonts, spacing density, card style, corners, and dashboard layouts
- Custom chart palettes, line styles, legends, fills, gridlines, and animations
- Custom product name, company workspace, initials, logo, report title, and footer
- Show or hide individual dashboard sections
- Saved design settings that persist after refresh and carry into report exports
- Dedicated Datasets workspace with 19 construction, refinery, commercial, HSE, quality, engineering, operations, and close-out dataset templates
- Dataset search, category filters, connection status, row counts, field-match quality, source tracking, and last-updated details
- Dataset previews with linked-report badges
- Individual CSV template downloads plus a multi-sheet Excel template pack
- Upload, replace, clear, or load sample data for every dataset
- Connected specialist datasets automatically replace demo registers in matching report exports
- XLSX, XLS, and CSV import
- Automatic spreadsheet column matching
- Budget, expenditure, forecast, progress, deadline, and labour KPIs
- Cost, progress, and category visuals with a Power BI-style visual gallery
- 37 coded chart and visual types with miniature SVG previews and official names
- Bar and column: clustered, stacked, and 100% stacked variants
- Line and area: line, area, stacked area, 100% stacked area, combo, ribbon, stepped line, and radar
- Waterfall, funnel, scatter, bubble, pie, donut, polar area, and treemap visuals
- Map, filled map, shape map, and point map presentation visuals
- Gauge, card, multi-row card, KPI, slicer, tile slicer, table, matrix, decomposition tree, key influencers, and Q&A visuals
- Automatic rule-based management summary and risk warnings
- Separate project-health and insight-review scores: reviewing a message never changes operational project health
- Project list and import history stored in browser localStorage
- Multi-page PDF report export
- Editable PowerPoint presentation export
- Excel report pack with summary, data, risks, work packages, and actions
- High-resolution PNG dashboard image export
- CSV data export
- Searchable industry report library with 44 specialist reports grouped by project, commercial, HSE, quality, engineering, refinery, and handover categories
- Separate report content, KPIs, tables, actions, charts, filenames, and export templates for every specialist report
- Included sample CSV for testing
- PowerPoint-style Presentation Studio with slide thumbnails, templates, duplicate/delete, reordering, speaker notes, undo, and redo
- Drag-and-drop report page builder with movable and resizable headings, text, KPI cards, charts, tables, photos, comparisons, progress bars, and callouts
- Editable chart controls for type, data source, title, colours, legend, and gridlines
- Six professional report themes: Energy & Refinery, Executive Dark, Construction, Minimal White, Safety, and Client Branded
- Photo-report slide templates with four image frames, captions, and fill/fit controls
- Editable project summaries with executive, client-friendly, technical, and concise tones
- Full-screen presenter mode with keyboard navigation, speaker notes, and a laser pointer
- Period comparison slide generator for progress, cost, schedule variance, labour, and project health
- Information, warning, milestone, and decision-required annotations
- Advanced export settings for PowerPoint, PDF, PNG slide images, and Word-compatible reports, including slide range, canvas ratio, quality, notes, page numbers, watermark, and data appendix

## Run it

1. Open the project folder in Visual Studio Code.
2. Use the Live Server extension to open `index.html`, or open `index.html` directly in a browser.
3. Click **Import data** and choose `sample-project-data.csv`.
4. Confirm the suggested column mappings.
5. Click **Build dashboard**.
6. Click the visual-name button on any dashboard chart to open the visual gallery, or use **Customize → Charts**.
7. Choose a visual by its miniature preview and official chart name. The choice is saved automatically.
8. Click **Customize** to change the theme, layout, chart appearance, branding, or visible sections.
9. Open **Datasets** to browse the dataset library.
10. Click **Connect** on a dataset, upload an Excel/CSV file, review its field-match score, and connect it to the workspace.
11. Use **Download template pack** for a multi-sheet Excel workbook containing every expected dataset structure.
12. Open **Reports** to search or filter the industry report library. Report cards show whether their dataset is connected, sample-based, or still required.
13. Select a report such as Daily Site, HSE, QA/QC, Procurement, RFI, Shutdown, Process Safety, Commissioning, or Handover, then choose PowerPoint, PDF, Excel, PNG, or CSV.
14. Open **Presentation studio** to build a custom client deck from the active project.
15. Add a slide template, or drag headings, KPI cards, charts, tables, photographs, comparisons, and annotations onto the canvas.
16. Click any element to edit its text, data source, chart type, colours, size, position, or style.
17. Use **Present** for full-screen delivery, or **Advanced export** for PowerPoint, PDF, PNG, and Word-compatible output.

Internet access is required for Chart.js, SheetJS, PptxGenJS, jsPDF, html2canvas, and Google Fonts in this prototype.

## Expected spreadsheet fields

The importer attempts to recognise variations of these fields:

- Reporting date
- Cost category or engineering discipline
- Planned cost
- Actual cost
- Planned progress percentage
- Actual progress percentage
- Labour hours
- Tasks completed
- Total tasks
- Risk level

Only reporting date, actual cost, and actual progress are mandatory for this prototype.

## Enterprise presentation workflow update

This build adds the complete report-governance and presentation-quality layer requested for commercial demonstrations:

- Project health is calculated from separate cost, schedule, safety, and risk dimensions (with deadline exposure included under schedule). Marking an insight as reviewed changes review completion only.
- Reusable master slide templates with locked logo, font, header, footer, colours, and page numbers. Masters are stored separately and can be reused across decks.
- Multi-select, snap-to-grid, alignment guides, grouping, locking, z-order controls, copy/paste, nudge keys, keyboard shortcuts, and improved zoom controls.
- Named version history with Draft, Client review, Approved, and Final issued milestones plus restore, duplicate, and compare actions.
- Slide comments, resolution states, change requests, approvals, final issue history, and approval-version snapshots.
- Visible data lineage on dashboard and presentation KPIs/charts, including dataset, refresh date, period, filters, and sample/uploaded/live status.
- Exact slide-image export rendering, A4 portrait and landscape support, speaker notes, high-quality images, and automatic pre-export checks.
- Encrypted read-only share links with optional password, expiry, download permission, local view tracking, and local client comments.
- First-use onboarding: create project, upload data, review matching, choose a template, and generate a deck.
- Civentraq remains the fixed product identity. Client and contractor branding is handled through workspace settings and master templates.
- Fictional demo identity: Cape Industrial Refinery Maintenance Project / Cape Industrial Energy.
- Automatic checks for empty slides, chart titles, image resolution, text overflow, missing data sources, stale datasets, colour inconsistency, and unresolved comments.

### Presentation Studio shortcuts

- `Shift + click`: multi-select
- `Ctrl/Cmd + C` / `Ctrl/Cmd + V`: copy and paste
- `Ctrl/Cmd + D`: duplicate selection
- `Ctrl/Cmd + G`: group
- `Ctrl/Cmd + Shift + G`: ungroup
- Arrow keys: nudge; hold Shift for larger steps
- `[` / `]`: send backward / bring forward
- `L`: lock or unlock
- Delete / Backspace: delete unlocked selection

## Important prototype limits

This version stores project, master-template, version, comment, workflow, and tracking data in the current browser. It does not yet have secure user accounts, a shared database, direct SAP access, multi-company permissions, a genuine AI model, or cloud file storage.

The map visuals are presentation-style site/location visuals rather than live GIS maps, and the AI visuals are rule-based previews generated from the imported project metrics. Production versions would connect to approved map data and server-side AI services.

The specialist report library now connects to dedicated browser-based datasets for HSE, QA/QC, procurement, document control, reliability, emissions, commissioning, and other operational areas. When no matching dataset is connected, the report engine still uses clearly marked realistic demo rows. Data remains local to one browser and is not yet shared between users or devices.

## Recommended next build phases

### Phase 2 — Secure web application

- React or Next.js application
- Supabase/PostgreSQL database
- Company workspaces and user accounts
- Project switching
- Role permissions
- Persistent spreadsheet imports
- Project tasks, milestones, risks, documents, and audit logs

### Phase 3 — Shared reporting workflow

- Server-backed client portal and cross-device share analytics
- Shared multi-user comments, approvals, version history, and real-time collaboration
- Multi-user presentation editing
- Server-side rendering for controlled enterprise exports

### Phase 4 — AI and integrations

- Server-side AI analysis and natural-language questions
- Direct SAP integration where client permissions allow it
- Scheduled imports
- Forecasting and anomaly detection
- Notifications for cost, deadline, and progress thresholds

## Security note

Do not use this browser prototype for confidential client or commercial data. The production system must add authentication, database access controls, encryption, audit logs, secure server-side AI calls, backups, and organisation-level data separation.

## Publish with GitHub Pages

1. Create a new empty GitHub repository named `civentraq`.
2. Open this folder in a terminal.
3. Run the commands below, replacing `YOUR-USERNAME` with your GitHub username:

```bash
git init
git add .
git commit -m "Initial Civentraq MVP"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/civentraq.git
git push -u origin main
```

4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then save.

The public site address will be:

```text
https://YOUR-USERNAME.github.io/civentraq/
```


## Presentation Studio layout fix

The Presentation Studio now opens in a dedicated full-screen editor. The normal dashboard sidebar, project header, and notice bar are hidden while editing so the slide canvas has enough room. The slide navigator and properties panel can be collapsed, the canvas automatically fits the available workspace, and the editor uses its own neutral Civentraq interface colours instead of inheriting the dashboard theme. Use **Back to dashboard** to leave the editor.


## New files in this update

- `enterprise-features.js` — report governance, master templates, editor controls, share links, onboarding, data lineage, and checks.
- `enterprise-features.css` — enterprise workflow, editor, modal, viewer, master, lineage, and onboarding styles.

## PowerPoint-style Presentation Studio update

The Presentation Studio now uses a familiar ribbon interface with Home, Insert, Design, Review, and View tabs. Slide layouts and report elements have been moved out of the permanent left sidebar, the properties pane starts collapsed, and the slide canvas receives more working space. Common text, paragraph, shape, theme, review, grid, notes, and zoom controls are available from the ribbon and status bar.

## Phase 1 interface polish

The final Phase 1 interface pass adds a consistent Civentraq design system across the opening workspace and project application.

### Redesigned start workspace

- Unique Civentraq home experience rather than copying Word or Power BI
- Dedicated Projects, Datasets, Reports, Presentations, Shared, and Settings pages
- Responsive desktop, tablet, and mobile navigation
- Global search / command centre (`Ctrl + K`)
- Help centre, product tour, notification centre, and account menu
- SVG icon system with no image-icon dependency

### Working start-page actions

- New project opens the guided project wizard
- Import data opens the existing import workspace and upload dialog
- Dataset cards open the dataset detail or connection flow
- Report cards open the report library and matching report
- Presentation actions open Presentation Studio, presenter mode, review, and export controls
- Project cards open, duplicate, and export active projects
- Shared-page actions connect to the existing secure-link workflow
- Workspace preferences are stored locally and can be reset

### Project workspace polish

- Cleaner project header with a visible route back to the Civentraq home workspace
- Updated navigation icons, buttons, KPI cards, panels, and spacing
- Consistent responsive styling across overview, projects, imports, datasets, reports, and Presentation Studio
- Improved accessibility focus states, labels, modal controls, and mobile navigation

### Files added

- `phase1-polish.css`
- `phase1-polish.js`
- `PHASE-1-READINESS.md`

The prototype remains a browser-only Phase 1 application. Authentication, a central database, cloud file storage, cross-device collaboration, and server-side access controls belong to Phase 2.
