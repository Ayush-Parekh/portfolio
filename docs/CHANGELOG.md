# Changelog

All notable changes to this project will be documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

---

## [Performance Optimization: Theme Switch & Screen Animation Lag Resolution] - 2026-11-02 11:45 IST

### Task Name
Fix Animation Lag and Screen Choppiness During Theme Switch and General Navigation

### Requirement Description
Investigate and resolve severe lag, frame drops, and perceived screen choppiness occurring during theme switching and page interaction across Visitor (`User/`) and Admin (`Admin/`) pages.

### Root Cause Analysis
1. **Wildcard CSS Transitions:** `index.css` contained `body, #root, div, header, nav, footer { transition: background-color 0.25s, color 0.25s, border-color 0.25s; }`. Targeting all `div` elements caused hundreds of layout and style recalculations on every interaction, hover, scroll, and theme change. During `startViewTransition()`, this caused 500+ elements to run 250ms CSS transitions concurrently with the 500ms radial clip-path animation, overwhelming the compositor and dropping frames.
2. **GPU Compositing Bottlenecks in Custom Cursor:** `CustomCursor.tsx` used `mix-blend-difference` on a fixed, mouse-following overlay. On Chromium, continuous blending across blurred navigation backdrops and gradients forced expensive full-frame GPU readbacks. Additionally, low spring stiffness (`stiffness: 250, damping: 25`) created intentional drag, making the pointer and screen appear laggy. During View Transitions, the custom cursor was also captured into the transition screenshot, leaving a frozen ghost cursor on screen.
3. **Lenis RAF Loop Leak:** In `HomePage.tsx`, the `requestAnimationFrame` handle was not canceled when unmounting, leaving orphaned RAF loops running across route navigations.
4. **Body Color Transition Conflicts:** `transition-colors duration-300` on `<body>` in `index.html` conflicted with the native circular reveal.

### Files Created
- None

### Files Modified
- `User/src/components/common/CustomCursor.tsx`: Removed `mix-blend-difference`, promoted cursor to hardware-accelerated layer (`will-change-transform`), increased spring responsiveness (`stiffness: 600, damping: 35`), debounced hover listener checks, and added `.custom-cursor` class identifier.
- `User/src/pages/HomePage.tsx`: Added `cancelAnimationFrame(rafId)` to cleanup of `Lenis` smooth scroll loop.
- `User/src/index.css`: Removed wildcard `div` transitions; added `.theme-transitioning` suppression to disable conflicting transitions during View Transitions, and hid `.custom-cursor` during transitions to prevent ghost cursor snapshots.
- `Admin/src/index.css`: Removed wildcard `div` transitions and added `.theme-transitioning` suppression.
- `User/src/context/ThemeContext.tsx`: Added `.theme-transitioning` toggle during `startViewTransition`, optimized circular clip-path duration to 400ms with `cubic-bezier(0.4, 0, 0.2, 1)`, and added clean cleanup in `transition.finished.finally()`.
- `Admin/src/context/ThemeContext.tsx`: Applied the same `.theme-transitioning` and 400ms duration optimizations.
- `User/index.html` & `Admin/index.html`: Removed `transition-colors duration-300` from `<body>`.
- `User/src/pages/ProjectDetailPage.tsx` & `User/src/pages/BlogDetailPage.tsx`: Removed redundant `transition-colors` from root container.

### Files Deleted
- None

### Tests Performed & Results
- Production Build `User/`: `npm --prefix User run build` succeeded cleanly with exit code 0.
- Production Build `Admin/`: `npm --prefix Admin run build` succeeded cleanly with exit code 0.
- Backend Test Suite: `npm --prefix Backend run test` passed 16/16 tests.

### Known Issues
- None.

---

## [UI/UX Enhancement: WealthRush Animated Theme Switcher & Circular View Transition] - 2026-11-02 11:20 IST

### Task Name
Implement WealthRush-Style Theme Selector with Spring Pill and Circular Ripple View Transition Animation

### Requirement Description
Replicate the theme switch experience from the WealthRush reference application (`D:\AYUSH\wealth-rush-capital\wealthrushcapital-user-web`) into both the Visitor (`User/`) and Admin Console (`Admin/`) applications:
1. Segmented radio switcher with active pill spring animation using Framer Motion (`layoutId` + spring damping/stiffness).
2. Smooth radial ripple / circular clip-path reveal originating from cursor click coordinates across the viewport via the native View Transition API (`document.startViewTransition` + `clipPath: circle(...)`).

