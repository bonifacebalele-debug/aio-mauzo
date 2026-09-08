# Deploying AIO Invoice to aio.co.tz (DirectAdmin)

Your login URL — `https://aio.co.tz:2222/evo/login` — is **DirectAdmin**,
not cPanel (port 2222 and the `/evo/` path are DirectAdmin's signature; the
earlier version of this guide assumed cPanel and used the wrong menu names —
this version replaces those with DirectAdmin's actual labels).

The app still splits into two subdomains, sharing your domain so the login
cookie works across both:

- **`api.aio.co.tz`** — the Laravel backend (PHP)
- **`app.aio.co.tz`** — the Next.js frontend (what you open in a browser)

---

## Step 0 — Check what this DirectAdmin install actually supports

Log into `https://aio.co.tz:2222/evo/login` and look for:

1. **SSH access.** Usually under **Advanced Features → SSH Access** (some
   DirectAdmin setups put a toggle here you can switch on yourself; others
   require the host to enable it per account). You need this to run
   `composer install`, `php artisan migrate`, `npm run build`. If you don't
   see it, message your host's support and ask them to enable SSH for your
   account.
2. **Node.js support.** Look under **Advanced Features** for something
   called **"Node.js Selector"** or **"Application Manager"**. This is a
   plugin the host has to install separately — plenty of DirectAdmin hosts
   (especially smaller/budget ones) don't have it. If it's not there, skip
   straight to **Plan B** below for the frontend; the backend steps still
   apply as written.
3. **PHP version.** Under **Select PHP Version** (or similar) — needs to be
   set to **PHP 8.2 or newer**.

Report back what you find for these three and I'll confirm which path to
take before you touch anything else.

---

## Step 1 — Create the two subdomains

**Domain Setup** → click your domain → **Subdomain Management** (label may
vary slightly, sometimes just "Subdomains") → add `api` and add `app`. That
creates `api.aio.co.tz` and `app.aio.co.tz`, each with its own folder under
your account (usually `~/domains/aio.co.tz/api/` and `.../app/` — DirectAdmin
shows you the exact path when you create it).

Once both exist: **SSL Certificates** → issue a **Let's Encrypt** certificate
for each (free, auto-renewing).

---

## Step 2 — Get the code onto the server

Good news — this DirectAdmin install has a **Git** icon under Advanced
Features, so you don't need SSH just for this part:

**Advanced Features → Git → Create Repository** (or "Add Repository"),
paste `https://github.com/bonifacebalele-debug/aio-mauzo.git` as the clone
URL, and set the destination path to something like `~/aio-mauzo` (a plain
folder in your home directory, not inside a domain's `public_html`). This
also makes future updates a one-click "Pull" from that same Git page,
instead of re-uploading files.

(If that tool gives you trouble, the fallback is SSH: `git clone
https://github.com/bonifacebalele-debug/aio-mauzo.git` from your home
directory — or zip the project locally, excluding `node_modules`, `vendor`,
`.next`, and upload/extract it via **File Manager**.)

---

## Step 3 — Backend (Laravel)

All of this runs over SSH, inside `~/aio-mauzo/backend`.

**Point `api.aio.co.tz` at the right folder.** DirectAdmin subdomains
usually default their document root to something like
`~/domains/aio.co.tz/api/public_html`. Either move/symlink your backend's
`public` folder to line up with that path, or (cleaner) edit the
subdomain's document root under **Domain Setup → api.aio.co.tz →
Change Document Root** to point straight at
`~/aio-mauzo/backend/public`.

**Install dependencies:**
```bash
cd ~/aio-mauzo/backend
composer install --no-dev --optimize-autoloader
```
(If `composer` isn't installed server-wide, DirectAdmin's PHP Selector page
sometimes has a link to install it, or ask host support — it's standard on
any PHP hosting plan.)

**Create the production database.** DirectAdmin → **MySQL Management** →
**Create new Database**. Note the full names — DirectAdmin prefixes both
the database and username with your account username, e.g.
`youruser_mauzo` / `youruser_prod`.

**Set up the environment file:**
```bash
cp .env.example .env
nano .env
```
Fill in real values:

```
APP_NAME="AIO Invoice"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.aio.co.tz
FRONTEND_URL=https://app.aio.co.tz

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=youruser_mauzo
DB_USERNAME=youruser_prod
DB_PASSWORD=<the password you set in DirectAdmin>

SESSION_DOMAIN=.aio.co.tz
SANCTUM_STATEFUL_DOMAINS=app.aio.co.tz
CORS_ALLOWED_ORIGINS=https://app.aio.co.tz

MAIL_MAILER=smtp
MAIL_HOST=<see note below>
MAIL_PORT=587
MAIL_USERNAME=<see note below>
MAIL_PASSWORD=<see note below>
MAIL_FROM_ADDRESS="invoices@aio.co.tz"
MAIL_FROM_NAME="AIO Invoice"

INVOICE_GENERATOR_API_KEY=<your existing key>
INVOICE_GENERATOR_API_URL=https://invoice-generator.com
```

> **Mail note:** the app sends real invoice emails, not just PDFs, so
> `MAIL_*` needs real credentials. DirectAdmin → **E-Mail Accounts** → create
> `invoices@aio.co.tz`; the SMTP host is usually `mail.aio.co.tz` or your
> server's hostname — DirectAdmin shows the exact settings on the email
> account's "Set up mail client" page. If deliverability turns out to be an
> issue (mail from small shared-hosting IPs sometimes lands in spam), a free
> tier on Brevo or Mailgun as an SMTP relay is a drop-in alternative — same
> `.env` fields, different host/credentials.

**Generate the app key, run migrations, seed only reference data** — not
demo customers/invoices/users, which are fake sample data meant for local
development:

```bash
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --class=RolesAndPermissionsSeeder --force
php artisan db:seed --class=CurrencySeeder --force
php artisan db:seed --class=TaxSeeder --force
php artisan db:seed --class=InvoiceTemplateSeeder --force
php artisan db:seed --class=CompanySeeder --force
```
(`CompanySeeder` creates one placeholder company record so the app has
something to work with — you'll overwrite the details in Settings → Company
once you're logged in.)

**Create your one real admin account** (skip `UserSeeder` — it creates 5
demo accounts sharing the password `password`, which you don't want in
production):

```bash
php artisan tinker
```
then inside the tinker shell:
```php
$u = App\Models\User::create([
    'name' => 'Boniface Balele',
    'email' => 'you@aio.co.tz',
    'password' => Hash::make('a-strong-real-password'),
    'is_active' => true,
    'email_verified_at' => now(),
]);
$u->syncRoles(['Administrator']);
exit
```

**Finish up:**
```bash
php artisan storage:link
chmod -R 775 storage bootstrap/cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

At this point `https://api.aio.co.tz` should load Laravel's default page (or
a JSON 404 for unknown routes — that's fine, it's an API).

---

## Step 4 — Frontend (Next.js)

This step depends entirely on what Step 0 found.

### If DirectAdmin has a Node.js Selector / Application Manager

Advanced Features → **Node.js Selector** → **Create Application**:

- **Node.js version:** 20.x (Next.js 15 needs 18.18+ or 20+)
- **Application root:** `aio-mauzo/frontend`
- **Application URL:** `app.aio.co.tz`
- **Startup file:** `server.js` (create this next — these selectors run
  apps through Phusion Passenger, which expects a plain Node entry point
  rather than Next's own `next start`)

Create `~/aio-mauzo/frontend/server.js`:
```js
const { createServer } = require("http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(process.env.PORT || 3000);
});
```

In the app's **Environment Variables** section, add:
```
NEXT_PUBLIC_API_URL=https://api.aio.co.tz
NODE_ENV=production
```

Then, via the selector's "Run NPM Install" button (or its terminal):
```bash
npm install
npm run build
```
Restart the app. `https://app.aio.co.tz` should now serve the real login
page.

### If there's no Node.js Selector (likely on this kind of host) — Plan B

Keep the **backend exactly as in Step 3**, and put the **frontend on
Vercel** (free tier is enough):

1. Sign in to vercel.com with GitHub, import the `aio-mauzo` repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable `NEXT_PUBLIC_API_URL=https://api.aio.co.tz`.
4. Deploy — Vercel gives you a `*.vercel.app` URL right away.
5. In the Vercel project → **Domains**, add `app.aio.co.tz`. Vercel shows
   you a CNAME record.
6. Back in DirectAdmin → **DNS Management** for `aio.co.tz`, add that CNAME
   record for the `app` subdomain.

Everything in the backend `.env` (`SESSION_DOMAIN`, `SANCTUM_STATEFUL_DOMAINS`,
`CORS_ALLOWED_ORIGINS`) stays exactly as written in Step 3 — Sanctum only
cares that the hostname `app.aio.co.tz` matches, not which server it
physically runs on.

---

## Step 5 — Final checks

1. Open `https://app.aio.co.tz`, log in with the real admin account from
   Step 3.
2. **Settings → Company** — replace the placeholder "AIO Technologies" info
   with your real company details (address, TIN/VRN, logo, bank/payment
   instructions).
3. Create a customer and an invoice, generate the PDF — confirms
   `INVOICE_GENERATOR_API_KEY` works in production.
4. Email that invoice to yourself — confirms `MAIL_*` works (check spam on
   the first send).
5. **Users** page — create real accounts for your team with the correct
   roles.
6. Confirm the padlock/SSL shows valid on both `app.` and `api.` subdomains.

---

## Ongoing hygiene

- `APP_DEBUG` must stay `false` in production — it defaults to `true` in
  `.env.example`, which is fine locally but leaks stack traces (including DB
  credentials in error pages) if left on live.
- To ship future changes: `git pull` on the server (or in Vercel's case,
  just push to GitHub — it redeploys automatically), re-run
  `composer install`/`npm run build` as needed on the backend, then
  `php artisan config:cache` again — same "test locally first, then deploy"
  habit you've used throughout this project.
- Set up regular database backups — DirectAdmin usually has a **Backup /
  Transfer** tool, or schedule a **Cron Job** running a `mysqldump` on a
  schedule.
