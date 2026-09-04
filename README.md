# AIO Invoice

Invoice management system for AIO Technologies — customer & invoice CRUD,
role-based access control, PDF generation via Invoice-Generator.com,
email/WhatsApp delivery, branding, and reporting.

## Stack

- **Backend**: Laravel 12 (PHP 8.3), Sanctum SPA cookie auth, MySQL,
  spatie/laravel-permission for RBAC (Administrator, Manager, Sales,
  Accountant, Viewer), Repository/Service/DTO/Policy layering.
- **Frontend**: Next.js 15 (React 19, TypeScript, Tailwind v4), TanStack
  Query, Zustand, React Hook Form + Zod.

## Project layout

```
backend/    Laravel 12 API
frontend/   Next.js 15 app
```

## Local setup

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# create the MySQL database named in .env (DB_DATABASE), then:
php artisan migrate --seed
php artisan storage:link
```

Fill in `INVOICE_GENERATOR_API_KEY` in `.env` (from
https://invoice-generator.com) before generating PDFs — it's never sent to
the frontend, only used server-side.

Serve `backend/public` at whatever host `APP_URL`/`SANCTUM_STATEFUL_DOMAINS`/
`CORS_ALLOWED_ORIGINS` in `.env` point to (e.g. a local Apache vhost).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_API_URL` in `.env.local` must match the backend's `APP_URL`.

### Auth notes

Sanctum's SPA cookie auth requires the frontend and backend to share a
common parent domain (`SESSION_DOMAIN`) when served from different
subdomains/ports in development, so the CSRF/session cookie is visible to
both. See the comments in `backend/.env.example`.

## Tests

```bash
cd backend && php artisan test
cd frontend && npx tsc --noEmit && npx eslint .
```
