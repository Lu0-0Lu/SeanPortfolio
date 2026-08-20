# AI Feature Plan — ISSUE-1: Build Global UI Layout and Theme Toggle

## Context
- [Architecture](../docs/architecture.md)
- Design System: Minimalist, clean, high-contrast. Must support seamless Dark/Light mode switching.

---

## Phase Plan

### Phase 1 — Analysis (React & Styling)
- This issue is strictly frontend (React). No database or backend logic is required yet.
- Determine the best state management approach for the Dark/Light mode toggle (e.g., React Context API).
- Establish CSS variables (custom properties) for a minimalist color palette (e.g., stark whites, deep off-blacks, subtle gray borders).

### Phase 2 — Design (Component Structure)
- Create a `ThemeProvider` wrapper component to handle the active theme state.
- Outline the `Navbar` component (Name: "Sean Brandon F. Reyes" on left, Links and Theme Toggle on right).
- Outline a `MainLayout` container to restrict maximum width and keep content centered and readable.
- Outline the `Footer` component.

### Phase 3 — Implementation
- Build the React components and write the foundational CSS rules.
- Implement the Dark/Light toggle logic, ensuring the user's preference is saved to `localStorage`.
- Create a temporary placeholder page inside `MainLayout` with dummy text. 
- Include a mock UI element for the Trashure capstone and a simple text block for the Mansfield International OJT to ensure the typography and colors scale correctly across both light and dark themes. 

### Phase 4 — Validation
- Verify the Dark/Light toggle works instantly without page reloads.
- Ensure text contrast passes accessibility standards in both modes.
- Check responsiveness on mobile viewport sizes.

---

## Clarifications & Open Questions
(AI: List all assumptions about UI libraries or font choices here before implementation.)