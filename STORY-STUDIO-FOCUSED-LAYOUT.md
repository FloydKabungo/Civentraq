# Story Studio focused layout fix

This update turns the presentation editor into a dedicated, full-screen workspace.

## Changes

- The normal project sidebar, project header, and notice bar are hidden while Story Studio is open.
- Opening Presentation Studio now reliably enters the dedicated editor, including when opened from the Civentraq home hub.
- The editor uses one top bar, a collapsible Storyline rail, and a large central canvas.
- Smart controls are hidden by default and open as a temporary drawer when an element is selected.
- The crowded content strip was replaced with one **Add content** button.
- The slide automatically fits again after opening/closing panels or resizing the browser.
- Laptop, split-screen, tablet, and mobile layouts were improved.
- Existing presentation, review, sharing, export, version, layout, chart, and editing handlers remain connected.

## Files changed

- `presentation-story-ui.css`
- `presentation-story-ui.js`
- `workspace-home.js`
