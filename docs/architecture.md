# Architecture Overview: Developer Portfolio

## 1. High-Level System Diagram
[Visitor] <--> [React Frontend] 
                   |
                   +--> [Node.js API] <--> [PostgreSQL]
                   |
                   +--> [PHP API] <--> [PostgreSQL]

## 2. Core Components

### 2.1. Frontend (React)
- **Purpose:** Delivers the interactive user interface.
- **State Management:** React Context / Hooks.
- **Routing:** React Router.

### 2.2. Backend Services (Node.js & PHP)
- **Node.js Service:** Handles real-time functionalities or lightweight async operations.
- **PHP Service:** Manages core business logic, form submissions, and structured data delivery.

## 3. Data Store (PostgreSQL)
- **Purpose:** Relational database for storing structured portfolio content.
- **Key Schemas:** `projects`, `users`, `contact_messages`.