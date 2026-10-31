# Ayush Parekh - Dynamic Portfolio & Management System

> Production-grade, high-performance, two-panel personal portfolio web application engineered with **React 18**, **Node.js + Express**, **PostgreSQL** with **Drizzle ORM**, **Tailwind CSS**, **Lenis smooth scrolling**, and **Framer Motion**.

---

## 1. System Overview

This repository houses a full-stack, dynamic personal portfolio architecture composed of two isolated frontend applications and an Express REST API backend:

1. **Public Visitor Panel (`User/`):**
   - Fast, beautifully animated, scroll-driven portfolio.
   - Smooth inertia scrolling via **Lenis** with automatic fallback for `prefers-reduced-motion`.
   - Scroll-triggered reveals, drawing vertical experience timelines, dynamic role word rotator, and custom desktop cursor using **Framer Motion**.
   - Dedicated deep routes for project case studies (`/projects/:slug`) and technical blog posts (`/blog/:slug`) with rich Markdown rendering.
   - Real-time contact form validated with Zod, saving inquiries directly to PostgreSQL and dispatching notifications via **Gmail SMTP**.
   - Dual theme support: Dark mode (`#0a0a0a` pitch black + crimson `#e91010` accent) and Light mode (`#EAE0D0` warm ivory + crimson `#e91010` accent).
   - Auto-hiding for sections without visible content.

2. **Admin Management Console (`Admin/`):**
   - Protected dashboard (`/`) behind stateless JWT cookie authentication.
   - Full CRUD management for all portfolio content: Projects, Technical Blog Posts, Skills & Categories, Work Experience, Education, Certifications, Endorsements/Testimonials, Social Links, and Site Settings.
   - Real-time visibility toggling (`is_visible`) and drag-and-drop / rank sequence ordering (`display_order`).
   - In-memory media streaming directly to **Cloudinary** (images, screenshots, avatars, and resume PDF) with live preview, PDF detection badge, and clipboard copy.
   - Message inbox tracking unread inquiries with read/unread flags and direct email reply triggers.

3. **Backend REST API (`Backend/`):**
   - Layered architecture: `Routes -> Controllers -> Services -> Repositories -> Drizzle ORM`.
   - Dual entry points:
     - **Vercel Serverless Function** (`Backend/api/index.ts`) for Fluid Compute deployments.
     - **Standalone Node.js Server** (`Backend/src/server.ts`) for traditional VPS or Docker hosting.
   - Strict Zod validation on every request body, query parameter, and route parameter.
   - Security hardening with Helmet HTTP headers, CORS allowlist, rate limiting, parameterized queries, and bcrypt password hashing.

---

## 2. Architecture & Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | High-performance SPA with client-side routing. |
| **Styling & Design** | Tailwind CSS | Utility-first styling with custom dark/light palettes. |
| **Motion & Scroll** | Framer Motion + Lenis | 60fps hardware-accelerated animations and inertia scrolling. |
| **Data Fetching** | TanStack Query v5 | Reactive caching, background refetching, loading states. |
| **Forms & Validation** | React Hook Form + Zod | Schema validation with client/server symmetry. |
| **Backend Runtime** | Node.js (v20+ / v24 LTS) + Express | Layered, stateless REST API architecture. |
| **Database & ORM** | PostgreSQL + Drizzle ORM | Relational data persistence with strict TypeScript schema definitions. |
| **Media Management** | Cloudinary SDK | In-memory buffer streaming (0 local disk dependence). |
| **Notifications** | Nodemailer | Gmail SMTP integration for instant submission alerts. |
| **Testing** | Vitest + Supertest | Unit and HTTP integration tests across API endpoints. |

---

## 3. Directory Structure