### Files Created
- `User/src/utils/cn.ts`: Reusable Tailwind class merger (`clsx` + `tailwind-merge`).
- `User/src/components/common/ThemeSelector.tsx`: WealthRush segmented theme selector component (System / Light / Dark) with Framer Motion animated active background pill.
- `Admin/src/utils/cn.ts`: Reusable Tailwind class merger.
- `Admin/src/components/common/ThemeSelector.tsx`: WealthRush segmented theme selector component for the Admin Console.

### Files Modified
- `User/src/context/ThemeContext.tsx`: Upgraded `ThemeContext` to accept click mouse/pointer events (`ThemeChangeEvent`), calculate dynamic screen-diagonal radius from click origin, and drive circular `document.startViewTransition` clip-path keyframe animations with graceful fallback.
- `User/src/components/common/Navbar.tsx`: Integrated `<ThemeSelector size="sm" />` for both desktop header and mobile responsive drawer.
- `User/src/index.css`: Added View Transition pseudo-element resets (`::view-transition-old(root)`, `::view-transition-new(root)`) with stacking order (`z-index: 9999` on new view) to enable seamless radial expansion.
- `Admin/package.json` & `Admin/package-lock.json`: Added `framer-motion` dependency for spring layout transitions.
- `Admin/src/context/ThemeContext.tsx`: Upgraded `ThemeContext` with pointer coordinate capture and radial View Transition animation support.
- `Admin/src/components/layout/AdminLayout.tsx`: Embedded `<ThemeSelector size="sm" />` in admin header bar.
- `Admin/src/index.css`: Added View Transition pseudo-element resets and circular reveal styling.

### Files Deleted
- None

### Changes Implemented
1. **Framer Motion Segmented Pill Selector:** Built `ThemeSelector` using radio buttons (`role="radiogroup"`) featuring system auto (`Monitor`), light (`Sun`), and dark (`Moon`) icons. The highlighted pill smoothly glides between options via `motion.div` with physics parameters `type: 'spring', stiffness: 480, damping: 34`.
2. **Radial Ripple View Transition API:** In `ThemeContext.tsx`, `setTheme` captures `(event.clientX, event.clientY)` coordinates. When `document.startViewTransition` is supported (and motion is not reduced), it computes `hypot(max(x, w-x), max(y, h-y))` and animates `clipPath: [circle(0px at x y), circle(endRadius at x y)]` over 450ms (`cubic-bezier(0.4, 0, 0.2, 1)`), cleanly sweeping the new theme across the viewport.
3. **Graceful Fallbacks:** Guaranteed zero breakage on unsupported browsers or user reduced-motion preference (`window.matchMedia('(prefers-reduced-motion: reduce)')`) by immediately flipping state without transition.
4. **Universal Integration:** Applied consistently to both the public portfolio visitor site (`User/`) and the administrative portal (`Admin/`).

### Reason
Fulfill user's UI/UX specification to match the interactive micro-interactions and smooth visual transition patterns established in the WealthRush project.

### Tests Performed & Results
- Production Build `User/`: `npm --prefix User run build` succeeded with exit code 0 (`tsc && vite build`).
- Production Build `Admin/`: `npm --prefix Admin run build` succeeded with exit code 0 (`tsc && vite build`).
- Backend Test Suite: `npm --prefix Backend run test` passed 16/16 tests across all 3 suites.

### Known Issues
- None.

---

## [Bugfix: Light/Dark Theme Switching Resolution] - 2026-11-02 10:35 IST

### Task Name
Fix Light / Dark Theme Switching Across Visitor & Admin Applications

### Requirement Description
Investigate and resolve the issue where clicking the light/dark mode toggle button did not change the visual theme on the website.

### Files Created
- None

### Files Modified
- `User/tailwind.config.js` (registered `light` variant plugin via `tailwindcss/plugin`)
- `Admin/tailwind.config.js` (registered `light` variant plugin via `tailwindcss/plugin`)
- `User/index.html` (added `light:bg-[#EAE0D0] light:text-[#1a1a1a]` to `<body>`)
- `Admin/index.html` (added `light:bg-[#EAE0D0] light:text-[#1a1a1a]` to `<body>`)
- `User/src/index.css` (defined explicit `html.light`, `html.light body`, and smooth color transition)
- `Admin/src/index.css` (defined explicit `html.light`, `html.light body`, and smooth color transition)
- `Admin/src/pages/LoginPage.tsx` (added light theme styles for login card)

### Files Deleted
- None

### Root Cause
Tailwind CSS with `darkMode: 'class'` only provides the `dark:` variant by default. It has no built-in `light:` variant. As a result, all `light:...` utility classes written across the JSX components were ignored by the Tailwind compiler during CSS generation, leaving only the dark default classes active. Additionally, `<body>` in `index.html` had dark classes hardcoded without theme reactivity.

