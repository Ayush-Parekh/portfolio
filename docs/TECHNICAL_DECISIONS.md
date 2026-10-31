# Technical & Architectural Decisions Log

This document records significant architectural and technical decisions, their justifications, trade-offs, and future impacts.

---

## DEC-001: Selection of Drizzle ORM over Prisma and Raw SQL
- **Context:** The database layer must support serverless deployment on Vercel Fluid Compute with zero cold-start delay, zero binary lock-in, and strict TypeScript type-safety while connecting to Neon PostgreSQL.
- **Alternatives Considered:**
  1. *Prisma ORM:* Excellent DX, but requires a heavy Rust engine binary that increases cold starts on Vercel serverless and adds bundle size.
  2. *node-pg-migrate with pg Pool:* Very lightweight, but lacks automatic type inference and requires manually maintaining SQL schemas alongside TypeScript types.
  3. *Drizzle ORM:* Native TypeScript schema declaration, zero engine binaries, microsecond cold starts, automatic migration generation via `drizzle-kit`, and built-in support for Neon serverless poolers.
- **Decision:** Selected **Drizzle ORM**.
- **Advantages:** Blazing performance, zero binary runtime overhead, pure SQL transparency, complete type safety from database to API controllers.
- **Disadvantages:** Less automated relations abstraction compared to Prisma (requires explicit join definitions or Drizzle query API).
- **Future Impact:** Effortless migration between serverless platforms (Vercel) and traditional VPS servers (Docker/Node.js).

---

## DEC-002: Dual-Target Backend Architecture (Vercel Serverless & VPS Portable)
- **Context:** Initial deployment targets Vercel Fluid Compute for a ₹0/month budget, but the system must remain portable to any traditional Linux VPS without code rewrites.
- **Alternatives Considered:**
  1. *Next.js API Routes:* Couples the backend tightly to Next.js/Vercel.
  2. *Pure Express Server:* Requires a container or dedicated VM to run continuously.
  3. *Stateless Express App with Dual Entry Points:* Core Express app configured in `src/app.ts`, exported for Vercel in `api/index.ts`, and run via `src/server.ts` for Node/VPS.
- **Decision:** Selected **Stateless Express App with Dual Entry Points**.
- **Advantages:** Maximum portability. Local development and VPS run standard `app.listen()`, while Vercel runs the serverless adapter.
- **Disadvantages:** In-memory caching and persistent local disk storage cannot be used.
- **Future Impact:** The portfolio backend can be deployed anywhere at any time without architectural changes.

---

## DEC-003: Direct Memory Streaming for Media Uploads (Cloudinary)
- **Context:** Vercel serverless functions do not provide persistent local disk storage. Traditional local file uploads (`/uploads` folder) are wiped on function spin-down.
- **Alternatives Considered:**
  1. *Local Disk Storage:* Incompatible with Vercel serverless functions.
  2. *Direct Browser-to-Cloudinary Upload:* Requires exposing Cloudinary upload presets or signatures to client-side code, complicating validation and authorization.
  3. *Server-Side Memory Stream via Multer Buffer:* Admin browser uploads to backend; backend validates file size, MIME type, and streams buffer directly to Cloudinary SDK; file is never saved to disk.
- **Decision:** Selected **Server-Side Memory Stream via Multer Buffer to Cloudinary**.
- **Advantages:** Centralized authentication and security validation; no temporary files on disk; works in all serverless environments; full control over file transformations and clean deletion.
- **Disadvantages:** Serverless function handles payload memory (capped at 5MB images, 10MB PDFs to stay well below serverless payload limits).
- **Future Impact:** Reliable media delivery and PDF downloads via Cloudinary's global CDN.

---

## DEC-004: Native PostgreSQL Array for Project Tech Tags
- **Context:** Each portfolio project showcases multiple technology tags (e.g., `["React", "TypeScript", "Node.js"]`).
- **Alternatives Considered:**
  1. *Normalized Tables (`project_tags` junction + `tags` master):* Excessive complexity, requires multi-table joins, creates overhead during project CRUD.
  2. *PostgreSQL Native `text[]` Array with GIN Indexing:* Supported natively in Postgres and Drizzle; enables efficient `@>` (contains) queries and eliminates join overhead.
- **Decision:** Selected **PostgreSQL Native `text[]` Array**.
- **Advantages:** Simple data model, zero N+1 queries, single-query reads and updates, high performance.
- **Disadvantages:** Tags cannot hold independent metadata (not required for simple tech badge tags).
- **Future Impact:** Fast, maintainable queries with zero schema bloat.