```text
portfolio/
├── Admin/                     # Admin Management Console (React 18 + Vite)
│   ├── src/
│   │   ├── components/        # Layout, modals, media uploader
│   │   ├── context/           # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/             # Dashboard, Projects, Blog, Skills, Settings, etc.
│   │   └── services/          # api.ts (Admin REST client)
│   ├── vercel.json            # SPA rewrite routing for Vercel
│   └── package.json
│
├── User/                      # Public Visitor Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/        # Hero, About, Skills, Experience, Projects, Contact, etc.
│   │   ├── context/           # ThemeContext
│   │   ├── pages/             # HomePage, ProjectDetailPage, BlogDetailPage, NotFoundPage
│   │   └── services/          # publicApi.ts (Public REST client)
│   ├── vercel.json            # SPA rewrite routing for Vercel
│   └── package.json
│
├── Backend/                   # REST API Server (Node.js + Express + Drizzle ORM)
│   ├── api/index.ts           # Vercel Serverless Function entry point
│   ├── src/
│   │   ├── config/            # Validated environment variables (Zod)
│   │   ├── controllers/       # HTTP request handlers (Admin & Public)
│   │   ├── db/                # Drizzle schema definitions, migrations, and seeds
│   │   ├── middleware/        # Auth, rate limiting, error handling, upload
│   │   ├── repositories/      # Database abstraction layer
│   │   ├── routes/            # Express route declarations
│   │   ├── services/          # Auth, Cloudinary storage, Gmail mailer
│   │   └── server.ts          # Standalone Node.js HTTP server entry point
│   ├── vercel.json            # Serverless function configuration for Vercel
│   └── package.json
│
└── docs/                      # Comprehensive Architecture & Engineering Documentation
    ├── ARCHITECTURE.md        # System architecture and Mermaid diagrams
    ├── BACKEND_FLOW.md        # Request/response lifecycle & middleware flow
    ├── DATABASE_SCHEMA.md     # Relational schema specification & ER diagram
    ├── API_DOCUMENTATION.md   # Complete REST API endpoint reference
    ├── TECHNICAL_DECISIONS.md # Architectural decisions and rationales
    ├── TESTING_STRATEGY.md    # Multi-layer testing and verification strategy
    ├── BUGS_AND_ISSUES.md     # Issue tracker and resolution records
    ├── PROJECT_CONTEXT.md     # Complete project specification and scope
    └── CHANGELOG.md           # Granular phase-by-phase changelog
```

---

## 4. Getting Started (Local Development)