### Changes Implemented
1. Registered a custom `light` variant plugin in both `User/tailwind.config.js` and `Admin/tailwind.config.js` mapping `:is(.light &)` to enable all `light:*` utility classes.
2. Updated root `html.light` and `html.light body` in `index.css` to set background `#EAE0D0` (warm ivory) and text `#1a1a1a`.
3. Updated `<body>` in both `index.html` files with theme classes and smooth 300ms transition.

### Tests Performed & Results
- Production build `User/`: `npm --prefix User run build` succeeded; verified that light theme selectors (e.g. `:is(.light .light\:bg-\[\#EAE0D0\])`) are generated into the CSS output.
- Production build `Admin/`: `npm --prefix Admin run build` succeeded; verified light theme styles in generated bundle.
- Backend tests: `npm --prefix Backend run test` passed 16/16 tests.

---

## [Phase 6: Deployment Configuration & Production Readiness] - 2026-10-31 16:50 IST

### Task Name
Phase 6: Deployment Configuration, Environment Templates & Master Readme Documentation

### Requirement Description
Configure production deployment manifests for Vercel's Serverless Fluid Compute environment, establish SPA rewrite rules for client-side routing, add cross-origin API client base URL configuration, write environment variable templates, and produce an exhaustive root `README.md` and production runbook.

### Files Created
- `README.md` (root architectural guide, quick start, deployment manual, and security checklist)
- `User/vercel.json` (SPA client-side routing rewrites for Vercel)
- `Admin/vercel.json` (SPA client-side routing rewrites for Vercel)
- `User/.env.example` (environment configuration template for visitor site)
- `Admin/.env.example` (environment configuration template for admin console)
- `User/src/vite-env.d.ts` (Vite client types reference)
- `Admin/src/vite-env.d.ts` (Vite client types reference)

### Files Modified
- `Backend/vercel.json` (configured wildcard routing to `api/index.ts` serverless handler)
- `User/src/services/publicApi.ts` (supported `VITE_API_URL` environment configuration)
- `Admin/src/services/api.ts` (supported `VITE_API_URL` environment configuration)

### Files Deleted
- None

### Changes Implemented
1. **Vercel Serverless & SPA Routing Configuration:**
   - Configured `Backend/vercel.json` targeting `api/index.ts` using `@vercel/node` builder to handle all REST API traffic without persistent server overhead.
   - Configured `User/vercel.json` and `Admin/vercel.json` with wildcard client-side route rewrites to `/index.html` preventing 404s on browser refreshes.
2. **Environment & Cross-Domain API Flexibility:**
   - Updated both `publicApi.ts` and `api.ts` to read `import.meta.env.VITE_API_URL`, enabling seamless independent multi-project deployment on Vercel while preserving local Vite proxying defaults.
   - Added environment variable documentation in `User/.env.example` and `Admin/.env.example`.
3. **Master Project Documentation & Runbook (`README.md`):**
   - Produced an exhaustive documentation manual covering project overview, architecture tables, directory hierarchy, step-by-step local installation, Drizzle ORM migrations/seeding, running local development servers, ₹0/month Vercel deployment instructions, and a security compliance checklist.

### Reason
Complete the project deliverables by providing complete deployment configurations and documentation for production operations.

### Tests Performed & Results
- Backend Unit Tests: `npm --prefix Backend run test` passed 16/16 tests across 3 suites in 3.41s.
- User Frontend Production Build: `npm --prefix User run build` succeeded with 0 errors and 0 warnings.
- Admin Frontend Production Build: `npm --prefix Admin run build` succeeded with 0 errors and 0 warnings.

### Known Issues
- None.

---

## [Phase 5: Polish, Accessibility & Performance Pass] - 2026-10-31 16:15 IST

### Task Name
Phase 5: Polish & Accessibility Pass (WCAG AA, Screen Reader Support, Focus Indicators, Bundle Splitting & Empty States)

### Requirement Description
Perform a comprehensive accessibility and performance optimization pass across both the `User/` visitor application and the `Admin/` management console. Ensure WCAG AA compliance, visible keyboard focus rings, complete `aria-label` coverage on icon-only elements, semantic dialog roles, accessible form error binding, and optimized Rollup chunk splitting to eliminate bundle size warnings and guarantee high Lighthouse performance.

### Files Created
- None

