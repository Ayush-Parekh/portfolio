# Testing Strategy & Quality Assurance Framework

## 1. Testing Philosophy & Scope
Code compilation alone is never sufficient to consider a feature complete. Every functional requirement must undergo systematic verification across multiple layers:
1. **Static Analysis & Type Checking:** Strict TypeScript type checking across all projects.
2. **Unit & Integration Testing:** Automated test suites verifying validation schemas, authentication, security middleware, and controller logic.
3. **Database Layer Testing:** Schema validation, migration reproducibility, and query correctness via Drizzle ORM.
4. **Security Testing:** Verification of rate limiters, CORS policies, XSS sanitization, parameter tampering, and SQL injection prevention.
5. **End-to-End & UX Verification:** Public section rendering, dark/light theme switching, smooth scrolling, and mobile responsiveness.

---

## 2. Testing Tools & Setup

| Domain | Tools | Purpose |
| :--- | :--- | :--- |
| **Backend Testing** | Vitest, Supertest | Fast unit and HTTP integration testing for Express routes, controllers, and auth. |
| **Type Verification** | TypeScript Compiler (`tsc --noEmit`) | Enforces type safety, schema matches, and prevents runtime type errors. |
| **Database Verification** | Drizzle Kit (`drizzle-kit generate / check`) | Verifies SQL migration syntax and schema integrity. |
| **Frontend Testing** | Vitest, React Testing Library | Component rendering, user interaction, form validation checks. |
| **Performance & SEO** | Rollup manualChunks, Lighthouse Audit | Verifies chunk sizes under 300 kB, 90+ performance, 95+ accessibility, 95+ SEO benchmarks. |

---

## 3. Key Test Scenarios

### 3.1 Authentication & Authorization
- [x] Valid credentials return 200 and set `httpOnly`, `Secure`, `SameSite=Lax` cookie.
- [x] Invalid credentials return 401 with generic error (no account enumeration).
- [x] Rate limiter blocks login after excessive failed attempts.
- [x] Protected admin routes reject requests lacking valid JWT cookie with 401.
- [x] Expired or tampered tokens result in immediate 401 and cookie clearing.

### 3.2 Zod Validation & Security
- [x] Requests with unexpected or malicious payload structures are rejected with 400 Bad Request.
- [x] Contact form payload validates email format, character limits, and prevents script injection.
- [x] Upload endpoints strictly restrict MIME types to valid images (PNG, JPEG, WebP, AVIF) and PDF documents.

### 3.3 Database Integrity & Concurrency
- [x] Drizzle migrations execute without errors in both fresh and incremental environments.
- [x] Reordering updates maintain valid non-conflicting display sequences.
- [x] Cascade deletions operate properly without leaving orphaned relational records.

### 3.4 Public API & Performance
- [x] `GET /api/public/portfolio` returns all visible items ordered by `display_order ASC`.
- [x] Items with `is_visible: false` are excluded from all public API responses.
- [x] Contact form submission stores message in database and triggers non-blocking email notification.

---

## 4. Accessibility & Performance Verification (Phase 5)

### 4.1 WCAG AA & Screen Reader Checks
- **Keyboard Navigation:** Every interactive button, link, and input possesses visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#e91010] outline-none`).
- **Screen Reader Semantics:**
  - All icon-only buttons (theme switch, mobile hamburger, modal close, external links, social icons, CDN copy) provide descriptive `aria-label` attributes.
  - Interactive modal dialogs contain `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
  - Skill meters implement `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
  - Contact form inputs are linked via `htmlFor`/`id` pairs with `aria-invalid` and `aria-describedby` referencing active validation errors.
  - Contact form success/failure status banners utilize `role="alert"` with `aria-live`.
- **Motion Reduction:** Lenis smooth scrolling listener checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and cleanly disables artificial smoothing when requested by the OS.

### 4.2 Production Bundle & Chunk Verification
- **User Bundle:**
  - `dist/assets/vendor-*.js`: ~163 kB (React, React-DOM, React Router)
  - `dist/assets/motion-*.js`: ~141 kB (Framer Motion, Lenis)
  - `dist/assets/query-*.js`: ~39 kB (TanStack Query)
  - `dist/assets/icons-*.js`: ~18 kB (Lucide React)
  - `dist/assets/index-*.js`: ~284 kB (Application code)
  - All chunks well below the 500 kB limit; 0 bundle warnings.
- **Admin Bundle:**
  - All chunks below 170 kB; 0 bundle warnings.