### 4.1 Prerequisites
- **Node.js:** v18.x or higher (v24.x LTS recommended)
- **Package Manager:** `npm` (v10+)
- **Database:** Local PostgreSQL 16 instance OR a free cloud PostgreSQL instance from [Neon.tech](https://neon.tech)
- **Cloudinary Account:** Free tier account for media storage
- **Gmail Account:** With a generated [Google App Password](https://myaccount.google.com/apppasswords) for SMTP notifications

### 4.2 Installation

Clone the repository and install dependencies in all three workspaces:

```bash
# 1. Install Backend dependencies
cd Backend
npm install

# 2. Install Admin dependencies
cd ../Admin
npm install

# 3. Install User dependencies
cd ../User
npm install
```

### 4.3 Configure Environment Variables

Create `.env` inside `Backend/` based on `Backend/.env.example`:

```bash
cd ../Backend
cp .env.example .env
```

Populate the required configuration values:

```env
PORT=5000
NODE_ENV=development

# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio
# Or Neon: postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require

# Authentication & Cookies
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
COOKIE_SECRET=super_secret_cookie_key_at_least_32_characters_long

# CORS (Comma-separated origins)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail SMTP Notification
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SMTP_FROM=Ayush Parekh Portfolio <your_email@gmail.com>

# Initial Admin User Credentials (Used by seed script)
ADMIN_EMAIL=ayushwork@gmail.com
ADMIN_PASSWORD=AdminSecurePassword2026!
ADMIN_NAME=Ayush Parekh
```

---

## 5. Database Setup & Seeding

1. **Generate and Apply Migrations:**
   ```bash
   cd Backend
   # Generate SQL migrations from schema
   npm run db:generate

   # Apply migrations to the database
   npm run db:migrate
   ```

2. **Seed Initial Data & Admin Account:**
   ```bash
   npm run db:seed
   ```
   *This seeds the default site settings, categorized skills, sample projects, timeline experiences, educational milestones, and provisions the initial Admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.*

3. **Drizzle Studio (Database GUI):**
   ```bash
   npm run db:studio
   ```
   *Opens a browser interface at `https://local.drizzle.studio` to inspect and manage tables.*

---

## 6. Running the Application Locally

Run each service in separate terminal windows:

```bash
# Terminal 1: Backend API (runs on http://localhost:5000)
cd Backend
npm run dev

# Terminal 2: Admin Dashboard (runs on http://localhost:5174)
cd Admin
npm run dev

# Terminal 3: Public Visitor Portfolio (runs on http://localhost:5173)
cd User
npm run dev
```

- **Visitor Portfolio:** Navigate to `http://localhost:5173`
- **Admin Dashboard:** Navigate to `http://localhost:5174` (Log in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`)
- **API Health Check:** Visit `http://localhost:5000/api/health`

---

## 7. Production Deployment (Vercel ₹0/Month Setup)

The system is engineered for zero-cost operation using free tiers of Vercel, Neon, and Cloudinary.

### Deployment Architecture
Deploy as 3 distinct projects on Vercel:

1. **`portfolio-api` (Backend):**
   - **Root Directory:** `Backend`
   - **Framework Preset:** `Other`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** Set all variables defined in `Backend/.env.example`.
   - Set `CORS_ORIGIN` to include your production frontend domains:
     `https://ayushparekh.vercel.app,https://admin-ayushparekh.vercel.app`

2. **`portfolio-user` (Visitor Site):**
   - **Root Directory:** `User`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     `VITE_API_URL=https://portfolio-api.vercel.app/api`

3. **`portfolio-admin` (Admin Console):**
   - **Root Directory:** `Admin`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     `VITE_API_URL=https://portfolio-api.vercel.app/api`

---

## 8. Verification & Automated Testing

Execute the test suites and build checks across all workspaces:

```bash
# Run Backend Vitest Test Suite (16/16 tests)
npm --prefix Backend run test

# Run User Frontend Production Bundle
npm --prefix User run build

# Run Admin Frontend Production Bundle
npm --prefix Admin run build
```

---

## 9. Engineering Documentation Suite

Detailed architecture specifications, request flows, and technical decisions are maintained in the [`/docs`](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs) directory:

- [Project Context](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/PROJECT_CONTEXT.md)
- [System Architecture](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/ARCHITECTURE.md)
- [Backend Request Lifecycle](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/BACKEND_FLOW.md)
- [Database Schema & ERD](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/DATABASE_SCHEMA.md)
- [REST API Reference](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/API_DOCUMENTATION.md)
- [Technical Decisions](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/TECHNICAL_DECISIONS.md)
- [Testing & QA Framework](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/TESTING_STRATEGY.md)
- [Changelog](file:///d:/AYUSH/111.%20private%20folder/portfolio/docs/CHANGELOG.md)

---

## 10. Security & Compliance Checklist

- [x] **Zero Plaintext Credentials:** Passwords hashed with `bcrypt` (12 salt rounds); secrets loaded strictly through validated environment schemas.
- [x] **SQL Injection Immunity:** All queries parameterized using Drizzle ORM query builders.
- [x] **XSS & Data Sanitization:** Strict Zod validation on incoming request bodies, query params, and route parameters.
- [x] **Cookie Security:** Auth tokens issued in `httpOnly`, `Secure`, `SameSite=Lax` cookies.
- [x] **Brute-Force Rate Limiting:** Login route rate limited to 5 attempts per 15-minute window; general API rate limited to 100 requests per 15 minutes.
- [x] **CORS Origin Restriction:** Cross-origin requests restricted to explicitly allowlisted origins with credentials enabled.
- [x] **Safe Media Ingestion:** File uploads validated for MIME type and file size (< 10MB) in memory buffers before direct streaming to Cloudinary CDN.
- [x] **WCAG AA Accessibility:** High contrast styling, keyboard focus indicators, screen reader ARIA landmarks, and motion reduction compliance.