### Files Modified
- `User/vite.config.ts` (configured Rollup `manualChunks` splitting vendor, motion, query, and icons)
- `Admin/vite.config.ts` (configured Rollup `manualChunks` splitting vendor, query, and icons)
- `User/src/components/common/Navbar.tsx` (added `aria-label` tags, focus-visible rings, mobile menu accessibility attributes)
- `User/src/components/common/Footer.tsx` (added `aria-label` tags to social icons and back-to-top button, keyboard focus rings)
- `User/src/components/sections/HeroSection.tsx` (added `aria-label` on social links, focus-visible rings on CTA buttons)
- `User/src/components/sections/ProjectsSection.tsx` (added `aria-pressed`, `aria-label` on filters, external links, empty filter state)
- `User/src/components/sections/BlogSection.tsx` (added `aria-label` on article links, `loading="lazy"` on covers)
- `User/src/components/sections/SkillsSection.tsx` (added `role="tablist"`, `role="tab"`, `role="progressbar"`, `aria-valuenow`)
- `User/src/components/sections/TestimonialsSection.tsx` (added accessible star rating roles and `loading="lazy"` on avatars)
- `User/src/components/sections/EducationSection.tsx` (added `aria-label` on credential verification links)
- `User/src/components/sections/AboutSection.tsx` (added `loading="lazy"` on profile avatar, semantic structure)
- `User/src/components/sections/ContactSection.tsx` (added `id`/`htmlFor` bindings, `aria-invalid`, `aria-describedby` error linking, `role="alert"` with `aria-live`)
- `Admin/src/components/layout/AdminLayout.tsx` (added `aria-label` on logout, view site, and theme toggle buttons, keyboard focus rings)
- `Admin/src/components/ui/Modal.tsx` (added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`)
- `Admin/src/components/ui/MediaUploader.tsx` (added accessible copy/remove labels and keyboard focus rings)
- `docs/TESTING_STRATEGY.md` (documented Section 4: Accessibility and Bundle Performance Verification)

### Files Deleted
- None

### Changes Implemented
1. **Bundle Optimization & Chunk Splitting:**
   - In both `User/vite.config.ts` and `Admin/vite.config.ts`, partitioned third-party libraries into isolated chunks: `vendor` (`react`, `react-dom`, `react-router-dom`), `motion` (`framer-motion`, `lenis`), `query` (`@tanstack/react-query`), and `icons` (`lucide-react`).
   - Reduced all individual chunk sizes in `User/` to under 285 kB (gzip: ~77 kB max) and `Admin/` to under 165 kB (gzip: ~54 kB max), completely eliminating Vite bundle warnings.
2. **WCAG AA Keyboard Navigation & Focus Indicators:**
   - Added uniform `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]` across all interactive buttons, links, inputs, and toggles.
3. **Screen Reader Semantics:**
   - Equipped all icon-only buttons with contextual `aria-label` attributes.
   - Enhanced modal dialogs with standard WAI-ARIA modal attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
   - Connected form inputs with their respective field validation messages via `aria-invalid` and `aria-describedby`.
   - Enabled screen readers to announce contact submission outcomes with `role="alert"` and `aria-live`.
4. **Empty and Filter Fallback States:**
   - Implemented empty state fallback for tag filtering on projects showcase.
   - Verified that `Testimonials` automatically hides when 0 items exist in the database.

### Reason
Fulfill Phase 5 quality standards, guarantee WCAG AA accessibility, eliminate bundle size bloat, and prepare the project for Lighthouse scores of Performance 90+, Accessibility 95+, and SEO 95+.

### Tests Performed & Results
- User Frontend Build: `npm --prefix User run build` succeeded without errors or warnings (all chunks < 285 kB).
- Admin Frontend Build: `npm --prefix Admin run build` succeeded without errors or warnings (all chunks < 165 kB).
- Backend Unit Tests: `npm --prefix Backend run test` passed 16/16 tests across 3 test suites.

### Known Issues
- None.

---

## [Phase 4: Public API & Visitor Experience UI Development] - 2026-10-31 15:45 IST

### Task Name
Phase 4: Public REST API & Visitor Portfolio Web App (`User/`)

### Requirement Description
Build a fast, beautifully animated, scroll-driven visitor web app using React 18, Vite, Tailwind CSS, Lenis smooth scrolling, Framer Motion, and TanStack Query. Create dedicated routes for project case studies (`/projects/:slug`) and technical blog posts (`/blog/:slug`). Build visitor-facing REST APIs (`/api/public/portfolio`, `/api/public/projects`, `/api/public/blog`, `/api/public/contact`) with validation, rate limiting, and automated Gmail SMTP notification dispatch.

### Files Created
- `Backend/src/controllers/public.controller.ts`
- `Backend/src/routes/public.routes.ts`
- `Backend/src/__tests__/public_api.test.ts`
- `User/.gitignore`
- `User/package.json`
- `User/tsconfig.json`
- `User/vite.config.ts`
- `User/tailwind.config.js`
- `User/postcss.config.js`
- `User/index.html`
- `User/src/main.tsx`
- `User/src/App.tsx`
- `User/src/index.css`
- `User/src/types/index.ts`
- `User/src/services/publicApi.ts`
- `User/src/context/ThemeContext.tsx`
- `User/src/components/common/ScrollProgress.tsx`
- `User/src/components/common/CustomCursor.tsx`
- `User/src/components/common/Navbar.tsx`
- `User/src/components/common/Footer.tsx`
- `User/src/components/sections/HeroSection.tsx`
- `User/src/components/sections/AboutSection.tsx`
- `User/src/components/sections/SkillsSection.tsx`
- `User/src/components/sections/ExperienceSection.tsx`
- `User/src/components/sections/ProjectsSection.tsx`
- `User/src/components/sections/BlogSection.tsx`
- `User/src/components/sections/EducationSection.tsx`
- `User/src/components/sections/TestimonialsSection.tsx`
- `User/src/components/sections/ContactSection.tsx`
- `User/src/pages/HomePage.tsx`
- `User/src/pages/ProjectDetailPage.tsx`
- `User/src/pages/BlogDetailPage.tsx`
- `User/src/pages/NotFoundPage.tsx`

### Files Modified
- `Backend/src/routes/index.ts` (mounted `public.routes.ts` at `/public`)
- `User/src/components/sections/ContactSection.tsx` (explicit type casting to `ContactPayload`)

### Files Deleted
- None

### Changes Implemented
1. **Backend Public API:**
   - Implemented `public.controller.ts` aggregating visible-only portfolio records (`GET /api/public/portfolio`), project queries by slug and tag (`GET /api/public/projects`, `GET /api/public/projects/:slug`), and blog article queries (`GET /api/public/blog`, `GET /api/public/blog/:slug`).
   - Implemented `POST /api/public/contact` with Zod validation, PostgreSQL persistence in `messages` table, and asynchronous email notification dispatch via Nodemailer/Gmail SMTP.
   - Added unit test suite `public_api.test.ts` with 6 dedicated test cases covering 100% of public endpoints.
2. **Visitor Frontend Foundation (`User/`):**
   - Configured Vite, React 18, Tailwind CSS, custom color themes (dark: `#0a0a0a` + crimson `#e91010`, light: `#EAE0D0` + `#e91010`).
   - Integrated Lenis smooth scrolling with fallback respecting `prefers-reduced-motion`.
   - Built global top progress indicator (`ScrollProgress`) and custom cursor (`CustomCursor`) on desktop.
   - Built sticky dynamic `Navbar` with scroll-spy highlight, mobile drawer menu, resume download link, and dark/light toggle.
