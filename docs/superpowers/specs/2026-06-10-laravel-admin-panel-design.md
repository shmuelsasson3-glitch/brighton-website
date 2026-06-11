# Brighton Website — Laravel Migration + Admin Panel Design

Date: 2026-06-10

## Goal

Convert the static Vite site into a Laravel application with an admin panel. Project ("Our Work") pages become database-driven and editable in the admin. Contact form submissions persist to MySQL. Add lightweight analytics and admin user management. Installation must be one command sequence with seeders that reproduce the current live content exactly.

## Current State

- Static multi-page Vite site: `index`, `residential`, `commercial`, `commercial-installs`, `sitework`, `snow`, `work`, plus 10 project pages.
- Every project page follows one template: hero image + tag + title, optional overview (heading, body, up to 4 stat boxes), photo gallery with lightbox, CTA band.
- `work.html` is a hardcoded grid of project cards with residential/commercial filter.
- Contact form on `index.html` opens a `mailto:` link — nothing is stored.
- Shared nav/footer injected by JS (`src/js/components/nav.js`, `footer.js`); CSS in `src/styles/**`, page JS in `src/js/pages/**`. Images in `projects/**` and `assets/**`.

## Stack Decision

**Laravel 12 + Filament 3 admin panel + Laravel Vite plugin**, app at repo root.

Alternatives considered:

1. Hand-rolled Blade admin — full control but hundreds of lines of forms/tables/auth UI we'd own forever. Violates DRY/KISS for no benefit.
2. Laravel + Nova — paid license. Rejected.
3. **Laravel + Filament (chosen)** — free, conventional, gives CRUD resources, dashboard widgets, charts, and user management with minimal code. Beautiful out of the box.

## Architecture

```
app/
  Http/Controllers/   PageController, ProjectController, ContactSubmissionController
  Http/Middleware/    TrackPageVisit
  Models/             Project, ProjectImage, ProjectStat, ContactSubmission, PageVisit, User
  Filament/           Resources (Projects, ContactSubmissions, Users), Widgets (StatsOverview, VisitsChart)
resources/
  views/              layouts/site.blade.php, components/ (nav, footer, cta-band, lightbox), pages/*, projects/show.blade.php, work
  css/, js/           moved from src/styles, src/js (page-init JS consolidated)
public/
  assets/, projects/  moved as-is (images, videos)
database/
  migrations/, seeders/ (AdminUserSeeder, ProjectSeeder with all 10 current projects)
```

### Routes

| Route | View | Source |
|---|---|---|
| `/` | pages.home | static Blade + contact form |
| `/residential`, `/commercial`, `/commercial-installs`, `/sitework`, `/snow` | pages.* | static Blade |
| `/work` | work.index | DB: published projects ordered by sort |
| `/work/{project:slug}` | work.show | DB: single template renders any project |
| `POST /contact` | — | validates, stores ContactSubmission, redirects back with flash |
| `/admin` | Filament panel | auth |

Legacy `*.html` URLs get permanent redirects to new routes (SEO preservation).

### Database Schema

- **projects**: id, title, slug (unique), category (residential|commercial), tag (e.g. "Residential - NJ"), location, cover_image, overview_kicker, overview_heading, overview_body (nullable — overview section renders only when present), is_published, sort_order, timestamps
- **project_stats**: id, project_id FK cascade, value, label, sort_order
- **project_images**: id, project_id FK cascade, path, alt, sort_order
- **contact_submissions**: id, name, phone, email, property_type, service, details, status (new|read|archived), timestamps
- **page_visits**: id, path, referrer (nullable), visited_at (date), aggregate-friendly index on (path, visited_at)
- **users**: Laravel default (all users are admins — single role, YAGNI)

### Images

Existing project images stay under `public/projects/**` and are referenced by relative path. Admin uploads via Filament go to `storage/app/public` (symlinked). Model accessor `Project::coverUrl()` / `ProjectImage::url()` resolves either source: paths starting with `projects/` or `assets/` resolve via `asset()`, everything else via `Storage::url()`.

### Contact Form

POST to `/contact` with server-side validation. Stored in DB with status `new`. Filament resource lists submissions with status badge, mark-read/archive actions, and a dashboard counter for new submissions. (Email notification deliberately out of scope — YAGNI; submissions live in the panel.)

### Analytics

`TrackPageVisit` middleware on public GET routes inserts one row per page view (path, referrer, date). Skips admin routes and non-200s. Filament dashboard: visits-per-day line chart (last 30 days), top pages table, totals widgets. No cookies, no external service, no PII.

### Frontend Migration

- One Blade layout (`layouts/site`) owns head, fonts, favicon, nav, footer, Vite assets — kills the duplicated boilerplate in 17 HTML files.
- Nav/footer become Blade components (server-rendered, replacing JS injection — active state via `request()->routeIs()`).
- Gallery/lightbox JS reads image list from DOM instead of per-page hardcoded arrays — one shared script replaces 10 per-project JS files.
- All existing CSS moves unchanged to `resources/css`. Visual output identical.

### Install Experience

```
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed       # creates schema, admin user, all 10 projects
npm install && npm run build
php artisan serve
```

Seeders: `AdminUserSeeder` (admin@brightonlawn.com, password from `ADMIN_PASSWORD` env or default `password`), `ProjectSeeder` (all 10 current projects, exact current content). README updated with these steps.

### Testing

Feature tests: public pages return 200, work index lists published projects only, project page renders by slug, contact POST validates + persists, legacy redirects work, page visits recorded. Run with SQLite in-memory.

## Out of Scope (YAGNI)

- Email notifications, roles/permissions beyond single admin role, draft preview, multi-language, image optimization pipeline, editing static page copy (only Work pages are CMS-driven per the goal).
