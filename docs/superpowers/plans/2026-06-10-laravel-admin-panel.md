# Laravel Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the static Brighton site to Laravel 12 with a Filament 3 admin panel: DB-driven work pages, persisted contact submissions, analytics, user management, full seeders.

**Architecture:** Laravel app at repo root. Blade layout + components replace duplicated HTML; one project template renders any DB project. Filament provides admin CRUD, dashboard widgets, and user management. Existing CSS/JS move to resources and build through laravel-vite-plugin.

**Tech Stack:** PHP 8.2, Laravel 12, Filament 3, MariaDB (XAMPP), Vite, Pest/PHPUnit feature tests (SQLite in-memory).

Spec: `docs/superpowers/specs/2026-06-10-laravel-admin-panel-design.md`

---

### Task 1: Scaffold Laravel at repo root

**Files:** Create Laravel skeleton (composer create-project into `.scaffold`, move into root), merge `.gitignore`, replace `package.json`/`vite.config.js` with Laravel versions, configure `.env` (MySQL `brighton` db), create database.

- [ ] `composer create-project laravel/laravel .scaffold` then move contents to root (no conflicts except package.json, vite.config.js, .gitignore, README — Laravel versions win; README rewritten in Task 10)
- [ ] Create db: `mysql -u root -e "CREATE DATABASE brighton"`
- [ ] `.env`: DB_CONNECTION=mysql, DB_DATABASE=brighton, DB_USERNAME=root, empty password
- [ ] `php artisan migrate` runs clean; `php artisan serve` shows welcome page
- [ ] Commit

### Task 2: Move static assets + frontend source into Laravel structure

**Files:** `assets/**` → `public/assets/**`, `projects/**` → `public/projects/**`, `src/styles/**` → `resources/css/**`, `src/main.css` → `resources/css/main.css`, `src/js/**` → `resources/js/**`. Delete `dist/`, root `*.html` (content preserved in Blade tasks below — git history keeps originals), old `vite.config.js` inputs replaced by `resources/css/main.css` + `resources/js/app.js`.

- [ ] Move files with git mv where possible
- [ ] vite.config.js: laravel-vite-plugin, inputs `resources/css/main.css`, `resources/js/app.js`
- [ ] Fix CSS @import paths in main.css (styles/ → relative)
- [ ] `npm install && npm run build` succeeds
- [ ] Commit

### Task 3: Database schema + models

**Files:** migrations for `projects`, `project_stats`, `project_images`, `contact_submissions`, `page_visits`; models `Project`, `ProjectStat`, `ProjectImage`, `ContactSubmission`, `PageVisit` with relations, `published` scope, URL accessors resolving `projects/|assets/` prefixes via `asset()` else `Storage::url()`.

- [ ] Write migrations per spec schema
- [ ] Write models (casts, fillable via `$guarded = []`, relations, `scopePublished`, `coverUrl`/`url` accessors)
- [ ] Feature test: factories create project with images/stats, accessor resolves both path styles
- [ ] `php artisan test` passes; commit

### Task 4: Blade layout + shared components

**Files:** `resources/views/layouts/site.blade.php` (head, fonts, favicon, vite, nav, footer, optional leaflet/lightbox stacks), `components/nav.blade.php` (server-rendered, active states via `request()->routeIs()`, snow variant prop), `components/footer.blade.php` (port from `resources/js/components/footer.js`), `components/cta-band.blade.php`, `components/lightbox.blade.php`. `resources/js/app.js` consolidates init (nav scroll behavior, animations, gallery from DOM, form, filters, map, stats, snow particles — conditional on DOM presence).

- [ ] Build layout + components
- [ ] Rewrite JS entry: one `app.js` initializing features when their DOM exists; gallery reads `.gallery-item img` srcs from DOM (delete 14 per-page JS files)
- [ ] Commit

### Task 5: Static pages as Blade views + routes

**Files:** `resources/views/pages/{home,residential,commercial,commercial-installs,sitework,snow}.blade.php` ported 1:1 from HTML; `routes/web.php` GET routes; legacy `.html` redirects (301).

- [ ] Port each page body into layout (drop duplicated head/nav/footer)
- [ ] Routes + redirect map (`index.html`→`/`, `work.html`→`/work`, each `*-project.html`→`/work/{slug}`, etc.)
- [ ] Feature test: each page 200, legacy URL 301
- [ ] Test passes; commit

### Task 6: DB-driven work pages

**Files:** `resources/views/work/index.blade.php` (grid + filters from `$projects`), `resources/views/work/show.blade.php` (hero, optional overview+stats, gallery, CTA from `$project`), `app/Http/Controllers/ProjectController.php`, routes `/work`, `/work/{project:slug}`.

- [ ] Controller: index (published, ordered), show (route-model binding by slug, published only)
- [ ] Views render all current page variants (with/without overview)
- [ ] Feature tests: index lists published only, show renders title/gallery, unpublished 404
- [ ] Tests pass; commit

### Task 7: Contact form → DB

**Files:** `app/Http/Controllers/ContactSubmissionController.php`, `app/Http/Requests/StoreContactSubmissionRequest.php`, form in `pages/home.blade.php` posts to `route('contact.store')`, flash success message replaces JS mailto.

- [ ] Form request validation (name, phone, email required; property_type in:residential,commercial; service/details optional)
- [ ] Store + redirect back with flash; home view shows success state
- [ ] Feature tests: valid POST persists + redirects, invalid POST errors
- [ ] Tests pass; commit

### Task 8: Analytics middleware

**Files:** `app/Http/Middleware/TrackPageVisit.php`, registered on web group; records path/referrer/date for GET 200 HTML responses, skips `/admin*`.

- [ ] Middleware + tests (visit recorded, admin skipped)
- [ ] Tests pass; commit

### Task 9: Filament admin panel

**Files:** `composer require filament/filament`, panel at `/admin`; resources: `ProjectResource` (form: title/slug/category/tag/cover upload/overview section/repeaters for stats+images with sort, table with publish toggle + reorder), `ContactSubmissionResource` (read-focused, status badge, mark read/archive bulk actions, new-count badge), `UserResource` (name/email/password CRUD); widgets: `StatsOverview` (projects, new submissions, visits today), `VisitsChart` (30-day line).

- [ ] Install Filament, create panel provider
- [ ] Build resources + widgets
- [ ] Smoke test: `/admin` redirects to login; logged-in admin sees dashboard
- [ ] Commit

### Task 10: Seeders + install polish

**Files:** `database/seeders/{AdminUserSeeder,ProjectSeeder,DatabaseSeeder}.php` — all 10 current projects with exact titles, slugs, tags, cover images, galleries (paths from current HTML), scotchway + toras-aron overview/stats content; README rewrite with install steps.

- [ ] ProjectSeeder content extracted from original HTML files (git history)
- [ ] `php artisan migrate:fresh --seed` then `/work` matches old work.html content
- [ ] Feature test: seeded slugs resolve
- [ ] README: requirements, install commands, admin credentials note
- [ ] Commit

### Task 11: Final verification

- [ ] `php artisan test` full pass
- [ ] `npm run build` pass
- [ ] Manual smoke: serve, check `/`, `/work`, one project page, contact submit, `/admin` login, edit project, see submission, dashboard charts
- [ ] Commit any fixes
