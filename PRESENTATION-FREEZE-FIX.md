# Presentation Studio reliability fix

This update removes the competing PowerPoint-style interface layer and keeps one Civentraq Story Studio interface.

## Fixed

- Presentation Studio now opens through one guarded render cycle.
- Dashboard charts are no longer re-rendered while the presentation editor is opening.
- Duplicate presentation renders were removed from home-page navigation.
- The canvas resize observer is throttled to prevent scrollbar/resize loops.
- Stale chart-render callbacks are ignored.
- Story Studio is initialized only once.
- A loading state and visible error fallback are included.
- The original slide engine, themes, exports, comments, approvals, versions, checks, sharing, and element controls remain connected.

## Replace these files

- `index.html`
- `workspace-home.js`
- `presentation-studio.js`
- `presentation-story-ui.js`
- `presentation-story-ui.css`

After replacing the files, hard-refresh the browser with `Ctrl + F5`.
