# Bugs and Technical Issues Log

This document tracks all identified technical issues, bugs, and edge cases across the portfolio application.

---

| Issue ID | Date Identified | Severity | Status | Affected Module | Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ISS-001` | 2026-10-31 | Low | `Fixed` | Backend Config | Initial system PATH lacked direct `psql` binary access; solved by leveraging Node.js native PostgreSQL drivers (`pg` and `@neondatabase/serverless`) without requiring external CLI tools. |

---

### Detailed Issue Records

#### ISS-001: Absence of `psql` CLI in Local Windows User PATH
- **Date Identified:** 2026-10-31
- **Severity:** Low
- **Status:** `Fixed`
- **Affected Modules:** Local environment setup
- **Expected Behavior:** Database migrations and connections execute reliably in both local and cloud environments.
- **Actual Behavior:** Standard `psql` command not in Windows PATH (Postgres 16 is installed under `C:\Program Files\PostgreSQL\16\bin`).
- **Verified Root Cause:** Windows default installation path omitted from user PATH variable.
- **Recommended Solution:** Utilize Drizzle Kit's programmatic TypeScript runners and `pg` pool driver, which connect directly via TCP/IP sockets without depending on OS-level `psql` executables.

