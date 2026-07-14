# Laravel Backend Setup (Wadi Group)

This project currently contains a static frontend. This guide adds a Laravel API backend in `backend/`.

## 1) Install prerequisites (macOS)

```bash
brew install php composer
```

Verify:

```bash
php -v
composer -V
```

## 2) Create Laravel project

From the repository root (`v1.0`):

```bash
composer create-project laravel/laravel backend
```

## 3) Configure environment

```bash
cd backend
cp .env.example .env
php artisan key:generate
```

Use SQLite for quick local development:

```bash
touch database/database.sqlite
```

Edit `.env`:

```env
APP_NAME="Wadi Group API"
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/v1.0/backend/database/database.sqlite
```

## 4) Run migrations and start server

```bash
php artisan migrate
php artisan serve
```

The API will be available at:

`http://127.0.0.1:8000/api`

## 5) Suggested build order

1. Build contact submission endpoint.
2. Build CMS-like homepage content endpoints.
3. Add admin auth and protected routes.
4. Connect frontend fetch calls to API.

## 6) Quick test command

```bash
curl http://127.0.0.1:8000/api/health
```

