# Civentraq Story Studio redesign

The Presentation Studio has been redesigned as a unique, guided storytelling workspace rather than a PowerPoint-style ribbon.

## Main interface

- **Storyline** on the left for choosing, reordering, adding, duplicating, and deleting slides.
- **Large central canvas** with automatic fit and zoom controls.
- **Add dock** below the canvas for headings, text, AI insights, KPI cards, charts, tables, photos, comparisons, progress visuals, and callouts.
- **Smart controls** on the right that change according to the selected item.
- **Preview, Review, Share, and Export** remain available from the top bar.
- Layouts, arrange commands, versions, checks, and new-deck actions are placed in small focused menus instead of a crowded ribbon.

## Existing functionality retained

The redesign keeps the current Civentraq presentation engine and all its working actions, including drag and resize, multi-select, copy/paste, grouping, locking, alignment, snap/grid, themes, data lineage, comments, approvals, versions, presentation checks, client sharing, presenter mode, speaker notes, and exports.

## New files

- `presentation-story-ui.css`
- `presentation-story-ui.js`

Both files are loaded last so the redesign can reorganise the interface without removing existing business logic.
