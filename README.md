# Sean Brandon F. Reyes - Full-Stack Developer Portfolio

A custom-built, full-stack personal portfolio and Content Management System (CMS). This application is built from scratch to showcase my software engineering projects, technical articles, professional experience, and creative writing. 

**Live Site:** [Sean's Portfolio](https://seanbr-dev-dthfdaf3dsf2arac.japanwest-01.azurewebsites.net)

## 🚀 Features

*   **Custom Admin Dashboard:** A private, secure `/admin` route allowing full CRUD (Create, Read, Update, Delete) operations for portfolio content without touching the codebase.
*   **Secure Authentication:** Custom login flow protected by JSON Web Tokens (JWT) and Bcrypt password hashing.
*   **RESTful API:** A robust Node.js/Express backend serving dynamic data from a relational PostgreSQL database.
*   **Automated CI/CD:** Fully automated deployment pipeline using GitHub Actions, pushing updates directly to Azure App Service.
*   **Security First:** Hardened HTTP headers using Helmet.js, strict CORS policies, and secure environment variable injection.

## 🛠️ Tech Stack

**Frontend:**
*   React.js
*   CSS3 (Custom Styling)
*   Vite (Build Tool)

**Backend:**
*   Node.js & Express.js
*   PostgreSQL (via `pg` and `pg-pool`)
*   JWT (`jsonwebtoken`) & Bcrypt

**Infrastructure & DevOps:**
*   Azure App Service
*   GitHub Actions (CI/CD)
*   Git Version Control

## 📂 Project Structure

```text
├── .github/workflows/   # CI/CD pipeline configurations for Azure
├── backend/             # Node.js & Express API server
│   ├── routes/          # API endpoints (articles, projects, auth, etc.)
│   ├── middleware/      # JWT authentication middleware
│   ├── db.js            # PostgreSQL connection pool
│   └── server.js        # Backend entry point
├── frontend/            # React client application
│   ├── src/             # React components, pages, and assets
│   ├── public/          # Static assets (icons, SVGs)
│   └── index.html       # HTML entry point
└── docs/                # Architectural documentation