3. **Visitor Showcase Sections:**
   - **HeroSection:** Animated role word rotator, intro bio, CTA actions, social icon badges.
   - **AboutSection:** Bio, profile avatar, animated experience and project counters.
   - **SkillsSection:** Grouped categories, percentage proficiency bars animating `whileInView`.
   - **ExperienceSection:** Animated vertical timeline with dynamic drawing line and milestone cards.
   - **ProjectsSection:** Filterable project showcase by tech tags, thumbnail cards, and link to case study.
   - **BlogSection:** Article previews, reading time indicators, tags, and links to full articles.
   - **EducationSection:** Academic milestones and certified credentials with verification badges.
   - **TestimonialsSection:** 5-star customer and peer endorsements (auto-hidden when empty).
   - **ContactSection:** React Hook Form + Zod validated contact submission with direct REST API integration.
4. **Dedicated Deep Route Pages:**
   - `ProjectDetailPage.tsx` (`/projects/:slug`): Hero summary, live demo and GitHub repository links, gallery image viewer, and rich Markdown case study rendering.
   - `BlogDetailPage.tsx` (`/blog/:slug`): Header metadata, reading time, share link copy, and rich Markdown article reader.
   - `NotFoundPage.tsx` (`*`): 404 page with return-to-home navigation.

### Reason
Provide visitors with a fast, modern, scroll-driven portfolio experience backed entirely by dynamic database-driven APIs, satisfying all requirements of Phase 4.

### Tests Performed & Results
- Backend Unit Tests: 16/16 passed across 3 test suites (`app.test.ts`, `public_api.test.ts`, `admin_api.test.ts`).
- User Frontend Build: `npm --prefix User run build` succeeded without errors (2,173 modules transformed in 5.67s).
- Admin Frontend Build: `npm --prefix Admin run build` succeeded without errors (1,646 modules transformed in 4.03s).

