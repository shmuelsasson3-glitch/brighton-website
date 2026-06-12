# Server setup — Brighton Lawn & Landscape (Laravel)

Production setup for the Laravel site + Filament admin on Ubuntu/Debian with nginx, PHP-FPM, and MySQL. The old static `dist/` deployment is replaced by the Laravel app served from `/var/www/brighton-website/public`.

## 1. PHP-FPM

The app requires PHP **8.2+** (8.3 recommended).

```bash
sudo apt update
sudo apt install -y php8.3-fpm php8.3-cli php8.3-mysql php8.3-xml php8.3-mbstring \
    php8.3-curl php8.3-zip php8.3-gd php8.3-intl php8.3-bcmath unzip

# Composer (if not installed)
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

Raise upload limits for Filament image uploads (covers + galleries):

```bash
sudo tee /etc/php/8.3/fpm/conf.d/99-brighton.ini > /dev/null <<'EOF'
upload_max_filesize = 20M
post_max_size = 25M
memory_limit = 256M
EOF

sudo systemctl restart php8.3-fpm
sudo systemctl enable php8.3-fpm
```

The default pool (`/etc/php/8.3/fpm/pool.d/www.conf`) running as `www-data` on `/run/php/php8.3-fpm.sock` is fine — that socket path is what the nginx config expects. If you use a different PHP version, update `fastcgi_pass` in the nginx config to match (`ls /run/php/` shows the socket name).

## 2. MySQL database

```bash
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
```

Create the database and a dedicated user (pick a real password):

```bash
sudo mysql <<'EOF'
CREATE DATABASE brighton CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'brighton'@'localhost' IDENTIFIED BY 'CHANGE-ME-strong-password';
GRANT ALL PRIVILEGES ON brighton.* TO 'brighton'@'localhost';
FLUSH PRIVILEGES;
EOF
```

## 3. Deploy the app

```bash
cd /var/www
sudo git clone <repo-url> brighton-website
cd brighton-website
sudo composer install --no-dev --optimize-autoloader
```

Create `.env`:

```bash
sudo cp .env.example .env
sudo nano .env
```

Production values:

```dotenv
APP_NAME="Brighton Lawn & Landscape"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://brightonlawnlandscape.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=brighton
DB_USERNAME=brighton
DB_PASSWORD=CHANGE-ME-strong-password

# Admin account created by the seeder — set BEFORE first seed
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=CHANGE-ME

# SMTP for contact form notifications
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=no-reply@brightonlawnlandscape.com
MAIL_FROM_NAME="${APP_NAME}"
```

Initialize:

```bash
sudo php artisan key:generate
sudo php artisan migrate --seed --force
```

Permissions — `www-data` needs to write to storage, bootstrap cache, and `public/project-images` (Filament uploads land directly in `public/`):

```bash
sudo chown -R www-data:www-data /var/www/brighton-website
sudo chmod -R 775 storage bootstrap/cache
sudo mkdir -p public/project-images
sudo chown -R www-data:www-data public/project-images
```

Cache for production:

```bash
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache
```

## 4. nginx

The Laravel-ready config lives in this repo at `deploy/nginx/brighton-website.conf`. It replaces the old static-site config:

- `root` moved from `/var/www/brighton-website/dist` to `/var/www/brighton-website/public`
- `index.html` → `index.php`, all routes go through Laravel's front controller (`/index.php?$query_string`)
- PHP-FPM `fastcgi_pass` block added (expects `unix:/run/php/php8.3-fpm.sock`)
- `client_max_body_size 25m` for Filament image uploads
- Dotfiles (`.env`, `.git`, ...) blocked, ACME challenges still allowed
- All `# managed by Certbot` SSL lines and the port-80 redirect block kept as-is

If your PHP-FPM version is not 8.3, check the socket name and fix the config before copying:

```bash
ls /run/php/
sudo sed -i 's|php8.3-fpm.sock|php8.2-fpm.sock|' /var/www/brighton-website/deploy/nginx/brighton-website.conf
```

Install it:

```bash
sudo cp /var/www/brighton-website/deploy/nginx/brighton-website.conf /etc/nginx/conf.d/brighton-website.conf
sudo nginx -t
sudo systemctl reload nginx
```

SSL certificates are already issued by Certbot for both domains; no action needed. Renewal stays automatic:

```bash
sudo certbot renew --dry-run   # verify the renewal timer works
```

## 5. Updating the site

```bash
cd /var/www/brighton-website
sudo git pull
sudo composer install --no-dev --optimize-autoloader
sudo php artisan migrate --force
sudo php artisan optimize:clear
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

## Troubleshooting

- **502 Bad Gateway** — PHP-FPM socket mismatch. Check `ls /run/php/` vs `fastcgi_pass` in the nginx config, then `sudo systemctl status php8.3-fpm`.
- **500 with blank page** — check `storage/logs/laravel.log`; usually permissions (`chown www-data`) or missing `APP_KEY`.
- **Image upload fails in admin** — confirm `client_max_body_size` (nginx), `upload_max_filesize`/`post_max_size` (PHP), and that `public/project-images` is writable by `www-data`.
- **Login page loops / 419** — `APP_URL` must match the real https domain; clear caches with `php artisan optimize:clear` then re-cache.
