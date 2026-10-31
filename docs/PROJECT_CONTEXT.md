# Project Context: Dynamic Portfolio

## 1. Application Overview
This project is a dynamic, high-performance, full-stack personal portfolio application designed for **Ayush Parekh** (Creative Technologist, Product-Driven Full-Stack Developer). It features a two-panel architecture:
1. **Public Panel (Visitors):** A scroll-driven, responsive web application with smooth scrolling (Lenis), animations (Framer Motion), dark/light theme switching, dedicated project case study pages (`/projects/:slug`), and a blog/articles section (`/blog/:slug`).
2. **Admin Panel (Portfolio Owner):** A secured dashboard allowing full content management (CRUD, drag-and-drop reordering, visibility toggling, media uploads via Cloudinary, site settings configuration, and contact message inbox).

No portfolio content is hardcoded in the frontend. All visible content is fetched dynamically from the PostgreSQL database via REST API.

---

## 2. Business Purpose & Target Audience
- **Purpose:** Showcase software engineering projects, technical skills, professional experience, academic background, certifications, and technical writing to recruiters, clients, and technical leaders.
- **Target Audience:** Engineering managers, technical recruiters, startup founders, and collaborative developers.
- **Cost Target:** Designed to run with a **₹0/month** operational cost during initial phases using free tiers of Vercel (Serverless Fluid Compute), Neon (Serverless PostgreSQL), Cloudinary (Media storage), and Gmail SMTP (Notifications), while maintaining full portability to a VPS/Node.js server.

---

## 3. Technology Stack

### Frontend (Public & Admin)
- **Framework:** React 18 / 19 with Vite
- **Styling:** Tailwind CSS with custom theme variables
- **Motion & Scrolling:** Framer Motion, Lenis smooth scrolling
- **State & Data Fetching:** TanStack Query (React Query)
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (v24.x LTS target)
- **Web Framework:** Express.js (Layered: Routes -> Controllers -> Services -> Repositories)
- **Database & ORM:** PostgreSQL (Neon Serverless in production, local Postgres 16 in development) with **Drizzle ORM** & `drizzle-kit`
- **Authentication:** Single admin credentials, bcrypt password hashing, stateless JWT stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies
- **Validation & Security:** Zod request validation, Helmet HTTP headers, CORS allowlist with credentials, express-rate-limit brute force protection
- **Media Management:** Cloudinary SDK with memory buffer streaming (zero local disk dependency)
- **Notifications:** Nodemailer via Gmail SMTP

---

## 4. Design Direction & Palette
- **Tone:** Creative Technologist, Product-driven Developer
- **Dark Mode (Default):**
  - Background: Pitch Black (`#0a0a0a` / `#000000`)
  - Elevated Card: `#121212` / `#181818`
  - Accent Color: Crimson Red (`#e91010`)
  - Text: High-contrast white (`#f5f5f5`) & muted grey (`#a3a3a3`)
- **Light Mode:**
  - Background: Warm Ivory / Bone Parchment (`#EAE0D0`)
  - Elevated Card: `#DFD4C2`
  - Accent Color: Crimson Red (`#e91010`)
  - Text: Deep Charcoal (`#1a1a1a`) & muted slate (`#57534e`)

---

## 5. Main Application Sections
1. **Hero:** Name, dynamic role rotator, quick bio, CTA buttons, social links.
2. **About Me:** Professional overview, profile avatar, metrics/stats counters.
3. **Skills:** Categorized skills (Frontend, Backend, Database, Tools) with proficiency percentages and icons.
4. **Experience:** Vertical animated timeline with milestones, achievements, and dates.
5. **Projects:** Tag-filtered grid with cards linking to dedicated `/projects/:slug` case study pages.
6. **Blog / Articles:** Article listing with reading time, tags, and dedicated `/blog/:slug` markdown reader.
7. **Education & Certifications:** Academic qualifications and verified certificates.
8. **Testimonials:** Client and mentor endorsements (auto-hides when empty).
9. **Contact:** Interactive form with Zod validation, PostgreSQL persistence, unread badge in Admin, and email dispatch via Gmail SMTP.

---

## 6. Directory Structure
```text
portfolio/
├── Admin/                     # React + Vite Admin Dashboard
├── User/                      # React + Vite Public Visitor Portfolio
├── Backend/                   # Express REST API (Drizzle ORM + Vercel Serverless Ready)
└── docs/                      # Architectural & Operational Documentation
```

---

## 7. Known Constraints & Production Conventions
- **Serverless Compatibility:** The backend runs seamlessly inside Vercel's Fluid Compute environment (`/api` serverless functions). No reliance on persistent local disk, in-memory global state, or long-running daemon workers.
- **Portability:** The core Express app is structured so that executing `server.ts` runs a standard standalone HTTP server on any Linux/Docker VPS with zero code modification.
- **Media Ingestion:** Direct streaming to Cloudinary via memory storage buffers.
- **Zero-Trust Security:** Strict Zod schema validation on every inbound request body, query parameter, and route parameter.

