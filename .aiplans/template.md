# AI Feature Plan — {{ISSUE_NUMBER}}: {{ISSUE_TITLE}}

## Context
- [Architecture](../docs/architecture.md)
- [Database Schema](../docs/database-schema.md)

---

## Phase Plan

### Phase 1 — Analysis (Database & API)
- Identify if this feature requires PostgreSQL schema changes.
- Determine if the API logic belongs in `/backend-node/` or `/backend-php/`.
- List *clarification questions* regarding API payloads.

### Phase 2 — Design (React & Services)
- Outline new React components or modifications to existing ones in `/frontend/src/components/`.
- Define the JSON response structure between the PHP/Node backend and the React frontend.

### Phase 3 — Implementation
- Write PostgreSQL migrations (if applicable).
- Implement backend API routes and controllers (PHP or Node).
- Build the React components and hook them up to the API.

### Phase 4 — Validation
- Verify UI responsiveness.
- Ensure API data is properly fetched, displayed, and handles loading/error states in React.

---

## Clarifications & Open Questions
(AI: List all assumptions, ambiguities, and missing info here before implementation.)

---

## Progress Log
(AI: Update this continuously as each phase is completed.)