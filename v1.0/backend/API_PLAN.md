# Wadi Group Laravel API Plan

This plan maps the current static frontend into a backend-ready API.

## Goals

- Store contact messages in the database.
- Serve editable homepage content from API (hero, stats, sectors, values, leaders).
- Keep API clean, versioned, and easy to connect from the current frontend.

## Base URL

`/api/v1`

## Public Endpoints

### Health

- `GET /health`

Response:

```json
{ "status": "ok" }
```

### Homepage payload

- `GET /home`

Returns all landing-page content in one response for performance.

Main keys:

- `hero`
- `stats`
- `about`
- `sectors`
- `values`
- `leaders`
- `footer`

### Contact form submission

- `POST /contact-messages`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+201001234567",
  "subject": "Partnership",
  "message": "We want to discuss a partnership."
}
```

Validation:

- `name`: required, string, max 120
- `email`: required, email, max 190
- `phone`: nullable, string, max 30
- `subject`: required, string, max 190
- `message`: required, string, max 5000

## Admin Endpoints (protected)

- `GET /admin/contact-messages`
- `GET /admin/contact-messages/{id}`
- `PATCH /admin/contact-messages/{id}/status`
- `PUT /admin/home`

Use Laravel Sanctum for auth tokens.

## Suggested Database Tables

### `contact_messages`

- `id`
- `name`
- `email`
- `phone` (nullable)
- `subject`
- `message`
- `status` (new, in_progress, closed)
- `created_at`
- `updated_at`

### `home_contents`

- `id`
- `section` (hero, about, stats, sectors, values, leaders, footer)
- `payload` (JSON)
- `created_at`
- `updated_at`

## Suggested Laravel Structure

- `app/Http/Controllers/Api/V1/HealthController.php`
- `app/Http/Controllers/Api/V1/HomeController.php`
- `app/Http/Controllers/Api/V1/ContactMessageController.php`
- `app/Http/Controllers/Api/V1/Admin/ContactMessageAdminController.php`
- `app/Http/Controllers/Api/V1/Admin/HomeAdminController.php`
- `app/Models/ContactMessage.php`
- `app/Models/HomeContent.php`
- `database/migrations/*_create_contact_messages_table.php`
- `database/migrations/*_create_home_contents_table.php`
- `routes/api.php`

## Initial Artisan Command Sequence

Run inside `backend/`:

```bash
php artisan make:model ContactMessage -m
php artisan make:model HomeContent -m
php artisan make:controller Api/V1/HealthController
php artisan make:controller Api/V1/HomeController
php artisan make:controller Api/V1/ContactMessageController
php artisan make:controller Api/V1/Admin/ContactMessageAdminController
php artisan make:controller Api/V1/Admin/HomeAdminController
```

## Frontend Integration Strategy

Current pages are static (`index.html`, `leaders.html`, `sector.html`).

Migration path:

1. Keep static layout and CSS as-is.
2. Replace hardcoded data sections with `fetch('/api/v1/home')`.
3. Add a contact form in footer and submit to `POST /api/v1/contact-messages`.
4. Optionally move to Blade or keep static frontend + Laravel API backend.