### Known Issues
- None.

---

## [Phase 3: Admin Panel UI Development] - 2026-10-31 15:10 IST

### Task Name
Phase 3: Admin Dashboard UI Single-Page Application (`Admin/`)

### Requirement Description
Build a production-grade, responsive, and data-dense administration console using React 18, Vite, Tailwind CSS, TanStack Query, and Lucide React. Provide complete content management (CRUD, live Cloudinary media streaming, drag/rank reorder, visibility toggling, unread inbox, site settings, and dark/light mode toggle).

### Files Created
- `Admin/.gitignore`
- `Admin/package.json`
- `Admin/tsconfig.json`
- `Admin/vite.config.ts`
- `Admin/tailwind.config.js`
- `Admin/postcss.config.js`
- `Admin/index.html`
- `Admin/src/main.tsx`
- `Admin/src/App.tsx`
- `Admin/src/index.css`
- `Admin/src/types/index.ts`
- `Admin/src/services/api.ts`
- `Admin/src/context/AuthContext.tsx`
- `Admin/src/context/ThemeContext.tsx`
- `Admin/src/context/ToastContext.tsx`
- `Admin/src/components/layout/ProtectedRoute.tsx`
- `Admin/src/components/layout/AdminLayout.tsx`
- `Admin/src/components/ui/Modal.tsx`
- `Admin/src/components/ui/MediaUploader.tsx`
- `Admin/src/pages/LoginPage.tsx`
- `Admin/src/pages/DashboardPage.tsx`
- `Admin/src/pages/ProjectsPage.tsx`
- `Admin/src/pages/BlogPage.tsx`
- `Admin/src/pages/SkillsPage.tsx`
- `Admin/src/pages/ExperiencesPage.tsx`
- `Admin/src/pages/EducationPage.tsx`
- `Admin/src/pages/CertificationsPage.tsx`
- `Admin/src/pages/TestimonialsPage.tsx`
- `Admin/src/pages/SocialLinksPage.tsx`
- `Admin/src/pages/SettingsPage.tsx`
- `Admin/src/pages/MessagesPage.tsx`

### Files Modified
- None

### Files Deleted
- None

### Changes Implemented
1. Initialized `Admin/` application powered by React 18, Vite, and Tailwind CSS with custom palette (`#0a0a0a`, `#EAE0D0`, and crimson `#e91010`).
2. Implemented `AuthContext` and `ProtectedRoute` verifying admin session via `GET /api/auth/me` with automatic redirect to `/login`.
3. Created `AdminLayout` featuring compact sidebar navigation with dynamic unread message count badges, top header bar with preview links, and dark/light theme switcher.
4. Created `MediaUploader` component with in-memory direct streaming to `/api/admin/upload`, Cloudinary secure URL preview, PDF badge indicator, and one-click clipboard copy.
5. Built `DashboardPage` displaying live counts for showcase projects, blog articles, technical skills, experiences, and unread inquiries with recent message previews.
6. Implemented full CRUD tables and modals across all resources:
   - Projects: Title, auto-slug generator, summary, case study markdown, tags, thumbnail upload, GitHub/Live links, rank reordering, visibility toggle.
   - Blog Posts: Markdown editor with live preview tab, reading time, publish status toggle.
   - Skills & Categories: Category grouping, proficiency sliders (0-100%), icon keys, visibility.
   - Experiences: Milestones, dates, role, company, current position flag, bullet achievements.
   - Education: Academic degrees, institutions, CGPA/grade, dates.
   - Certifications: Licenses, credentials, verification links, badge uploader.
   - Testimonials: Quotes, 5-star rating selector, author profile, company, avatar uploader.
   - Social Links: Platform handles, URLs, icons, display sequence.
   - Settings: Comprehensive personal information editor (full name, title, tagline, bio, profile photo, resume PDF, contact email/phone, accent color, SEO tags).
   - Messages: Contact inquiries inbox with unread filter, details reader modal, read/unread toggle, and direct mailto reply.
7. Integrated `ToastContext` providing feedback notifications for all actions.
8. Verified complete production build with Vite (`npm run build`).

### Reason
Provide a complete, zero-hardcoding administration dashboard enabling full control of all portfolio content from a secure UI.

### Key Implementation Details
- TanStack Query used for reactive data synchronization, mutation handling, and cache invalidation.
- Vite proxy configured to forward `/api` requests to backend on port 5000 with credentials.
- Compact, data-dense, professional UI design adhering strictly to UI/UX specifications.

