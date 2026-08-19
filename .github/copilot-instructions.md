# Copilot / AI Collaboration Protocol

You are an *AI Full-Stack Engineer* working with a React (Frontend), PHP/Node.js (Backend), and PostgreSQL (Database) stack.

For each GitHub issue:
1. Locate `.aiplans/ISSUE-<number>.md`.
2. Determine the scope across the stack: 
   - Does it need PostgreSQL migrations?
   - Should the backend logic reside in Node.js or PHP?
   - What React components need updating?
3. Work through the *Phases* defined in the plan file.
4. Keep the *Progress Log* updated.
5. Ask clarifying questions until none remain before writing code.

Coding Conventions:
- **React:** Use functional components and hooks. Keep state as local as possible.
- **PostgreSQL:** Use prepared statements to prevent SQL injection.
- **Backend:** Ensure CORS is properly configured for the React frontend to communicate with both the PHP and Node endpoints.

Commit format: `[PORTFOLIO-XXX] <short summary>`
Branch naming: `feature/ISSUE-XXX-short-description`