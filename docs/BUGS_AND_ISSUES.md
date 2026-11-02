# Bugs and Technical Issues Log

This document tracks all identified technical issues, bugs, and edge cases across the portfolio application.

---

| Issue ID | Date Identified | Severity | Status | Affected Module | Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ISS-001` | 2026-10-31 | Low | `Fixed` | Backend Config | Initial system PATH lacked direct `psql` binary access; solved by leveraging Node.js native PostgreSQL drivers (`pg` and `@neondatabase/serverless`) without requiring external CLI tools. |
| `ISS-002` | 2026-11-02 | Medium | `Fixed` | Frontend Performance | Theme switch animation stutter and perceived screen choppiness caused by wildcard CSS transitions (`div { transition: ... }`), `mix-blend-difference` on custom cursor, and orphaned Lenis RAF loops. |

---

### Detailed Issue Records

#### ISS-002: Theme Switch Animation Lag and Screen Choppiness
- **Date Identified:** 2026-11-02
- **Severity:** Medium
- **Status:** `Fixed`
- **Affected Modules:** `User/`, `Admin/`
- **Expected Behavior:** Smooth 60/120fps circular clip-path reveal when switching themes, and fluid mouse/scroll interactions without perceived screen lag.
- **Actual Behavior:** Severe frame drops during theme toggling and choppy pointer tracking across heavy pages (`HomePage`, `ProjectDetailPage`, `BlogDetailPage`).
- **Verified Root Cause:**
  1. `index.css` had wildcard `div` transitions active, causing 500+ elements to run 250ms CSS color fades concurrently with the 500ms radial clip-path animation.
  2. `CustomCursor.tsx` used `mix-blend-difference` on a fixed layer, forcing full-frame GPU readbacks on every mouse movement. The sluggish spring config (`stiffness: 250, damping: 25`) created perceived pointer lag, and the cursor was snapshotted into the View Transition canvas.
  3. `HomePage.tsx` did not cancel the `requestAnimationFrame` loop when unmounting Lenis, creating leaked RAF instances across route navigations.
- **Recommended Solution:** Remove wildcard `div` transitions, suppress all transitions during View Transition via `.theme-transitioning`, optimize circular reveal to 400ms, eliminate `mix-blend-difference`, promote cursor to hardware-accelerated transforms with snappy spring physics, and cancel RAF loops on unmount.
- **Verification:** Both frontend builds (`User` and `Admin`) compile cleanly with 0 errors; all 16 backend unit tests pass.

---

#### ISS-001: Absence of `psql` CLI in Local Windows User PATH
- **Date Identified:** 2026-10-31
- **Severity:** Low
- **Status:** `Fixed`
- **Affected Modules:** Local environment setup
- **Expected Behavior:** Database migrations and connections execute reliably in both local and cloud environments.
- **Actual Behavior:** Standard `psql` command not in Windows PATH (Postgres 16 is installed under `C:\Program Files\PostgreSQL\16\bin`).
- **Verified Root Cause:** Windows default installation path omitted from user PATH variable.
- **Recommended Solution:** Utilize Drizzle Kit's programmatic TypeScript runners and `pg` pool driver, which connect directly via TCP/IP sockets without depending on OS-level `psql` executables.