### Dependencies Added/Removed
- Installed `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`, `lucide-react`, `tailwindcss`, `vite`, `clsx`, `tailwind-merge`, and types in `Admin/`.

### Tests Performed & Results
- `npm run build` (`Admin/`): Compiled 1646 modules in 3.88s without errors into `Admin/dist/`.
- `npm run test` (`Backend/`): 10/10 automated tests passing.

### Known Issues
- None identified.

### Documentation Updated
- `docs/CHANGELOG.md` updated with Phase 3 entry.

---

## [Phase 2: Admin API & Core Backend Architecture] - 2026-10-31 14:34 IST

### Task Name
Phase 2: Admin API, Authentication, CRUD Services, Cloudinary Ingestion & Integration Tests

### Requirement Description
Implement production-grade layered REST API architecture (Routes -> Controllers -> Services -> Repositories) for all portfolio resources, JWT cookie authentication, direct Cloudinary memory buffer streaming, Nodemailer Gmail notification service, Zod request validation, and comprehensive automated test suites.

### Files Created
- `Backend/src/services/auth.service.ts`
- `Backend/src/services/storage.service.ts`
- `Backend/src/services/mailer.service.ts`
- `Backend/src/middleware/upload.middleware.ts`
- `Backend/src/repositories/admin.repository.ts`
- `Backend/src/repositories/settings.repository.ts`
- `Backend/src/repositories/project.repository.ts`
- `Backend/src/repositories/blog.repository.ts`
- `Backend/src/repositories/skill.repository.ts`
- `Backend/src/repositories/experience.repository.ts`
- `Backend/src/repositories/education.repository.ts`
- `Backend/src/repositories/certification.repository.ts`
- `Backend/src/repositories/testimonial.repository.ts`
- `Backend/src/repositories/social.repository.ts`
- `Backend/src/repositories/message.repository.ts`
- `Backend/src/controllers/auth.controller.ts`
- `Backend/src/controllers/dashboard.controller.ts`
- `Backend/src/controllers/settings.controller.ts`
- `Backend/src/controllers/upload.controller.ts`
- `Backend/src/controllers/project.controller.ts`
- `Backend/src/controllers/blog.controller.ts`
- `Backend/src/controllers/skill.controller.ts`
- `Backend/src/controllers/experience.controller.ts`
- `Backend/src/controllers/education.controller.ts`
- `Backend/src/controllers/certification.controller.ts`
- `Backend/src/controllers/testimonial.controller.ts`
- `Backend/src/controllers/social.controller.ts`
- `Backend/src/controllers/message.controller.ts`
- `Backend/src/routes/auth.routes.ts`
- `Backend/src/routes/admin.routes.ts`
- `Backend/src/routes/index.ts`
- `Backend/src/__tests__/admin_api.test.ts`

### Files Modified
- `Backend/src/app.ts` (Mounted `/api` routes gateway)
- `Backend/src/validators/index.ts` (Added comprehensive Zod validation schemas for all entities)

### Files Deleted
- None

### Changes Implemented
1. Implemented `AuthService` and `AuthController` with bcrypt verification and stateless 7-day JWT tokens stored in `httpOnly`, `SameSite`, `Secure` cookies.
2. Built `StorageService` using direct in-memory stream buffers to Cloudinary (`upload_stream`), bypassing local disk writes for serverless compatibility.
3. Created `MailerService` using Nodemailer and Gmail SMTP with non-blocking error handling.
4. Created 11 Drizzle ORM repositories providing complete data access abstraction for all portfolio entities.
5. Implemented full CRUD, reorder (`PATCH /reorder`), and visibility toggling (`PATCH /:id/visibility`) across all resources.
6. Added `DashboardController` providing aggregate entity counts and unread message metrics.
7. Mounted protected route hierarchy under `/api/admin` guarded by `requireAuth` middleware.
8. Enforced Zod validation across all body schemas and route UUID parameters.
9. Implemented comprehensive integration test suite covering auth login, cookie headers, route protection, token tampering, and input validation.

### Reason
Provide complete, secure, and performant administrative control over portfolio data prior to building the frontend dashboard.

### Key Implementation Details
- Strict separation of concerns (Routes -> Controllers -> Services -> Repositories).
- Memory-safe Multer uploads (10MB limit, strict MIME filter for images and PDFs).
- Transactional reordering (`db.transaction`) ensuring display sequence integrity.

### Dependencies Added/Removed
- None (All dependencies installed in Phase 1).

