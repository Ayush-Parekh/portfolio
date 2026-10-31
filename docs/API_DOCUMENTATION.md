# REST API Documentation

## 1. Overview & General Conventions
- **Base URL:** `/api`
- **Content Type:** `application/json`
- **Authentication:** Admin endpoints require a valid JWT token transmitted in the `httpOnly` `auth_token` cookie.
- **Unified Success Response Format:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Optional description"
  }
  ```
- **Unified Error Response Format:**
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human readable summary",
      "details": []
    }
  }
  ```

---

## 2. Public API Endpoints (`/api/public`)

### 2.1 Get Consolidated Portfolio
- **Method:** `GET /api/public/portfolio`
- **Auth:** None (Public)
- **Description:** Returns all visible content (settings, social links, categorized skills, experiences, projects, education, certifications, testimonials) in a single optimized payload.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "settings": { "fullName": "Ayush Parekh", ... },
      "socialLinks": [ ... ],
      "skillCategories": [ { "name": "Frontend", "skills": [ ... ] } ],
      "experiences": [ ... ],
      "projects": [ ... ],
      "education": [ ... ],
      "certifications": [ ... ],
      "testimonials": [ ... ]
    }
  }
  ```

### 2.2 Get Project by Slug
- **Method:** `GET /api/public/projects/:slug`
- **Auth:** None (Public)
- **Description:** Returns deep case study details for a specific project.
- **Response (200 OK):** Project object with gallery, architecture summary, tech tags, links.

### 2.3 List Blog Posts
- **Method:** `GET /api/public/blog`
- **Auth:** None (Public)
- **Query Params:** `tag` (optional), `page` (default 1), `limit` (default 10)
- **Response (200 OK):** Paginated array of published blog posts.

### 2.4 Get Blog Post by Slug
- **Method:** `GET /api/public/blog/:slug`
- **Auth:** None (Public)
- **Response (200 OK):** Full blog post with markdown content, metadata, and tags.

### 2.5 Submit Contact Message
- **Method:** `POST /api/public/contact`
- **Auth:** None (Strict Rate Limited: max 5 requests per 15 minutes per IP)
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Project Collaboration",
    "message": "Hello, I would love to collaborate on a new full-stack project."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Your message has been sent successfully. I will get back to you shortly!"
  }
  ```

---

## 3. Admin Authentication Endpoints (`/api/admin/auth`)

### 3.1 Admin Login
- **Method:** `POST /api/admin/auth/login`
- **Rate Limit:** Max 5 failed attempts per 15 minutes per IP.
- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response (200 OK):** Sets `auth_token` cookie; returns admin profile data.

### 3.2 Admin Logout
- **Method:** `POST /api/admin/auth/logout`
- **Response (200 OK):** Clears `auth_token` cookie.

### 3.3 Get Authenticated Profile
- **Method:** `GET /api/admin/auth/me`
- **Auth:** Required (`auth_token` cookie)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "id": "...", "email": "admin@example.com", "fullName": "Ayush Parekh" }
  }
  ```

---

## 4. Admin Management Endpoints (`/api/admin`)

### 4.1 Dashboard Overview
- **Method:** `GET /api/admin/dashboard/stats`
- **Auth:** Required
- **Response (200 OK):** Counts of projects, skills, experiences, blogs, and total unread messages.

### 4.2 Site Settings
- `GET /api/admin/settings` - Retrieve current configuration.
- `PUT /api/admin/settings` - Update bio, avatar, resume URL, SEO tags, and colors.

### 4.3 CRUD on Portfolio Resources
Applies to: `projects`, `blog`, `skills`, `skill-categories`, `experiences`, `education`, `certifications`, `testimonials`, `social-links`.
- `GET /api/admin/:resource` - List all records (including hidden).
- `POST /api/admin/:resource` - Create new record.
- `GET /api/admin/:resource/:id` - Fetch single record.
- `PUT /api/admin/:resource/:id` - Update existing record.
- `DELETE /api/admin/:resource/:id` - Remove record.
- `PATCH /api/admin/:resource/reorder` - Reorder items (Body: `[{ id: "...", display_order: 1 }, ...]`).
- `PATCH /api/admin/:resource/:id/visibility` - Toggle visibility (Body: `{ is_visible: boolean }`).

### 4.4 Messages Management
- `GET /api/admin/messages` - Paginated messages.
- `PATCH /api/admin/messages/:id/read` - Mark message as read/unread.
- `DELETE /api/admin/messages/:id` - Delete message.

### 4.5 Media Uploads (Cloudinary Direct Stream)
- `POST /api/admin/upload` - Multipart form upload (`file` field). Direct stream to Cloudinary. Returns `{ secure_url, public_id }`.
- `DELETE /api/admin/upload/:publicId` - Deletes asset from Cloudinary and media record.

