"use strict";

const DEFAULT_PROJECT = {
  id: "project-001",
  name: "Cape Industrial Refinery Maintenance Project",
  client: "Cape Industrial Energy",
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


const VISUAL_CATALOG = [
  {
    id: "bar-column", label: "Bar and column", icon: "▥", visuals: [
      { id: "clustered_bar", label: "Clustered bar chart", description: "Compare values side by side using horizontal bars." },
      { id: "stacked_bar", label: "Stacked bar chart", description: "Show how multiple values contribute to each horizontal total." },
      { id: "stacked100_bar", label: "100% stacked bar chart", description: "Compare percentage contribution across horizontal bars." },
      { id: "clustered_column", label: "Clustered column chart", description: "Compare values side by side using vertical columns." },
      { id: "stacked_column", label: "Stacked column chart", description: "Show how multiple values contribute to each vertical total." },
      { id: "stacked100_column", label: "100% stacked column chart", description: "Compare percentage contribution across vertical columns." }
    ]
  },
  {
    id: "line-area", label: "Line and area", icon: "⌁", visuals: [
      { id: "line", label: "Line chart", description: "Show a trend across ordered reporting periods." },
      { id: "area", label: "Area chart", description: "Emphasise the size of a trend with a filled area." },
      { id: "stacked_area", label: "Stacked area chart", description: "Show changing totals and each series contribution over time." },
      { id: "stacked100_area", label: "100% stacked area chart", description: "Show percentage contribution over time." },
      { id: "combo", label: "Line and clustered column chart", description: "Combine columns with a line to compare target and actual values." },
      { id: "ribbon", label: "Ribbon chart", description: "Highlight the changing gap and ranking between two series." },
      { id: "stepped_line", label: "Stepped line chart", description: "Show changes that occur in clear reporting steps." },
      { id: "radar", label: "Radar chart", description: "Compare several values around a circular performance profile." }
    ]
  },
  {
    id: "waterfall-scatter", label: "Waterfall, funnel, and scatter", icon: "⌗", visuals: [
      { id: "waterfall", label: "Waterfall chart", description: "Explain how period movements build to a final total." },
      { id: "funnel", label: "Funnel chart", description: "Show values narrowing through stages or ranked categories." },
      { id: "scatter", label: "Scatter chart", description: "Compare the relationship between planned and actual values." },
      { id: "bubble", label: "Bubble chart", description: "Add a third measure through bubble size." }
    ]
  },
  {
    id: "pie-treemap", label: "Pie, donut, and treemap", icon: "◔", visuals: [
      { id: "pie", label: "Pie chart", description: "Show each category as a share of one total." },
      { id: "doughnut", label: "Donut chart", description: "Show category share with space for a total in the centre." },
      { id: "treemap", label: "Treemap", description: "Use sized rectangles to compare category contribution." },
      { id: "polar_area", label: "Polar area chart", description: "Compare category size using radial segments." }
    ]
  },
  {
    id: "maps", label: "Maps", icon: "◎", visuals: [
      { id: "map", label: "Map", description: "Plot project information on a geographic-style visual." },
      { id: "filled_map", label: "Filled map", description: "Use filled regions to show comparative project intensity." },
      { id: "shape_map", label: "Shape map", description: "Compare values across custom site or regional shapes." },
      { id: "point_map", label: "Azure Maps point map", description: "Plot labelled project and work-package locations as points." }
    ]
  },
  {
    id: "gauge-kpi", label: "Gauge, card, and KPI", icon: "◴", visuals: [
      { id: "gauge", label: "Gauge", description: "Show current performance against a target on a dial." },
      { id: "card", label: "Card", description: "Display one important value prominently." },
      { id: "multi_row_card", label: "Multi-row card", description: "Display several related KPIs in one compact visual." },
      { id: "kpi", label: "KPI", description: "Show status, target, variance, and trend in one visual." }
    ]
  },
  {
    id: "slicer", label: "Slicer", icon: "▽", visuals: [
      { id: "slicer", label: "Slicer", description: "Present categories as a compact filtering control." },
      { id: "tile_slicer", label: "Tile slicer", description: "Present categories as large selectable tiles." }
    ]
  },
  {
    id: "table-matrix", label: "Table and matrix", icon: "▦", visuals: [
      { id: "table", label: "Table", description: "Show detailed rows with labels, values, and variance." },
      { id: "matrix", label: "Matrix", description: "Summarise data in a cross-tab with totals and heat shading." }
    ]
  },
  {
    id: "ai", label: "AI visuals", icon: "✦", visuals: [
      { id: "decomposition_tree", label: "Decomposition tree", description: "Break a project result into the factors that contribute to it." },
      { id: "key_influencers", label: "Key influencers", description: "Rank the factors most associated with project performance." },
      { id: "qa", label: "Q&A visual", description: "Display a plain-language question and an automatic project answer." }
    ]
  }
];

const VISUAL_DEFINITIONS = Object.fromEntries(VISUAL_CATALOG.flatMap(group => group.visuals.map(visual => [visual.id, { ...visual, group: group.label }])));
const ALL_VISUAL_TYPES = Object.keys(VISUAL_DEFINITIONS);
let activeChartPickerKind = "cost";
let chartResizeTimer = null;


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
  costChartType: "line",
  progressChartType: "clustered_column",
  categoryChartType: "doughnut",
  chartPalette: "brand",
  legendPosition: "top",
  gridlines: true,
  chartFill: true,
  animations: true,
  brandName: "Civentraq",
  brandTagline: "Project Intelligence",
  brandInitials: "CV",
  companyName: "Demo Engineering Contractor",
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
const REPORT_CATEGORIES = {
  all: { label: "All reports", icon: "▦", order: 0 },
  progress: { label: "Project & progress", icon: "◫", order: 1 },
  commercial: { label: "Cost & commercial", icon: "R", order: 2 },
  safety: { label: "HSE & environment", icon: "✚", order: 3 },
  quality: { label: "Quality & inspection", icon: "✓", order: 4 },
  engineering: { label: "Engineering & documents", icon: "▤", order: 5 },
  refinery: { label: "Refinery & operations", icon: "⚙", order: 6 },
  closeout: { label: "Commissioning & handover", icon: "◆", order: 7 }
};

Object.assign(REPORT_TYPES, {
  executive: { ...REPORT_TYPES.executive, category: "progress", icon: "▥", featured: true },
  daily_site: {
    title: "Daily site report", category: "progress", icon: "☀", slug: "daily-site-report",
    description: "Daily work completed, manpower, equipment, weather, deliveries, delays, safety observations, photographs, and next-shift plan."
  },
  weekly_progress: {
    title: "Weekly progress report", category: "progress", icon: "7", slug: "weekly-progress-report",
    description: "Weekly planned versus actual progress, activities completed, upcoming work, blockers, labour, equipment, risks, and decisions required."
  },
  monthly_client: {
    title: "Monthly client report", category: "progress", icon: "M", slug: "monthly-client-report",
    description: "Formal monthly client pack covering executive performance, cost, schedule, procurement, HSE, quality, risks, variations, and forecasts."
  },
  schedule: { ...REPORT_TYPES.schedule, category: "progress", icon: "◷", featured: true },
  lookahead: {
    title: "Schedule and look-ahead report", category: "progress", icon: "→", slug: "schedule-lookahead-report",
    description: "Baseline and current programme, critical activities, milestones, two-to-six-week look-ahead, delayed work, and recovery actions."
  },
  risk_issue: {
    title: "Risk and issue report", category: "progress", icon: "!", slug: "risk-issue-report",
    description: "Open risks and issues with probability, impact, owners, due dates, mitigation plans, escalation status, and residual exposure."
  },
  cost: { ...REPORT_TYPES.cost, category: "commercial", icon: "R", featured: true },
  cash_flow: {
    title: "Cost and cash-flow report", category: "commercial", icon: "≈", slug: "cost-cash-flow-report",
    description: "Approved budget, commitments, actual expenditure, invoices, payments, outstanding amounts, monthly cash flow, variance, and forecast."
  },
  variations_claims: {
    title: "Variations and claims report", category: "commercial", icon: "±", slug: "variations-claims-report",
    description: "Variation orders and claims with reasons, submitted values, approvals, disputed amounts, schedule impact, and supporting-document status."
  },
  procurement: {
    title: "Procurement report", category: "commercial", icon: "▣", slug: "procurement-report",
    description: "Purchase orders, suppliers, required-on-site dates, promised delivery, late materials, inspections, expediting, and approval status."
  },
  labour_productivity: {
    title: "Labour and productivity report", category: "commercial", icon: "♟", slug: "labour-productivity-report",
    description: "Headcount, hours, overtime, absenteeism, output per labour hour, trade performance, subcontractors, and productivity trends."
  },
  equipment_plant: {
    title: "Equipment and plant report", category: "commercial", icon: "⚒", slug: "equipment-plant-report",
    description: "Equipment availability, operating hours, downtime, utilisation, fuel use, maintenance due, hire cost, and operator allocation."
  },
  hse_performance: {
    title: "HSE performance report", category: "safety", icon: "✚", slug: "hse-performance-report",
    description: "Leading and lagging HSE indicators, incidents, observations, toolbox talks, inspections, permits, corrective actions, and days without LTI."
  },
  incident_accident: {
    title: "Incident and accident report", category: "safety", icon: "!", slug: "incident-accident-report",
    description: "Incident classification, location, people involved, immediate response, investigation, root cause, corrective actions, and close-out status."
  },
  near_miss: {
    title: "Near-miss report", category: "safety", icon: "△", slug: "near-miss-report",
    description: "Near-miss events, potential severity, unsafe condition, immediate controls, owners, investigation, lessons learned, and closure evidence."
  },
  safety_observation: {
    title: "Safety-observation report", category: "safety", icon: "◉", slug: "safety-observation-report",
    description: "Positive and unsafe observations by area, category, contractor, action owner, target date, status, and recurring trends."
  },
  toolbox_talk: {
    title: "Toolbox-talk register", category: "safety", icon: "☷", slug: "toolbox-talk-register",
    description: "Toolbox topics, supervisors, crews, attendance, shift, work area, supporting evidence, and acknowledgement status."
  },
  permit_to_work: {
    title: "Permit-to-work report", category: "safety", icon: "P", slug: "permit-to-work-report",
    description: "Hot work, confined space, excavation, electrical isolation, lockout/tagout, expiry, suspension, and permit-compliance status."
  },
  ppe_compliance: {
    title: "PPE compliance report", category: "safety", icon: "⌂", slug: "ppe-compliance-report",
    description: "PPE inspections by area and contractor with compliant headcount, non-compliances, repeat findings, corrective action, and closure status."
  },
  safety_inspection: {
    title: "Safety inspection report", category: "safety", icon: "⌕", slug: "safety-inspection-report",
    description: "Planned and completed inspections, findings by severity, responsible contractor, due dates, overdue actions, and verification status."
  },
  environmental_incident: {
    title: "Environmental incident report", category: "safety", icon: "♻", slug: "environmental-incident-report",
    description: "Spills, leaks, discharges, affected area, estimated quantity, containment, notifications, remediation, and investigation status."
  },
  lost_time_injury: {
    title: "Lost-time injury report", category: "safety", icon: "L", slug: "lost-time-injury-report",
    description: "Lost-time injuries, exposure hours, days lost, restricted duty, injury classification, investigation, corrective actions, and return-to-work status."
  },
  corrective_action: {
    title: "Corrective-action tracker", category: "safety", icon: "↻", slug: "corrective-action-tracker",
    description: "Corrective and preventive actions from incidents, audits, inspections, NCRs, owners, due dates, overdue status, and verification evidence."
  },
  qaqc: {
    title: "QA/QC performance report", category: "quality", icon: "✓", slug: "qaqc-performance-report",
    description: "Inspection and test plan performance, accepted and rejected work, test results, hold points, outstanding inspections, and document status."
  },
  non_conformance: {
    title: "Non-conformance report", category: "quality", icon: "N", slug: "non-conformance-report",
    description: "NCRs with defect details, responsible contractor, disposition, root cause, corrective action, due date, status, and cost or schedule impact."
  },
  punch_list: {
    title: "Snag and punch-list report", category: "quality", icon: "☑", slug: "snag-punch-list-report",
    description: "Outstanding defects by system, location, discipline, priority, responsible party, target date, evidence, verification, and close-out status."
  },
  welding_fabrication: {
    title: "Welding and fabrication report", category: "quality", icon: "W", slug: "welding-fabrication-report",
    description: "Weld production, weld maps, welder IDs, NDT results, repair rate, rejected welds, heat treatment, and pressure-test readiness."
  },
  rfi_register: {
    title: "RFI register", category: "engineering", icon: "?", slug: "rfi-register",
    description: "Requests for information with discipline, question, responsible person, submitted date, due date, response, status, and schedule impact."
  },
  drawing_register: {
    title: "Drawing register", category: "engineering", icon: "▱", slug: "drawing-register",
    description: "Drawing numbers, titles, disciplines, revisions, issue purpose, transmittals, client review, superseded status, and construction release."
  },
  technical_submittal: {
    title: "Technical-submittal report", category: "engineering", icon: "T", slug: "technical-submittal-report",
    description: "Material and technical submittals with supplier, specification, revision, submission date, review result, comments, and resubmission status."
  },
  document_control: {
    title: "Document-control report", category: "engineering", icon: "D", slug: "document-control-report",
    description: "Document volumes, transmittals, revisions, overdue reviews, returned comments, distribution, controlled copies, and acknowledgement status."
  },
  design_progress: {
    title: "Design-progress report", category: "engineering", icon: "◇", slug: "design-progress-report",
    description: "Design deliverables by discipline with planned, actual, issued-for-review, issued-for-construction, overdue, and forecast completion."
  },
  engineering_deliverables: {
    title: "Engineering deliverables report", category: "engineering", icon: "E", slug: "engineering-deliverables-report",
    description: "Engineering deliverables, responsible discipline, planned issue date, actual issue date, revision, approval, dependencies, and status."
  },
  revision_status: {
    title: "Revision-status report", category: "engineering", icon: "↺", slug: "revision-status-report",
    description: "Latest document revisions, prior versions, revision reason, issue purpose, effective date, superseded copies, and distribution status."
  },
  client_approval: {
    title: "Client-approval tracker", category: "engineering", icon: "A", slug: "client-approval-tracker",
    description: "Items awaiting client review with submission date, contractual response date, reviewer, comments, approval code, resubmission, and delay impact."
  },
  turnaround_shutdown: {
    title: "Turnaround and shutdown report", category: "refinery", icon: "⏱", slug: "turnaround-shutdown-report",
    description: "Shutdown scope, work packages, units isolated, critical-path work, shift manpower, equipment, delays, safety events, and restart readiness."
  },
  process_safety: {
    title: "Process-safety performance report", category: "refinery", icon: "PS", slug: "process-safety-performance-report",
    description: "Loss-of-containment events, process-safety tiers, relief activations, trips, alarm performance, safety-system failures, and overdue actions."
  },
  maintenance_reliability: {
    title: "Maintenance and reliability report", category: "refinery", icon: "⚙", slug: "maintenance-reliability-report",
    description: "Preventive and corrective maintenance, breakdowns, downtime, MTBF, MTTR, backlog, critical equipment, work orders, and spare-parts status."
  },
  inspection_corrosion: {
    title: "Inspection and corrosion report", category: "refinery", icon: "⊙", slug: "inspection-corrosion-report",
    description: "Piping and vessel inspections, thickness readings, corrosion rates, remaining life, leaks, repairs, overdue inspections, and RBI ranking."
  },
  production_operations: {
    title: "Production and operations report", category: "refinery", icon: "▰", slug: "production-operations-report",
    description: "Throughput, unit availability, production plan, product yield, unplanned shutdowns, storage, off-spec product, and operational losses."
  },
  environmental_emissions: {
    title: "Environmental and emissions report", category: "refinery", icon: "♧", slug: "environmental-emissions-report",
    description: "Air emissions, flaring, wastewater, spills, waste, water and energy consumption, greenhouse gases, limits, and permit compliance."
  },
  commissioning_startup: {
    title: "Commissioning and start-up report", category: "closeout", icon: "▶", slug: "commissioning-startup-report",
    description: "Mechanical completion, pre-commissioning, tests, loop checks, energisation, outstanding punch items, start-up readiness, and acceptance."
  },
  handover_closeout: {
    title: "Handover and close-out report", category: "closeout", icon: "◆", slug: "handover-closeout-report",
    description: "Handover dossiers, as-built drawings, O&M manuals, training, warranties, final punch items, completion certificates, and client acceptance."
  }
});

const DATASET_CATEGORIES = {
  all: { label: "All datasets", icon: "▦", order: 0 },
  core: { label: "Core project", icon: "◫", order: 1 },
  commercial: { label: "Commercial", icon: "R", order: 2 },
  delivery: { label: "Delivery resources", icon: "⇄", order: 3 },
  assurance: { label: "HSE & quality", icon: "✓", order: 4 },
  engineering: { label: "Engineering control", icon: "▤", order: 5 },
  refinery: { label: "Refinery operations", icon: "⚙", order: 6 },
  closeout: { label: "Commissioning & close-out", icon: "◆", order: 7 }
};

const DATASET_TEMPLATES = {
  project_performance: {
    title: "Project performance", icon: "▥", category: "core",
    description: "Reporting-period cost, progress, labour, task, and risk information that powers the main dashboard.",
    reports: ["executive", "weekly_progress", "monthly_client", "risk_issue", "cost", "schedule"],
    columns: FIELD_CONFIG.map(field => ({ ...field, required: ["date", "actualCost", "actualProgress"].includes(field.key) })),
    sampleRows: SAMPLE_ROWS
  },
  schedule_milestones: {
    title: "Schedule and milestones", icon: "◷", category: "core",
    description: "Activities, baseline dates, current dates, completion, float, milestones, constraints, and critical-path status.",
    reports: ["daily_site", "lookahead"],
    columns: [
      { key: "activity", label: "Activity", aliases: ["activity", "task", "work package"], required: true },
      { key: "owner", label: "Owner", aliases: ["owner", "responsible", "contractor"] },
      { key: "baselineStart", label: "Baseline start", aliases: ["baseline start", "planned start"] },
      { key: "baselineFinish", label: "Baseline finish", aliases: ["baseline finish", "planned finish"] },
      { key: "currentFinish", label: "Current finish", aliases: ["current finish", "forecast finish"] },
      { key: "progress", label: "Progress (%)", aliases: ["progress", "complete %", "percentage complete"] },
      { key: "floatDays", label: "Float (days)", aliases: ["float", "total float", "days float"] },
      { key: "critical", label: "Critical path", aliases: ["critical", "critical path"] },
      { key: "status", label: "Status", aliases: ["status", "state"] }
    ],
    sampleRows: [
      { Activity: "Piping fabrication", Owner: "Piping team", "Baseline start": "2026-06-01", "Baseline finish": "2026-07-18", "Current finish": "2026-07-29", "Progress (%)": 78, "Float (days)": -11, "Critical path": "Yes", Status: "Delayed" },
      { Activity: "Electrical reticulation", Owner: "Electrical team", "Baseline start": "2026-06-12", "Baseline finish": "2026-08-04", "Current finish": "2026-08-08", "Progress (%)": 64, "Float (days)": -4, "Critical path": "Yes", Status: "At risk" },
      { Activity: "Civil rehabilitation", Owner: "Civil team", "Baseline start": "2026-05-10", "Baseline finish": "2026-07-30", "Current finish": "2026-07-28", "Progress (%)": 82, "Float (days)": 2, "Critical path": "No", Status: "On track" }
    ]
  },
  cost_cashflow: {
    title: "Cost and cash flow", icon: "R", category: "commercial",
    description: "Budget, commitments, actual expenditure, invoices, payments, accruals, cash flow, forecasts, and cost codes.",
    reports: ["cash_flow"],
    columns: [
      { key: "period", label: "Period", aliases: ["period", "month", "date"], required: true },
      { key: "costCode", label: "Cost code", aliases: ["cost code", "wbs", "account"] },
      { key: "description", label: "Description", aliases: ["description", "item", "scope"] },
      { key: "budget", label: "Budget", aliases: ["budget", "approved budget"] },
      { key: "committed", label: "Committed cost", aliases: ["committed", "commitment"] },
      { key: "actual", label: "Actual cost", aliases: ["actual", "actual cost", "expenditure"] },
      { key: "invoice", label: "Invoice value", aliases: ["invoice", "invoice value"] },
      { key: "paid", label: "Paid value", aliases: ["paid", "payment"] },
      { key: "forecast", label: "Forecast final cost", aliases: ["forecast", "final cost", "eac"] }
    ],
    sampleRows: [
      { Period: "2026-05", "Cost code": "MECH-110", Description: "Mechanical installation", Budget: 2200000, "Committed cost": 1880000, "Actual cost": 1510000, "Invoice value": 390000, "Paid value": 310000, "Forecast final cost": 2180000 },
      { Period: "2026-06", "Cost code": "PIPE-220", Description: "Piping fabrication", Budget: 1900000, "Committed cost": 1720000, "Actual cost": 1340000, "Invoice value": 460000, "Paid value": 420000, "Forecast final cost": 1980000 },
      { Period: "2026-07", "Cost code": "ELEC-310", Description: "Electrical reticulation", Budget: 1450000, "Committed cost": 1210000, "Actual cost": 980000, "Invoice value": 280000, "Paid value": 240000, "Forecast final cost": 1490000 }
    ]
  },
  variations_claims: {
    title: "Variations and claims", icon: "±", category: "commercial",
    description: "Change events, instructions, submitted values, approved values, entitlement, time impact, evidence, and determination status.",
    reports: ["variations_claims", "monthly_client"],
    columns: [
      { key: "reference", label: "Reference", aliases: ["reference", "variation number", "claim number"], required: true },
      { key: "description", label: "Description", aliases: ["description", "change", "claim"] },
      { key: "reason", label: "Reason", aliases: ["reason", "cause"] },
      { key: "submitted", label: "Submitted value", aliases: ["submitted", "claimed value"] },
      { key: "approved", label: "Approved value", aliases: ["approved", "approved value"] },
      { key: "timeImpact", label: "Time impact (days)", aliases: ["time impact", "days"] },
      { key: "owner", label: "Owner", aliases: ["owner", "responsible"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { Reference: "VO-014", Description: "Additional pipe supports", Reason: "Client instruction", "Submitted value": 420000, "Approved value": 0, "Time impact (days)": 6, Owner: "Commercial manager", Status: "Under review" },
      { Reference: "CL-007", Description: "Access delay", Reason: "Late work-area release", "Submitted value": 285000, "Approved value": 120000, "Time impact (days)": 4, Owner: "Contracts manager", Status: "Part approved" }
    ]
  },
  labour_productivity: {
    title: "Labour and productivity", icon: "♟", category: "delivery",
    description: "Headcount, trade, shift, normal hours, overtime, absenteeism, installed quantities, targets, and productivity indexes.",
    reports: ["labour_productivity", "daily_site", "weekly_progress"],
    columns: [
      { key: "date", label: "Date", aliases: ["date", "shift date"], required: true },
      { key: "trade", label: "Trade", aliases: ["trade", "discipline"] },
      { key: "shift", label: "Shift", aliases: ["shift"] },
      { key: "headcount", label: "Headcount", aliases: ["headcount", "manpower"] },
      { key: "normalHours", label: "Normal hours", aliases: ["normal hours", "regular hours"] },
      { key: "overtime", label: "Overtime hours", aliases: ["overtime", "ot hours"] },
      { key: "plannedOutput", label: "Planned output", aliases: ["planned output", "target"] },
      { key: "actualOutput", label: "Actual output", aliases: ["actual output", "completed quantity"] },
      { key: "unit", label: "Unit", aliases: ["unit", "uom"] }
    ],
    sampleRows: [
      { Date: "2026-07-20", Trade: "Pipe fitters", Shift: "Day", Headcount: 34, "Normal hours": 306, "Overtime hours": 48, "Planned output": 42, "Actual output": 36, Unit: "spools" },
      { Date: "2026-07-20", Trade: "Electricians", Shift: "Day", Headcount: 28, "Normal hours": 252, "Overtime hours": 24, "Planned output": 68, "Actual output": 63, Unit: "terminations" },
      { Date: "2026-07-20", Trade: "Welders", Shift: "Night", Headcount: 18, "Normal hours": 162, "Overtime hours": 36, "Planned output": 25, "Actual output": 21, Unit: "welds" }
    ]
  },
  procurement_materials: {
    title: "Procurement and materials", icon: "▣", category: "delivery",
    description: "Purchase orders, suppliers, order values, required-on-site dates, promised delivery, inspections, expediting, and material status.",
    reports: ["procurement", "weekly_progress", "monthly_client"],
    columns: [
      { key: "po", label: "Purchase order", aliases: ["purchase order", "po", "po number"], required: true },
      { key: "item", label: "Item / package", aliases: ["item", "package", "description"] },
      { key: "supplier", label: "Supplier", aliases: ["supplier", "vendor"] },
      { key: "orderValue", label: "Order value", aliases: ["order value", "po value"] },
      { key: "requiredDate", label: "Required on site", aliases: ["required on site", "required date", "ros date"] },
      { key: "promisedDate", label: "Promised delivery", aliases: ["promised delivery", "delivery date"] },
      { key: "inspection", label: "Inspection status", aliases: ["inspection", "inspection status"] },
      { key: "status", label: "Delivery status", aliases: ["status", "delivery status"] }
    ],
    sampleRows: [
      { "Purchase order": "PO-450117", "Item / package": "Control valves", Supplier: "FlowTech", "Order value": 1180000, "Required on site": "2026-07-22", "Promised delivery": "2026-07-29", "Inspection status": "Released", "Delivery status": "Late" },
      { "Purchase order": "PO-450124", "Item / package": "Cable trays", Supplier: "ElectroFab", "Order value": 480000, "Required on site": "2026-07-24", "Promised delivery": "2026-07-23", "Inspection status": "Not required", "Delivery status": "On track" },
      { "Purchase order": "PO-450131", "Item / package": "Gaskets and bolting", Supplier: "SealPro", "Order value": 265000, "Required on site": "2026-07-20", "Promised delivery": "2026-07-21", "Inspection status": "Accepted", "Delivery status": "Delivered" }
    ]
  },
  equipment_plant: {
    title: "Equipment and plant", icon: "⚒", category: "delivery",
    description: "Plant register, availability, operating hours, downtime, fuel, utilisation, maintenance, hire cost, and operator details.",
    reports: ["equipment_plant", "daily_site"],
    columns: [
      { key: "asset", label: "Asset ID", aliases: ["asset id", "equipment id", "plant number"], required: true },
      { key: "equipment", label: "Equipment", aliases: ["equipment", "plant", "description"] },
      { key: "owner", label: "Owner / supplier", aliases: ["owner", "supplier"] },
      { key: "availableHours", label: "Available hours", aliases: ["available hours", "availability"] },
      { key: "operatingHours", label: "Operating hours", aliases: ["operating hours", "worked hours"] },
      { key: "downtime", label: "Downtime hours", aliases: ["downtime", "downtime hours"] },
      { key: "maintenanceDue", label: "Maintenance due", aliases: ["maintenance due", "service due"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { "Asset ID": "CR-07", Equipment: "80 t mobile crane", "Owner / supplier": "LiftCo", "Available hours": 72, "Operating hours": 49, "Downtime hours": 6, "Maintenance due": "2026-07-26", Status: "Available" },
      { "Asset ID": "GEN-12", Equipment: "250 kVA generator", "Owner / supplier": "Site plant", "Available hours": 168, "Operating hours": 151, "Downtime hours": 17, "Maintenance due": "2026-07-22", Status: "Maintenance due" }
    ]
  },
  hse_incidents_actions: {
    title: "HSE incidents and actions", icon: "✚", category: "assurance",
    description: "Incidents, near misses, observations, permit issues, severity, exposure hours, investigations, corrective actions, owners, and closure.",
    reports: ["hse_performance", "incident_accident", "near_miss", "safety_observation", "safety_inspection", "lost_time_injury", "corrective_action"],
    columns: [
      { key: "reference", label: "Reference", aliases: ["reference", "incident number", "observation number"], required: true },
      { key: "date", label: "Date", aliases: ["date", "event date"] },
      { key: "type", label: "Event type", aliases: ["event type", "type"] },
      { key: "area", label: "Area", aliases: ["area", "location"] },
      { key: "description", label: "Description", aliases: ["description", "event"] },
      { key: "severity", label: "Severity", aliases: ["severity", "risk rating"] },
      { key: "action", label: "Corrective action", aliases: ["corrective action", "action"] },
      { key: "owner", label: "Owner", aliases: ["owner", "responsible"] },
      { key: "dueDate", label: "Due date", aliases: ["due date", "target date"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { Reference: "NM-041", Date: "2026-07-19", "Event type": "Near miss", Area: "Pipe rack 3", Description: "Spanner dropped from scaffold platform", Severity: "High potential", "Corrective action": "Install tool-tether points", Owner: "Construction manager", "Due date": "2026-07-22", Status: "Open" },
      { Reference: "OBS-188", Date: "2026-07-20", "Event type": "Safety observation", Area: "Electrical room", Description: "Good lockout verification observed", Severity: "Positive", "Corrective action": "Share learning at toolbox talk", Owner: "HSE officer", "Due date": "2026-07-21", Status: "Closed" },
      { Reference: "INC-031", Date: "2026-07-17", "Event type": "First aid", Area: "Workshop", Description: "Minor hand cut during cable preparation", Severity: "Low", "Corrective action": "Revise cable-cleaning method", Owner: "Electrical lead", "Due date": "2026-07-24", Status: "In progress" }
    ]
  },
  permits_toolbox: {
    title: "Permits and toolbox talks", icon: "☷", category: "assurance",
    description: "Permit-to-work controls, isolations, permit expiry, toolbox topics, attendance, evidence, and compliance status.",
    reports: ["toolbox_talk", "permit_to_work", "ppe_compliance"],
    columns: [
      { key: "reference", label: "Reference", aliases: ["reference", "permit number", "talk number"], required: true },
      { key: "date", label: "Date", aliases: ["date"] },
      { key: "type", label: "Type", aliases: ["type", "permit type", "topic"] },
      { key: "area", label: "Area / shift", aliases: ["area", "shift"] },
      { key: "issuer", label: "Issuer / presenter", aliases: ["issuer", "presenter"] },
      { key: "people", label: "People covered", aliases: ["people", "attendance", "attendees"] },
      { key: "expiry", label: "Expiry", aliases: ["expiry", "expiry time"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { Reference: "PTW-8041", Date: "2026-07-20", Type: "Hot work", "Area / shift": "Pipe rack 3 / Day", "Issuer / presenter": "Permit office", "People covered": 12, Expiry: "18:00", Status: "Active" },
      { Reference: "TBT-220", Date: "2026-07-20", Type: "Dropped-object prevention", "Area / shift": "Piping / Day", "Issuer / presenter": "M. Dlamini", "People covered": 34, Expiry: "N/A", Status: "Complete" }
    ]
  },
  quality_ncr_punch: {
    title: "Quality, NCR, and punch list", icon: "✓", category: "assurance",
    description: "Inspections, hold points, test results, non-conformances, defects, punch items, corrective actions, verification, and close-out evidence.",
    reports: ["qaqc", "non_conformance", "punch_list", "corrective_action"],
    columns: [
      { key: "reference", label: "Reference", aliases: ["reference", "ncr number", "punch number"], required: true },
      { key: "type", label: "Record type", aliases: ["record type", "type"] },
      { key: "discipline", label: "Discipline", aliases: ["discipline", "trade"] },
      { key: "description", label: "Description", aliases: ["description", "defect"] },
      { key: "priority", label: "Priority", aliases: ["priority", "category", "severity"] },
      { key: "owner", label: "Owner", aliases: ["owner", "responsible"] },
      { key: "dueDate", label: "Due date", aliases: ["due date"] },
      { key: "verification", label: "Verification evidence", aliases: ["verification", "evidence"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { Reference: "NCR-026", "Record type": "NCR", Discipline: "Piping", Description: "Incorrect gasket specification fitted", Priority: "High", Owner: "Piping superintendent", "Due date": "2026-07-23", "Verification evidence": "Replacement and inspection record", Status: "Open" },
      { Reference: "P-184", "Record type": "Punch", Discipline: "Electrical", Description: "Cable tag missing", Priority: "B", Owner: "Electrical supervisor", "Due date": "2026-07-25", "Verification evidence": "Photo", Status: "In progress" }
    ]
  },
  welding_inspection: {
    title: "Welding and fabrication", icon: "W", category: "assurance",
    description: "Weld register, weld maps, welder IDs, procedures, NDT, repairs, pressure-test packs, inspection, and acceptance status.",
    reports: ["welding_fabrication", "qaqc"],
    columns: [
      { key: "weld", label: "Weld ID", aliases: ["weld id", "weld number"], required: true },
      { key: "line", label: "Line / drawing", aliases: ["line", "drawing"] },
      { key: "welder", label: "Welder ID", aliases: ["welder id", "welder"] },
      { key: "wps", label: "WPS", aliases: ["wps", "procedure"] },
      { key: "date", label: "Weld date", aliases: ["weld date", "date"] },
      { key: "ndt", label: "NDT method", aliases: ["ndt", "ndt method"] },
      { key: "result", label: "Result", aliases: ["result", "inspection result"] },
      { key: "testPack", label: "Test pack", aliases: ["test pack"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { "Weld ID": "W-PP-2218", "Line / drawing": "10-P-401", "Welder ID": "WL-17", WPS: "WPS-CS-04", "Weld date": "2026-07-18", "NDT method": "RT", Result: "Accepted", "Test pack": "TP-19", Status: "Complete" },
      { "Weld ID": "W-PP-2226", "Line / drawing": "8-P-312", "Welder ID": "WL-22", WPS: "WPS-SS-02", "Weld date": "2026-07-19", "NDT method": "PT", Result: "Repair", "Test pack": "TP-21", Status: "Repair open" }
    ]
  },
  engineering_documents: {
    title: "Engineering documents and RFIs", icon: "▤", category: "engineering",
    description: "RFIs, drawings, submittals, revisions, issue purpose, reviewers, contractual response dates, deliverables, and approval status.",
    reports: ["rfi_register", "drawing_register", "technical_submittal", "document_control", "design_progress", "engineering_deliverables", "revision_status", "client_approval"],
    columns: [
      { key: "reference", label: "Reference", aliases: ["reference", "document number", "rfi number"], required: true },
      { key: "type", label: "Document type", aliases: ["document type", "type"] },
      { key: "title", label: "Title / subject", aliases: ["title", "subject", "description"] },
      { key: "revision", label: "Revision", aliases: ["revision", "rev"] },
      { key: "purpose", label: "Issue purpose", aliases: ["issue purpose", "purpose"] },
      { key: "submitted", label: "Submitted date", aliases: ["submitted date", "date submitted"] },
      { key: "responseDue", label: "Response due", aliases: ["response due", "due date"] },
      { key: "reviewer", label: "Reviewer", aliases: ["reviewer", "approver"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { Reference: "RFI-108", "Document type": "RFI", "Title / subject": "Nozzle orientation clarification", Revision: "0", "Issue purpose": "Information", "Submitted date": "2026-07-14", "Response due": "2026-07-21", Reviewer: "Client engineer", Status: "Overdue" },
      { Reference: "DWG-P-2041", "Document type": "Drawing", "Title / subject": "Pipe rack supports", Revision: "C", "Issue purpose": "IFC", "Submitted date": "2026-07-16", "Response due": "N/A", Reviewer: "Document control", Status: "Current" },
      { Reference: "SUB-067", "Document type": "Submittal", "Title / subject": "Control valve datasheets", Revision: "1", "Issue purpose": "Approval", "Submitted date": "2026-07-17", "Response due": "2026-07-24", Reviewer: "Process engineer", Status: "Under review" }
    ]
  },
  turnaround_shutdown: {
    title: "Turnaround and shutdown", icon: "T", category: "refinery",
    description: "Shutdown scope, unit, work package, shift plan, critical-path work, permits, progress, blockers, remaining hours, and restart readiness.",
    reports: ["turnaround_shutdown"],
    columns: [
      { key: "workPackage", label: "Work package", aliases: ["work package", "scope"], required: true },
      { key: "unit", label: "Unit / area", aliases: ["unit", "area"] },
      { key: "shift", label: "Shift", aliases: ["shift"] },
      { key: "plannedHours", label: "Planned hours", aliases: ["planned hours"] },
      { key: "actualHours", label: "Actual hours", aliases: ["actual hours"] },
      { key: "progress", label: "Progress (%)", aliases: ["progress"] },
      { key: "critical", label: "Critical path", aliases: ["critical path", "critical"] },
      { key: "blocker", label: "Blocker", aliases: ["blocker", "constraint"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { "Work package": "Vessel V-210 internal inspection", "Unit / area": "Hydrotreater", Shift: "Day", "Planned hours": 48, "Actual hours": 52, "Progress (%)": 86, "Critical path": "Yes", Blocker: "Additional cleaning", Status: "At risk" },
      { "Work package": "Compressor C-12 overhaul", "Unit / area": "Utilities", Shift: "Night", "Planned hours": 72, "Actual hours": 66, "Progress (%)": 93, "Critical path": "Yes", Blocker: "None", Status: "On track" }
    ]
  },
  process_safety: {
    title: "Process safety", icon: "PS", category: "refinery",
    description: "Process-safety events, loss of containment, trips, relief activations, alarm performance, impairments, barriers, actions, and event tiers.",
    reports: ["process_safety"],
    columns: [
      { key: "reference", label: "Reference", aliases: ["reference", "event number"], required: true },
      { key: "date", label: "Date", aliases: ["date"] },
      { key: "event", label: "Event / indicator", aliases: ["event", "indicator"] },
      { key: "tier", label: "Tier", aliases: ["tier", "event tier"] },
      { key: "unit", label: "Unit", aliases: ["unit", "area"] },
      { key: "consequence", label: "Consequence", aliases: ["consequence", "impact"] },
      { key: "barrier", label: "Barrier status", aliases: ["barrier", "barrier status"] },
      { key: "action", label: "Action", aliases: ["action"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { Reference: "PSE-006", Date: "2026-07-08", "Event / indicator": "Minor hydrocarbon release", Tier: "Tier 2", Unit: "Crude unit", Consequence: "Contained locally", "Barrier status": "Detection effective", Action: "Replace flange and inspect similar joints", Status: "Action open" },
      { Reference: "IMP-014", Date: "2026-07-19", "Event / indicator": "Gas detector impairment", Tier: "Leading", Unit: "Tank farm", Consequence: "Temporary impairment", "Barrier status": "Compensating measure active", Action: "Repair detector", Status: "In progress" }
    ]
  },
  maintenance_reliability: {
    title: "Maintenance and reliability", icon: "⚙", category: "refinery",
    description: "Work orders, preventive and corrective maintenance, breakdowns, asset criticality, downtime, MTBF, MTTR, backlog, and spare-parts status.",
    reports: ["maintenance_reliability"],
    columns: [
      { key: "workOrder", label: "Work order", aliases: ["work order", "wo"], required: true },
      { key: "asset", label: "Asset", aliases: ["asset", "equipment"] },
      { key: "type", label: "Maintenance type", aliases: ["maintenance type", "type"] },
      { key: "priority", label: "Priority", aliases: ["priority", "criticality"] },
      { key: "plannedDate", label: "Planned date", aliases: ["planned date", "due date"] },
      { key: "completedDate", label: "Completed date", aliases: ["completed date"] },
      { key: "downtime", label: "Downtime hours", aliases: ["downtime", "downtime hours"] },
      { key: "backlogAge", label: "Backlog age (days)", aliases: ["backlog age", "age days"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { "Work order": "WO-88421", Asset: "Pump P-104A", "Maintenance type": "Corrective", Priority: "Critical", "Planned date": "2026-07-18", "Completed date": "", "Downtime hours": 14, "Backlog age (days)": 3, Status: "In progress" },
      { "Work order": "WO-88302", Asset: "Compressor C-12", "Maintenance type": "Preventive", Priority: "High", "Planned date": "2026-07-16", "Completed date": "2026-07-17", "Downtime hours": 8, "Backlog age (days)": 0, Status: "Complete" }
    ]
  },
  inspection_corrosion: {
    title: "Inspection and corrosion", icon: "⊙", category: "refinery",
    description: "Assets, inspection points, thickness readings, corrosion rates, remaining life, RBI ranking, leaks, repairs, and next inspection dates.",
    reports: ["inspection_corrosion"],
    columns: [
      { key: "asset", label: "Asset / circuit", aliases: ["asset", "circuit", "equipment"], required: true },
      { key: "location", label: "Measurement location", aliases: ["measurement location", "location", "tml"] },
      { key: "date", label: "Inspection date", aliases: ["inspection date", "date"] },
      { key: "thickness", label: "Measured thickness", aliases: ["measured thickness", "thickness"] },
      { key: "minimum", label: "Minimum allowable", aliases: ["minimum allowable", "minimum thickness"] },
      { key: "corrosionRate", label: "Corrosion rate", aliases: ["corrosion rate"] },
      { key: "remainingLife", label: "Remaining life", aliases: ["remaining life"] },
      { key: "rbi", label: "RBI risk", aliases: ["rbi", "risk ranking"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { "Asset / circuit": "10-P-401", "Measurement location": "TML-08", "Inspection date": "2026-07-12", "Measured thickness": 6.1, "Minimum allowable": 5.4, "Corrosion rate": 0.18, "Remaining life": "3.9 years", "RBI risk": "High", Status: "Repair planned" },
      { "Asset / circuit": "V-210", "Measurement location": "Shell course 2", "Inspection date": "2026-07-15", "Measured thickness": 12.8, "Minimum allowable": 10.2, "Corrosion rate": 0.09, "Remaining life": "28.9 years", "RBI risk": "Medium", Status: "Acceptable" }
    ]
  },
  production_operations: {
    title: "Production and operations", icon: "▰", category: "refinery",
    description: "Throughput, unit availability, production plan, actual production, yield, storage, off-spec product, losses, and operational events.",
    reports: ["production_operations"],
    columns: [
      { key: "date", label: "Date / period", aliases: ["date", "period"], required: true },
      { key: "unit", label: "Unit", aliases: ["unit", "plant"] },
      { key: "plannedThroughput", label: "Planned throughput", aliases: ["planned throughput", "plan"] },
      { key: "actualThroughput", label: "Actual throughput", aliases: ["actual throughput", "actual"] },
      { key: "availability", label: "Availability (%)", aliases: ["availability"] },
      { key: "yield", label: "Yield (%)", aliases: ["yield"] },
      { key: "offSpec", label: "Off-spec volume", aliases: ["off spec", "off-spec volume"] },
      { key: "loss", label: "Operational loss", aliases: ["operational loss", "loss"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { "Date / period": "2026-07-20", Unit: "Crude unit", "Planned throughput": 98000, "Actual throughput": 94500, "Availability (%)": 96.4, "Yield (%)": 92.1, "Off-spec volume": 420, "Operational loss": 3500, Status: "Watch" },
      { "Date / period": "2026-07-20", Unit: "Hydrotreater", "Planned throughput": 42000, "Actual throughput": 42500, "Availability (%)": 99.1, "Yield (%)": 95.8, "Off-spec volume": 0, "Operational loss": 0, Status: "On target" }
    ]
  },
  environmental_emissions: {
    title: "Environmental and emissions", icon: "♧", category: "refinery",
    description: "Air emissions, flaring, wastewater, spills, waste, water, energy, greenhouse gases, permit limits, monitoring source, and compliance status.",
    reports: ["environmental_incident", "environmental_emissions"],
    columns: [
      { key: "period", label: "Period", aliases: ["period", "date"], required: true },
      { key: "indicator", label: "Indicator", aliases: ["indicator", "parameter"] },
      { key: "current", label: "Current value", aliases: ["current value", "actual"] },
      { key: "unit", label: "Unit", aliases: ["unit", "uom"] },
      { key: "limit", label: "Limit / target", aliases: ["limit", "target"] },
      { key: "previous", label: "Previous value", aliases: ["previous", "prior value"] },
      { key: "source", label: "Monitoring source", aliases: ["monitoring source", "source"] },
      { key: "action", label: "Action", aliases: ["action"] },
      { key: "status", label: "Status", aliases: ["status", "compliance"] }
    ],
    sampleRows: [
      { Period: "2026-07", Indicator: "Flaring", "Current value": 18.6, Unit: "t", "Limit / target": 15, "Previous value": 16.2, "Monitoring source": "Flare meter", Action: "Reduce start-up flaring", Status: "Attention" },
      { Period: "2026-07", Indicator: "Wastewater COD", "Current value": 82, Unit: "mg/L", "Limit / target": 100, "Previous value": 79, "Monitoring source": "Laboratory", Action: "Monitor", Status: "Compliant" },
      { Period: "2026-07", Indicator: "Water consumption", "Current value": 42.1, Unit: "ML", "Limit / target": 40, "Previous value": 41.4, "Monitoring source": "Utility meter", Action: "Leak survey", Status: "Watch" }
    ]
  },
  commissioning_handover: {
    title: "Commissioning and handover", icon: "◆", category: "closeout",
    description: "System completion, pre-commissioning, tests, loop checks, energisation, punch items, readiness, dossiers, training, and client acceptance.",
    reports: ["commissioning_startup", "handover_closeout"],
    columns: [
      { key: "system", label: "System / package", aliases: ["system", "package"], required: true },
      { key: "mechanicalComplete", label: "Mechanical complete", aliases: ["mechanical complete", "mc"] },
      { key: "preCommissioning", label: "Pre-commissioning (%)", aliases: ["pre-commissioning", "precommissioning"] },
      { key: "tests", label: "Tests", aliases: ["tests", "test status"] },
      { key: "punchA", label: "Category A punch", aliases: ["category a punch", "punch a"] },
      { key: "documents", label: "Documents complete (%)", aliases: ["documents complete", "dossier completion"] },
      { key: "training", label: "Training", aliases: ["training"] },
      { key: "acceptance", label: "Client acceptance", aliases: ["client acceptance", "acceptance"] },
      { key: "status", label: "Status", aliases: ["status"] }
    ],
    sampleRows: [
      { "System / package": "Cooling water", "Mechanical complete": "Yes", "Pre-commissioning (%)": 100, Tests: "Complete", "Category A punch": 0, "Documents complete (%)": 100, Training: "Complete", "Client acceptance": "Accepted", Status: "Closed" },
      { "System / package": "Firewater", "Mechanical complete": "Yes", "Pre-commissioning (%)": 92, Tests: "Pressure test complete", "Category A punch": 1, "Documents complete (%)": 88, Training: "Scheduled", "Client acceptance": "Conditional", Status: "Watch" },
      { "System / package": "Control system", "Mechanical complete": "No", "Pre-commissioning (%)": 72, Tests: "Loop checks ongoing", "Category A punch": 2, "Documents complete (%)": 61, Training: "Not started", "Client acceptance": "Pending", Status: "Attention" }
    ]
  }
};

let datasetLibraryFilter = "all";
let datasetLibrarySearch = "";
let activeDatasetId = "project_performance";


let reportLibraryFilter = "all";
let reportLibrarySearch = "";


let activeReportType = "full";

let state = {
  project: loadJson("civentraq_project", DEFAULT_PROJECT),
  projects: loadJson("civentraq_projects", [DEFAULT_PROJECT]),
  rows: loadJson("civentraq_rows", SAMPLE_ROWS),
  importHistory: loadJson("civentraq_imports", []),
  datasets: loadJson("civentraq_datasets", []),
  ignoredInsights: loadJson("civentraq_ignored_insights", {}),
  customization: mergeCustomization(loadJson("civentraq_customization", DEFAULT_CUSTOMIZATION)),
  rawRows: [],
  headers: [],
  mapping: {},
  datasetRawRows: [],
  datasetHeaders: [],
  datasetCurrentFile: null,
  charts: {}
};

const els = {};
document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  ensureDatasetLibrary();
  populateVisualSelects();
  renderReportLibrary();
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
    "costChartType", "progressChartType", "categoryChartType", "customCostChartType", "customProgressChartType", "customCategoryChartType", "customChartPalette", "customLegendPosition", "customGridlines", "customChartFill", "customAnimations", "customBrandName", "customBrandTagline", "customBrandInitials", "customCompanyName",
    "customCompanySubtitle", "customCompanyInitials", "customReportTitle", "customReportFooter", "customLogoInput", "logoPreview", "logoPreviewInitials", "logoPreviewImage", "removeLogoButton", "showAllSectionsButton",
    "showNotice", "showKpis", "showCost", "showInsight", "showProgress", "showCategory", "showPackages", "showRisks",
    "chartPickerModal", "chartPickerSearch", "chartPickerCategories", "chartPickerTarget", "chartPickerCount", "chartPickerSelectedName", "chartPickerSelectedDescription",
    "costChartTypeLabel", "progressChartTypeLabel", "categoryChartTypeLabel", "customCostChartTypeLabel", "customProgressChartTypeLabel", "customCategoryChartTypeLabel",
    "reportLibrary", "reportSearch", "reportCategoryFilters", "reportCount",
    "datasetGrid", "datasetSearch", "datasetCategoryFilters", "datasetCount", "datasetTotalKpi", "datasetConnectedKpi", "datasetRowsKpi", "datasetReportsKpi",
    "addDatasetButton", "downloadAllTemplatesButton", "datasetPickerModal", "datasetPickerSearch", "datasetTemplateGrid", "datasetDetailModal", "datasetDetailIcon", "datasetDetailCategory", "datasetDetailTitle", "datasetDetailDescription", "datasetDetailStatus", "datasetDetailStats", "datasetDetailReports", "datasetDetailPreviewNote", "datasetDetailTable", "clearDatasetButton", "datasetSampleButton", "datasetTemplateButton", "datasetUploadButton",
    "datasetUploadModal", "datasetUploadTitle", "datasetUploadDescription", "datasetDropZone", "datasetFileInput", "datasetFilePreview", "datasetMatchPreview", "connectDatasetButton"
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
  els.reportLibrary?.addEventListener("click", event => {
    const button = event.target.closest(".report-generate");
    if (button) openExportModal(button.dataset.reportType);
  });
  els.reportSearch?.addEventListener("input", event => {
    reportLibrarySearch = event.target.value.trim().toLowerCase();
    renderReportLibrary();
  });
  els.reportCategoryFilters?.addEventListener("click", event => {
    const button = event.target.closest("[data-report-category]");
    if (!button) return;
    reportLibraryFilter = button.dataset.reportCategory;
    renderReportLibrary();
  });
  els.addDatasetButton?.addEventListener("click", openDatasetPicker);
  els.downloadAllTemplatesButton?.addEventListener("click", downloadDatasetTemplatePack);
  els.datasetSearch?.addEventListener("input", event => {
    datasetLibrarySearch = event.target.value.trim().toLowerCase();
    renderDatasets();
  });
  els.datasetCategoryFilters?.addEventListener("click", event => {
    const button = event.target.closest("[data-dataset-category]");
    if (!button) return;
    datasetLibraryFilter = button.dataset.datasetCategory;
    renderDatasets();
  });
  els.datasetGrid?.addEventListener("click", event => {
    const action = event.target.closest("[data-dataset-action]");
    if (!action) return;
    const id = action.dataset.datasetId;
    if (action.dataset.datasetAction === "open") openDatasetDetail(id);
    else if (action.dataset.datasetAction === "upload") openDatasetUpload(id);
    else if (action.dataset.datasetAction === "template") downloadDatasetTemplate(id);
    else if (action.dataset.datasetAction === "sample") loadDatasetSample(id);
  });
  els.datasetPickerSearch?.addEventListener("input", () => renderDatasetPicker(els.datasetPickerSearch.value));
  els.datasetTemplateGrid?.addEventListener("click", event => {
    const card = event.target.closest("[data-dataset-template]");
    if (!card) return;
    closeModal(els.datasetPickerModal);
    openDatasetDetail(card.dataset.datasetTemplate);
  });
  document.querySelectorAll("[data-close-dataset-picker]").forEach(el => el.addEventListener("click", () => closeModal(els.datasetPickerModal)));
  document.querySelectorAll("[data-close-dataset-detail]").forEach(el => el.addEventListener("click", () => closeModal(els.datasetDetailModal)));
  document.querySelectorAll("[data-close-dataset-upload]").forEach(el => el.addEventListener("click", () => closeModal(els.datasetUploadModal)));
  els.datasetUploadButton?.addEventListener("click", () => openDatasetUpload(activeDatasetId));
  els.datasetTemplateButton?.addEventListener("click", () => downloadDatasetTemplate(activeDatasetId));
  els.datasetSampleButton?.addEventListener("click", () => loadDatasetSample(activeDatasetId, true));
  els.clearDatasetButton?.addEventListener("click", () => clearDataset(activeDatasetId));
  els.datasetFileInput?.addEventListener("change", event => handleDatasetFile(event.target.files[0]));
  ["dragenter", "dragover"].forEach(type => els.datasetDropZone?.addEventListener(type, event => {
    event.preventDefault();
    els.datasetDropZone.classList.add("dragging");
  }));
  ["dragleave", "drop"].forEach(type => els.datasetDropZone?.addEventListener(type, event => {
    event.preventDefault();
    els.datasetDropZone.classList.remove("dragging");
  }));
  els.datasetDropZone?.addEventListener("drop", event => handleDatasetFile(event.dataTransfer.files[0]));
  els.connectDatasetButton?.addEventListener("click", processDatasetImport);

  document.querySelectorAll("[data-open-chart-picker]").forEach(button => {
    button.addEventListener("click", () => openChartPicker(button.dataset.openChartPicker));
  });
  document.querySelectorAll("[data-close-chart-picker]").forEach(element => element.addEventListener("click", closeChartPicker));
  els.chartPickerSearch?.addEventListener("input", () => renderChartPicker(activeChartPickerKind, els.chartPickerSearch.value));
  els.chartPickerCategories?.addEventListener("click", event => {
    const option = event.target.closest("[data-visual-type]");
    if (option) selectVisual(activeChartPickerKind, option.dataset.visualType);
  });
  ["cost", "progress", "category"].forEach(kind => {
    const selector = els[`${kind}ChartType`];
    if (!selector) return;
    selector.addEventListener("change", () => {
      state.customization = mergeCustomization({ ...state.customization, [`${kind}ChartType`]: selector.value });
      syncChartTypeControls();
      saveState();
      renderCharts(calculateMetrics());
      showToast(`${chartTypeLabel(kind, selector.value)} selected.`);
    });
  });
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
  window.addEventListener("resize", () => {
    clearTimeout(chartResizeTimer);
    chartResizeTimer = setTimeout(() => renderCharts(calculateMetrics()), 160);
  });
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
  renderDatasets();
  renderReportLibrary();
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
  Object.values(state.charts).forEach(chart => chart?.destroy?.());
  state.charts = {};
  syncChartTypeControls();

  const visualData = {
    cost: buildVisualData("cost", m),
    progress: buildVisualData("progress", m),
    category: buildVisualData("category", m)
  };

  renderVisualPanel("cost", "costChart", state.customization.costChartType, visualData.cost, m);
  renderVisualPanel("progress", "progressChart", state.customization.progressChartType, visualData.progress, m);
  renderVisualPanel("category", "categoryChart", state.customization.categoryChartType, visualData.category, m);
}

function buildVisualData(kind, m) {
  const labels = m.rows.map(row => shortDate(row.date));
  if (kind === "cost") {
    let plannedCumulative = 0;
    let actualCumulative = 0;
    const planned = m.rows.map(row => plannedCumulative += validNumber(row.plannedCost));
    const actual = m.rows.map(row => actualCumulative += validNumber(row.actualCost));
    return {
      kind,
      labels,
      series: [
        { label: "Planned cost", values: planned },
        { label: "Actual cost", values: actual }
      ],
      primary: actual,
      secondary: planned,
      increments: m.rows.map(row => validNumber(row.actualCost)),
      current: m.actualTotal,
      target: state.project.approvedBudget,
      currentLabel: "Actual spend",
      targetLabel: "Approved budget",
      varianceLabel: m.predictedFinalCost <= state.project.approvedBudget ? "Forecast within budget" : "Forecast over budget",
      formatter: compactMoney,
      axisMax: undefined,
      unit: "money"
    };
  }

  if (kind === "progress") {
    const planned = m.rows.map(row => validNumber(row.plannedProgress));
    const actual = m.rows.map(row => validNumber(row.actualProgress));
    return {
      kind,
      labels,
      series: [
        { label: "Planned progress", values: planned },
        { label: "Actual progress", values: actual }
      ],
      primary: actual,
      secondary: planned,
      increments: actual.map((value, index) => index ? Math.max(0, value - actual[index - 1]) : value),
      current: m.actualProgress,
      target: m.plannedProgress || 100,
      currentLabel: "Actual progress",
      targetLabel: "Planned progress",
      varianceLabel: `${Math.abs(round(m.progressVariance))}% ${m.progressVariance < 0 ? "behind" : "ahead of"} plan`,
      formatter: value => `${round(value)}%`,
      axisMax: 100,
      unit: "percent"
    };
  }

  const categoryEntries = Object.entries(m.categories);
  const categoryLabels = categoryEntries.map(([label]) => label);
  const values = categoryEntries.map(([, value]) => validNumber(value));
  const average = values.length ? values.reduce((sumValue, value) => sumValue + value, 0) / values.length : 0;
  const largestIndex = values.indexOf(Math.max(...values, 0));
  return {
    kind,
    labels: categoryLabels,
    series: [{ label: "Actual spend", values }],
    primary: values,
    secondary: values.map(() => average),
    increments: values,
    current: values[largestIndex] || 0,
    target: m.actualTotal || 1,
    currentLabel: categoryLabels[largestIndex] ? `${categoryLabels[largestIndex]} spend` : "Largest category",
    targetLabel: "Total actual spend",
    varianceLabel: `${m.actualTotal ? ((values[largestIndex] || 0) / m.actualTotal * 100).toFixed(1) : 0}% of total spend`,
    formatter: compactMoney,
    axisMax: undefined,
    unit: "money"
  };
}

function renderVisualPanel(kind, canvasId, requestedType, data, metrics) {
  const type = normaliseChartType(kind, requestedType);
  const canvas = document.getElementById(canvasId);
  const wrap = canvas?.closest(".chart-wrap");
  if (!canvas || !wrap) return;

  wrap.dataset.visualType = type;
  wrap.classList.toggle("doughnut", ["doughnut", "pie", "polar_area", "gauge"].includes(type));
  wrap.classList.toggle("category-bars", ["clustered_bar", "stacked_bar", "stacked100_bar", "funnel"].includes(type));
  wrap.classList.toggle("custom-canvas-visual", isCustomCanvasVisual(type));

  if (isCustomCanvasVisual(type)) {
    drawCustomVisual(canvas, type, data, metrics);
    state.charts[kind] = null;
    return;
  }

  if (typeof Chart === "undefined") {
    drawUnavailableChart(canvas, VISUAL_DEFINITIONS[type]?.label || "Chart");
    return;
  }

  resetCanvasForChart(canvas);
  state.charts[kind] = createChartJsVisual(canvas, type, data);
}

function isCustomCanvasVisual(type) {
  return [
    "treemap", "map", "filled_map", "shape_map", "point_map", "card", "multi_row_card", "kpi",
    "slicer", "tile_slicer", "table", "matrix", "decomposition_tree", "key_influencers", "qa"
  ].includes(type);
}

function resetCanvasForChart(canvas) {
  canvas.style.width = "";
  canvas.style.height = "";
  canvas.removeAttribute("width");
  canvas.removeAttribute("height");
}

function createChartJsVisual(canvas, type, data) {
  const theme = getChartTheme();
  const lineStyle = getLineStyle();
  const c = state.customization;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = cssVar("--muted") || "#697582";
  const colors = theme.palette;
  const formatter = data.formatter;

  const datasetBase = data.series.map((series, index) => ({
    label: series.label,
    data: series.values,
    borderColor: index === 0 ? theme.secondary : theme.primary,
    backgroundColor: hexToRgba(index === 0 ? theme.secondary : theme.primary, index === 0 ? .58 : .82),
    borderWidth: 1.5,
    borderRadius: 6
  }));

  const commonOptions = visualChartOptions(data);

  if (["clustered_column", "clustered_bar", "stacked_column", "stacked_bar", "stacked100_column", "stacked100_bar"].includes(type)) {
    const horizontal = type.endsWith("_bar");
    const isStacked = type.includes("stacked");
    const isPercent = type.includes("stacked100");
    let labels = data.labels;
    let datasets = datasetBase;

    if (data.kind === "category" && isStacked) {
      const total = Math.max(1, data.primary.reduce((sumValue, value) => sumValue + value, 0));
      labels = ["Total spend"];
      datasets = data.labels.map((label, index) => ({
        label,
        data: [isPercent ? data.primary[index] / total * 100 : data.primary[index]],
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1,
        borderRadius: 4
      }));
    } else if (isPercent) {
      datasets = data.series.map((series, seriesIndex) => ({
        ...datasetBase[seriesIndex],
        data: series.values.map((value, pointIndex) => {
          const total = data.series.reduce((sumValue, current) => sumValue + Math.abs(validNumber(current.values[pointIndex])), 0) || 1;
          return Math.abs(validNumber(value)) / total * 100;
        })
      }));
    }

    return new Chart(canvas, {
      type: "bar",
      data: { labels, datasets },
      options: {
        ...commonOptions,
        indexAxis: horizontal ? "y" : "x",
        interaction: { mode: "index", intersect: false },
        plugins: {
          ...commonOptions.plugins,
          tooltip: { callbacks: { label: context => `${context.dataset.label}: ${isPercent ? `${validNumber(context.raw).toFixed(1)}%` : formatter(context.raw)}` } }
        },
        scales: horizontal
          ? {
              x: { ...gridOptions(), beginAtZero: true, stacked: isStacked, max: isPercent ? 100 : undefined, ticks: { callback: value => isPercent ? `${value}%` : formatter(value), color: cssVar("--muted"), font: { size: 10 } } },
              y: { ...gridOptions(), stacked: isStacked }
            }
          : {
              x: { ...gridOptions(), stacked: isStacked },
              y: { ...gridOptions(), beginAtZero: true, stacked: isStacked, max: isPercent ? 100 : data.axisMax, ticks: { callback: value => isPercent ? `${value}%` : formatter(value), color: cssVar("--muted"), font: { size: 10 } } }
            }
      }
    });
  }

  if (["line", "area", "stacked_area", "stacked100_area", "ribbon", "stepped_line"].includes(type)) {
    const isArea = ["area", "stacked_area", "stacked100_area", "ribbon"].includes(type);
    const isPercent = type === "stacked100_area";
    const isStacked = ["stacked_area", "stacked100_area"].includes(type);
    const datasets = data.series.map((series, index) => {
      let values = series.values;
      if (isPercent) {
        values = values.map((value, pointIndex) => {
          const total = data.series.reduce((sumValue, current) => sumValue + Math.abs(validNumber(current.values[pointIndex])), 0) || 1;
          return Math.abs(validNumber(value)) / total * 100;
        });
      }
      const color = index === 0 ? theme.secondary : theme.primary;
      return {
        label: series.label,
        data: values,
        borderColor: color,
        backgroundColor: hexToRgba(color, type === "ribbon" ? .23 : index === 0 ? .12 : .2),
        borderDash: index === 0 && type !== "stepped_line" ? [6, 5] : undefined,
        ...lineStyle,
        stepped: type === "stepped_line",
        fill: type === "ribbon" ? (index === 1 ? "-1" : false) : isArea,
        pointRadius: type === "ribbon" ? 1.8 : 3,
        pointHoverRadius: 5,
        tension: type === "stepped_line" ? 0 : lineStyle.tension
      };
    });
    return new Chart(canvas, {
      type: "line",
      data: { labels: data.labels, datasets },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          tooltip: { callbacks: { label: context => `${context.dataset.label}: ${isPercent ? `${validNumber(context.raw).toFixed(1)}%` : formatter(context.raw)}` } }
        },
        scales: {
          x: { ...gridOptions(), stacked: isStacked },
          y: { ...gridOptions(), beginAtZero: true, stacked: isStacked, max: isPercent ? 100 : data.axisMax, ticks: { callback: value => isPercent ? `${value}%` : formatter(value), color: cssVar("--muted"), font: { size: 10 } } }
        }
      }
    });
  }

  if (type === "combo") {
    const first = data.series[0];
    const second = data.series[1] || { label: "Average", values: data.primary.map(() => data.primary.reduce((sumValue, value) => sumValue + value, 0) / Math.max(1, data.primary.length)) };
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          { type: "bar", label: first.label, data: first.values, backgroundColor: hexToRgba(theme.secondary, .58), borderColor: theme.secondary, borderWidth: 1, borderRadius: 6 },
          { type: "line", label: second.label, data: second.values, borderColor: theme.primary, backgroundColor: hexToRgba(theme.primary, .12), ...lineStyle, pointRadius: 3, borderWidth: 2.4 }
        ]
      },
      options: commonOptions
    });
  }

  if (type === "radar") {
    return new Chart(canvas, {
      type: "radar",
      data: {
        labels: data.labels,
        datasets: data.series.map((series, index) => ({
          label: series.label,
          data: series.values,
          borderColor: index === 0 ? theme.secondary : theme.primary,
          backgroundColor: hexToRgba(index === 0 ? theme.secondary : theme.primary, .16),
          pointBackgroundColor: index === 0 ? theme.secondary : theme.primary,
          borderWidth: 2
        }))
      },
      options: {
        ...radarChartOptions(),
        scales: {
          r: {
            ...radarChartOptions().scales.r,
            max: data.axisMax || Math.max(...data.primary, ...data.secondary, 1) * 1.15,
            ticks: { display: false }
          }
        },
        plugins: { ...radarChartOptions().plugins, tooltip: { callbacks: { label: context => `${context.dataset.label}: ${formatter(context.raw)}` } } }
      }
    });
  }

  if (type === "waterfall") {
    let running = 0;
    const floating = data.increments.map(value => {
      const start = running;
      running += validNumber(value);
      return [start, running];
    });
    const labels = [...data.labels, "Total"];
    const values = [...floating, [0, running]];
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Movement",
          data: values,
          backgroundColor: values.map((value, index) => index === values.length - 1 ? theme.primary : (value[1] >= value[0] ? hexToRgba(theme.primary, .78) : "#d45f5f")),
          borderColor: values.map((value, index) => index === values.length - 1 ? theme.primary : (value[1] >= value[0] ? theme.primary : "#b43f3f")),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        ...commonOptions,
        plugins: { ...commonOptions.plugins, legend: { display: false }, tooltip: { callbacks: { label: context => formatter(context.raw[1] - context.raw[0]) } } },
        scales: { x: gridOptions(), y: { ...gridOptions(), beginAtZero: true, ticks: { callback: formatter, color: cssVar("--muted"), font: { size: 10 } } } }
      }
    });
  }

  if (type === "funnel") {
    const rows = data.labels.map((label, index) => ({ label, value: validNumber(data.primary[index]) })).sort((a, b) => b.value - a.value);
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map(row => row.label),
        datasets: [{ label: data.currentLabel, data: rows.map(row => row.value), backgroundColor: rows.map((row, index) => hexToRgba(colors[index % colors.length], .82)), borderRadius: 6 }]
      },
      options: {
        ...commonOptions,
        indexAxis: "y",
        plugins: { ...commonOptions.plugins, legend: { display: false }, tooltip: { callbacks: { label: context => formatter(context.raw) } } },
        scales: { x: { display: false, beginAtZero: true }, y: { ...gridOptions(), grid: { display: false } } }
      }
    });
  }

  if (["scatter", "bubble"].includes(type)) {
    const maxValue = Math.max(...data.primary.map(value => Math.abs(validNumber(value))), 1);
    const points = data.primary.map((value, index) => ({
      x: validNumber(data.secondary[index] ?? index + 1),
      y: validNumber(value),
      r: type === "bubble" ? 5 + Math.sqrt(Math.abs(validNumber(value)) / maxValue) * 12 : undefined,
      label: data.labels[index]
    }));
    return new Chart(canvas, {
      type,
      data: { datasets: [{ label: data.currentLabel, data: points, backgroundColor: hexToRgba(theme.primary, .72), borderColor: theme.primary, borderWidth: 1.2 }] },
      options: {
        ...commonOptions,
        interaction: { mode: "nearest", intersect: true },
        plugins: { ...commonOptions.plugins, legend: { display: false }, tooltip: { callbacks: { label: context => `${context.raw.label}: ${formatter(context.raw.y)}` } } },
        scales: {
          x: { ...gridOptions(), beginAtZero: true, ticks: { callback: formatter, color: cssVar("--muted"), font: { size: 10 } }, title: { display: true, text: data.kind === "category" ? "Category average" : data.targetLabel, color: cssVar("--muted") } },
          y: { ...gridOptions(), beginAtZero: true, max: data.axisMax, ticks: { callback: formatter, color: cssVar("--muted"), font: { size: 10 } }, title: { display: true, text: data.currentLabel, color: cssVar("--muted") } }
        }
      }
    });
  }

  if (["pie", "doughnut", "polar_area"].includes(type)) {
    const chartType = type === "polar_area" ? "polarArea" : type;
    return new Chart(canvas, {
      type: chartType,
      data: { labels: data.labels, datasets: [{ data: data.primary, backgroundColor: colors, borderColor: c.surface, borderWidth: type === "polar_area" ? 2 : 1, hoverOffset: 7 }] },
      options: {
        ...circularChartOptions(chartType),
        cutout: type === "doughnut" ? "66%" : undefined,
        plugins: { ...circularChartOptions(chartType).plugins, tooltip: { callbacks: { label: context => `${context.label}: ${formatter(context.raw)}` } } }
      }
    });
  }

  if (type === "gauge") {
    const percent = Math.max(0, Math.min(100, data.target ? data.current / data.target * 100 : data.current));
    const centerTextPlugin = {
      id: `gaugeText-${Math.random()}`,
      afterDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const x = (chartArea.left + chartArea.right) / 2;
        const y = chartArea.bottom - 14;
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = cssVar("--text") || "#17202a";
        ctx.font = `700 24px ${getComputedStyle(document.body).fontFamily}`;
        ctx.fillText(`${Math.round(percent)}%`, x, y - 10);
        ctx.fillStyle = cssVar("--muted") || "#697582";
        ctx.font = `600 10px ${getComputedStyle(document.body).fontFamily}`;
        ctx.fillText(data.currentLabel, x, y + 9);
        ctx.restore();
      }
    };
    return new Chart(canvas, {
      type: "doughnut",
      plugins: [centerTextPlugin],
      data: { labels: ["Current", "Remaining"], datasets: [{ data: [percent, Math.max(0, 100 - percent)], backgroundColor: [theme.primary, hexToRgba(theme.secondary, .22)], borderWidth: 0, circumference: 180, rotation: 270 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "72%", animation: c.animations ? undefined : false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => `${context.label}: ${context.raw.toFixed(1)}%` } } } }
    });
  }

  return createChartJsVisual(canvas, "line", data);
}

function visualChartOptions(data) {
  const formatter = data.formatter;
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: state.customization.animations ? undefined : false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: legendOptions(),
      tooltip: { callbacks: { label: context => `${context.dataset.label}: ${formatter(extractChartValue(context.raw))}` } }
    },
    scales: {
      x: gridOptions(),
      y: { ...gridOptions(), beginAtZero: true, max: data.axisMax, ticks: { callback: formatter, color: cssVar("--muted"), font: { size: 10 } } }
    }
  };
}

function extractChartValue(raw) {
  if (Array.isArray(raw)) return validNumber(raw[1]) - validNumber(raw[0]);
  if (raw && typeof raw === "object") return validNumber(raw.y ?? raw.r ?? 0);
  return validNumber(raw);
}

function prepareCustomCanvas(canvas) {
  const wrap = canvas.closest(".chart-wrap");
  const rect = wrap?.getBoundingClientRect?.() || { width: 600, height: 320 };
  const width = Math.max(260, Math.floor(rect.width || 600));
  const height = Math.max(220, Math.floor(rect.height || 320));
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.textBaseline = "middle";
  return { ctx, width, height };
}

function drawUnavailableChart(canvas, name) {
  const { ctx, width, height } = prepareCustomCanvas(canvas);
  ctx.fillStyle = cssVar("--muted") || "#697582";
  ctx.textAlign = "center";
  ctx.font = `700 15px ${getComputedStyle(document.body).fontFamily}`;
  ctx.fillText(name, width / 2, height / 2 - 12);
  ctx.font = `500 12px ${getComputedStyle(document.body).fontFamily}`;
  ctx.fillText("The chart library could not load. Check your connection and refresh.", width / 2, height / 2 + 14);
}

function drawCustomVisual(canvas, type, data, metrics) {
  const { ctx, width, height } = prepareCustomCanvas(canvas);
  const theme = getChartTheme();
  const colors = theme.palette;
  const text = cssVar("--text") || "#17202a";
  const muted = cssVar("--muted") || "#697582";
  const border = cssVar("--border") || "#dfe5e9";
  const surface = cssVar("--surface") || "#ffffff";
  const font = getComputedStyle(document.body).fontFamily;
  ctx.font = `600 12px ${font}`;
  ctx.fillStyle = text;

  if (type === "treemap") return drawTreemapVisual(ctx, width, height, data, colors, text, muted, border, font);
  if (["map", "filled_map", "shape_map", "point_map"].includes(type)) return drawMapVisual(ctx, width, height, type, data, colors, text, muted, border, font);
  if (type === "card") return drawCardVisual(ctx, width, height, data, theme, text, muted, font);
  if (type === "multi_row_card") return drawMultiRowCardVisual(ctx, width, height, data, metrics, theme, text, muted, border, font);
  if (type === "kpi") return drawKpiVisual(ctx, width, height, data, theme, text, muted, border, font);
  if (["slicer", "tile_slicer"].includes(type)) return drawSlicerVisual(ctx, width, height, type, data, theme, text, muted, border, font);
  if (type === "table") return drawTableVisual(ctx, width, height, data, text, muted, border, font);
  if (type === "matrix") return drawMatrixVisual(ctx, width, height, data, colors, text, muted, border, font);
  if (type === "decomposition_tree") return drawDecompositionTreeVisual(ctx, width, height, data, colors, text, muted, border, font);
  if (type === "key_influencers") return drawInfluencersVisual(ctx, width, height, data, metrics, colors, text, muted, border, font);
  if (type === "qa") return drawQaVisual(ctx, width, height, data, metrics, theme, text, muted, border, surface, font);
}

function roundedCanvasRect(ctx, x, y, width, height, radius, fill, stroke = null) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

function fitCanvasText(ctx, value, maxWidth) {
  let text = String(value ?? "");
  if (ctx.measureText(text).width <= maxWidth) return text;
  while (text.length > 2 && ctx.measureText(`${text}…`).width > maxWidth) text = text.slice(0, -1);
  return `${text}…`;
}

function wrapCanvasText(ctx, value, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(value ?? "").split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
    else line = test;
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((current, index) => {
    const finalText = index === maxLines - 1 && lines.length > maxLines ? `${current.replace(/\.?$/, "")}…` : current;
    ctx.fillText(finalText, x, y + index * lineHeight);
  });
}

function drawTreemapVisual(ctx, width, height, data, colors, text, muted, border, font) {
  const items = data.labels.map((label, index) => ({ label, value: Math.max(0, validNumber(data.primary[index])) })).sort((a, b) => b.value - a.value);
  const total = items.reduce((sumValue, item) => sumValue + item.value, 0) || 1;
  const pad = 10;
  let x = pad;
  let y = pad;
  let remainingWidth = width - pad * 2;
  let remainingHeight = height - pad * 2;
  items.forEach((item, index) => {
    const remainingTotal = items.slice(index).reduce((sumValue, current) => sumValue + current.value, 0) || 1;
    const horizontal = remainingWidth >= remainingHeight;
    const ratio = item.value / remainingTotal;
    const blockWidth = horizontal ? Math.max(42, remainingWidth * ratio) : remainingWidth;
    const blockHeight = horizontal ? remainingHeight : Math.max(38, remainingHeight * ratio);
    roundedCanvasRect(ctx, x + 2, y + 2, Math.max(20, blockWidth - 4), Math.max(24, blockHeight - 4), 7, hexToRgba(colors[index % colors.length], .88), border);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${Math.max(10, Math.min(14, blockWidth / 10))}px ${font}`;
    ctx.fillText(fitCanvasText(ctx, item.label, blockWidth - 18), x + 11, y + 18);
    ctx.font = `600 10px ${font}`;
    ctx.fillText(fitCanvasText(ctx, data.formatter(item.value), blockWidth - 18), x + 11, y + 36);
    if (horizontal) { x += blockWidth; remainingWidth -= blockWidth; }
    else { y += blockHeight; remainingHeight -= blockHeight; }
  });
  ctx.fillStyle = muted;
}

function drawMapVisual(ctx, width, height, type, data, colors, text, muted, border, font) {
  ctx.save();
  ctx.fillStyle = hexToRgba(colors[0], .05);
  ctx.fillRect(0, 0, width, height);
  const scaleX = width / 640;
  const scaleY = height / 340;
  const polygons = [
    [[50,95],[105,48],[175,63],[198,105],[164,139],[110,132],[84,171],[43,143]],
    [[212,50],[275,42],[320,75],[307,116],[270,133],[241,103]],
    [[278,144],[326,128],[352,170],[339,230],[298,253],[265,203]],
    [[362,70],[442,50],[503,78],[550,120],[526,158],[459,151],[423,184],[371,154]],
    [[495,209],[548,197],[590,232],[568,276],[516,267]]
  ];
  polygons.forEach((points, index) => {
    ctx.beginPath();
    points.forEach(([px, py], pointIndex) => pointIndex ? ctx.lineTo(px * scaleX, py * scaleY) : ctx.moveTo(px * scaleX, py * scaleY));
    ctx.closePath();
    ctx.fillStyle = type === "filled_map" ? hexToRgba(colors[index % colors.length], .24 + index * .08) : hexToRgba(colors[0], .10);
    ctx.fill();
    ctx.strokeStyle = type === "shape_map" ? colors[index % colors.length] : border;
    ctx.lineWidth = type === "shape_map" ? 1.8 : 1;
    ctx.stroke();
  });

  const points = data.labels.slice(0, 6).map((label, index) => ({
    label,
    x: width * (.23 + ((index * 0.137) % .58)),
    y: height * (.25 + ((index * 0.19) % .5)),
    value: data.primary[index] || 0
  }));
  const maxValue = Math.max(...points.map(point => point.value), 1);
  points.forEach((point, index) => {
    const radius = type === "point_map" ? 5 + Math.sqrt(point.value / maxValue) * 9 : 5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  const locationX = width * .54;
  const locationY = height * .67;
  ctx.fillStyle = colors[0];
  ctx.beginPath();
  ctx.arc(locationX, locationY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(locationX - 5, locationY + 5);
  ctx.lineTo(locationX, locationY + 17);
  ctx.lineTo(locationX + 5, locationY + 5);
  ctx.closePath();
  ctx.fill();
  roundedCanvasRect(ctx, Math.min(width - 180, locationX + 13), locationY - 24, 165, 43, 7, "rgba(255,255,255,.94)", border);
  ctx.fillStyle = text;
  ctx.font = `700 11px ${font}`;
  ctx.fillText(fitCanvasText(ctx, state.project.location, 145), Math.min(width - 170, locationX + 22), locationY - 11);
  ctx.fillStyle = muted;
  ctx.font = `500 9px ${font}`;
  ctx.fillText(fitCanvasText(ctx, state.project.name, 145), Math.min(width - 170, locationX + 22), locationY + 6);
  ctx.restore();
}

function drawCardVisual(ctx, width, height, data, theme, text, muted, font) {
  const value = data.formatter(data.current);
  ctx.textAlign = "center";
  ctx.fillStyle = hexToRgba(theme.primary, .09);
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 5, Math.min(width, height) * .28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = text;
  ctx.font = `800 ${Math.max(34, Math.min(64, width / 8))}px ${font}`;
  ctx.fillText(value, width / 2, height / 2 - 12);
  ctx.fillStyle = muted;
  ctx.font = `700 12px ${font}`;
  ctx.fillText(data.currentLabel.toUpperCase(), width / 2, height / 2 + 35);
  ctx.font = `500 11px ${font}`;
  ctx.fillText(data.varianceLabel, width / 2, height / 2 + 58);
  ctx.textAlign = "left";
}

function drawMultiRowCardVisual(ctx, width, height, data, metrics, theme, text, muted, border, font) {
  const rows = [
    [data.currentLabel, data.formatter(data.current)],
    [data.targetLabel, data.formatter(data.target)],
    ["Variance / status", data.varianceLabel],
    ["Last reporting period", data.labels[data.labels.length - 1] || "No data"]
  ];
  const x = 18;
  const rowHeight = Math.min(58, (height - 28) / rows.length);
  rows.forEach(([label, value], index) => {
    const y = 12 + index * rowHeight;
    roundedCanvasRect(ctx, x, y, width - 36, rowHeight - 8, 8, index % 2 ? hexToRgba(theme.primary, .045) : "transparent", border);
    ctx.fillStyle = muted;
    ctx.font = `600 10px ${font}`;
    ctx.fillText(label.toUpperCase(), x + 14, y + 15);
    ctx.fillStyle = text;
    ctx.font = `800 ${index === 2 ? 13 : 18}px ${font}`;
    ctx.textAlign = "right";
    ctx.fillText(fitCanvasText(ctx, value, width * .55), width - 32, y + rowHeight / 2 + 4);
    ctx.textAlign = "left";
  });
}

function drawKpiVisual(ctx, width, height, data, theme, text, muted, border, font) {
  const direction = data.current >= data.target ? 1 : -1;
  const color = direction >= 0 ? theme.primary : "#d28a25";
  ctx.textAlign = "center";
  ctx.fillStyle = muted;
  ctx.font = `700 11px ${font}`;
  ctx.fillText(data.currentLabel.toUpperCase(), width / 2, 30);
  ctx.fillStyle = text;
  ctx.font = `800 ${Math.max(36, Math.min(60, width / 8))}px ${font}`;
  ctx.fillText(data.formatter(data.current), width / 2, 82);
  ctx.fillStyle = color;
  ctx.font = `800 16px ${font}`;
  ctx.fillText(`${direction >= 0 ? "▲" : "▼"} ${data.varianceLabel}`, width / 2, 121);
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, height - 75);
  ctx.lineTo(width - 28, height - 75);
  ctx.stroke();
  const values = data.primary.length ? data.primary : [0];
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = 32 + index * ((width - 64) / Math.max(1, values.length - 1));
    const y = height - 30 - ((value - minValue) / Math.max(1, maxValue - minValue)) * 40;
    index ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = muted;
  ctx.font = `600 10px ${font}`;
  ctx.fillText(`Target: ${data.formatter(data.target)}`, width / 2, height - 12);
  ctx.textAlign = "left";
}

function drawSlicerVisual(ctx, width, height, type, data, theme, text, muted, border, font) {
  const labels = data.labels.slice(0, 8);
  ctx.fillStyle = muted;
  ctx.font = `600 10px ${font}`;
  ctx.fillText("SELECT VALUES", 18, 18);
  if (type === "slicer") {
    roundedCanvasRect(ctx, 18, 31, width - 36, 36, 7, "transparent", border);
    ctx.fillStyle = text;
    ctx.font = `600 12px ${font}`;
    ctx.fillText("All project values", 31, 49);
    ctx.textAlign = "right";
    ctx.fillText("⌄", width - 32, 49);
    ctx.textAlign = "left";
    labels.forEach((label, index) => {
      const y = 85 + index * 27;
      if (y > height - 15) return;
      roundedCanvasRect(ctx, 20, y - 8, 14, 14, 3, index < 2 ? theme.primary : "transparent", border);
      if (index < 2) { ctx.fillStyle = "#fff"; ctx.font = `800 9px ${font}`; ctx.fillText("✓", 23, y); }
      ctx.fillStyle = text;
      ctx.font = `600 11px ${font}`;
      ctx.fillText(fitCanvasText(ctx, label, width - 66), 44, y);
    });
  } else {
    const columns = Math.max(2, Math.min(4, Math.floor(width / 145)));
    const gap = 10;
    const tileWidth = (width - 36 - gap * (columns - 1)) / columns;
    labels.forEach((label, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = 18 + col * (tileWidth + gap);
      const y = 34 + row * 58;
      if (y + 48 > height) return;
      roundedCanvasRect(ctx, x, y, tileWidth, 46, 8, index === 0 ? hexToRgba(theme.primary, .15) : "transparent", index === 0 ? theme.primary : border);
      ctx.fillStyle = index === 0 ? theme.primary : text;
      ctx.font = `700 11px ${font}`;
      ctx.textAlign = "center";
      ctx.fillText(fitCanvasText(ctx, label, tileWidth - 16), x + tileWidth / 2, y + 23);
      ctx.textAlign = "left";
    });
  }
}

function drawTableVisual(ctx, width, height, data, text, muted, border, font) {
  const x = 10;
  const top = 12;
  const tableWidth = width - 20;
  const rowHeight = Math.max(28, Math.min(38, (height - 24) / Math.min(7, data.labels.length + 1)));
  const columns = [tableWidth * .42, tableWidth * .29, tableWidth * .29];
  ctx.fillStyle = hexToRgba(getChartTheme().primary, .1);
  ctx.fillRect(x, top, tableWidth, rowHeight);
  const headers = [data.kind === "category" ? "Category" : "Period", data.series[0]?.label || "Value", data.series[1]?.label || "Variance"];
  let colX = x;
  headers.forEach((header, index) => {
    ctx.fillStyle = text;
    ctx.font = `800 10px ${font}`;
    ctx.fillText(fitCanvasText(ctx, header, columns[index] - 14), colX + 8, top + rowHeight / 2);
    colX += columns[index];
  });
  const count = Math.min(6, data.labels.length);
  for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
    const y = top + rowHeight * (rowIndex + 1);
    ctx.fillStyle = rowIndex % 2 ? hexToRgba(getChartTheme().secondary, .04) : "transparent";
    ctx.fillRect(x, y, tableWidth, rowHeight);
    ctx.strokeStyle = border;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + tableWidth, y); ctx.stroke();
    const first = data.primary[rowIndex] || 0;
    const second = data.series[1]?.values[rowIndex];
    const variance = second == null ? (first / Math.max(1, data.primary.reduce((sumValue, value) => sumValue + value, 0)) * 100) : first - second;
    const values = [data.labels[rowIndex], data.formatter(first), second == null ? `${variance.toFixed(1)}% share` : data.formatter(variance)];
    colX = x;
    values.forEach((value, index) => {
      ctx.fillStyle = index === 2 && validNumber(variance) < 0 ? "#c45a4d" : (index ? text : muted);
      ctx.font = `${index ? 700 : 600} 10px ${font}`;
      ctx.fillText(fitCanvasText(ctx, value, columns[index] - 14), colX + 8, y + rowHeight / 2);
      colX += columns[index];
    });
  }
  ctx.strokeStyle = border;
  ctx.strokeRect(x, top, tableWidth, rowHeight * (count + 1));
}

function drawMatrixVisual(ctx, width, height, data, colors, text, muted, border, font) {
  const labels = data.labels.slice(0, 6);
  const series = data.series.length > 1 ? data.series : [data.series[0], { label: "Share", values: data.primary.map(value => value / Math.max(1, data.primary.reduce((sumValue, current) => sumValue + current, 0)) * 100) }];
  const left = 88;
  const top = 38;
  const cellWidth = Math.max(54, (width - left - 14) / labels.length);
  const cellHeight = Math.max(44, (height - top - 18) / series.length);
  labels.forEach((label, index) => {
    ctx.save();
    ctx.translate(left + index * cellWidth + cellWidth / 2, top - 8);
    ctx.rotate(-.36);
    ctx.fillStyle = muted;
    ctx.font = `600 9px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText(fitCanvasText(ctx, label, cellWidth - 5), 0, 0);
    ctx.restore();
  });
  const allValues = series.flatMap(item => item.values.map(validNumber));
  const maxValue = Math.max(...allValues, 1);
  series.forEach((item, rowIndex) => {
    ctx.fillStyle = text;
    ctx.font = `700 10px ${font}`;
    ctx.fillText(fitCanvasText(ctx, item.label, left - 16), 10, top + rowIndex * cellHeight + cellHeight / 2);
    labels.forEach((label, columnIndex) => {
      const value = validNumber(item.values[columnIndex]);
      const x = left + columnIndex * cellWidth;
      const y = top + rowIndex * cellHeight;
      roundedCanvasRect(ctx, x + 2, y + 2, cellWidth - 4, cellHeight - 4, 5, hexToRgba(colors[rowIndex % colors.length], .08 + .74 * value / maxValue), border);
      ctx.fillStyle = value / maxValue > .55 ? "#fff" : text;
      ctx.font = `700 9px ${font}`;
      ctx.textAlign = "center";
      ctx.fillText(item.label === "Share" ? `${value.toFixed(1)}%` : data.formatter(value), x + cellWidth / 2, y + cellHeight / 2);
      ctx.textAlign = "left";
    });
  });
}

function drawDecompositionTreeVisual(ctx, width, height, data, colors, text, muted, border, font) {
  const rootX = 18;
  const rootY = height / 2 - 27;
  const rootW = Math.min(150, width * .24);
  roundedCanvasRect(ctx, rootX, rootY, rootW, 54, 8, hexToRgba(colors[0], .14), colors[0]);
  ctx.fillStyle = muted; ctx.font = `700 9px ${font}`; ctx.fillText(data.currentLabel.toUpperCase(), rootX + 11, rootY + 16);
  ctx.fillStyle = text; ctx.font = `800 15px ${font}`; ctx.fillText(data.formatter(data.current), rootX + 11, rootY + 36);
  const childItems = data.labels.map((label, index) => ({ label, value: data.primary[index] || 0 })).sort((a, b) => b.value - a.value).slice(0, 4);
  const childX = width * .43;
  const childW = Math.min(170, width * .27);
  const gap = 12;
  const childH = Math.min(48, (height - 28 - gap * (childItems.length - 1)) / Math.max(1, childItems.length));
  childItems.forEach((item, index) => {
    const y = 14 + index * (childH + gap);
    ctx.strokeStyle = border; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(rootX + rootW, rootY + 27); ctx.lineTo(childX - 12, rootY + 27); ctx.lineTo(childX - 12, y + childH / 2); ctx.lineTo(childX, y + childH / 2); ctx.stroke();
    roundedCanvasRect(ctx, childX, y, childW, childH, 7, hexToRgba(colors[(index + 1) % colors.length], .1), border);
    ctx.fillStyle = text; ctx.font = `700 10px ${font}`; ctx.fillText(fitCanvasText(ctx, item.label, childW - 18), childX + 9, y + 15);
    ctx.fillStyle = colors[(index + 1) % colors.length]; ctx.font = `800 11px ${font}`; ctx.fillText(data.formatter(item.value), childX + 9, y + childH - 12);
    const factorX = childX + childW + 25;
    if (factorX + 80 < width) {
      ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(childX + childW, y + childH / 2); ctx.lineTo(factorX, y + childH / 2); ctx.stroke();
      ctx.fillStyle = muted; ctx.font = `700 9px ${font}`; ctx.fillText(`${(item.value / Math.max(1, data.primary.reduce((sumValue, value) => sumValue + value, 0)) * 100).toFixed(0)}%`, factorX + 8, y + childH / 2);
    }
  });
}

function drawInfluencersVisual(ctx, width, height, data, metrics, colors, text, muted, border, font) {
  const factors = data.labels.map((label, index) => ({ label, value: Math.abs(validNumber(data.primary[index] - (data.secondary[index] || 0))) })).sort((a, b) => b.value - a.value).slice(0, 5);
  if (!factors.some(item => item.value)) {
    factors.splice(0, factors.length, ...metrics.scoreFactors.slice(0, 5).map(factor => ({ label: factor.title, value: factor.points })));
  }
  const maxValue = Math.max(...factors.map(item => item.value), 1);
  ctx.fillStyle = muted; ctx.font = `600 10px ${font}`; ctx.fillText("WHAT INFLUENCES THIS RESULT", 16, 17);
  factors.forEach((factor, index) => {
    const y = 42 + index * Math.min(52, (height - 52) / Math.max(1, factors.length));
    ctx.fillStyle = text; ctx.font = `700 10px ${font}`; ctx.fillText(fitCanvasText(ctx, factor.label, width * .36), 18, y);
    const barX = width * .42;
    const barW = (width - barX - 45) * factor.value / maxValue;
    roundedCanvasRect(ctx, barX, y - 8, width - barX - 28, 16, 8, hexToRgba(colors[index % colors.length], .08), null);
    roundedCanvasRect(ctx, barX, y - 8, Math.max(5, barW), 16, 8, colors[index % colors.length], null);
    ctx.fillStyle = muted; ctx.font = `700 9px ${font}`; ctx.textAlign = "right"; ctx.fillText(data.unit === "percent" ? `${factor.value.toFixed(1)} pts` : data.formatter(factor.value), width - 16, y); ctx.textAlign = "left";
  });
}

function drawQaVisual(ctx, width, height, data, metrics, theme, text, muted, border, surface, font) {
  roundedCanvasRect(ctx, 16, 16, width - 32, 46, 10, hexToRgba(theme.primary, .08), border);
  ctx.fillStyle = muted; ctx.font = `600 10px ${font}`; ctx.fillText("ASK A QUESTION ABOUT THIS VISUAL", 30, 30);
  ctx.fillStyle = text; ctx.font = `700 12px ${font}`; ctx.fillText("What is the main performance issue?", 30, 49);
  const answer = data.kind === "cost"
    ? (metrics.predictedFinalCost > state.project.approvedBudget ? `The final-cost forecast is above the approved budget. Review the fastest-growing cost categories and contingency use.` : `Actual spending is currently within budget. The main issue is the difference between planned and actual delivery progress.`)
    : data.kind === "progress"
      ? (metrics.progressVariance < 0 ? `Actual progress is ${Math.abs(round(metrics.progressVariance))}% behind plan. Prioritise delayed work packages and issue a recovery programme.` : `Actual progress is meeting or exceeding plan. Continue protecting critical milestones.`)
      : `The largest spend category is ${data.currentLabel.replace(/ spend$/i, "")}, representing ${data.varianceLabel}. Review whether this matches the approved cost plan.`;
  roundedCanvasRect(ctx, 44, 84, width - 60, Math.min(132, height - 105), 12, surface, border);
  ctx.fillStyle = theme.primary; ctx.font = `800 11px ${font}`; ctx.fillText("CIVENTRAQ ANSWER", 62, 104);
  ctx.fillStyle = text; ctx.font = `600 12px ${font}`;
  wrapCanvasText(ctx, answer, 62, 130, width - 98, 19, Math.max(3, Math.floor((height - 145) / 19)));
  ctx.fillStyle = muted; ctx.font = `500 9px ${font}`; ctx.fillText("Answer generated from the latest imported project data", 62, height - 17);
}

function percentageChartOptions() {
  return {
    ...chartOptions(value => `${value}%`),
    scales: { x: gridOptions(), y: { ...gridOptions(), beginAtZero: true, max: 100, ticks: { callback: value => `${value}%`, color: cssVar("--muted"), font: { size: 10 } } } }
  };
}

function radarChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: state.customization.animations ? undefined : false,
    plugins: {
      legend: legendOptions(),
      tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` } }
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        angleLines: { color: state.customization.gridlines ? (cssVar("--chart-grid") || "rgba(105,117,130,.10)") : "transparent" },
        grid: { color: state.customization.gridlines ? (cssVar("--chart-grid") || "rgba(105,117,130,.10)") : "transparent" },
        pointLabels: { color: cssVar("--muted"), font: { size: 10 } },
        ticks: { display: false, stepSize: 20 }
      }
    }
  };
}

function circularChartOptions(type) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: type === "doughnut" ? "66%" : undefined,
    animation: state.customization.animations ? undefined : false,
    plugins: {
      legend: legendOptions(),
      tooltip: { callbacks: { label: ctx => `${ctx.label}: ${formatMoney(ctx.raw)}` } }
    },
    scales: type === "polarArea" ? {
      r: {
        grid: { color: state.customization.gridlines ? (cssVar("--chart-grid") || "rgba(105,117,130,.10)") : "transparent" },
        angleLines: { color: state.customization.gridlines ? (cssVar("--chart-grid") || "rgba(105,117,130,.10)") : "transparent" },
        ticks: { display: false }
      }
    } : undefined
  };
}

function legendOptions() {
  return {
    position: state.customization.legendPosition,
    align: state.customization.legendPosition === "top" ? "end" : "center",
    labels: { usePointStyle: true, boxWidth: 8, padding: 15, font: { size: 10 }, color: cssVar("--muted") }
  };
}

function populateVisualSelects() {
  const options = ALL_VISUAL_TYPES.map(id => `<option value="${id}">${escapeHtml(VISUAL_DEFINITIONS[id].label)}</option>`).join("");
  ["costChartType", "progressChartType", "categoryChartType", "customCostChartType", "customProgressChartType", "customCategoryChartType"].forEach(id => {
    const select = document.getElementById(id);
    if (select) select.innerHTML = options;
  });
}

function panelVisualName(kind) {
  return ({ cost: "Cost performance", progress: "Schedule performance", category: "Spend by category" })[kind] || "Dashboard visual";
}

function openChartPicker(kind) {
  activeChartPickerKind = ["cost", "progress", "category"].includes(kind) ? kind : "cost";
  if (els.chartPickerSearch) els.chartPickerSearch.value = "";
  if (els.chartPickerTarget) els.chartPickerTarget.textContent = panelVisualName(activeChartPickerKind);
  renderChartPicker(activeChartPickerKind);
  openModal(els.chartPickerModal);
  setTimeout(() => els.chartPickerSearch?.focus(), 80);
}

function closeChartPicker() {
  closeModal(els.chartPickerModal);
}

function renderChartPicker(kind, search = "") {
  const query = normalise(search);
  const current = normaliseChartType(kind, state.customization[`${kind}ChartType`]);
  let visibleCount = 0;
  const html = VISUAL_CATALOG.map(group => {
    const visuals = group.visuals.filter(visual => !query || normalise(`${visual.label} ${visual.description} ${group.label}`).includes(query));
    if (!visuals.length) return "";
    visibleCount += visuals.length;
    return `<section class="visual-category">
      <div class="visual-category-heading"><span>${group.icon}</span><h3>${escapeHtml(group.label)}</h3><small>${visuals.length}</small></div>
      <div class="visual-option-grid">
        ${visuals.map(visual => `<button type="button" class="visual-option${visual.id === current ? " active" : ""}" data-visual-type="${visual.id}" title="${escapeAttr(visual.label)}">
          <span class="visual-thumb">${miniVisualSvg(visual.id)}</span>
          <span class="visual-option-name">${escapeHtml(visual.label)}</span>
          ${visual.id === current ? '<span class="visual-selected-check">✓</span>' : ""}
        </button>`).join("")}
      </div>
    </section>`;
  }).join("");

  els.chartPickerCategories.innerHTML = html || `<div class="visual-empty"><strong>No visuals found</strong><p>Try a broader search such as chart, map, card, table, or AI.</p></div>`;
  els.chartPickerCount.textContent = `${visibleCount} visual${visibleCount === 1 ? "" : "s"}`;
  const selected = VISUAL_DEFINITIONS[current];
  els.chartPickerSelectedName.textContent = selected?.label || "Chart";
  els.chartPickerSelectedDescription.textContent = selected?.description || "Choose a visual for this panel.";
}

function selectVisual(kind, requestedType) {
  const type = normaliseChartType(kind, requestedType);
  state.customization = mergeCustomization({ ...state.customization, [`${kind}ChartType`]: type });
  syncChartTypeControls();
  saveState();
  renderCharts(calculateMetrics());
  renderChartPicker(kind, els.chartPickerSearch?.value || "");
  showToast(`${VISUAL_DEFINITIONS[type]?.label || "Visual"} selected for ${panelVisualName(kind).toLowerCase()}.`);
  setTimeout(closeChartPicker, 160);
}

function miniVisualSvg(type) {
  const start = '<svg viewBox="0 0 72 52" aria-hidden="true" focusable="false">';
  const end = '</svg>';
  const axis = '<path d="M10 7v36h54" class="v-axis"/>';
  const barsV = '<rect x="17" y="27" width="8" height="16" rx="1"/><rect x="31" y="18" width="8" height="25" rx="1"/><rect x="45" y="10" width="8" height="33" rx="1"/>';
  const barsH = '<rect x="12" y="10" width="31" height="8" rx="1"/><rect x="12" y="23" width="45" height="8" rx="1"/><rect x="12" y="36" width="24" height="8" rx="1"/>';
  const line = '<polyline points="12,37 24,28 36,31 48,16 61,21" class="v-line"/><circle cx="12" cy="37" r="2"/><circle cx="24" cy="28" r="2"/><circle cx="36" cy="31" r="2"/><circle cx="48" cy="16" r="2"/><circle cx="61" cy="21" r="2"/>';
  const area = '<path d="M11 40L11 35L24 25L36 31L49 14L62 20L62 40Z" class="v-area"/><polyline points="11,35 24,25 36,31 49,14 62,20" class="v-line"/>';
  const stackedV = '<rect x="16" y="27" width="9" height="16"/><rect x="16" y="19" width="9" height="8" class="v-soft"/><rect x="32" y="22" width="9" height="21"/><rect x="32" y="12" width="9" height="10" class="v-soft"/><rect x="48" y="16" width="9" height="27"/><rect x="48" y="7" width="9" height="9" class="v-soft"/>';
  const stackedH = '<rect x="11" y="9" width="22" height="8"/><rect x="33" y="9" width="18" height="8" class="v-soft"/><rect x="11" y="22" width="32" height="8"/><rect x="43" y="22" width="15" height="8" class="v-soft"/><rect x="11" y="35" width="15" height="8"/><rect x="26" y="35" width="27" height="8" class="v-soft"/>';
  const pie = '<path d="M36 26L36 5A21 21 0 0 1 55 35Z"/><path d="M36 26L55 35A21 21 0 0 1 20 42Z" class="v-soft"/><path d="M36 26L20 42A21 21 0 0 1 36 5Z" class="v-faint"/>';
  const mapShape = '<path d="M10 19l8-8 10 3 7-6 9 7 9-2 8 8-5 9 4 8-10 5-9-4-8 5-9-6-10 1-5-9z" class="v-map"/>';
  const table = '<rect x="8" y="7" width="56" height="38" rx="2" class="v-outline"/><path d="M8 18h56M8 29h56M8 39h56M27 7v38M46 7v38" class="v-grid"/><rect x="8" y="7" width="56" height="11" class="v-soft"/>';
  let body = "";
  if (["clustered_column"].includes(type)) body = axis + barsV;
  else if (["clustered_bar"].includes(type)) body = axis + barsH;
  else if (["stacked_column", "stacked100_column"].includes(type)) body = axis + stackedV;
  else if (["stacked_bar", "stacked100_bar"].includes(type)) body = axis + stackedH;
  else if (["line", "stepped_line"].includes(type)) body = axis + (type === "stepped_line" ? '<polyline points="12,37 24,37 24,27 38,27 38,31 50,31 50,16 62,16" class="v-line"/>' : line);
  else if (["area", "stacked_area", "stacked100_area", "ribbon"].includes(type)) body = axis + area + (type !== "area" ? '<path d="M11 40L11 31L24 33L36 23L49 27L62 14L62 40Z" class="v-area v-secondary"/>' : "");
  else if (type === "combo") body = axis + '<g class="v-soft">' + barsV + '</g>' + line;
  else if (type === "waterfall") body = axis + '<rect x="15" y="29" width="9" height="14"/><rect x="28" y="22" width="9" height="9"/><rect x="41" y="22" width="9" height="12" class="v-negative"/><rect x="54" y="13" width="9" height="30" class="v-soft"/><path d="M24 29h4M37 22h4M50 34h4" class="v-grid"/>';
  else if (type === "funnel") body = '<path d="M8 8h56l-8 9H16z"/><path d="M17 21h38l-7 9H24z" class="v-soft"/><path d="M26 34h20l-6 10h-8z" class="v-faint"/>';
  else if (type === "scatter") body = axis + '<circle cx="20" cy="35" r="3"/><circle cx="30" cy="24" r="3" class="v-soft"/><circle cx="41" cy="31" r="3"/><circle cx="50" cy="17" r="3"/><circle cx="60" cy="12" r="3" class="v-soft"/>';
  else if (type === "bubble") body = axis + '<circle cx="21" cy="34" r="5"/><circle cx="34" cy="24" r="8" class="v-soft"/><circle cx="49" cy="31" r="4"/><circle cx="58" cy="15" r="10" class="v-faint"/>';
  else if (type === "pie") body = pie;
  else if (type === "doughnut") body = pie + '<circle cx="36" cy="26" r="10" class="v-hole"/>';
  else if (type === "polar_area") body = '<path d="M36 26L36 4A22 22 0 0 1 52 11Z"/><path d="M36 26L52 11A22 22 0 0 1 57 35Z" class="v-soft"/><path d="M36 26L57 35A22 22 0 0 1 17 43Z" class="v-faint"/><path d="M36 26L17 43A22 22 0 0 1 36 4Z" class="v-secondary"/>';
  else if (type === "treemap") body = '<rect x="7" y="7" width="34" height="38"/><rect x="43" y="7" width="22" height="22" class="v-soft"/><rect x="43" y="31" width="10" height="14" class="v-faint"/><rect x="55" y="31" width="10" height="14" class="v-secondary"/>';
  else if (["map", "filled_map", "shape_map", "point_map"].includes(type)) body = mapShape + (type === "filled_map" ? '<path d="M18 12l10 2 7-6 2 16-13 5-10-10z"/><path d="M38 24l15-11 8 8-5 9-15 2z" class="v-soft"/>' : type === "shape_map" ? '<path d="M15 18l14-3 7 11-9 13-13-4zM38 14l14 1 8 8-6 13-14-3z" class="v-outline"/>' : '<circle cx="26" cy="24" r="4"/><circle cx="46" cy="18" r="3"/><circle cx="51" cy="35" r="5" class="v-soft"/>');
  else if (type === "gauge") body = '<path d="M13 38a23 23 0 0 1 46 0" class="v-gauge-track"/><path d="M13 38a23 23 0 0 1 34-20" class="v-gauge"/><path d="M36 37l13-14" class="v-needle"/><circle cx="36" cy="37" r="3"/>';
  else if (type === "card") body = '<rect x="7" y="8" width="58" height="36" rx="5" class="v-outline"/><text x="36" y="29" text-anchor="middle" class="v-number">62%</text><text x="36" y="39" text-anchor="middle" class="v-caption">ACTUAL</text>';
  else if (type === "multi_row_card") body = '<rect x="6" y="6" width="60" height="40" rx="4" class="v-outline"/><path d="M9 19h54M9 32h54" class="v-grid"/><text x="12" y="15" class="v-caption">BUDGET</text><text x="50" y="15" class="v-small">R10m</text><text x="12" y="28" class="v-caption">SPEND</text><text x="50" y="28" class="v-small">R6.2m</text><text x="12" y="41" class="v-caption">VAR.</text><text x="50" y="41" class="v-small">8%</text>';
  else if (type === "kpi") body = '<text x="36" y="24" text-anchor="middle" class="v-number">92%</text><path d="M22 37l8-8 7 5 13-15" class="v-line"/><path d="M47 19h5v5" class="v-line"/><text x="36" y="48" text-anchor="middle" class="v-caption">TARGET 90%</text>';
  else if (type === "slicer") body = '<rect x="7" y="7" width="58" height="12" rx="2" class="v-outline"/><path d="M55 11l4 4 4-4" class="v-grid"/><rect x="8" y="25" width="8" height="8" class="v-outline"/><rect x="8" y="38" width="8" height="8" class="v-outline"/><path d="M21 29h34M21 42h27" class="v-grid"/>';
  else if (type === "tile_slicer") body = '<rect x="6" y="8" width="18" height="36" rx="3"/><rect x="27" y="8" width="18" height="36" rx="3" class="v-soft"/><rect x="48" y="8" width="18" height="36" rx="3" class="v-faint"/>';
  else if (["table", "matrix"].includes(type)) body = table + (type === "matrix" ? '<rect x="27" y="18" width="19" height="21" class="v-faint"/>' : "");
  else if (type === "decomposition_tree") body = '<path d="M13 26h14M27 26v-13h14M27 26v13h14M41 13h14M41 39h14" class="v-grid"/><rect x="5" y="20" width="10" height="12" rx="2"/><rect x="39" y="7" width="10" height="12" rx="2" class="v-soft"/><rect x="39" y="33" width="10" height="12" rx="2" class="v-faint"/><rect x="54" y="7" width="10" height="12" rx="2"/><rect x="54" y="33" width="10" height="12" rx="2" class="v-soft"/>';
  else if (type === "key_influencers") body = '<circle cx="13" cy="13" r="3"/><circle cx="13" cy="26" r="3"/><circle cx="13" cy="39" r="3"/><rect x="21" y="9" width="38" height="8" rx="2"/><rect x="21" y="22" width="29" height="8" rx="2" class="v-soft"/><rect x="21" y="35" width="20" height="8" rx="2" class="v-faint"/>';
  else if (type === "qa") body = '<path d="M8 8h35v27H24l-8 8v-8H8z" class="v-outline"/><text x="25" y="27" text-anchor="middle" class="v-number">?</text><path d="M46 18h18v19H53l-5 5v-5h-2z" class="v-soft"/>';
  else if (type === "radar") body = '<path d="M36 5l24 15-9 27H21L12 20z" class="v-outline"/><path d="M36 13l15 11-6 15H25l-5-15z" class="v-area"/><path d="M36 5v42M12 20l39 27M60 20L21 47" class="v-grid"/>';
  else body = axis + line;
  return `${start}${body}${end}`;
}

function normaliseChartType(kind, value) {
  const aliases = {
    bar: kind === "category" ? "clustered_bar" : "clustered_column",
    polarArea: "polar_area",
    column: "clustered_column"
  };
  const candidate = aliases[value] || value;
  const fallback = { cost: "line", progress: "clustered_column", category: "doughnut" };
  return ALL_VISUAL_TYPES.includes(candidate) ? candidate : fallback[kind] || "line";
}

function chartTypeLabel(kind, type) {
  const visual = VISUAL_DEFINITIONS[normaliseChartType(kind, type)];
  return visual?.label || "Chart type";
}

function syncChartTypeControls() {
  const mappings = [
    ["cost", "costChartType", "customCostChartType", "costChartTypeLabel", "customCostChartTypeLabel"],
    ["progress", "progressChartType", "customProgressChartType", "progressChartTypeLabel", "customProgressChartTypeLabel"],
    ["category", "categoryChartType", "customCategoryChartType", "categoryChartTypeLabel", "customCategoryChartTypeLabel"]
  ];
  mappings.forEach(([kind, quickId, customId, quickLabelId, customLabelId]) => {
    const value = normaliseChartType(kind, state.customization[`${kind}ChartType`]);
    state.customization[`${kind}ChartType`] = value;
    if (document.getElementById(quickId)) document.getElementById(quickId).value = value;
    if (document.getElementById(customId)) document.getElementById(customId).value = value;
    if (document.getElementById(quickLabelId)) document.getElementById(quickLabelId).textContent = VISUAL_DEFINITIONS[value].label;
    if (document.getElementById(customLabelId)) document.getElementById(customLabelId).textContent = VISUAL_DEFINITIONS[value].label;
    document.querySelectorAll(`[data-current-visual-icon="${kind}"]`).forEach(icon => icon.innerHTML = miniVisualSvg(value));
  });
}

function chartOptions(callback) {
  return {
    responsive: true, maintainAspectRatio: false, animation: state.customization.animations ? undefined : false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: legendOptions(), tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${callback(ctx.raw)}` } } },
    scales: { x: gridOptions(), y: { ...gridOptions(), beginAtZero: true, ticks: { callback, color: cssVar("--muted"), font: { size: 10 } } } }
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


function ensureDatasetLibrary() {
  const saved = new Map((Array.isArray(state.datasets) ? state.datasets : []).map(dataset => [dataset.id, dataset]));
  state.datasets = Object.entries(DATASET_TEMPLATES).map(([id, template]) => {
    const previous = saved.get(id) || {};
    const base = {
      id,
      name: template.title,
      status: "empty",
      source: "No file connected",
      fileName: "",
      rows: [],
      headers: [],
      mapping: {},
      quality: 0,
      updatedAt: ""
    };
    const merged = { ...base, ...previous, id, name: template.title };
    if (id === "project_performance") {
      const imported = state.importHistory.length > 0 || previous.status === "connected";
      return {
        ...merged,
        status: imported ? "connected" : "demo",
        source: imported ? (previous.source || state.importHistory[0]?.name || "Imported project data") : "Built-in demonstration data",
        fileName: imported ? (previous.fileName || state.importHistory[0]?.name || "") : "",
        rows: state.rows,
        headers: template.columns.map(column => column.key),
        quality: 100,
        updatedAt: previous.updatedAt || (imported ? state.importHistory[0]?.date : "20 Jul 2026") || "20 Jul 2026"
      };
    }
    return merged;
  });
}

function getDataset(id) {
  return state.datasets.find(dataset => dataset.id === id);
}

function getDatasetTemplate(id) {
  return DATASET_TEMPLATES[id];
}

function datasetStatusMeta(dataset) {
  if (dataset?.status === "connected") return { label: "Connected", className: "connected", description: "Live imported data" };
  if (dataset?.status === "demo") return { label: "Sample data", className: "demo", description: "Demonstration rows" };
  return { label: "Not connected", className: "empty", description: "Template ready" };
}

function datasetCategoryMeta(category) {
  return DATASET_CATEGORIES[category] || DATASET_CATEGORIES.core;
}

function datasetRowsCount(dataset) {
  return Array.isArray(dataset?.rows) ? dataset.rows.length : 0;
}

function connectedDatasetRows() {
  return state.datasets.reduce((total, dataset) => total + (dataset.status !== "empty" ? datasetRowsCount(dataset) : 0), 0);
}

function reportsWithDatasetData() {
  const reports = new Set();
  state.datasets.filter(dataset => dataset.status !== "empty").forEach(dataset => {
    getDatasetTemplate(dataset.id)?.reports.forEach(report => reports.add(report));
  });
  return reports.size;
}

function findDatasetForReport(reportType, includeEmpty = false) {
  const candidates = state.datasets.filter(dataset => getDatasetTemplate(dataset.id)?.reports.includes(reportType));
  const rank = { connected: 0, demo: 1, empty: 2 };
  candidates.sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3));
  return candidates.find(dataset => includeEmpty || (dataset.status !== "empty" && datasetRowsCount(dataset))) || (includeEmpty ? candidates[0] : null);
}

function renderDatasets() {
  if (!els.datasetGrid) return;
  const entries = state.datasets.map(dataset => ({ dataset, template: getDatasetTemplate(dataset.id) }));
  const categoryCounts = entries.reduce((counts, entry) => {
    counts[entry.template.category] = (counts[entry.template.category] || 0) + 1;
    return counts;
  }, {});

  els.datasetCategoryFilters.innerHTML = Object.entries(DATASET_CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, category]) => {
      const count = key === "all" ? entries.length : (categoryCounts[key] || 0);
      return `<button class="dataset-filter${datasetLibraryFilter === key ? " active" : ""}" type="button" data-dataset-category="${key}"><span>${escapeHtml(category.icon)}</span>${escapeHtml(category.label)}<b>${count}</b></button>`;
    }).join("");

  const filtered = entries.filter(({ dataset, template }) => {
    const matchesCategory = datasetLibraryFilter === "all" || template.category === datasetLibraryFilter;
    const reportNames = template.reports.map(key => REPORT_TYPES[key]?.title || key).join(" ");
    const fieldNames = template.columns.map(column => column.label).join(" ");
    const haystack = `${template.title} ${template.description} ${reportNames} ${fieldNames}`.toLowerCase();
    return matchesCategory && (!datasetLibrarySearch || haystack.includes(datasetLibrarySearch));
  });

  els.datasetTotalKpi.textContent = state.datasets.length;
  els.datasetConnectedKpi.textContent = state.datasets.filter(dataset => dataset.status === "connected").length;
  els.datasetRowsKpi.textContent = connectedDatasetRows().toLocaleString("en-ZA");
  els.datasetReportsKpi.textContent = reportsWithDatasetData();
  els.datasetCount.textContent = `${filtered.length} dataset${filtered.length === 1 ? "" : "s"}`;

  if (!filtered.length) {
    els.datasetGrid.innerHTML = `<div class="dataset-empty"><strong>No datasets match your search.</strong><p>Try a different word or choose another category.</p></div>`;
    return;
  }

  els.datasetGrid.innerHTML = filtered.map(({ dataset, template }) => {
    const status = datasetStatusMeta(dataset);
    const category = datasetCategoryMeta(template.category);
    const rows = datasetRowsCount(dataset);
    const reports = template.reports.length;
    const fields = template.columns.length;
    return `
      <article class="dataset-card ${status.className}" data-dataset-card="${escapeAttr(dataset.id)}">
        <div class="dataset-card-top">
          <span class="dataset-icon">${escapeHtml(template.icon)}</span>
          <span class="dataset-status-badge ${status.className}">${escapeHtml(status.label)}</span>
        </div>
        <div class="dataset-category-label">${escapeHtml(category.label)}</div>
        <h3>${escapeHtml(template.title)}</h3>
        <p>${escapeHtml(template.description)}</p>
        <div class="dataset-metrics">
          <span><strong>${rows.toLocaleString("en-ZA")}</strong><small>Rows</small></span>
          <span><strong>${fields}</strong><small>Expected fields</small></span>
          <span><strong>${reports}</strong><small>Linked reports</small></span>
        </div>
        <div class="dataset-source"><span>Source</span><strong title="${escapeAttr(dataset.source || "No file connected")}">${escapeHtml(dataset.source || "No file connected")}</strong></div>
        <div class="dataset-card-actions">
          <button class="button secondary" type="button" data-dataset-action="open" data-dataset-id="${escapeAttr(dataset.id)}">Open</button>
          <button class="button primary" type="button" data-dataset-action="upload" data-dataset-id="${escapeAttr(dataset.id)}">${dataset.status === "empty" ? "Connect" : "Replace"}</button>
          <button class="dataset-more-button" type="button" title="Download CSV template" data-dataset-action="template" data-dataset-id="${escapeAttr(dataset.id)}">↓</button>
        </div>
      </article>`;
  }).join("");
}

function openDatasetPicker() {
  els.datasetPickerSearch.value = "";
  renderDatasetPicker("");
  openModal(els.datasetPickerModal);
}

function renderDatasetPicker(search = "") {
  const query = String(search || "").trim().toLowerCase();
  const templates = Object.entries(DATASET_TEMPLATES).filter(([id, template]) => {
    const reports = template.reports.map(key => REPORT_TYPES[key]?.title || key).join(" ");
    return !query || `${template.title} ${template.description} ${reports}`.toLowerCase().includes(query);
  });
  els.datasetTemplateGrid.innerHTML = templates.map(([id, template]) => {
    const dataset = getDataset(id);
    const status = datasetStatusMeta(dataset);
    const category = datasetCategoryMeta(template.category);
    return `<button class="dataset-template-card" type="button" data-dataset-template="${escapeAttr(id)}">
      <span class="dataset-template-icon">${escapeHtml(template.icon)}</span>
      <span class="dataset-template-copy"><small>${escapeHtml(category.label)}</small><strong>${escapeHtml(template.title)}</strong><em>${escapeHtml(template.description)}</em></span>
      <span class="dataset-status-badge ${status.className}">${escapeHtml(status.label)}</span>
    </button>`;
  }).join("") || `<div class="dataset-empty"><strong>No template found.</strong><p>Search using a report name, field, or industry term.</p></div>`;
}

function datasetPreviewHeaders(dataset) {
  if (dataset.headers?.length) return dataset.headers;
  const first = dataset.rows?.[0];
  return first ? Object.keys(first) : [];
}

function datasetHeaderLabel(datasetId, header) {
  const template = getDatasetTemplate(datasetId);
  const column = template?.columns.find(item => item.key === header || item.label === header);
  return column?.label || header;
}

function datasetPreviewTable(dataset, maxColumns = 9, maxRows = 8) {
  const headers = datasetPreviewHeaders(dataset).slice(0, maxColumns);
  if (!headers.length || !datasetRowsCount(dataset)) return `<div class="dataset-no-preview"><span>▦</span><strong>No rows connected yet</strong><p>Upload an Excel or CSV file, or load the sample data to preview this dataset.</p></div>`;
  const rows = dataset.rows.slice(0, maxRows);
  return `<table><thead><tr>${headers.map(header => `<th>${escapeHtml(datasetHeaderLabel(dataset.id, header))}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map(header => `<td>${escapeHtml(formatDatasetCell(row?.[header]))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function formatDatasetCell(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function openDatasetDetail(id) {
  const dataset = getDataset(id);
  const template = getDatasetTemplate(id);
  if (!dataset || !template) return;
  activeDatasetId = id;
  const status = datasetStatusMeta(dataset);
  const category = datasetCategoryMeta(template.category);
  const rows = datasetRowsCount(dataset);
  els.datasetDetailIcon.textContent = template.icon;
  els.datasetDetailCategory.textContent = category.label;
  els.datasetDetailTitle.textContent = template.title;
  els.datasetDetailDescription.textContent = template.description;
  els.datasetDetailStatus.textContent = status.label;
  els.datasetDetailStatus.className = `dataset-status-badge ${status.className}`;
  els.datasetDetailStats.innerHTML = `
    <div><span>Rows</span><strong>${rows.toLocaleString("en-ZA")}</strong></div>
    <div><span>Columns</span><strong>${datasetPreviewHeaders(dataset).length || template.columns.length}</strong></div>
    <div><span>Field match</span><strong>${dataset.status === "empty" ? "—" : `${round(dataset.quality || 100)}%`}</strong></div>
    <div><span>Last updated</span><strong>${escapeHtml(dataset.updatedAt || "Never")}</strong></div>
    <div class="wide"><span>Source</span><strong>${escapeHtml(dataset.source || "No file connected")}</strong></div>`;
  els.datasetDetailReports.innerHTML = template.reports.map(key => `<span>${escapeHtml(REPORT_TYPES[key]?.title || key)}</span>`).join("");
  els.datasetDetailPreviewNote.textContent = rows ? `Showing ${Math.min(rows, 8)} of ${rows.toLocaleString("en-ZA")} rows.` : "Connect a file to preview rows.";
  els.datasetDetailTable.innerHTML = datasetPreviewTable(dataset);
  els.clearDatasetButton.hidden = dataset.status === "empty";
  els.datasetSampleButton.textContent = dataset.status === "demo" ? "Reload sample" : "Use sample data";
  els.datasetUploadButton.textContent = dataset.status === "empty" ? "Upload dataset" : "Upload / replace";
  openModal(els.datasetDetailModal);
}

function openDatasetUpload(id) {
  const dataset = getDataset(id);
  const template = getDatasetTemplate(id);
  if (!dataset || !template) return;
  activeDatasetId = id;
  if (id === "project_performance") {
    closeModal(els.datasetDetailModal);
    closeModal(els.datasetPickerModal);
    openImportModal();
    return;
  }
  state.datasetRawRows = [];
  state.datasetHeaders = [];
  state.datasetCurrentFile = null;
  els.datasetFileInput.value = "";
  els.datasetFilePreview.classList.add("hidden");
  els.datasetMatchPreview.classList.add("hidden");
  els.connectDatasetButton.disabled = true;
  els.datasetUploadTitle.textContent = `Upload ${template.title.toLowerCase()}`;
  els.datasetUploadDescription.textContent = `Expected fields include ${template.columns.slice(0, 5).map(column => column.label).join(", ")}${template.columns.length > 5 ? ", and more" : ""}. Extra columns are kept.`;
  closeModal(els.datasetDetailModal);
  closeModal(els.datasetPickerModal);
  openModal(els.datasetUploadModal);
}

function matchDatasetHeaders(template, headers) {
  const mapping = {};
  template.columns.forEach(column => {
    const aliases = [column.label, column.key, ...(column.aliases || [])].map(normalise);
    const matched = headers.find(header => {
      const clean = normalise(header);
      return aliases.some(alias => clean === alias || clean.includes(alias) || alias.includes(clean));
    });
    mapping[column.key] = matched || "";
  });
  return mapping;
}

async function handleDatasetFile(file) {
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
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    if (!rows.length) throw new Error("The first worksheet contains no data rows.");
    state.datasetRawRows = rows;
    state.datasetHeaders = Object.keys(rows[0]);
    state.datasetCurrentFile = file;
    const template = getDatasetTemplate(activeDatasetId);
    const mapping = matchDatasetHeaders(template, state.datasetHeaders);
    const matched = template.columns.filter(column => mapping[column.key]).length;
    const requiredMissing = template.columns.filter(column => column.required && !mapping[column.key]);
    const quality = template.columns.length ? Math.round((matched / template.columns.length) * 100) : 100;
    state.datasetPendingMapping = mapping;
    state.datasetPendingQuality = quality;
    els.datasetFilePreview.innerHTML = `<strong>${escapeHtml(file.name)}</strong><br>${rows.length.toLocaleString("en-ZA")} rows · ${state.datasetHeaders.length} columns · Worksheet: ${escapeHtml(sheetName)}`;
    els.datasetFilePreview.classList.remove("hidden");
    els.datasetMatchPreview.innerHTML = `
      <div class="dataset-match-score"><span style="--match:${quality}"><strong>${quality}%</strong></span><div><strong>${matched} of ${template.columns.length} expected fields matched</strong><p>${requiredMissing.length ? `${requiredMissing.length} required field${requiredMissing.length === 1 ? " is" : "s are"} missing, but you can still connect and review the data.` : "All required fields were found."}</p></div></div>
      <div class="dataset-field-chips">${template.columns.map(column => `<span class="${mapping[column.key] ? "matched" : "missing"}">${mapping[column.key] ? "✓" : "–"} ${escapeHtml(column.label)}</span>`).join("")}</div>`;
    els.datasetMatchPreview.classList.remove("hidden");
    els.connectDatasetButton.disabled = false;
  } catch (error) {
    console.error(error);
    showToast(error.message || "The dataset file could not be read.");
  }
}

function processDatasetImport() {
  const dataset = getDataset(activeDatasetId);
  if (!dataset || !state.datasetRawRows.length) return;
  dataset.rows = state.datasetRawRows;
  dataset.headers = state.datasetHeaders;
  dataset.mapping = state.datasetPendingMapping || {};
  dataset.quality = state.datasetPendingQuality || 0;
  dataset.status = "connected";
  dataset.fileName = state.datasetCurrentFile?.name || "Imported dataset";
  dataset.source = dataset.fileName;
  dataset.updatedAt = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
  saveState();
  closeModal(els.datasetUploadModal);
  renderAll();
  openDatasetDetail(activeDatasetId);
  showToast(`${dataset.name} connected with ${dataset.rows.length.toLocaleString("en-ZA")} rows.`);
}

function loadDatasetSample(id, reopen = false) {
  const dataset = getDataset(id);
  const template = getDatasetTemplate(id);
  if (!dataset || !template) return;
  dataset.rows = structuredClone(template.sampleRows || []);
  dataset.headers = dataset.rows[0] ? Object.keys(dataset.rows[0]) : template.columns.map(column => column.label);
  dataset.mapping = matchDatasetHeaders(template, dataset.headers);
  dataset.quality = 100;
  dataset.status = "demo";
  dataset.fileName = "";
  dataset.source = "Built-in sample dataset";
  dataset.updatedAt = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
  if (id === "project_performance") {
    state.rows = structuredClone(SAMPLE_ROWS);
    resetIgnoredInsights();
  }
  saveState();
  renderAll();
  if (reopen || els.datasetDetailModal?.classList.contains("open")) openDatasetDetail(id);
  showToast(`${template.title} sample data loaded.`);
}

function clearDataset(id) {
  const dataset = getDataset(id);
  const template = getDatasetTemplate(id);
  if (!dataset || !template) return;
  if (!window.confirm(`Clear the ${template.title} dataset? This removes its rows from this browser.`)) return;
  if (id === "project_performance") {
    state.rows = structuredClone(SAMPLE_ROWS);
    dataset.rows = state.rows;
    dataset.headers = template.columns.map(column => column.key);
    dataset.status = "demo";
    dataset.source = "Built-in demonstration data";
    dataset.quality = 100;
    dataset.updatedAt = "20 Jul 2026";
    resetIgnoredInsights();
  } else {
    Object.assign(dataset, { status: "empty", source: "No file connected", fileName: "", rows: [], headers: [], mapping: {}, quality: 0, updatedAt: "" });
  }
  saveState();
  renderAll();
  openDatasetDetail(id);
  showToast(id === "project_performance" ? "Project performance reset to demo data." : `${template.title} data cleared.`);
}

function templateRowsForDownload(template) {
  const headers = template.columns.map(column => column.label);
  const sample = template.sampleRows?.[0] || {};
  const sampleRow = template.columns.map(column => sample[column.label] ?? sample[column.key] ?? "");
  return [headers, sampleRow];
}

function downloadDatasetTemplate(id) {
  const template = getDatasetTemplate(id);
  if (!template) return;
  const rows = templateRowsForDownload(template);
  const csv = rows.map(row => row.map(csvValue).join(",")).join("\r\n");
  const slug = template.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  downloadBlob(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `civentraq-${slug}-template.csv`);
  showToast(`${template.title} template downloaded.`);
}

function downloadDatasetTemplatePack() {
  if (typeof XLSX === "undefined") {
    showToast("Excel template export could not load. Check your internet connection.");
    return;
  }
  const workbook = XLSX.utils.book_new();
  Object.values(DATASET_TEMPLATES).forEach(template => {
    const sheet = XLSX.utils.aoa_to_sheet(templateRowsForDownload(template));
    sheet["!cols"] = template.columns.map(column => ({ wch: Math.min(30, Math.max(14, column.label.length + 3)) }));
    XLSX.utils.book_append_sheet(workbook, sheet, safeExcelSheetName(template.title));
  });
  XLSX.writeFile(workbook, "civentraq-dataset-template-pack.xlsx", { compression: true });
  showToast("Dataset template pack downloaded.");
}

function datasetRowsForReport(dataset, maxColumns = 8, maxRows = 30) {
  const headers = datasetPreviewHeaders(dataset).slice(0, maxColumns);
  return {
    columns: headers.map(header => datasetHeaderLabel(dataset.id, header)),
    rows: dataset.rows.slice(0, maxRows).map(row => headers.map(header => formatDatasetCell(row?.[header])))
  };
}

function attachDatasetToIndustryReport(model, reportType) {
  const dataset = findDatasetForReport(reportType);
  if (!dataset) return model;
  const table = datasetRowsForReport(dataset);
  if (!table.columns.length || !table.rows.length) return model;
  const status = datasetStatusMeta(dataset);
  model.columns = table.columns;
  model.rows = table.rows;
  model.tableTitle = `${dataset.name} dataset`;
  model.sourceNote = `${status.description}: ${dataset.source}. ${dataset.rows.length.toLocaleString("en-ZA")} rows connected; preview exports include the first ${table.rows.length}.`;
  model.summary = `${model.summary} This report is currently using the ${dataset.name.toLowerCase()} dataset with ${dataset.rows.length.toLocaleString("en-ZA")} available rows.`;
  return model;
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
    "customLayout", "customDensity", "customCardStyle", "customRadius", "customChartStyle", "customCostChartType", "customProgressChartType", "customCategoryChartType", "customChartPalette",
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
    costChartType: els.customCostChartType.value,
    progressChartType: els.customProgressChartType.value,
    categoryChartType: els.customCategoryChartType.value,
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
    customCostChartType: c.costChartType, customProgressChartType: c.progressChartType, customCategoryChartType: c.categoryChartType, customChartPalette: c.chartPalette, customLegendPosition: c.legendPosition, customBrandName: c.brandName,
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
  syncChartTypeControls();
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

function getReportLibraryEntries() {
  return Object.entries(REPORT_TYPES)
    .filter(([key, report]) => key !== "full" && report.category)
    .map(([key, report]) => ({ key, ...report }));
}

function renderReportLibrary() {
  if (!els.reportLibrary || !els.reportCategoryFilters) return;
  const allEntries = getReportLibraryEntries();
  const categoryCounts = allEntries.reduce((counts, report) => {
    counts[report.category] = (counts[report.category] || 0) + 1;
    return counts;
  }, {});

  els.reportCategoryFilters.innerHTML = Object.entries(REPORT_CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order)
    .filter(([key]) => key === "all" || categoryCounts[key])
    .map(([key, category]) => {
      const count = key === "all" ? allEntries.length : categoryCounts[key] || 0;
      return `<button type="button" class="report-filter${reportLibraryFilter === key ? " active" : ""}" data-report-category="${key}"><span>${escapeHtml(category.icon)}</span>${escapeHtml(category.label)}<b>${count}</b></button>`;
    }).join("");

  const filtered = allEntries.filter(report => {
    const categoryMatch = reportLibraryFilter === "all" || report.category === reportLibraryFilter;
    const haystack = `${report.title} ${report.description} ${REPORT_CATEGORIES[report.category]?.label || ""}`.toLowerCase();
    return categoryMatch && (!reportLibrarySearch || haystack.includes(reportLibrarySearch));
  });

  if (els.reportCount) els.reportCount.textContent = `${filtered.length} report${filtered.length === 1 ? "" : "s"}`;

  if (!filtered.length) {
    els.reportLibrary.innerHTML = `<div class="report-empty"><strong>No reports found</strong><p>Try a different search term or select another category.</p></div>`;
    return;
  }

  const grouped = filtered.reduce((groups, report) => {
    (groups[report.category] ||= []).push(report);
    return groups;
  }, {});

  els.reportLibrary.innerHTML = Object.entries(REPORT_CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order)
    .filter(([key]) => key !== "all" && grouped[key]?.length)
    .map(([key, category]) => `
      <section class="report-group" data-report-group="${key}">
        <div class="report-group-heading">
          <div><span>${escapeHtml(category.icon)}</span><div><h3>${escapeHtml(category.label)}</h3><p>${grouped[key].length} available report${grouped[key].length === 1 ? "" : "s"}</p></div></div>
        </div>
        <div class="report-grid">
          ${grouped[key].map(report => {
            const dataset = findDatasetForReport(report.key, true);
            const status = datasetStatusMeta(dataset);
            const datasetName = dataset ? getDatasetTemplate(dataset.id)?.title : "Project performance";
            return `
            <article class="report-card${report.featured ? " featured" : ""}" data-report-card="${escapeAttr(report.key)}">
              <div class="report-card-top">
                <span class="report-icon">${escapeHtml(report.icon || "▧")}</span>
                <div class="report-card-labels">
                  <span class="report-category-label">${escapeHtml(category.label)}</span>
                  ${report.featured ? '<span class="report-featured-badge">Core</span>' : ""}
                  <span class="report-data-badge ${status.className}">${escapeHtml(status.label)}</span>
                </div>
              </div>
              <h3>${escapeHtml(report.title)}</h3>
              <p>${escapeHtml(report.description)}</p>
              <div class="report-data-source"><span>Dataset</span><strong>${escapeHtml(datasetName || "Project performance")}</strong></div>
              <div class="report-card-footer">
                <span>PDF · PowerPoint · Excel · PNG · CSV</span>
                <button class="button secondary report-generate" data-report-type="${escapeAttr(report.key)}">Choose format</button>
              </div>
            </article>`;
          }).join("")}
        </div>
      </section>
    `).join("");
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
  const projectDataset = getDataset("project_performance");
  if (projectDataset) {
    projectDataset.rows = mapped;
    projectDataset.headers = getDatasetTemplate("project_performance").columns.map(column => column.key);
    projectDataset.mapping = { ...state.mapping };
    projectDataset.quality = 100;
    projectDataset.status = "connected";
    projectDataset.fileName = state.currentFile?.name || "Imported project data";
    projectDataset.source = projectDataset.fileName;
    projectDataset.updatedAt = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
  }
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

const CORE_EXPORT_REPORTS = new Set(["full", "executive", "cost", "schedule"]);

function isIndustryReport(reportType) {
  return Boolean(REPORT_TYPES[reportType]) && !CORE_EXPORT_REPORTS.has(reportType);
}

function reportKpi(label, value, note = "") { return { label, value: String(value), note }; }
function reportAction(title, detail) { return { title, detail }; }
function reportChart(title, labels, values, options = {}) {
  return { title, labels, values: values.map(value => validNumber(value)), prefix: options.prefix || "", suffix: options.suffix || "", max: options.max || 0 };
}
function cap(value, max = 100) { return Math.max(0, Math.min(max, validNumber(value))); }
function statusFromVariance(value) { return value >= 0 ? "On track" : value >= -5 ? "Watch" : "Delayed"; }
function monthLabel(date) { return new Date(`${date}T00:00:00`).toLocaleDateString("en-ZA", { month: "short", year: "2-digit" }); }
function demoSource(label) { return `Prototype ${label}: project KPIs use the current imported data; register rows are realistic demo content until the matching data source is connected.`; }

function getIndustryReportModel(reportType) {
  const definition = REPORT_TYPES[reportType];
  if (!definition) throw new Error("That report type is not available.");
  const m = calculateMetrics();
  const latest = m.latest || {};
  const category = REPORT_CATEGORIES[definition.category]?.label || "Project report";
  const budget = state.project.approvedBudget;
  const reportDate = formatDate(new Date().toISOString().slice(0, 10));
  const base = {
    key: reportType,
    title: definition.title,
    description: definition.description,
    category,
    icon: definition.icon || "▧",
    slug: definition.slug,
    reportDate,
    sourceNote: demoSource(definition.title.toLowerCase()),
    kpis: [], summary: "", tableTitle: "Report detail", columns: [], rows: [], actions: [], chart: null
  };

  switch (reportType) {
    case "daily_site": {
      const todayHours = round(latest.labourHours || m.labourHours / Math.max(1, m.rows.length));
      const tasksToday = Math.max(1, round((latest.tasksCompleted || 0) / Math.max(1, m.rows.length)));
      base.kpis = [
        reportKpi("Shift progress", `${round(m.actualProgress)}%`, "Current physical completion"),
        reportKpi("Labour on shift", `${Math.max(24, round(todayHours / 10))}`, `${todayHours.toLocaleString("en-ZA")} hours recorded in the latest period`),
        reportKpi("Activities completed", tasksToday, "Demo daily activity count"),
        reportKpi("Open constraints", m.riskRows + 2, "Safety, access, material, and permit constraints")
      ];
      base.summary = `Site delivery is at ${round(m.actualProgress)}% against ${round(m.plannedProgress)}% planned. The daily report records completed work, workforce, plant, constraints, and the next-shift plan for ${state.project.name}.`;
      base.tableTitle = "Daily work-front status";
      base.columns = ["Work area", "Work completed", "Crew", "Plant / equipment", "Constraint", "Next shift"];
      base.rows = WORK_PACKAGES.map((item, index) => [item.name, `${Math.max(1, round(item.progress / 12))} activities`, `${12 + index * 4}`, ["Crane + rigging", "Cable tools", "Welding sets", "Test equipment", "Excavator"][index], item.status === "On track" ? "None" : item.status, item.status === "Delayed" ? "Recovery crew and material release" : "Continue planned sequence"]);
      base.actions = [reportAction("Close daily constraints", "Assign each access, permit, material, and interface constraint to an owner before the next shift."), reportAction("Attach site evidence", "Add dated photographs, delivery notes, permits, and supervisor sign-off to the final daily report."), reportAction("Confirm tomorrow's plan", "Agree crew, plant, permits, and work fronts during the end-of-shift coordination meeting.")];
      base.chart = reportChart("Work-package progress", WORK_PACKAGES.map(item => item.name), WORK_PACKAGES.map(item => item.progress), { suffix: "%", max: 100 });
      break;
    }
    case "weekly_progress": {
      base.kpis = [reportKpi("Actual progress", `${round(m.actualProgress)}%`, "Current completion"), reportKpi("Weekly variance", `${round(m.progressVariance)}%`, "Against approved plan"), reportKpi("Labour hours", round(m.labourHours).toLocaleString("en-ZA"), "Cumulative hours"), reportKpi("At-risk packages", WORK_PACKAGES.filter(item => item.status !== "On track").length, "Delayed or at-risk work packages")];
      base.summary = `Weekly delivery remains ${Math.abs(round(m.progressVariance))}% ${m.progressVariance < 0 ? "behind" : "ahead of"} the approved programme. The report focuses on package progress, completed activities, upcoming work, blockers, and decisions required from the project team.`;
      base.tableTitle = "Weekly package performance";
      base.columns = ["Work package", "Owner", "Planned %", "Actual %", "Variance", "Status", "Next-week priority"];
      base.rows = WORK_PACKAGES.map(item => { const planned = cap(item.progress + (item.status === "On track" ? 2 : 8)); const variance = item.progress - planned; return [item.name, item.owner, `${planned}%`, `${item.progress}%`, `${variance}%`, item.status, item.status === "Delayed" ? "Add resources and resequence" : "Protect planned production"] });
      base.actions = [reportAction("Issue the weekly recovery list", "Convert every delayed package into a dated action with an accountable owner."), reportAction("Confirm client decisions", "List approvals, access releases, and technical answers required before the next reporting cut-off."), reportAction("Lock the next-week plan", "Confirm materials, labour, equipment, inspections, and permits for each planned work front.")];
      base.chart = reportChart("Planned versus actual package progress", WORK_PACKAGES.map(item => item.name), WORK_PACKAGES.map(item => item.progress), { suffix: "%", max: 100 });
      break;
    }
    case "monthly_client": {
      const statusRows = [
        ["Cost", m.predictedFinalCost <= budget ? "Within budget" : "Forecast overrun", formatMoney(m.predictedFinalCost), m.predictedFinalCost <= budget ? "Maintain weekly controls" : "Approve cost-recovery plan"],
        ["Schedule", statusFromVariance(m.progressVariance), `${round(m.actualProgress)}% / ${round(m.plannedProgress)}%`, "Recover delayed critical work"],
        ["HSE", "Monitor", `${round(m.labourHours).toLocaleString("en-ZA")} exposure hours`, "Close open corrective actions"],
        ["Quality", "Monitor", `${Math.max(1, m.riskRows)} open quality risks`, "Complete inspections and punch close-out"],
        ["Procurement", "At risk", `${WORK_PACKAGES.filter(item => item.status !== "On track").length} constrained packages`, "Expedite long-lead materials"],
        ["Risk", m.riskRows ? "Attention" : "Controlled", `${m.riskRows} high-risk periods`, "Review residual exposure with client"]
      ];
      base.kpis = [reportKpi("Project health", `${m.healthScore}/100`, getHealthLabel(m.healthScore)), reportKpi("Actual progress", `${round(m.actualProgress)}%`, `${round(m.progressVariance)}% variance`), reportKpi("Actual spend", formatMoney(m.actualTotal), `${m.spendPercent.toFixed(1)}% of budget`), reportKpi("Forecast final cost", formatMoney(m.predictedFinalCost), m.predictedFinalCost <= budget ? "Within budget" : "Above budget")];
      base.summary = getManagementSummary(m);
      base.tableTitle = "Monthly management review";
      base.columns = ["Control area", "Status", "Current position", "Required management response"];
      base.rows = statusRows;
      base.actions = [reportAction("Approve the monthly action plan", "Record client and contractor decisions, owners, and dates in the signed meeting minutes."), reportAction("Update forecast at completion", "Refresh cost and completion forecasts using the latest productivity, procurement, and risk information."), reportAction("Freeze the reporting baseline", "Archive the approved monthly data cut, charts, evidence, and narrative for auditability.")];
      base.chart = reportChart("Monthly project control profile", ["Cost", "Schedule", "HSE", "Quality", "Procurement", "Risk"], [Math.max(0, 100 - Math.abs(m.predictedFinalCost - budget) / Math.max(1, budget) * 100), cap(100 + m.progressVariance), 88, 84, 78, cap(100 - m.riskRows * 10)], { suffix: "%", max: 100 });
      break;
    }
    case "lookahead": {
      base.kpis = [reportKpi("Look-ahead window", "6 weeks", "Rolling construction plan"), reportKpi("Activities planned", 18, "Demo activity register"), reportKpi("Ready to start", 12, "Materials, permits, drawings, and access available"), reportKpi("Blocked activities", 6, "Require action before planned start")];
      base.summary = `The look-ahead report converts the approved programme into a six-week execution plan. Current schedule variance is ${round(m.progressVariance)}%, so readiness checks and recovery activities should be reviewed daily.`;
      base.tableTitle = "Six-week look-ahead";
      base.columns = ["Activity", "Week", "Owner", "Readiness", "Constraint", "Planned output"];
      base.rows = [
        ["Complete piping fabrication", "Week 1", "Piping team", "Blocked", "Material release", "14 spools"],
        ["Cable tray installation", "Week 1", "Electrical team", "Ready", "None", "220 m"],
        ["Instrument impulse lines", "Week 2", "I&C team", "Watch", "Drawing response", "36 lines"],
        ["Civil coating repairs", "Week 2", "Civil team", "Ready", "None", "480 m²"],
        ["Mechanical alignment", "Week 3", "Mechanical team", "Watch", "Vendor attendance", "8 equipment items"],
        ["Pressure testing", "Week 4", "QA/QC", "Blocked", "Test packs incomplete", "6 systems"],
        ["Loop checks", "Week 5", "Commissioning", "Watch", "Power availability", "55 loops"],
        ["System handover", "Week 6", "Project team", "Blocked", "Punch-list closure", "3 systems"]
      ];
      base.actions = [reportAction("Run readiness checks", "Verify drawings, materials, labour, permits, access, equipment, and inspections before each activity enters the frozen two-week window."), reportAction("Escalate blocked starts", "Any activity not ready seven days before planned start must have an executive owner and recovery date."), reportAction("Protect critical milestones", "Prioritise activities with zero float and track recovery output daily.")];
      base.chart = reportChart("Activities ready by week", ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"], [4, 3, 2, 2, 1, 0]);
      break;
    }
    case "risk_issue": {
      const risks = getRiskItems(m);
      base.kpis = [reportKpi("Open risks", risks.length + 3, "Demo risk register"), reportKpi("High / critical", m.riskRows + 1, "Require management attention"), reportKpi("Open issues", 5, "Current delivery issues"), reportKpi("Overdue actions", 2, "Past agreed response date")];
      base.summary = `${m.riskRows} high-risk reporting periods are visible in the imported project data. This register combines schedule, cost, technical, procurement, and HSE exposure with owners and mitigation dates.`;
      base.tableTitle = "Priority risk and issue register";
      base.columns = ["ID", "Type", "Risk / issue", "Probability", "Impact", "Owner", "Due", "Status"];
      base.rows = [
        ["R-014", "Risk", "Piping material delivery may delay fabrication", "High", "High", "Procurement lead", "28 Jul 2026", "Mitigating"],
        ["R-018", "Risk", "Electrical access conflicts with civil works", "Medium", "High", "Construction manager", "25 Jul 2026", "Open"],
        ["I-009", "Issue", "Instrument drawing response overdue", "Occurred", "High", "Engineering manager", "22 Jul 2026", "Escalated"],
        ["R-021", "Risk", "Final-cost forecast sensitivity to overtime", "Medium", "Medium", "Commercial manager", "31 Jul 2026", "Monitoring"],
        ["I-012", "Issue", "Pressure-test pack documentation incomplete", "Occurred", "Medium", "QA/QC manager", "27 Jul 2026", "In progress"]
      ];
      base.actions = [reportAction("Escalate overdue owners", "Review all overdue and high-impact risks at the weekly management meeting."), reportAction("Quantify exposure", "Add cost, schedule, safety, and quality consequences to support prioritisation."), reportAction("Verify mitigation evidence", "Close risks only after the agreed control has been implemented and independently checked.")];
      base.chart = reportChart("Risk exposure by control area", ["Schedule", "Procurement", "Engineering", "Cost", "HSE", "Quality"], [82, 76, 68, 55, 42, 38], { suffix: "%", max: 100 });
      break;
    }
    case "cash_flow": {
      let plannedCum = 0, actualCum = 0;
      base.kpis = [reportKpi("Approved budget", formatMoney(budget), "Client-approved value"), reportKpi("Actual expenditure", formatMoney(m.actualTotal), `${m.spendPercent.toFixed(1)}% consumed`), reportKpi("Outstanding invoices", formatMoney(budget * .075), "Demo commercial register"), reportKpi("Cash-flow forecast", formatMoney(m.predictedFinalCost), "Estimated final cost")];
      base.summary = `Actual expenditure totals ${formatMoney(m.actualTotal)}. The cash-flow report tracks planned spend, actual cost, invoices, receipts, commitments, and forecast requirements through project completion.`;
      base.tableTitle = "Monthly cash-flow position";
      base.columns = ["Period", "Planned cost", "Actual cost", "Planned cumulative", "Actual cumulative", "Invoice status"];
      base.rows = m.rows.map((row, index) => { plannedCum += validNumber(row.plannedCost); actualCum += validNumber(row.actualCost); return [monthLabel(row.date), formatMoney(row.plannedCost), formatMoney(row.actualCost), formatMoney(plannedCum), formatMoney(actualCum), index === m.rows.length - 1 ? "Draft invoice" : "Paid"] });
      base.actions = [reportAction("Reconcile commitments", "Confirm purchase orders, subcontract values, accruals, and unapproved variations before forecasting."), reportAction("Accelerate certification", "Resolve supporting-document gaps that delay invoice approval and payment."), reportAction("Update monthly funding need", "Align the cash-flow forecast with the current schedule and procurement delivery dates.")];
      base.chart = reportChart("Actual monthly expenditure", m.rows.map(row => monthLabel(row.date)), m.rows.map(row => row.actualCost), { prefix: "R" });
      break;
    }
    case "variations_claims": {
      const variations = [
        ["VO-001", "Additional pipe support steel", "Client instruction", formatMoney(budget * .018), formatMoney(budget * .014), "Approved", "+4 days"],
        ["VO-002", "Electrical rerouting", "Site condition", formatMoney(budget * .012), formatMoney(0), "Under review", "+3 days"],
        ["CL-003", "Restricted access standby", "Client delay", formatMoney(budget * .009), formatMoney(0), "Submitted", "+2 days"],
        ["VO-004", "Instrument specification change", "Design revision", formatMoney(budget * .015), formatMoney(budget * .006), "Part approved", "+5 days"],
        ["CL-005", "Acceleration overtime", "Recovery instruction", formatMoney(budget * .021), formatMoney(0), "Draft", "0 days"]
      ];
      const submitted = budget * .075, approved = budget * .020;
      base.kpis = [reportKpi("Submitted value", formatMoney(submitted), "Variations and claims"), reportKpi("Approved value", formatMoney(approved), "Certified to date"), reportKpi("Pending value", formatMoney(submitted - approved), "Awaiting determination"), reportKpi("Potential time impact", "14 days", "Before mitigation")];
      base.summary = `The commercial register contains five active variation or claim items with a submitted value of ${formatMoney(submitted)}. Prompt instructions, substantiation, and determinations are required to protect entitlement and forecast accuracy.`;
      base.tableTitle = "Variation and claim register";
      base.columns = ["Reference", "Description", "Cause", "Submitted", "Approved", "Status", "Time impact"];
      base.rows = variations;
      base.actions = [reportAction("Complete substantiation", "Attach instruction, notice, records, quotations, programme impact, and cost build-up to each item."), reportAction("Agree determination dates", "Set contractual response dates and escalate overdue client decisions."), reportAction("Update forecast exposure", "Include probable outcomes in cost and completion forecasts without double counting.")];
      base.chart = reportChart("Submitted value by item", variations.map(row => row[0]), [budget*.018,budget*.012,budget*.009,budget*.015,budget*.021], { prefix: "R" });
      break;
    }
    case "procurement": {
      const items = [
        ["PO-1042", "Pipe fittings", "Cape Industrial Supply", formatMoney(budget*.032), "24 Jul 2026", "29 Jul 2026", "Late", "Expediting"],
        ["PO-1047", "LV cable", "PowerCore", formatMoney(budget*.026), "28 Jul 2026", "28 Jul 2026", "On time", "Released"],
        ["PO-1051", "Control valves", "FlowTech", formatMoney(budget*.041), "05 Aug 2026", "12 Aug 2026", "At risk", "Vendor inspection"],
        ["PO-1055", "Protective coating", "CoatPro", formatMoney(budget*.014), "22 Jul 2026", "22 Jul 2026", "Delivered", "Accepted"],
        ["PO-1060", "Instrument cable", "SignalWorks", formatMoney(budget*.019), "08 Aug 2026", "10 Aug 2026", "Watch", "Drawing approval"],
        ["PO-1063", "Gaskets and bolts", "SealFast", formatMoney(budget*.011), "26 Jul 2026", "26 Jul 2026", "On time", "In transit"]
      ];
      base.kpis = [reportKpi("Open purchase orders", 18, "Demo procurement register"), reportKpi("Order value", formatMoney(budget*.143), "Active procurement"), reportKpi("Late / at risk", 3, "Require expediting"), reportKpi("Delivered this period", 7, "Accepted at site")];
      base.summary = `Procurement readiness is directly affecting delayed and at-risk work packages. This report identifies late materials, supplier commitments, inspection requirements, approvals, and recovery dates.`;
      base.tableTitle = "Priority procurement register";
      base.columns = ["PO", "Item", "Supplier", "Value", "Required on site", "Promised", "Delivery status", "Current action"];
      base.rows = items;
      base.actions = [reportAction("Expedite critical materials", "Hold supplier calls for all items linked to critical-path and recovery activities."), reportAction("Close technical approvals", "Resolve outstanding drawings, data sheets, inspections, and release notes before dispatch."), reportAction("Protect site logistics", "Confirm transport, offloading, storage, preservation, and receiving inspection.")];
      base.chart = reportChart("Procurement status", ["Delivered", "On time", "Watch", "At risk", "Late"], [7, 6, 2, 2, 1]);
      break;
    }
    case "labour_productivity": {
      const totalHours = Math.max(1, m.labourHours);
      const labourRows = state.rows.map((row, index) => [row.category, `${18 + index*5}`, round(row.labourHours).toLocaleString("en-ZA"), `${index % 3 === 0 ? 12 : 7}%`, `${(0.72 + index*.04).toFixed(2)}`, index < 2 ? "Good" : index < 4 ? "Watch" : "Recovery required"]);
      base.kpis = [reportKpi("Cumulative hours", round(totalHours).toLocaleString("en-ZA"), "Imported project data"), reportKpi("Current headcount", 146, "Demo manpower register"), reportKpi("Overtime share", "9.4%", "Of total hours"), reportKpi("Productivity index", "0.89", "Actual output / planned output")];
      base.summary = `The project has recorded ${round(totalHours).toLocaleString("en-ZA")} labour hours. Productivity pressure is concentrated in delayed packages, where overtime and work-front readiness should be reviewed together.`;
      base.tableTitle = "Labour and productivity by discipline";
      base.columns = ["Discipline", "Headcount", "Hours", "Overtime", "Productivity index", "Status"];
      base.rows = labourRows;
      base.actions = [reportAction("Balance crews by work-front readiness", "Move labour away from blocked areas and into ready critical-path work."), reportAction("Control overtime", "Approve overtime against measurable recovery output and monitor fatigue exposure."), reportAction("Measure installed quantities", "Use discipline-specific units to calculate output per labour hour each week.")];
      base.chart = reportChart("Labour hours by discipline", state.rows.map(row => row.category), state.rows.map(row => row.labourHours));
      break;
    }
    case "equipment_plant": {
      const equipment = [
        ["Mobile crane 80t", "CR-08", "Mechanical", "72%", "6.5 h", "2.5 h", "Service in 42 h", "Available"],
        ["Excavator", "EX-14", "Civil", "81%", "7.3 h", "1.7 h", "Service in 18 h", "Available"],
        ["Welding set bank", "WS-22", "Piping", "64%", "5.8 h", "3.2 h", "Inspection due", "Watch"],
        ["Cable drum trailer", "CD-05", "Electrical", "58%", "5.2 h", "3.8 h", "No defect", "Available"],
        ["Air compressor", "AC-11", "Construction", "39%", "3.5 h", "5.5 h", "Leak repair", "Restricted"],
        ["Hydrotest pump", "HP-04", "QA/QC", "46%", "4.1 h", "4.9 h", "Calibration due", "Watch"]
      ];
      base.kpis = [reportKpi("Plant items", 26, "Demo equipment register"), reportKpi("Average utilisation", "63%", "Operating hours / available hours"), reportKpi("Downtime this week", "31 h", "Planned and unplanned"), reportKpi("Maintenance due", 4, "Within next seven days")];
      base.summary = "Plant utilisation is adequate overall, but low-use and maintenance-constrained equipment should be aligned with the look-ahead plan to avoid hire cost without productive output.";
      base.tableTitle = "Equipment utilisation and condition";
      base.columns = ["Equipment", "Asset ID", "Work area", "Utilisation", "Operating", "Idle / down", "Maintenance", "Status"];
      base.rows = equipment;
      base.actions = [reportAction("Release idle hired plant", "Review low-utilisation equipment and off-hire units not required by the approved look-ahead."), reportAction("Complete preventive maintenance", "Schedule service and calibration before equipment enters critical work."), reportAction("Record downtime causes", "Separate breakdown, operator, access, weather, and work-front delays for reliable utilisation analysis.")];
      base.chart = reportChart("Equipment utilisation", equipment.map(row => row[0]), [72,81,64,58,39,46], { suffix: "%", max: 100 });
      break;
    }
    case "hse_performance": {
      base.kpis = [reportKpi("Days without LTI", 184, "Demo HSE register"), reportKpi("Exposure hours", round(m.labourHours).toLocaleString("en-ZA"), "Imported labour hours"), reportKpi("Open HSE actions", m.riskRows + 4, "Incident, inspection, and observation actions"), reportKpi("Toolbox completion", "96%", "Planned talks completed")];
      base.summary = `HSE performance is presented across leading and lagging indicators. The current prototype uses ${round(m.labourHours).toLocaleString("en-ZA")} imported exposure hours and a demo safety register for incidents, observations, permits, and corrective actions.`;
      base.tableTitle = "HSE indicator dashboard";
      base.columns = ["Indicator", "Current", "Target", "Trend", "Status", "Management response"];
      base.rows = [["Lost-time injuries", "0", "0", "Stable", "Good", "Maintain critical controls"], ["Recordable incidents", "1", "0", "Watch", "Attention", "Close investigation actions"], ["Near misses", "4", ">= 6 reported", "Improving", "Watch", "Encourage reporting"], ["Safety observations", "38", "40", "Improving", "Watch", "Complete planned observations"], ["Toolbox talks", "24 / 25", "100%", "Stable", "Good", "Close one missed shift"], ["Open corrective actions", `${m.riskRows + 4}`, "0 overdue", "Watch", "Attention", "Escalate overdue owners"]];
      base.actions = [reportAction("Close overdue HSE actions", "Verify evidence and effectiveness before marking incident, inspection, or observation actions complete."), reportAction("Focus on critical risks", "Review work at height, lifting, energy isolation, confined space, excavation, and hot work daily."), reportAction("Increase leading indicators", "Set observation, inspection, and engagement targets by supervisor and contractor.")];
      base.chart = reportChart("HSE performance against target", ["LTI-free", "Toolbox", "Inspections", "Observations", "Actions closed"], [100,96,92,95,78], { suffix: "%", max: 100 });
      break;
    }
    case "incident_accident": {
      base.kpis = [reportKpi("Total incidents", 3, "Demo incident register"), reportKpi("Recordable", 1, "Medical treatment case"), reportKpi("Lost-time", 0, "No LTI recorded"), reportKpi("Actions open", 5, "Investigation and prevention actions")];
      base.summary = "Three demo incidents are recorded for the reporting period. The report provides classification, immediate response, investigation status, root cause, corrective actions, and close-out evidence.";
      base.tableTitle = "Incident and accident register";
      base.columns = ["Reference", "Date", "Area", "Classification", "Event", "Immediate response", "Investigation", "Status"];
      base.rows = [["INC-026", "04 Jul 2026", "Workshop", "First aid", "Minor hand cut during material handling", "Treated and task stopped", "Complete", "Closed"], ["INC-029", "11 Jul 2026", "Pipe rack", "Property damage", "Scaffold board damaged by lifting activity", "Area barricaded", "Complete", "Actions open"], ["INC-031", "18 Jul 2026", "Substation", "Medical treatment", "Eye irritation during cable cleaning", "Flushed and referred", "In progress", "Open"]];
      base.actions = [reportAction("Complete root-cause analysis", "Use evidence and contributing factors rather than stopping at unsafe act or human error."), reportAction("Share learning", "Brief all affected crews and update task risk assessments and procedures."), reportAction("Verify corrective actions", "Check implementation in the field before formal close-out.")];
      base.chart = reportChart("Incidents by classification", ["First aid", "Medical treatment", "Property damage", "Lost time"], [1,1,1,0]);
      break;
    }
    case "near_miss": {
      base.kpis = [reportKpi("Near misses", 4, "Demo register"), reportKpi("High potential", 1, "Potential severe outcome"), reportKpi("Actions open", 3, "Awaiting verification"), reportKpi("Average closure", "4.5 days", "From report to close-out")];
      base.summary = "Near-miss reporting helps identify weak controls before harm occurs. One high-potential event requires management verification of the corrective controls.";
      base.tableTitle = "Near-miss register";
      base.columns = ["Reference", "Area", "Event", "Potential severity", "Immediate control", "Owner", "Due", "Status"];
      base.rows = [["NM-041", "Pipe rack", "Loose tool fell inside exclusion zone", "High", "Work stopped; tethering checked", "HSE lead", "22 Jul", "Open"], ["NM-042", "Workshop", "Forklift reversed into unmarked path", "Medium", "Spotter assigned", "Logistics lead", "23 Jul", "In progress"], ["NM-043", "Substation", "Unlabelled temporary cable", "Medium", "Cable isolated and tagged", "Electrical lead", "21 Jul", "Closed"], ["NM-044", "Laydown", "Unstable material stack", "Medium", "Area barricaded and restacked", "Stores lead", "24 Jul", "Open"]];
      base.actions = [reportAction("Treat high-potential events as priority investigations", "Apply the same discipline used for serious incidents even when no injury occurred."), reportAction("Track recurring conditions", "Group near misses by energy source, area, contractor, and control failure."), reportAction("Recognise quality reporting", "Encourage early reporting and avoid blame-based responses.")];
      base.chart = reportChart("Near misses by potential severity", ["Low", "Medium", "High", "Critical"], [0,3,1,0]);
      break;
    }
    case "safety_observation": {
      base.kpis = [reportKpi("Observations", 38, "Current demo period"), reportKpi("Positive", 23, "Good practices recognised"), reportKpi("Unsafe conditions", 15, "Actions generated"), reportKpi("Closed", "79%", "Verified close-out")];
      base.summary = "Safety observations show positive behaviours and unsafe conditions by work area. The report highlights repeat themes and overdue actions for supervisor follow-up.";
      base.tableTitle = "Safety observation trends";
      base.columns = ["Category", "Positive", "Unsafe", "Repeat finding", "Open actions", "Owner", "Status"];
      base.rows = [["PPE", "6", "3", "Eye protection", "1", "Area supervisors", "Watch"], ["Housekeeping", "4", "5", "Access routes", "3", "Construction manager", "Attention"], ["Lifting", "5", "2", "Tag-line use", "1", "Lifting supervisor", "Watch"], ["Energy isolation", "3", "2", "Label quality", "1", "Electrical lead", "Watch"], ["Work at height", "5", "3", "Tool tethering", "2", "Scaffold lead", "Attention"]];
      base.actions = [reportAction("Target repeat themes", "Run focused inspections and toolbox talks on recurring unsafe conditions."), reportAction("Recognise positive behaviour", "Use positive observations to reinforce effective controls and crew ownership."), reportAction("Close field actions quickly", "Correct simple conditions immediately and verify larger actions by the due date.")];
      base.chart = reportChart("Observations by category", ["PPE", "Housekeeping", "Lifting", "Isolation", "Work at height"], [9,9,7,5,8]);
      break;
    }
    case "toolbox_talk": {
      base.kpis = [reportKpi("Talks planned", 25, "Demo schedule"), reportKpi("Completed", 24, "96% completion"), reportKpi("Attendance", 142, "Unique worker acknowledgements"), reportKpi("Missed shifts", 1, "Requires make-up session")];
      base.summary = "The toolbox register confirms daily pre-task communication, attendance, topic relevance, and acknowledgement across shifts and work areas.";
      base.tableTitle = "Toolbox-talk register";
      base.columns = ["Date", "Topic", "Supervisor", "Area / crew", "Attendance", "Evidence", "Status"];
      base.rows = [["20 Jul 2026", "Dropped-object prevention", "M. Dlamini", "Piping / Day", "34", "Signed register", "Complete"], ["20 Jul 2026", "Electrical isolation", "S. Naidoo", "Electrical / Day", "28", "Digital sign-off", "Complete"], ["19 Jul 2026", "Manual handling", "P. Jacobs", "Civil / Day", "25", "Signed register", "Complete"], ["19 Jul 2026", "Hot-work fire watch", "L. Mokoena", "Mechanical / Night", "31", "Photo + register", "Complete"], ["18 Jul 2026", "Heat stress and hydration", "T. Adams", "Site-wide / Night", "24", "No register", "Evidence missing"]];
      base.actions = [reportAction("Close missing evidence", "Obtain attendance and supervisor acknowledgement for incomplete talks."), reportAction("Link topics to current risk", "Select topics from incidents, observations, weather, look-ahead activities, and permit risks."), reportAction("Check understanding", "Use short questions or demonstrations rather than attendance alone.")];
      base.chart = reportChart("Toolbox completion by crew", ["Piping", "Electrical", "Civil", "Mechanical", "Site-wide"], [100,100,100,100,80], { suffix: "%", max: 100 });
      break;
    }
    case "permit_to_work": {
      base.kpis = [reportKpi("Active permits", 17, "Demo permit register"), reportKpi("Hot work", 6, "Currently active"), reportKpi("Isolation permits", 5, "Electrical and mechanical"), reportKpi("Expiring < 2 h", 3, "Requires extension or close-out")];
      base.summary = "The permit-to-work report tracks active high-risk work, isolations, validity, suspension, hand-back, and compliance checks across the site.";
      base.tableTitle = "Active permit register";
      base.columns = ["Permit", "Type", "Area", "Responsible person", "Issued", "Expires", "Isolation", "Status"];
      base.rows = [["PTW-2207", "Hot work", "Pipe rack A", "M. Dlamini", "06:30", "18:30", "Confirmed", "Active"], ["PTW-2210", "Confined space", "Vessel V-104", "L. Mokoena", "07:15", "15:15", "Confirmed", "Active"], ["PTW-2212", "Electrical isolation", "Substation 2", "S. Naidoo", "08:00", "17:00", "LOTO verified", "Active"], ["PTW-2216", "Excavation", "North corridor", "P. Jacobs", "07:00", "16:00", "Services cleared", "Suspended"], ["PTW-2218", "Cold work", "Pump bay", "R. Botha", "09:00", "19:00", "Mechanical isolation", "Active"]];
      base.actions = [reportAction("Review expiring permits", "Extend or close permits before expiry and revalidate controls after breaks or changes."), reportAction("Verify isolations", "Confirm lockout/tagout and zero-energy state at the work face."), reportAction("Audit permit quality", "Check scope, hazards, controls, gas tests, signatures, and hand-back documentation.")];
      base.chart = reportChart("Active permits by type", ["Hot work", "Confined space", "Isolation", "Excavation", "Cold work"], [6,2,5,1,3]);
      break;
    }
    case "ppe_compliance": {
      base.kpis = [reportKpi("People inspected", 126, "Demo PPE audit"), reportKpi("Compliant", 116, "92.1%"), reportKpi("Non-compliances", 10, "Corrected or actioned"), reportKpi("Repeat findings", 3, "Require supervisor action")];
      base.summary = "PPE compliance is strongest in mechanical and electrical areas, while eye and hand protection findings require focused follow-up in fabrication and material handling.";
      base.tableTitle = "PPE compliance by area";
      base.columns = ["Area", "Inspected", "Compliant", "Compliance %", "Main finding", "Action owner", "Status"];
      base.rows = [["Mechanical", "28", "27", "96%", "Damaged gloves", "Mechanical supervisor", "Good"], ["Electrical", "24", "23", "96%", "Arc-rated label", "Electrical supervisor", "Good"], ["Piping fabrication", "31", "27", "87%", "Eye protection", "Piping supervisor", "Attention"], ["Civil", "22", "20", "91%", "Dust masks", "Civil supervisor", "Watch"], ["Laydown / stores", "21", "19", "90%", "Hand protection", "Logistics supervisor", "Watch"]];
      base.actions = [reportAction("Correct repeat findings", "Use supervisor accountability and replacement stock to prevent recurrence."), reportAction("Verify task-specific PPE", "Check compatibility with hot work, chemicals, electrical work, noise, and respiratory hazards."), reportAction("Track contractor trends", "Compare compliance by contractor and work area over time.")];
      base.chart = reportChart("PPE compliance", ["Mechanical", "Electrical", "Piping", "Civil", "Stores"], [96,96,87,91,90], { suffix: "%", max: 100 });
      break;
    }
    case "safety_inspection": {
      base.kpis = [reportKpi("Inspections planned", 18, "Current period"), reportKpi("Completed", 17, "94% completion"), reportKpi("Findings", 29, "All severities"), reportKpi("Overdue actions", 4, "Requires escalation")];
      base.summary = "Safety inspection completion is high, but four overdue actions and recurring housekeeping and work-at-height findings require management intervention.";
      base.tableTitle = "Safety inspection summary";
      base.columns = ["Inspection", "Area", "Completed", "Findings", "High", "Actions overdue", "Lead", "Status"];
      base.rows = [["General site inspection", "Site-wide", "20 Jul", "8", "1", "2", "HSE manager", "Attention"], ["Scaffold inspection", "Pipe rack", "20 Jul", "4", "0", "0", "Scaffold inspector", "Good"], ["Electrical inspection", "Substation", "19 Jul", "5", "1", "1", "Electrical lead", "Attention"], ["Lifting equipment", "Mechanical", "19 Jul", "3", "0", "0", "Lifting supervisor", "Good"], ["Environmental inspection", "Laydown", "18 Jul", "9", "0", "1", "Environmental officer", "Watch"]];
      base.actions = [reportAction("Escalate high-severity findings", "Stop affected work where critical controls are absent and verify correction before restart."), reportAction("Close overdue actions", "Review owner capacity, due dates, and evidence at the daily coordination meeting."), reportAction("Trend recurring findings", "Use inspection data to target campaigns and supervisor coaching.")];
      base.chart = reportChart("Inspection findings by area", ["Site-wide", "Pipe rack", "Substation", "Mechanical", "Laydown"], [8,4,5,3,9]);
      break;
    }
    case "environmental_incident": {
      base.kpis = [reportKpi("Environmental events", 3, "Demo register"), reportKpi("Reportable", 0, "No external reporting threshold reached"), reportKpi("Spill volume", "38 L", "Estimated total"), reportKpi("Actions open", 2, "Remediation and prevention")];
      base.summary = "Three minor environmental events were contained within site boundaries. The report tracks spill response, notifications, waste handling, remediation, investigation, and prevention actions.";
      base.tableTitle = "Environmental incident register";
      base.columns = ["Reference", "Date", "Type", "Area", "Quantity", "Containment", "Notification", "Status"];
      base.rows = [["ENV-012", "06 Jul", "Hydraulic oil spill", "Laydown", "18 L", "Absorbent and contaminated soil removed", "Internal", "Closed"], ["ENV-014", "13 Jul", "Wastewater overflow", "Wash bay", "20 L", "Drain isolated and liquid recovered", "Internal", "Actions open"], ["ENV-015", "17 Jul", "Dust complaint", "Civil area", "N/A", "Water suppression increased", "Internal", "Monitoring"]];
      base.actions = [reportAction("Complete remediation evidence", "Record waste classification, disposal documentation, photographs, and restored condition."), reportAction("Prevent recurrence", "Repair equipment, improve bunding, and update inspection frequencies."), reportAction("Check reporting thresholds", "Confirm permit, client, and regulatory notification requirements for each event.")];
      base.chart = reportChart("Environmental events by type", ["Spill", "Wastewater", "Dust", "Air emission", "Waste"], [1,1,1,0,0]);
      break;
    }
    case "lost_time_injury": {
      base.kpis = [reportKpi("Lost-time injuries", 0, "Demo HSE register"), reportKpi("Days lost", 0, "Current period"), reportKpi("Exposure hours", round(m.labourHours).toLocaleString("en-ZA"), "Imported labour data"), reportKpi("LTI-free days", 184, "Since last recorded LTI")];
      base.summary = "No lost-time injury is recorded in the demo register. The report retains exposure hours, days lost, restricted work cases, investigation status, corrective actions, and return-to-work information.";
      base.tableTitle = "Lost-time and restricted-work register";
      base.columns = ["Reference", "Classification", "Date", "Person / contractor", "Days lost", "Restricted days", "Investigation", "Status"];
      base.rows = [["No current LTI", "LTI", "—", "—", "0", "0", "Not required", "Clear"], ["MTC-031", "Medical treatment", "18 Jul", "Electrical subcontractor", "0", "1", "In progress", "Restricted duty"]];
      base.actions = [reportAction("Maintain exposure-hour accuracy", "Reconcile timesheets and contractor hours before calculating incident rates."), reportAction("Manage return to work", "Document medical restrictions, suitable duties, and clearance."), reportAction("Protect critical controls", "Focus verification on high-energy activities that could cause serious injury.")];
      base.chart = reportChart("Injury classification", ["First aid", "Medical treatment", "Restricted work", "Lost time"], [1,1,1,0]);
      break;
    }
    case "corrective_action": {
      base.kpis = [reportKpi("Total open actions", 14, "Demo combined tracker"), reportKpi("Overdue", 4, "Past agreed due date"), reportKpi("High priority", 5, "Incident, audit, and NCR actions"), reportKpi("Closed this month", 18, "Verified close-out")];
      base.summary = "The corrective-action tracker combines HSE, quality, audit, risk, and inspection actions so overdue ownership and verification gaps can be managed from one list.";
      base.tableTitle = "Corrective and preventive actions";
      base.columns = ["Action", "Source", "Priority", "Owner", "Due", "Evidence required", "Verification", "Status"];
      base.rows = [["Install tool-tether points", "Near miss NM-041", "High", "Construction manager", "22 Jul", "Photo and field check", "HSE", "Open"], ["Revise cable-cleaning method", "Incident INC-031", "High", "Electrical lead", "24 Jul", "Approved method and briefing", "HSE", "In progress"], ["Close pressure-test document gaps", "QA inspection", "High", "QA/QC manager", "27 Jul", "Signed test packs", "Client inspector", "Open"], ["Repair compressor leak", "Plant inspection", "Medium", "Plant supervisor", "21 Jul", "Work order closure", "Maintenance", "Overdue"], ["Update drawing revision register", "Document audit", "Medium", "Document controller", "23 Jul", "Issued register", "Engineering manager", "In progress"]];
      base.actions = [reportAction("Escalate overdue actions", "Review due dates and barriers with accountable managers, not only action owners."), reportAction("Require objective evidence", "Do not close actions on verbal confirmation alone."), reportAction("Check effectiveness", "Verify that the action removed or reduced the original risk and did not create new exposure.")];
      base.chart = reportChart("Actions by status", ["Open", "In progress", "Overdue", "Awaiting verification", "Closed"], [6,4,4,3,18]);
      break;
    }
    case "qaqc": {
      base.kpis = [reportKpi("Inspections completed", 64, "Demo QA/QC register"), reportKpi("Accepted first time", "89%", "First-pass acceptance"), reportKpi("Open hold points", 6, "Awaiting inspection or documents"), reportKpi("Open NCRs", 4, "Corrective action required")];
      base.summary = "Quality performance is stable, with first-pass acceptance at 89%. Hold-point readiness, test documentation, and repeat defects should be managed before they affect commissioning.";
      base.tableTitle = "QA/QC performance by discipline";
      base.columns = ["Discipline", "Inspections", "Accepted", "Rejected", "First-pass %", "Hold points open", "Status"];
      base.rows = [["Mechanical", "14", "13", "1", "93%", "1", "Good"], ["Piping", "18", "15", "3", "83%", "3", "Attention"], ["Electrical", "11", "10", "1", "91%", "1", "Good"], ["Instrumentation", "9", "8", "1", "89%", "1", "Watch"], ["Civil", "12", "11", "1", "92%", "0", "Good"]];
      base.actions = [reportAction("Improve inspection readiness", "Confirm drawings, ITP steps, materials, calibrated tools, and records before calling inspection."), reportAction("Close repeat defects", "Analyse rejection themes and coach the responsible crews."), reportAction("Protect commissioning dossiers", "Complete and index signed inspection and test records by system.")];
      base.chart = reportChart("First-pass acceptance", ["Mechanical", "Piping", "Electrical", "Instrumentation", "Civil"], [93,83,91,89,92], { suffix: "%", max: 100 });
      break;
    }
    case "non_conformance": {
      base.kpis = [reportKpi("Open NCRs", 4, "Demo NCR register"), reportKpi("Overdue", 1, "Past corrective-action date"), reportKpi("Closed this month", 7, "Client-verified"), reportKpi("Estimated impact", formatMoney(budget*.006), "Rework and delay exposure")];
      base.summary = "Four non-conformances remain open. Piping and coating defects carry the largest rework and schedule exposure and should be closed before testing and handover.";
      base.tableTitle = "Non-conformance register";
      base.columns = ["NCR", "Discipline", "Defect", "Disposition", "Owner", "Due", "Impact", "Status"];
      base.rows = [["NCR-037", "Piping", "Weld undercut above acceptance limit", "Repair and re-test", "Piping manager", "23 Jul", "2 days", "In progress"], ["NCR-039", "Civil", "Coating DFT below specification", "Prepare and recoat", "Civil manager", "24 Jul", "R42,000", "Open"], ["NCR-041", "Electrical", "Cable gland not certified for area", "Replace", "Electrical manager", "22 Jul", "1 day", "Overdue"], ["NCR-044", "Instrumentation", "Impulse-line support spacing", "Rework", "I&C manager", "26 Jul", "No milestone impact", "Open"]];
      base.actions = [reportAction("Agree disposition quickly", "Obtain engineering and client acceptance before rework or use-as-is decisions."), reportAction("Verify root cause", "Separate workmanship, material, design, supervision, and process failures."), reportAction("Prevent recurrence", "Update work instructions, training, inspection points, and supplier controls.")];
      base.chart = reportChart("NCRs by discipline", ["Piping", "Civil", "Electrical", "Instrumentation", "Mechanical"], [1,1,1,1,0]);
      break;
    }
    case "punch_list": {
      base.kpis = [reportKpi("Open punch items", 46, "Demo punch register"), reportKpi("Category A", 7, "Blocks safe commissioning"), reportKpi("Closed this week", 19, "Verified close-out"), reportKpi("Systems ready", "3 / 8", "No category-A items")];
      base.summary = "Punch-list closure is becoming a commissioning constraint. Seven category-A items require focused ownership before system energisation or handover.";
      base.tableTitle = "Priority punch and snag items";
      base.columns = ["Punch ID", "System / area", "Description", "Category", "Owner", "Target", "Evidence", "Status"];
      base.rows = [["PL-118", "Cooling water", "Valve tag missing", "B", "Mechanical", "22 Jul", "Photo", "Open"], ["PL-124", "Substation 2", "Cable termination incomplete", "A", "Electrical", "23 Jul", "Inspection record", "In progress"], ["PL-131", "Instrument air", "Support requires additional clamp", "B", "I&C", "24 Jul", "Photo + inspection", "Open"], ["PL-139", "Firewater", "Pressure-test certificate outstanding", "A", "QA/QC", "22 Jul", "Signed certificate", "Overdue"], ["PL-145", "Pump bay", "Housekeeping and labels", "C", "Construction", "25 Jul", "Photo", "Open"]];
      base.actions = [reportAction("Prioritise category-A items", "Close items that block safe energisation, testing, or operation before cosmetic work."), reportAction("Bundle walkdowns by system", "Use joint contractor-client walkdowns and freeze new scope after acceptance."), reportAction("Require close-out evidence", "Attach photographs, signed inspection records, certificates, or marked-up drawings.")];
      base.chart = reportChart("Punch items by category", ["A - Critical", "B - Functional", "C - Minor", "Closed"], [7,23,16,82]);
      break;
    }
    case "welding_fabrication": {
      base.kpis = [reportKpi("Welds completed", 286, "Demo weld register"), reportKpi("NDT completed", 214, "74.8% of welds"), reportKpi("Repair rate", "3.7%", "Target below 5%"), reportKpi("Test packs ready", "9 / 15", "For pressure testing")];
      base.summary = "Weld production and repair rate remain within the demo quality target, but NDT completion and test-pack readiness must accelerate to protect pressure-testing milestones.";
      base.tableTitle = "Welding and fabrication status";
      base.columns = ["Line / spool", "Welds", "NDT complete", "Repairs", "Repair %", "Welder / shop", "Test pack", "Status"];
      base.rows = [["CW-101 / Spools 01-18", "62", "58", "2", "3.2%", "Shop A", "TP-04", "Ready"], ["FW-204 / Spools 01-14", "48", "36", "3", "6.3%", "Shop B", "TP-06", "Attention"], ["IA-330 / Spools 01-22", "71", "51", "2", "2.8%", "Site team", "TP-09", "In progress"], ["DR-118 / Spools 01-11", "39", "30", "1", "2.6%", "Shop A", "TP-11", "In progress"], ["STM-410 / Spools 01-16", "66", "39", "3", "4.5%", "Shop C", "TP-13", "NDT backlog"]];
      base.actions = [reportAction("Recover NDT backlog", "Align technicians, access, surface preparation, and film review with fabrication output."), reportAction("Investigate high repair lines", "Review welder, joint type, position, consumables, fit-up, and environmental conditions."), reportAction("Complete test dossiers", "Link weld maps, material certificates, NDT, heat treatment, and pressure-test records.")];
      base.chart = reportChart("Weld repair rate by system", ["Cooling water", "Firewater", "Instrument air", "Drain", "Steam"], [3.2,6.3,2.8,2.6,4.5], { suffix: "%", max: 8 });
      break;
    }
    case "rfi_register": {
      base.kpis = [reportKpi("Open RFIs", 11, "Demo engineering register"), reportKpi("Overdue responses", 3, "Past contractual date"), reportKpi("Schedule-critical", 4, "Blocking or threatening work"), reportKpi("Average response", "6.2 days", "Submitted to final answer")];
      base.summary = "Eleven RFIs remain open, including four with schedule impact. Clear responsibility and contractual response dates are required to prevent engineering queries from delaying work fronts.";
      base.tableTitle = "Request for information register";
      base.columns = ["RFI", "Discipline", "Question / clarification", "Submitted", "Due", "Responsible", "Schedule impact", "Status"];
      base.rows = [["RFI-082", "Instrumentation", "Confirm impulse-line routing at rack crossing", "14 Jul", "19 Jul", "Client engineer", "Blocks installation", "Overdue"], ["RFI-086", "Electrical", "Cable gland hazardous-area certification", "16 Jul", "21 Jul", "Design consultant", "Procurement hold", "Open"], ["RFI-089", "Civil", "Repair detail for existing plinth cracks", "17 Jul", "22 Jul", "Structural engineer", "2-day risk", "Open"], ["RFI-091", "Piping", "Tie-in flange rating discrepancy", "18 Jul", "23 Jul", "Process engineer", "Critical path", "Escalated"], ["RFI-094", "Mechanical", "Pump alignment tolerance confirmation", "19 Jul", "24 Jul", "Vendor", "No current impact", "Open"]];
      base.actions = [reportAction("Escalate schedule-critical RFIs", "Agree interim instructions or priority answers before work fronts become idle."), reportAction("Improve question quality", "Include drawing references, photographs, proposed solution, and required-by date."), reportAction("Record final answers", "Distribute responses to affected drawings, methods, procurement, and field teams.")];
      base.chart = reportChart("Open RFIs by discipline", ["Instrumentation", "Electrical", "Civil", "Piping", "Mechanical"], [3,2,2,3,1]);
      break;
    }
    case "drawing_register": {
      base.kpis = [reportKpi("Controlled drawings", 428, "Demo document register"), reportKpi("Issued for construction", 312, "Current IFC set"), reportKpi("Under review", 37, "Client or design review"), reportKpi("Superseded on site", 2, "Requires immediate withdrawal")];
      base.summary = "The drawing register controls current revisions and issue purpose. Two superseded copies found in field circulation require immediate withdrawal and verification.";
      base.tableTitle = "Priority drawing register";
      base.columns = ["Drawing number", "Title", "Discipline", "Revision", "Issue purpose", "Issued", "Client status", "Field status"];
      base.rows = [["P-410-201", "Cooling-water piping GA", "Piping", "C3", "IFC", "18 Jul", "Approved", "Current"], ["E-220-118", "Substation cable routing", "Electrical", "B2", "IFC", "16 Jul", "Approved with comments", "Current"], ["I-330-044", "Instrument hook-ups", "Instrumentation", "A4", "Review", "19 Jul", "Under review", "Not for construction"], ["C-115-072", "Pump plinth repair detail", "Civil", "B1", "Review", "17 Jul", "Comments received", "Revision required"], ["M-510-016", "Pump alignment arrangement", "Mechanical", "C1", "IFC", "12 Jul", "Approved", "Superseded copy found"]];
      base.actions = [reportAction("Withdraw superseded copies", "Verify controlled drawing stations and field teams are using the latest revision."), reportAction("Close review comments", "Track each comment into the next revision and retain response evidence."), reportAction("Link drawings to work packages", "Prevent construction release where required IFC drawings are missing.")];
      base.chart = reportChart("Drawings by issue status", ["IFC", "Under review", "Revise and resubmit", "As-built", "Superseded"], [312,37,18,59,2]);
      break;
    }
    case "technical_submittal": {
      base.kpis = [reportKpi("Active submittals", 34, "Demo submittal register"), reportKpi("Approved", 21, "Released for procurement or use"), reportKpi("Under review", 8, "Client / engineer review"), reportKpi("Overdue", 5, "Response or resubmission overdue")];
      base.summary = "Technical-submittal approvals are constraining several procurement items. Overdue reviews and resubmissions should be prioritised by schedule impact.";
      base.tableTitle = "Technical-submittal register";
      base.columns = ["Submittal", "Item", "Supplier", "Specification", "Revision", "Submitted", "Review code", "Status"];
      base.rows = [["TS-066", "Control valve data sheet", "FlowTech", "SP-IC-014", "2", "12 Jul", "B - Approved with comments", "Release pending"], ["TS-071", "LV cable schedule", "PowerCore", "SP-EL-022", "1", "15 Jul", "A - Approved", "Closed"], ["TS-074", "Protective coating system", "CoatPro", "SP-CV-008", "3", "16 Jul", "C - Revise", "Resubmission due"], ["TS-077", "Pipe fitting MTC pack", "Cape Industrial", "SP-PP-031", "1", "18 Jul", "Under review", "Open"], ["TS-081", "Instrument cable", "SignalWorks", "SP-IC-018", "1", "19 Jul", "Under review", "Open"]];
      base.actions = [reportAction("Prioritise schedule-critical reviews", "Sort by required-on-site date and procurement lead time."), reportAction("Close comment cycles", "Respond to every comment and clearly identify changes in resubmissions."), reportAction("Link approval to release", "Prevent purchase, manufacture, or installation before the required approval code.")];
      base.chart = reportChart("Submittals by status", ["Approved", "Approved with comments", "Under review", "Revise", "Overdue"], [21,6,8,4,5]);
      break;
    }
    case "document_control": {
      base.kpis = [reportKpi("Documents controlled", 1284, "Demo document system"), reportKpi("Transmittals this month", 46, "Incoming and outgoing"), reportKpi("Reviews overdue", 12, "Past response date"), reportKpi("Acknowledgements missing", 7, "Controlled-copy distribution")];
      base.summary = "Document control is managing more than a thousand project records. Overdue reviews and unconfirmed distribution require attention to protect traceability and field use of current information.";
      base.tableTitle = "Document-control performance";
      base.columns = ["Document class", "Total", "Issued this month", "Under review", "Overdue", "Superseded", "Owner", "Status"];
      base.rows = [["Drawings", "428", "31", "37", "6", "22", "Engineering", "Watch"], ["Procedures / methods", "116", "8", "12", "2", "9", "Construction", "Good"], ["Quality records", "302", "44", "18", "3", "0", "QA/QC", "Watch"], ["Vendor documents", "249", "29", "21", "1", "14", "Procurement", "Good"], ["HSE records", "189", "36", "9", "0", "0", "HSE", "Good"]];
      base.actions = [reportAction("Recover overdue reviews", "Escalate documents that affect procurement, construction, inspection, or commissioning."), reportAction("Verify distribution", "Confirm recipients acknowledged new revisions and withdrew superseded copies."), reportAction("Maintain metadata quality", "Use consistent numbers, titles, disciplines, revisions, dates, status codes, and transmittal references.")];
      base.chart = reportChart("Documents by class", ["Drawings", "Procedures", "Quality", "Vendor", "HSE"], [428,116,302,249,189]);
      break;
    }
    case "design_progress": {
      base.kpis = [reportKpi("Design complete", "76%", "Demo design register"), reportKpi("IFC issued", 312, "Construction-ready drawings"), reportKpi("Deliverables overdue", 18, "Past baseline date"), reportKpi("Forecast completion", "18 Sep 2026", "Current productivity forecast")];
      base.summary = "Design is 76% complete. Instrumentation and civil deliverables are below plan and create downstream procurement and construction exposure.";
      base.tableTitle = "Design progress by discipline";
      base.columns = ["Discipline", "Planned %", "Actual %", "IFR", "IFC", "Overdue", "Forecast complete", "Status"];
      base.rows = [["Process", "100%", "98%", "6", "42", "1", "29 Jul", "Watch"], ["Mechanical", "84%", "81%", "12", "68", "3", "16 Aug", "Watch"], ["Piping", "82%", "78%", "18", "74", "4", "28 Aug", "Attention"], ["Electrical", "75%", "73%", "9", "51", "2", "04 Sep", "Watch"], ["Instrumentation", "74%", "65%", "21", "44", "6", "18 Sep", "Attention"], ["Civil", "78%", "69%", "11", "33", "2", "12 Sep", "Attention"]];
      base.actions = [reportAction("Recover priority deliverables", "Focus design resources on items linked to critical procurement and construction fronts."), reportAction("Freeze interfaces", "Resolve cross-discipline clashes before IFC issue."), reportAction("Track comment incorporation", "Measure time from review return to revised issue and prevent repeat comments.")];
      base.chart = reportChart("Actual design progress", ["Process", "Mechanical", "Piping", "Electrical", "Instrumentation", "Civil"], [98,81,78,73,65,69], { suffix: "%", max: 100 });
      break;
    }
    case "engineering_deliverables": {
      base.kpis = [reportKpi("Total deliverables", 682, "Demo engineering register"), reportKpi("Complete", 518, "Issued at required status"), reportKpi("Due next 30 days", 96, "Planned delivery window"), reportKpi("Overdue", 18, "Requires recovery")];
      base.summary = "Engineering deliverables are 76% complete. The report links responsible discipline, planned and actual issue dates, revisions, approval, dependencies, and overdue recovery.";
      base.tableTitle = "Priority engineering deliverables";
      base.columns = ["Deliverable", "Discipline", "Planned issue", "Actual / forecast", "Revision", "Approval", "Dependency", "Status"];
      base.rows = [["Cooling-water stress report", "Piping", "15 Jul", "22 Jul forecast", "A", "Required", "Pipe support IFC", "Overdue"], ["Substation protection study", "Electrical", "20 Jul", "19 Jul", "B", "Approved", "Relay settings", "Complete"], ["Instrument index update", "Instrumentation", "18 Jul", "25 Jul forecast", "C", "Under review", "Cable schedule", "Overdue"], ["Pump alignment procedure", "Mechanical", "23 Jul", "23 Jul forecast", "A", "Vendor review", "Installation", "On track"], ["Concrete repair calculation", "Civil", "16 Jul", "21 Jul", "B", "Comments", "Repair drawing", "Recovery"]];
      base.actions = [reportAction("Prioritise dependency deliverables", "Identify items that release multiple downstream activities."), reportAction("Reforecast transparently", "Use realistic dates based on remaining work and review cycles."), reportAction("Escalate overdue approvals", "Separate internal production delays from client or vendor response delays.")];
      base.chart = reportChart("Deliverables by status", ["Complete", "In progress", "Under review", "Overdue", "Not started"], [518,82,41,18,23]);
      break;
    }
    case "revision_status": {
      base.kpis = [reportKpi("Revisions issued", 74, "Current month"), reportKpi("Current revisions", 428, "Controlled documents"), reportKpi("Superseded withdrawn", "98%", "Distribution compliance"), reportKpi("Revision conflicts", 2, "Field copies require correction")];
      base.summary = "Revision control is effective overall, but two field conflicts require immediate correction to prevent work from outdated information.";
      base.tableTitle = "Revision status and distribution";
      base.columns = ["Document", "Previous", "Current", "Revision reason", "Issue purpose", "Effective date", "Distribution", "Status"];
      base.rows = [["P-410-201", "C2", "C3", "Tie-in dimensions updated", "IFC", "18 Jul", "Acknowledged", "Current"], ["E-220-118", "B1", "B2", "Cable route revised", "IFC", "16 Jul", "Acknowledged", "Current"], ["I-330-044", "A3", "A4", "Hook-up detail changed", "Review", "19 Jul", "Pending", "Not for construction"], ["C-115-072", "A2", "B1", "Repair method revised", "Review", "17 Jul", "Acknowledged", "Comments"], ["M-510-016", "B4", "C1", "Vendor tolerance included", "IFC", "12 Jul", "Conflict found", "Action required"]];
      base.actions = [reportAction("Correct field conflicts", "Withdraw outdated hard copies and verify electronic access points."), reportAction("Explain revision impact", "Highlight changed scope, interfaces, materials, methods, or acceptance criteria."), reportAction("Record acknowledgements", "Retain recipient confirmation for controlled distribution.")];
      base.chart = reportChart("Revision issues by purpose", ["IFC", "Review", "Approval", "As-built", "Tender"], [38,19,8,7,2]);
      break;
    }
    case "client_approval": {
      base.kpis = [reportKpi("Awaiting client", 23, "Demo approval tracker"), reportKpi("Overdue", 7, "Past contractual response date"), reportKpi("Schedule-critical", 6, "Affects procurement or field work"), reportKpi("Average review", "8.1 days", "Target 5 days")];
      base.summary = "Client review duration is above target, with six schedule-critical items awaiting response. The tracker supports escalation and quantifies downstream impact.";
      base.tableTitle = "Client approval tracker";
      base.columns = ["Item", "Type", "Submitted", "Response due", "Reviewer", "Approval code", "Impact", "Status"];
      base.rows = [["Control valve submittal TS-066", "Technical submittal", "12 Jul", "19 Jul", "Client I&C", "Pending", "Procurement release", "Overdue"], ["RFI-082 impulse routing", "RFI", "14 Jul", "19 Jul", "Client engineering", "Pending", "Installation blocked", "Overdue"], ["Coating procedure", "Method statement", "15 Jul", "22 Jul", "Client QA", "Comments", "Civil work", "Resubmit"], ["Shutdown isolation plan", "Operations approval", "17 Jul", "24 Jul", "Client operations", "Under review", "Shutdown readiness", "Open"], ["Monthly progress claim", "Commercial", "18 Jul", "25 Jul", "Client QS", "Under review", "Cash flow", "Open"]];
      base.actions = [reportAction("Escalate critical overdue items", "Use the agreed governance route and record the effect on cost and schedule."), reportAction("Submit complete packages", "Reduce review cycles through clear revision histories, comment responses, and supporting evidence."), reportAction("Track response performance", "Compare actual review time with contractual and agreed service levels.")];
      base.chart = reportChart("Approvals by status", ["Approved", "Approved with comments", "Under review", "Resubmit", "Overdue"], [31,12,11,5,7]);
      break;
    }
    case "turnaround_shutdown": {
      base.kpis = [reportKpi("Shutdown progress", `${round(m.actualProgress)}%`, "Current completion"), reportKpi("Hours remaining", Math.max(0, m.daysRemaining * 24), "Based on project end date"), reportKpi("Critical work fronts", 8, "Demo shutdown scope"), reportKpi("Restart blockers", 5, "Open critical items")];
      base.summary = `Shutdown scope is ${round(m.actualProgress)}% complete against ${round(m.plannedProgress)}% planned. Critical-path work, permit readiness, shift resources, inspection, and restart blockers require continuous control.`;
      base.tableTitle = "Shutdown critical-path status";
      base.columns = ["Work scope", "Unit / system", "Planned %", "Actual %", "Shift owner", "Constraint", "Restart critical", "Status"];
      base.rows = WORK_PACKAGES.map((item, index) => [item.name, ["Unit 1", "Substation 2", "Pipe rack A", "Control system", "Utilities"][index], `${cap(item.progress + 8)}%`, `${item.progress}%`, item.owner, item.status === "On track" ? "None" : ["Material", "Access", "Inspection", "Engineering", "Permit"][index], index < 4 ? "Yes" : "No", item.status]);
      base.actions = [reportAction("Control the critical path hourly", "Use shift-level targets, remaining quantities, resource loading, and constraint owners."), reportAction("Protect safe restart", "Do not trade isolation, inspection, testing, or punch-list controls for schedule recovery."), reportAction("Freeze restart blockers", "Maintain one agreed list with client operations and commissioning leadership.")];
      base.chart = reportChart("Shutdown work-front progress", WORK_PACKAGES.map(item => item.name), WORK_PACKAGES.map(item => item.progress), { suffix: "%", max: 100 });
      break;
    }
    case "process_safety": {
      base.kpis = [reportKpi("Tier 1 events", 0, "Demo process-safety register"), reportKpi("Tier 2 events", 1, "Minor loss of primary containment"), reportKpi("Safety-system impairments", 3, "Temporary impairments"), reportKpi("Overdue PSM actions", 4, "Requires management review")];
      base.summary = "No Tier 1 process-safety event is recorded in the demo register. One Tier 2 event and temporary safety-system impairments require close control and verified restoration.";
      base.tableTitle = "Process-safety indicators";
      base.columns = ["Indicator / event", "Current", "Threshold / target", "Area", "Owner", "Due", "Control", "Status"];
      base.rows = [["Tier 1 process safety events", "0", "0", "Site-wide", "Operations", "Ongoing", "Critical controls", "Good"], ["Tier 2 loss of containment", "1", "0", "Pump bay", "Operations", "24 Jul", "Seal replacement", "Open"], ["Relief-device activations", "2", "Review each", "Unit 1", "Process engineer", "23 Jul", "Cause review", "In progress"], ["Safety-system impairments", "3", "0 overdue", "Multiple", "Maintenance", "22 Jul", "Temporary controls", "Attention"], ["High-high alarm standing", "6", "< 5", "Control room", "Operations", "25 Jul", "Alarm rationalisation", "Watch"]];
      base.actions = [reportAction("Restore impaired protection", "Apply approved temporary controls and prioritise repair of safety-critical systems."), reportAction("Investigate containment events", "Confirm source, quantity, consequence, tier classification, and systemic causes."), reportAction("Review leading indicators", "Track overdue proof tests, alarms, bypasses, permits, inspections, and PHA actions.")];
      base.chart = reportChart("Process-safety indicators", ["Tier 1", "Tier 2", "Relief activations", "Impairments", "Overdue actions"], [0,1,2,3,4]);
      break;
    }
    case "maintenance_reliability": {
      base.kpis = [reportKpi("PM compliance", "91%", "Preventive maintenance completed on time"), reportKpi("Breakdowns", 7, "Current month"), reportKpi("Maintenance backlog", "486 h", "Approved work not completed"), reportKpi("Critical equipment down", 2, "Requires priority recovery")];
      base.summary = "Preventive-maintenance compliance is 91%. Reliability risk is concentrated in two critical assets and an ageing corrective-maintenance backlog.";
      base.tableTitle = "Maintenance and reliability status";
      base.columns = ["Asset", "Criticality", "PM status", "Breakdowns", "Downtime", "MTBF", "Current work order", "Status"];
      base.rows = [["Cooling-water pump P-101A", "High", "Complete", "1", "6.2 h", "412 h", "Seal replacement", "In progress"], ["Air compressor C-204", "High", "Overdue", "2", "14.5 h", "188 h", "Valve overhaul", "Attention"], ["Firewater pump P-301B", "Safety critical", "Complete", "0", "0 h", "> 1,000 h", "Proof test", "Good"], ["Instrument air dryer D-330", "Medium", "Due", "1", "3.8 h", "526 h", "Filter change", "Watch"], ["Substation UPS U-22", "High", "Complete", "1", "2.1 h", "738 h", "Battery test", "Good"]];
      base.actions = [reportAction("Recover critical backlog", "Prioritise safety, production, environmental, and single-point-failure equipment."), reportAction("Improve failure analysis", "Use repeat failure, MTBF, downtime, and maintenance history to eliminate chronic problems."), reportAction("Protect spares readiness", "Confirm critical spares, repairable assets, preservation, and reorder points.")];
      base.chart = reportChart("Downtime by asset", ["P-101A", "C-204", "P-301B", "D-330", "UPS U-22"], [6.2,14.5,0,3.8,2.1], { suffix: " h" });
      break;
    }
    case "inspection_corrosion": {
      base.kpis = [reportKpi("Assets due inspection", 18, "Demo integrity register"), reportKpi("Overdue", 3, "Past inspection date"), reportKpi("High RBI risk", 5, "Priority equipment"), reportKpi("Repairs required", 7, "Temporary or permanent")];
      base.summary = "Inspection and corrosion monitoring identifies three overdue inspections and five high-risk assets. Remaining life and repair plans should be confirmed before continued operation or restart.";
      base.tableTitle = "Inspection and corrosion register";
      base.columns = ["Asset / circuit", "Inspection", "Current thickness", "Corrosion rate", "Remaining life", "RBI rank", "Repair / action", "Status"];
      base.rows = [["P-410-CW-03", "UT thickness", "5.8 mm", "0.24 mm/y", "6.7 y", "High", "Install clamp then replace", "Open"], ["V-104 shell", "Internal visual", "12.4 mm", "0.08 mm/y", "18 y", "Medium", "Monitor", "Acceptable"], ["E-220 cable trench", "Visual", "N/A", "N/A", "N/A", "Medium", "Repair water ingress", "Overdue"], ["P-118 drain header", "UT thickness", "3.9 mm", "0.31 mm/y", "2.9 y", "High", "Replace spool", "Planned"], ["TK-207 floor", "MFL scan", "6.7 mm", "0.15 mm/y", "9.2 y", "High", "Engineering assessment", "In review"]];
      base.actions = [reportAction("Complete overdue inspections", "Apply formal deferral and risk controls where inspection cannot be completed on time."), reportAction("Approve repair plans", "Define temporary repair limits, monitoring, permanent repair scope, and completion dates."), reportAction("Update remaining life", "Use verified thickness, corrosion rates, minimum required thickness, and operating conditions.")];
      base.chart = reportChart("Remaining life by asset", ["CW-03", "V-104", "Drain header", "TK-207", "Other high-risk"], [6.7,18,2.9,9.2,4.1], { suffix: " y" });
      break;
    }
    case "production_operations": {
      base.kpis = [reportKpi("Throughput", "82,400 bpd", "Demo operations data"), reportKpi("Plan attainment", "94%", "Actual / planned production"), reportKpi("Unit availability", "91%", "Time available for operation"), reportKpi("Operational losses", "5,200 bbl", "Estimated current month")];
      base.summary = "Production attainment is 94% with unit availability at 91%. Unplanned downtime and off-spec production are the largest contributors to operational loss.";
      base.tableTitle = "Production and unit performance";
      base.columns = ["Unit / product", "Plan", "Actual", "Attainment", "Availability", "Off-spec / loss", "Constraint", "Status"];
      base.rows = [["Crude unit", "90,000 bpd", "84,500 bpd", "94%", "93%", "1,800 bbl", "Heat exchanger fouling", "Watch"], ["Hydrotreating", "42,000 bpd", "40,300 bpd", "96%", "95%", "600 bbl", "Feed variability", "Good"], ["Utilities", "100% demand", "97%", "97%", "89%", "N/A", "Compressor downtime", "Attention"], ["Diesel product", "38,500 bpd", "36,100 bpd", "94%", "N/A", "1,200 bbl off-spec", "Sulphur excursion", "Watch"], ["Jet product", "12,000 bpd", "11,500 bpd", "96%", "N/A", "300 bbl loss", "Tank availability", "Good"]];
      base.actions = [reportAction("Recover unit availability", "Prioritise chronic equipment, utilities, and turnaround actions affecting throughput."), reportAction("Reduce off-spec production", "Review feed, process controls, laboratory results, and operating windows."), reportAction("Quantify loss drivers", "Separate planned, unplanned, rate, quality, storage, and utility losses.")];
      base.chart = reportChart("Production plan attainment", ["Crude", "Hydrotreating", "Utilities", "Diesel", "Jet"], [94,96,97,94,96], { suffix: "%", max: 100 });
      break;
    }
    case "environmental_emissions": {
      base.kpis = [reportKpi("Permit exceedances", 0, "Demo environmental register"), reportKpi("Flaring", "18.6 t", "Current month"), reportKpi("Water use", "42.1 ML", "Current month"), reportKpi("Waste recycled", "78%", "Of non-hazardous waste")];
      base.summary = "No permit exceedance is recorded in the demo register. Flaring, wastewater, energy use, and hazardous waste remain the priority environmental performance areas.";
      base.tableTitle = "Environmental and emissions performance";
      base.columns = ["Indicator", "Current", "Limit / target", "Previous", "Variance", "Source", "Action", "Status"];
      base.rows = [["SOx emissions", "41 t", "55 t", "44 t", "-3 t", "Stack monitoring", "Maintain fuel quality", "Compliant"], ["NOx emissions", "36 t", "48 t", "34 t", "+2 t", "CEMS", "Review burner tuning", "Compliant"], ["Flaring", "18.6 t", "< 15 t", "16.2 t", "+3.6 t", "Flare meter", "Reduce start-up flaring", "Attention"], ["Wastewater COD", "82 mg/L", "100 mg/L", "79 mg/L", "+3", "Laboratory", "Monitor", "Compliant"], ["Hazardous waste", "26 t", "Reduce 5%", "24 t", "+2 t", "Waste manifests", "Improve segregation", "Watch"], ["Water consumption", "42.1 ML", "40 ML", "41.4 ML", "+2.1 ML", "Utility meter", "Leak survey", "Watch"]];
      base.actions = [reportAction("Reduce flaring", "Analyse causes, improve start-up planning, and repair contributing equipment."), reportAction("Control water and waste", "Target leaks, reuse opportunities, segregation, and contractor performance."), reportAction("Maintain compliance evidence", "Retain calibrated monitoring, laboratory, manifests, calculations, and permit reports.")];
      base.chart = reportChart("Environmental performance vs target", ["SOx", "NOx", "Flaring", "Wastewater", "Water", "Waste recycled"], [75,75,124,82,105,78], { suffix: "%", max: 130 });
      break;
    }
    case "commissioning_startup": {
      base.kpis = [reportKpi("Systems", 8, "Demo commissioning scope"), reportKpi("Mechanically complete", 5, "Signed MC certificates"), reportKpi("Ready for start-up", 3, "All prerequisite checks complete"), reportKpi("Critical punch items", 7, "Category A blockers")];
      base.summary = "Three of eight systems are ready for start-up. Mechanical completion, test documentation, loop checks, energisation, punch-list closure, and operating acceptance determine readiness.";
      base.tableTitle = "Commissioning and start-up readiness";
      base.columns = ["System", "Mechanical complete", "Pre-commissioning", "Tests", "Punch A", "Operations acceptance", "Start-up window", "Status"];
      base.rows = [["Cooling water", "Yes", "100%", "Complete", "0", "Accepted", "24 Jul", "Ready"], ["Firewater", "Yes", "92%", "Pressure test complete", "1", "Conditional", "26 Jul", "Watch"], ["Instrument air", "Yes", "88%", "Leak test complete", "1", "Under review", "28 Jul", "Watch"], ["Electrical distribution", "Yes", "81%", "Protection test ongoing", "2", "Pending", "30 Jul", "Attention"], ["Control system", "No", "72%", "Loop checks ongoing", "2", "Pending", "03 Aug", "Attention"], ["Drain system", "Yes", "95%", "Complete", "0", "Accepted", "25 Jul", "Ready"]];
      base.actions = [reportAction("Freeze system readiness criteria", "Agree the documents, tests, punch categories, permits, and approvals required for each release."), reportAction("Close category-A punch items", "Prioritise safe operation and functional completion before cosmetic items."), reportAction("Run joint readiness reviews", "Include construction, commissioning, operations, maintenance, HSE, and QA/QC.")];
      base.chart = reportChart("Commissioning readiness", ["Cooling water", "Firewater", "Instrument air", "Electrical", "Control system", "Drain"], [100,92,88,81,72,95], { suffix: "%", max: 100 });
      break;
    }
    case "handover_closeout": {
      base.kpis = [reportKpi("Handover dossiers", 8, "System packages"), reportKpi("Accepted", 3, "Client acceptance"), reportKpi("Documents complete", "74%", "Required close-out records"), reportKpi("Final punch items", 46, "Open across systems")];
      base.summary = "Close-out is 74% document-complete, with three systems accepted. As-built drawings, O&M manuals, training, warranties, certificates, and punch closure remain the main handover controls.";
      base.tableTitle = "Handover dossier status";
      base.columns = ["System / package", "As-builts", "O&M manuals", "Certificates", "Training", "Punch closed", "Client acceptance", "Status"];
      base.rows = [["Cooling water", "Complete", "Complete", "Complete", "Complete", "100%", "Accepted", "Closed"], ["Firewater", "Complete", "Complete", "Complete", "Scheduled", "92%", "Conditional", "Watch"], ["Instrument air", "Draft", "Complete", "Complete", "Scheduled", "88%", "Pending", "In progress"], ["Electrical distribution", "Draft", "Incomplete", "Testing open", "Not started", "81%", "Pending", "Attention"], ["Control system", "In progress", "Draft", "Loop records open", "Not started", "72%", "Pending", "Attention"], ["Civil works", "Complete", "N/A", "Complete", "N/A", "96%", "Accepted", "Close-out"]];
      base.actions = [reportAction("Complete dossier indexes", "Assign document owners and verify every required record against the handover matrix."), reportAction("Finish training and warranties", "Capture attendance, competency confirmation, supplier warranties, and spare-parts handover."), reportAction("Obtain formal acceptance", "Record conditional acceptance, outstanding obligations, final completion dates, and retention release requirements.")];
      base.chart = reportChart("Handover completion", ["Cooling water", "Firewater", "Instrument air", "Electrical", "Control system", "Civil"], [100,92,88,81,72,96], { suffix: "%", max: 100 });
      break;
    }
    default:
      throw new Error("The selected specialist report has not been configured yet.");
  }

  if (!base.kpis.length) base.kpis = [reportKpi("Actual progress", `${round(m.actualProgress)}%`), reportKpi("Actual spend", formatMoney(m.actualTotal)), reportKpi("Project health", `${m.healthScore}/100`), reportKpi("Days remaining", m.daysRemaining)];
  if (!base.actions.length) base.actions = [reportAction("Review report", "Assign owners and due dates to all items requiring action.")];
  return attachDatasetToIndustryReport(base, reportType);
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
  if (isIndustryReport(reportType)) return exportIndustryPowerPoint(reportType);
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
  if (isIndustryReport(reportType)) return exportIndustryPdf(reportType);
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
  if (isIndustryReport(reportType)) return exportIndustryExcel(reportType);
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
  if (isIndustryReport(reportType)) return exportIndustryCsv(reportType);
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
  if (isIndustryReport(reportType)) return exportIndustryPng(reportType);
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

function formatIndustryChartValue(value, chart) {
  const number = validNumber(value);
  if (chart.prefix === "R") return formatMoney(number);
  const formatted = Number.isInteger(number) ? number.toLocaleString("en-ZA") : number.toFixed(1);
  return `${chart.prefix || ""}${formatted}${chart.suffix || ""}`;
}

function addPptIndustryBarChart(slide, pptx, model, x, y, w, h, C) {
  const chart = model.chart;
  if (!chart?.values?.length) return;
  const items = chart.labels.slice(0, 8).map((label, index) => ({ label, value: validNumber(chart.values[index]) }));
  const max = chart.max || Math.max(...items.map(item => item.value), 1);
  const labelW = Math.min(2.1, w * .28);
  const valueW = Math.min(1.15, w * .17);
  const barX = x + labelW;
  const barW = w - labelW - valueW - .18;
  const rowH = h / Math.max(1, items.length);
  items.forEach((item, index) => {
    const rowY = y + index * rowH;
    const barHeight = Math.min(.22, rowH * .45);
    slide.addText(String(item.label), { x, y: rowY + .01, w: labelW - .08, h: rowH - .02, fontSize: 7.2, color: C.muted, margin: 0, fit: "shrink", valign: "mid" });
    slide.addShape(pptx.ShapeType.roundRect, { x: barX, y: rowY + (rowH - barHeight) / 2, w: barW, h: barHeight, rectRadius: .03, line: { color: C.border, transparency: 100 }, fill: { color: C.soft } });
    slide.addShape(pptx.ShapeType.roundRect, { x: barX, y: rowY + (rowH - barHeight) / 2, w: Math.max(.02, barW * cap(item.value / max, 1)), h: barHeight, rectRadius: .03, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
    slide.addText(formatIndustryChartValue(item.value, chart), { x: barX + barW + .09, y: rowY + .01, w: valueW, h: rowH - .02, fontSize: 7.2, bold: true, color: C.text, align: "right", margin: 0, fit: "shrink", valign: "mid" });
  });
}

async function exportIndustryPowerPoint(reportType) {
  const model = getIndustryReportModel(reportType);
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = state.customization.brandName;
  pptx.company = state.customization.companyName;
  pptx.subject = `${state.project.name} ${model.title}`;
  pptx.title = `${state.project.name} - ${model.title}`;
  pptx.lang = "en-ZA";
  pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-ZA" };
  const C = getPptPalette();

  const footer = (slide, number) => {
    slide.addText(`${state.customization.brandName} | ${model.title}`, { x: .55, y: 7.12, w: 8, h: .18, fontSize: 8, color: C.muted, margin: 0, fit: "shrink" });
    slide.addText(`${number}`, { x: 12.2, y: 7.1, w: .5, h: .2, fontSize: 8, color: C.muted, align: "right", margin: 0 });
  };
  const title = (slide, heading, subtitle, number) => {
    slide.background = { color: C.bg };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: .14, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
    slide.addText(heading, { x: .55, y: .34, w: 9.8, h: .38, fontFace: "Aptos Display", fontSize: 22, bold: true, color: C.text, margin: 0, fit: "shrink" });
    slide.addText(subtitle, { x: .55, y: .79, w: 11.7, h: .24, fontSize: 9.2, color: C.muted, margin: 0, fit: "shrink" });
    footer(slide, number);
  };
  const kpi = (slide, x, y, w, item) => {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 1.06, rectRadius: .07, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
    slide.addText(item.label.toUpperCase(), { x: x + .16, y: y + .13, w: w - .32, h: .16, fontSize: 7.1, bold: true, color: C.muted, charSpacing: .6, margin: 0, fit: "shrink" });
    slide.addText(item.value, { x: x + .16, y: y + .37, w: w - .32, h: .29, fontSize: 17, bold: true, color: C.text, margin: 0, fit: "shrink" });
    slide.addText(item.note || "", { x: x + .16, y: y + .78, w: w - .32, h: .16, fontSize: 6.7, color: C.muted, margin: 0, fit: "shrink" });
  };

  let slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: .22, h: 7.5, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
  if (state.customization.logoData) slide.addImage({ data: state.customization.logoData, x: .72, y: .58, w: .6, h: .6 });
  else {
    slide.addShape(pptx.ShapeType.roundRect, { x: .72, y: .58, w: .6, h: .6, rectRadius: .08, line: { color: C.primary, transparency: 100 }, fill: { color: C.primary } });
    slide.addText(state.customization.brandInitials, { x: .72, y: .77, w: .6, h: .16, fontSize: 11, bold: true, color: C.white, align: "center", margin: 0 });
  }
  slide.addText(state.customization.brandName, { x: 1.5, y: .68, w: 4.1, h: .3, fontSize: 20, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText(model.category.toUpperCase(), { x: .72, y: 1.95, w: 5.8, h: .24, fontSize: 9.5, bold: true, charSpacing: 1.1, color: C.primary, margin: 0, fit: "shrink" });
  slide.addText(model.title, { x: .7, y: 2.32, w: 9.6, h: .9, fontFace: "Aptos Display", fontSize: 34, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText(state.project.name, { x: .72, y: 3.5, w: 8, h: .36, fontSize: 16, color: "DDE7EA", margin: 0, fit: "shrink" });
  slide.addText(`${state.project.client} | ${state.project.location} | ${formatDate(state.project.startDate)} - ${formatDate(state.project.endDate)}`, { x: .72, y: 3.95, w: 9, h: .25, fontSize: 10, color: "9FB0B7", margin: 0, fit: "shrink" });
  slide.addText(model.description, { x: .72, y: 4.76, w: 8.4, h: .78, fontSize: 12, color: "B7C6CB", margin: 0, fit: "shrink" });
  slide.addShape(pptx.ShapeType.roundRect, { x: 10.1, y: 2.15, w: 2.25, h: 2.25, rectRadius: .12, line: { color: C.primary, pt: 2 }, fill: { color: "162930" } });
  slide.addText(model.icon, { x: 10.1, y: 2.75, w: 2.25, h: .55, fontSize: 30, bold: true, color: C.primary, align: "center", margin: 0, fit: "shrink" });
  slide.addText(`Generated ${model.reportDate}`, { x: .72, y: 6.72, w: 4.5, h: .2, fontSize: 8.5, color: "82949C", margin: 0 });

  slide = pptx.addSlide();
  title(slide, `${model.title} overview`, `${state.project.name} | ${model.reportDate}`, 2);
  const four = model.kpis.slice(0, 4);
  const kpiW = 2.92;
  four.forEach((item, index) => kpi(slide, .55 + index * 3.12, 1.18, kpiW, item));
  slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 2.54, w: 6.1, h: 3.95, rectRadius: .07, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
  slide.addText("MANAGEMENT SUMMARY", { x: .82, y: 2.82, w: 2.8, h: .2, fontSize: 8, bold: true, color: C.primary, charSpacing: .8, margin: 0 });
  slide.addText(model.summary, { x: .82, y: 3.19, w: 5.56, h: 1.26, fontSize: 11.3, color: C.text, margin: 0, fit: "shrink", valign: "top" });
  slide.addText("RECOMMENDED ACTIONS", { x: .82, y: 4.7, w: 2.8, h: .2, fontSize: 8, bold: true, color: C.primary, charSpacing: .8, margin: 0 });
  model.actions.slice(0, 3).forEach((action, index) => {
    const y = 5.02 + index * .47;
    slide.addText(`${index + 1}`, { x: .82, y, w: .28, h: .25, fontSize: 7.8, bold: true, color: C.white, align: "center", fill: { color: C.primary }, margin: .04 });
    slide.addText(action.title, { x: 1.2, y, w: 1.85, h: .2, fontSize: 8.5, bold: true, color: C.text, margin: 0, fit: "shrink" });
    slide.addText(action.detail, { x: 3.05, y: y - .01, w: 3.25, h: .28, fontSize: 7.4, color: C.muted, margin: 0, fit: "shrink" });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 6.9, y: 2.54, w: 5.88, h: 3.95, rectRadius: .07, line: { color: C.border, pt: 1 }, fill: { color: C.white } });
  slide.addText(model.chart?.title || "Report trend", { x: 7.2, y: 2.82, w: 4.8, h: .25, fontSize: 13, bold: true, color: C.text, margin: 0, fit: "shrink" });
  addPptIndustryBarChart(slide, pptx, model, 7.2, 3.28, 5.15, 2.72, C);
  slide.addText(model.sourceNote, { x: 7.2, y: 6.13, w: 5.1, h: .22, fontSize: 6.4, italic: true, color: C.muted, margin: 0, fit: "shrink" });

  slide = pptx.addSlide();
  title(slide, model.tableTitle, `${model.title} | Detailed register and management actions`, 3);
  const columns = model.columns.slice(0, 8);
  const bodyRows = model.rows.slice(0, 10).map(row => row.slice(0, columns.length).map(value => String(value ?? "")));
  const tableRows = [columns, ...bodyRows];
  const colW = Array(columns.length).fill(12.1 / Math.max(1, columns.length));
  slide.addTable(tableRows, {
    x: .55, y: 1.2, w: 12.23, h: 4.5, border: { type: "solid", color: C.border, pt: .7 },
    fill: C.white, color: C.text, fontSize: columns.length > 6 ? 6.4 : 7.2, margin: .055, rowH: .34,
    bold: false, autoFit: false, colW,
    fillRows: false, colorRows: false
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: .55, y: 5.9, w: 12.23, h: .76, rectRadius: .05, line: { color: C.border, pt: 1 }, fill: { color: C.soft } });
  slide.addText("REPORT SOURCE NOTE", { x: .8, y: 6.08, w: 1.8, h: .17, fontSize: 7.1, bold: true, color: C.primary, margin: 0 });
  slide.addText(model.sourceNote, { x: 2.58, y: 6.03, w: 9.8, h: .3, fontSize: 7.1, color: C.text, margin: 0, fit: "shrink" });

  await pptx.writeFile({ fileName: exportFileName("pptx", reportType) });
}

function drawPdfIndustryBars(doc, model, x, y, w, h, C) {
  const chart = model.chart;
  if (!chart?.values?.length) return;
  const items = chart.labels.slice(0, 8).map((label, index) => ({ label, value: validNumber(chart.values[index]) }));
  const max = chart.max || Math.max(...items.map(item => item.value), 1);
  const rowH = h / Math.max(1, items.length);
  const labelW = w * .30;
  const valueW = w * .17;
  const barW = w - labelW - valueW - 3;
  items.forEach((item, index) => {
    const rowY = y + index * rowH;
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.text(pdfText(String(item.label)), x, rowY + rowH*.62, { maxWidth: labelW - 1 });
    doc.setFillColor(...C.soft); doc.roundedRect(x + labelW, rowY + rowH*.30, barW, Math.min(3.3, rowH*.38), 1, 1, "F");
    doc.setFillColor(...C.primary); doc.roundedRect(x + labelW, rowY + rowH*.30, Math.max(.6, barW * cap(item.value / max, 1)), Math.min(3.3, rowH*.38), 1, 1, "F");
    doc.setTextColor(...C.text); doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); doc.text(pdfText(formatIndustryChartValue(item.value, chart)), x + w, rowY + rowH*.62, { align: "right" });
  });
}

async function exportIndustryPdf(reportType) {
  const model = getIndustryReportModel(reportType);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const C = getPdfPalette();
  const header = (heading, subtitle) => {
    doc.setFillColor(...C.bg); doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setFillColor(...C.primary); doc.rect(0, 0, pageWidth, 4, "F");
    doc.setTextColor(...C.text); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(pdfText(heading), 12, 16);
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(8.3); doc.text(pdfText(subtitle), 12, 22);
    addPdfLogo(doc, pageWidth - 25, 8, 13, 13);
  };
  const kpi = (x, y, w, item) => {
    doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(x, y, w, 23, 3, 3, "FD");
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "bold"); doc.setFontSize(6.6); doc.text(pdfText(item.label.toUpperCase()), x + 4, y + 6);
    doc.setTextColor(...C.text); doc.setFontSize(13.8); doc.text(pdfText(item.value), x + 4, y + 14, { maxWidth: w - 8 });
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(6.2); doc.text(doc.splitTextToSize(pdfText(item.note || ""), w - 8), x + 4, y + 19);
  };

  header(`${model.title} overview`, `${state.project.name} | ${state.project.client} | ${model.reportDate}`);
  const kpiW = (pageWidth - 36) / 4;
  model.kpis.slice(0, 4).forEach((item, index) => kpi(12 + index * (kpiW + 4), 30, kpiW, item));
  doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(12, 60, 132, 105, 3, 3, "FD");
  doc.setTextColor(...C.primary); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("MANAGEMENT SUMMARY", 18, 70);
  doc.setTextColor(...C.text); doc.setFont("helvetica", "normal"); doc.setFontSize(9.4); doc.text(doc.splitTextToSize(pdfText(model.summary), 120), 18, 80);
  doc.setTextColor(...C.primary); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("RECOMMENDED ACTIONS", 18, 112);
  model.actions.slice(0, 4).forEach((action, index) => {
    const y = 121 + index * 10;
    doc.setFillColor(...C.primary); doc.circle(20.5, y - 1.2, 2.2, "F");
    doc.setTextColor(...C.white); doc.setFontSize(6.5); doc.text(`${index + 1}`, 20.5, y - .2, { align: "center" });
    doc.setTextColor(...C.text); doc.setFont("helvetica", "bold"); doc.setFontSize(7.4); doc.text(pdfText(action.title), 25, y - 2, { maxWidth: 35 });
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(6.8); doc.text(doc.splitTextToSize(pdfText(action.detail), 73), 61, y - 2);
  });
  doc.setFillColor(...C.white); doc.setDrawColor(...C.border); doc.roundedRect(150, 60, 135, 105, 3, 3, "FD");
  doc.setTextColor(...C.text); doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text(pdfText(model.chart?.title || "Report trend"), 156, 71);
  drawPdfIndustryBars(doc, model, 156, 80, 123, 64, C);
  doc.setFillColor(...C.soft); doc.roundedRect(156, 148, 123, 11, 2, 2, "F");
  doc.setTextColor(...C.muted); doc.setFont("helvetica", "italic"); doc.setFontSize(6.1); doc.text(doc.splitTextToSize(pdfText(model.sourceNote), 116), 160, 153);

  doc.addPage("a4", "landscape");
  header(model.tableTitle, `${model.title} | Detailed register`);
  if (typeof doc.autoTable === "function") {
    doc.autoTable({
      startY: 29,
      head: [model.columns.map(pdfText)],
      body: model.rows.map(row => row.map(value => pdfText(value))),
      theme: "grid",
      styles: { font: "helvetica", fontSize: model.columns.length > 6 ? 6.2 : 7, cellPadding: 1.7, textColor: C.text, lineColor: C.border, lineWidth: .18, overflow: "linebreak" },
      headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248,250,251] },
      margin: { left: 12, right: 12, bottom: 24 }
    });
    const y = Math.min(pageHeight - 42, doc.lastAutoTable.finalY + 8);
    if (y > pageHeight - 48) {
      doc.addPage("a4", "landscape"); header("Management actions", model.title);
    }
    const actionY = y > pageHeight - 48 ? 30 : y;
    doc.autoTable({
      startY: actionY,
      head: [["Action", "Recommended response"]],
      body: model.actions.map(action => [pdfText(action.title), pdfText(action.detail)]),
      theme: "grid",
      styles: { fontSize: 7.2, cellPadding: 2.2, textColor: C.text, lineColor: C.border, lineWidth: .18 },
      headStyles: { fillColor: C.dark, textColor: C.white },
      columnStyles: { 0: { cellWidth: 58, fontStyle: "bold" } },
      margin: { left: 12, right: 12, bottom: 24 }
    });
  }
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(...C.border); doc.line(12, pageHeight - 10, pageWidth - 12, pageHeight - 10);
    doc.setTextColor(...C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.text(pdfText(`${state.customization.brandName} | ${model.title}`), 12, pageHeight - 5.7);
    doc.text(`Page ${page} of ${pages}`, pageWidth - 12, pageHeight - 5.7, { align: "right" });
  }
  doc.save(exportFileName("pdf", reportType));
}

function safeExcelSheetName(name) {
  return String(name || "Report").replace(/[\\/?*\[\]:]/g, " ").slice(0, 31) || "Report";
}

function exportIndustryExcel(reportType) {
  const model = getIndustryReportModel(reportType);
  const wb = XLSX.utils.book_new();
  wb.Props = { Title: `${state.project.name} - ${model.title}`, Subject: model.description, Author: state.customization.brandName, Company: state.customization.companyName, CreatedDate: new Date() };
  const summary = [
    [`${state.customization.brandName.toUpperCase()} | ${model.title.toUpperCase()}`],
    ["Project", state.project.name], ["Client", state.project.client], ["Location", state.project.location], ["Report category", model.category], ["Generated", model.reportDate],
    [], ["KEY PERFORMANCE INDICATORS"], ["KPI", "Value", "Note"], ...model.kpis.map(item => [item.label, item.value, item.note]),
    [], ["MANAGEMENT SUMMARY"], [model.summary],
    [], ["SOURCE NOTE"], [model.sourceNote],
    [], ["RECOMMENDED ACTIONS"], ["Action", "Recommended response"], ...model.actions.map(action => [action.title, action.detail])
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summary);
  summarySheet["!cols"] = [{ wch: 34 }, { wch: 88 }, { wch: 42 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Report Summary");

  const register = [model.columns, ...model.rows];
  const registerSheet = XLSX.utils.aoa_to_sheet(register);
  registerSheet["!cols"] = model.columns.map((column, index) => ({ wch: Math.min(42, Math.max(13, String(column).length + 4, ...model.rows.map(row => String(row[index] ?? "").length + 2))) }));
  XLSX.utils.book_append_sheet(wb, registerSheet, safeExcelSheetName(model.tableTitle));

  if (model.chart?.labels?.length) {
    const chartSheet = XLSX.utils.aoa_to_sheet([[model.chart.title], ["Category", "Value"], ...model.chart.labels.map((label, index) => [label, model.chart.values[index]])]);
    chartSheet["!cols"] = [{ wch: 38 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, chartSheet, "Chart Data");
  }
  XLSX.writeFile(wb, exportFileName("xlsx", reportType), { compression: true });
}

function exportIndustryCsv(reportType) {
  const model = getIndustryReportModel(reportType);
  const rows = [
    [state.customization.brandName, model.title], ["Project", state.project.name], ["Client", state.project.client], ["Location", state.project.location], ["Category", model.category], ["Generated", model.reportDate],
    [], ["KPI", "Value", "Note"], ...model.kpis.map(item => [item.label, item.value, item.note]),
    [], ["Management summary", model.summary], ["Source note", model.sourceNote],
    [], model.columns, ...model.rows,
    [], ["Recommended action", "Response"], ...model.actions.map(action => [action.title, action.detail])
  ];
  const csv = rows.map(row => row.map(csvValue).join(",")).join("\r\n");
  downloadBlob(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), exportFileName("csv", reportType));
}

async function exportIndustryPng(reportType) {
  const model = getIndustryReportModel(reportType);
  const chart = model.chart || { labels: [], values: [] };
  const max = chart.max || Math.max(...chart.values.map(validNumber), 1);
  const capture = document.createElement("section");
  capture.style.cssText = `position:fixed;left:-20000px;top:0;width:1280px;padding:46px;background:${state.customization.background};color:${state.customization.text};font-family:${fontStack(state.customization.font)};z-index:-1`;
  capture.innerHTML = `
    <div style="background:${state.customization.surface};border-top:8px solid ${state.customization.accent};border-radius:20px;padding:34px 38px;box-shadow:0 14px 34px rgba(20,32,43,.1)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:30px">
        <div style="display:flex;gap:14px;align-items:flex-start">
          ${state.customization.logoData ? `<img src="${state.customization.logoData}" style="width:56px;height:56px;object-fit:contain;border-radius:12px;background:#fff;padding:5px">` : `<div style="width:56px;height:56px;border-radius:12px;background:${state.customization.accent};color:#fff;display:grid;place-items:center;font-weight:900">${escapeHtml(state.customization.brandInitials)}</div>`}
          <div><div style="font-size:13px;color:${state.customization.accent};font-weight:850;letter-spacing:.12em">${escapeHtml(model.category.toUpperCase())}</div><h1 style="font-size:38px;margin:8px 0 8px">${escapeHtml(model.title)}</h1><div style="font-size:17px;color:#66727c">${escapeHtml(state.project.name)} · ${escapeHtml(state.project.client)} · ${escapeHtml(state.project.location)}</div></div>
        </div>
        <div style="font-size:14px;color:#66727c;text-align:right">Generated<br><strong>${escapeHtml(model.reportDate)}</strong></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:30px 0">${model.kpis.slice(0,4).map(item => `<div style="border:1px solid #dfe5e9;border-radius:14px;padding:17px"><div style="font-size:11px;font-weight:850;text-transform:uppercase;color:#66727c">${escapeHtml(item.label)}</div><div style="font-size:25px;font-weight:850;margin:8px 0 5px">${escapeHtml(item.value)}</div><div style="font-size:11px;color:#66727c">${escapeHtml(item.note)}</div></div>`).join("")}</div>
      <div style="display:grid;grid-template-columns:1.05fr .95fr;gap:18px">
        <div style="border:1px solid #dfe5e9;border-radius:15px;padding:22px"><div style="font-size:12px;color:${state.customization.accent};font-weight:850;letter-spacing:.08em">MANAGEMENT SUMMARY</div><p style="font-size:16px;line-height:1.55;margin:12px 0 22px">${escapeHtml(model.summary)}</p><div style="font-size:12px;color:${state.customization.accent};font-weight:850;letter-spacing:.08em;margin-bottom:11px">RECOMMENDED ACTIONS</div>${model.actions.slice(0,4).map((action,index)=>`<div style="display:grid;grid-template-columns:30px 1fr;gap:10px;margin:0 0 12px"><div style="width:28px;height:28px;border-radius:8px;background:${state.customization.accent};color:#fff;display:grid;place-items:center;font-weight:850">${index+1}</div><div><strong>${escapeHtml(action.title)}</strong><div style="font-size:12px;line-height:1.4;color:#66727c;margin-top:3px">${escapeHtml(action.detail)}</div></div></div>`).join("")}</div>
        <div style="border:1px solid #dfe5e9;border-radius:15px;padding:22px"><h2 style="font-size:19px;margin:0 0 18px">${escapeHtml(chart.title || "Report trend")}</h2>${chart.labels.slice(0,8).map((label,index)=>{const value=validNumber(chart.values[index]);return `<div style="display:grid;grid-template-columns:145px 1fr 90px;gap:10px;align-items:center;margin:0 0 13px"><div style="font-size:12px;color:#66727c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(label)}</div><div style="height:12px;border-radius:999px;background:${mixHex(state.customization.accent,state.customization.surface,.84)};overflow:hidden"><div style="height:100%;width:${cap(value/max,1)*100}%;background:${state.customization.accent};border-radius:999px"></div></div><strong style="font-size:12px;text-align:right">${escapeHtml(formatIndustryChartValue(value,chart))}</strong></div>`}).join("")}</div>
      </div>
      <div style="border:1px solid #dfe5e9;border-radius:15px;padding:20px;margin-top:18px"><h2 style="font-size:19px;margin:0 0 14px">${escapeHtml(model.tableTitle)}</h2><table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr>${model.columns.slice(0,8).map(column=>`<th style="text-align:left;padding:9px 7px;border-bottom:2px solid #dfe5e9;color:#66727c">${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${model.rows.slice(0,8).map(row=>`<tr>${row.slice(0,8).map(value=>`<td style="padding:9px 7px;border-bottom:1px solid #edf0f2">${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <div style="margin-top:16px;padding:12px 15px;border-radius:12px;background:${mixHex(state.customization.accent,state.customization.surface,.9)};font-size:11px;color:#66727c"><strong>Source note:</strong> ${escapeHtml(model.sourceNote)}</div>
    </div>`;
  document.body.appendChild(capture);
  try {
    await waitForPaint();
    const canvas = await html2canvas(capture, { scale: 2, useCORS: true, backgroundColor: state.customization.background, logging: false, width: 1280, windowWidth: 1280 });
    const blob = await canvasToBlob(canvas);
    downloadBlob(blob, exportFileName("png", reportType));
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
  localStorage.setItem("civentraq_datasets", JSON.stringify(state.datasets));
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