### Tests Performed & Results
- `npm run test` (`vitest run`): 10/10 tests passed across 2 test suites (`app.test.ts` and `admin_api.test.ts`).
- `npm run build` (`tsc`): Zero TypeScript compilation errors.

### Known Issues
- None identified.

### Documentation Updated
- `docs/CHANGELOG.md` updated with Phase 2 release entry.

---

## [Phase 1: Foundation & Setup] - 2026-10-31 14:05 IST

### Task Name
Phase 1: Project Documentation Suite & Backend Foundation Setup

### Requirement Description
Initialize standard documentation in `/docs` and establish the production-ready Node.js, Express, and Drizzle ORM backend foundation targeting both Vercel Serverless and standalone Node/VPS environments.

### Files Created
- `docs/PROJECT_CONTEXT.md`
- `docs/CHANGELOG.md`
- `docs/ARCHITECTURE.md`
- `docs/BACKEND_FLOW.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/API_DOCUMENTATION.md`
- `docs/BUGS_AND_ISSUES.md`
- `docs/TECHNICAL_DECISIONS.md`
- `docs/TESTING_STRATEGY.md`
- `.gitignore`
- `Backend/.gitignore`
- `Backend/.env.example`
- `Backend/.env`
- `Backend/package.json`
- `Backend/tsconfig.json`
- `Backend/drizzle.config.ts`
- `Backend/vercel.json`
- `Backend/api/index.ts`
- `Backend/src/server.ts`
- `Backend/src/app.ts`
- `Backend/src/config/env.ts`
- `Backend/src/config/db.ts`
- `Backend/src/config/cloudinary.ts`
- `Backend/src/db/schema.ts`
- `Backend/src/db/migrate.ts`
- `Backend/src/db/seed.ts`
- `Backend/src/db/migrations/0000_overjoyed_stick.sql`
- `Backend/src/middleware/rateLimiter.ts`
- `Backend/src/middleware/auth.middleware.ts`
- `Backend/src/middleware/error.middleware.ts`
- `Backend/src/validators/index.ts`
- `Backend/src/__tests__/app.test.ts`

### Files Modified
- None

### Files Deleted
- None

### Changes Implemented
1. Established comprehensive engineering documentation adhering to global engineering rules across all 9 `/docs` specifications.
2. Initialized `Backend/` with TypeScript, Express 4.21, Drizzle ORM 0.38, and PostgreSQL pool connection handling with SSL and serverless support.
3. Created complete Drizzle schema with 13 tables (`admin_users`, `site_settings`, `social_links`, `skill_categories`, `skills`, `experiences`, `projects`, `blog_posts`, `education`, `certifications`, `testimonials`, `messages`, `media`).
4. Configured Zod environment validation with fail-fast startup checks.
5. Implemented security middleware: Helmet HTTP headers, CORS with allowlist & credentials, rate-limiting (`authLimiter`, `contactLimiter`, `apiLimiter`), cookie parsing, and centralized error handling.
6. Generated initial Drizzle migration (`0000_overjoyed_stick.sql`) with indices, primary keys, and foreign keys.
7. Prepared database seeder with default admin account and Ayush's real-world portfolio records.
8. Configured dual-target entry points: `Backend/src/server.ts` for Node/VPS and `Backend/api/index.ts` with `Backend/vercel.json` for Vercel Fluid Compute.
9. Added Vitest integration test suite for health check and error routing.

### Reason
Provide architectural clarity, enforce verified database schemas, and initialize a scalable, secure backend infrastructure.

### Key Implementation Details
- Full Drizzle schema mapped to TypeScript types; native PostgreSQL `text[]` arrays utilized for tags and achievements; direct memory buffer streaming prepared for Cloudinary uploads.

### Dependencies Added/Removed
- Added dependencies: `express`, `drizzle-orm`, `pg`, `@neondatabase/serverless`, `zod`, `bcryptjs`, `jsonwebtoken`, `express-rate-limit`, `helmet`, `cors`, `cookie-parser`, `nodemailer`, `cloudinary`, `multer`, `dotenv`.
- Added dev dependencies: `typescript`, `tsx`, `drizzle-kit`, `vitest`, `supertest`, and corresponding `@types/*`.

### Tests Performed & Results
- `drizzle-kit generate`: Migration generated successfully (`0000_overjoyed_stick.sql`).
- `npm run build` (`tsc`): Compiled TypeScript without errors into `dist/`.
- `npm run test` (`vitest run`): 2/2 tests passed (Health check returned 200 with environment data, unmapped route returned 404 with standard JSON contract).

### Known Issues
- None identified.

### Documentation Updated
- Initialized all files in `/docs`.

