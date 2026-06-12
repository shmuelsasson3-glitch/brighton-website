# Brighton Lawn & Landscape

Marketing site and admin panel for Brighton Lawn & Landscape, built with Laravel 12 and Filament 3.

The public site serves the company pages (home, residential, commercial, site work, snow) plus a portfolio of work projects driven entirely by the database. The admin panel at `/admin` manages projects, contact form submissions, site analytics, and admin users.

## Requirements

- PHP 8.2+ with the `intl`, `pdo_mysql`, `gd`, and `fileinfo` extensions
- Composer
- MySQL / MariaDB
- Node.js 20+

## Install

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database and point `.env` at it:

```dotenv
DB_CONNECTION=mysql
DB_DATABASE=brighton
DB_USERNAME=root
DB_PASSWORD=
```

Set `APP_URL` to the address you actually browse on (e.g. `http://localhost:8000` for `php artisan serve`) — admin image previews are built from it.

Then:

```bash
php artisan migrate --seed
php artisan storage:link
npm install
npm run build
php artisan serve
```

Seeding creates the full current portfolio (10 projects with galleries and stats) and an admin user:

- **Email:** `admin@brightonlawn.com` (override with `ADMIN_EMAIL`)
- **Password:** `password` (override with `ADMIN_PASSWORD` — change it in production)

## Email notifications

New contact form submissions are emailed to `CONTACT_NOTIFICATION_EMAIL` with a branded template. Configure SMTP in `.env`:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp.yourprovider.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=no-reply@brightonlawn.com
CONTACT_NOTIFICATION_EMAIL=info@BrightonLawn.com
```

Submissions are always stored in the admin panel, even if sending fails.

## Admin panel

Visit `/admin`:

- **Projects** — create, edit, reorder, and publish/unpublish work portfolio pages. Galleries and stat boxes are managed inline; new images upload to `storage/app/public`.
- **Contact submissions** — quote requests from the site contact form, with new/read/archived workflow.
- **Users** — manage admin accounts.
- **Dashboard** — visit counts, a 30-day traffic chart, and new-submission totals.

## Development

```bash
npm run dev        # Vite dev server with hot reload
php artisan test   # feature tests (SQLite in-memory)
```
