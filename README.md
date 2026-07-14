# DocoFied

DocoFied is a healthcare provider directory web app in the style of Zocdoc — search
for doctors by specialty, location, and insurance; view provider profiles with
ratings and reviews; and manage everything from an admin dashboard.

This is the foundational build: a full public directory (search, provider profiles)
and a full admin panel (auth, dashboard, provider CRUD, review moderation, CSV bulk
import, integrations settings). The database schema also includes models for
booking, patient/provider accounts, and appointments so those features can be added
later without a schema migration.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Prisma ORM** on **PostgreSQL** (e.g. Vercel Postgres / Neon) — swap back to
  SQLite for offline local dev with a one-line datasource change
- **Recharts** for admin dashboard charts
- **bcryptjs** for admin password hashing
- **papaparse** for CSV bulk import

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in a real `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
ADMIN_EMAIL="admin@docofied.com"
ADMIN_PASSWORD="ChangeMe123!"
SESSION_SECRET="a-long-random-string"
```

`ADMIN_EMAIL` / `ADMIN_PASSWORD` are used to seed the initial admin account.
`SESSION_SECRET` signs the admin login cookie — use a long, random value in
production.

The schema ships configured for PostgreSQL (what Vercel Postgres / Neon /
Supabase all speak). If you'd rather develop locally without a Postgres
instance, switch `provider = "postgresql"` back to `provider = "sqlite"` in
`prisma/schema.prisma` and point `DATABASE_URL` at a local file
(`file:./dev.db`) — no model changes are needed either way.

### 3. Set up the database

Runs Prisma client generation, pushes the schema, and seeds sample data
(admin user, ~100 providers, insurance carriers/plans, sample reviews):

```bash
npm run setup
```

Or run the steps individually:

```bash
npm run db:push   # sync schema to the database
npm run db:seed   # seed sample data
```

### 4. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000 for the public site and http://localhost:3000/admin
for the admin panel (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## npm scripts

| Script          | Description                                             |
| --------------- | -------------------------------------------------------- |
| `npm run dev`   | Push the schema, then start the Next.js dev server         |
| `npm run build` | `prisma generate && next build` — production build        |
| `npm run vercel-build` | Push the schema, then build — used automatically by Vercel |
| `npm run start` | Push the schema, then start the production server (after `build`) |
| `npm run db:push` | Push the Prisma schema to the database                  |
| `npm run db:seed` | Seed the database with sample data                       |
| `npm run setup` | Generate client, push schema, and seed — first-time setup |

`dev` and `start` both run `prisma db push` first so the database schema always
exists before the server starts serving requests — even if `npm run setup` was
never run. Without it, every page would 500 with `The table 'Provider' does
not exist in the current database` (surfaced generically in production as
"Application error: a server-side exception has occurred") on any fresh
database. `db push` only creates/updates schema — it never seeds data, so run
`npm run db:seed` separately if you want the sample providers.

**Vercel note**: Vercel never runs `npm start` — it builds your app and serves
it through its own runtime, invoking `vercel-build` instead of `build` when
that script is present. `vercel-build` runs `prisma db push --accept-data-loss`
so the schema is created/updated on every deploy automatically. (`--accept-data-loss`
is required for a non-interactive CI build; for a real production system with
data you care about, switch to `prisma migrate deploy` with committed
migrations instead of `db push`.) Seeding is not run automatically on
Vercel — run `npm run db:seed` locally with `DATABASE_URL` pointed at your
production database (e.g. after `vercel env pull`) if you want the sample
data there.

## Project structure

```
prisma/
  schema.prisma        # Full data model (providers, reviews, insurance,
                        # availability, appointments, accounts, analytics, etc.)
  seed.ts               # Seeds admin user, ~100 providers, insurance data, reviews
src/
  app/
    page.tsx            # Homepage — hero search, top-rated doctors, specialties
    search/page.tsx      # Search results — filters, sort, pagination
    provider/[id]/page.tsx  # Provider profile — bio, reviews, insurance, map link
    admin/
      login/page.tsx     # Admin login
      (protected)/        # Route group guarded by the admin session cookie
        dashboard/         # Stat cards + traffic & specialty charts
        providers/          # List, add, edit, delete providers
        reviews/             # Review moderation (approve/reject)
        import/               # CSV bulk import
        settings/              # GA4 + Google Maps integration settings
  components/            # Shared UI (Header, Footer, SearchBar, ProviderCard, ...)
  lib/                    # Prisma client, auth/session, settings, CSV import, etc.
```

## Database schema

The Prisma schema (`prisma/schema.prisma`) runs on PostgreSQL by default, with a
one-line change to switch to SQLite for offline local dev:

```prisma
datasource db {
  provider = "sqlite"  // was "postgresql"
  url      = env("DATABASE_URL")  // e.g. "file:./dev.db"
}
```

No model changes are required either way — just match `DATABASE_URL` to
whichever provider is set and run `npx prisma db push` (or migrate) again.

Models cover the current feature set (`Provider`, `Review`, `InsuranceCarrier`,
`InsurancePlan`, `ProviderInsurance`, `Setting`, `PageView`, `SearchLog`) as well
as models reserved for upcoming features (`AvailabilitySlot`, `Appointment`,
`Patient`, `ProviderUser`, `AdminUser`) so those can be built without a
re-migration.

## Admin panel

- **Auth**: cookie-based session, HMAC-signed with `SESSION_SECRET`, checked
  against a bcrypt-hashed `AdminUser` record seeded from `ADMIN_EMAIL` /
  `ADMIN_PASSWORD`. All routes under `/admin` (except `/admin/login`) are guarded
  by a layout that redirects unauthenticated visitors to the login page.
- **Dashboard**: stat cards, a 14-day traffic line chart, a providers-by-specialty
  bar chart, and a recent searches table.
- **Providers**: searchable list, create/edit form (including photo URL and
  credentials), and delete.
- **Reviews**: moderation queue (pending/approved/rejected/all) — approving or
  rejecting a review recomputes the provider's `ratingAvg` / `ratingCount`.
- **Bulk import**: upload a CSV to create or update providers. Column headers are
  matched flexibly (e.g. "First Name", "first_name", "firstname" all resolve to
  the same field). Rows are upserted by NPI when present; `specialty`, `state`,
  `firstName`, `lastName`, and `city` are required per row. Results show
  created / updated / skipped counts.
- **Integrations**: store a Google Analytics 4 measurement ID (auto-loads the GA4
  tag on public pages) and a Google Maps API key in the `Setting` table.

## Deployment

### Vercel

1. Provision a Postgres database (Vercel's Storage tab → Postgres/Neon
   integration is the easiest path — it sets `DATABASE_URL` for you) and
   connect it to the project for the Production and Preview environments.
2. In Project Settings → Environment Variables, also set `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, and a strong random `SESSION_SECRET`.
3. Deploy. Vercel automatically runs `vercel-build`
   (`prisma generate && prisma db push --accept-data-loss && next build`)
   instead of `build`, so the schema is created on the very first deploy —
   no manual `db push` step needed.
4. The database will be empty after that first deploy (schema only, no data).
   To load the sample providers, pull the production env vars locally and run
   the seed script against that database:
   ```bash
   vercel env pull .env.production.local
   DATABASE_URL="$(grep DATABASE_URL .env.production.local | cut -d '=' -f2- | tr -d '"')" npm run db:seed
   ```

### Other hosts (a plain Node server, Railway, Render, etc.)

1. Provision a PostgreSQL database.
2. Set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a strong
   `SESSION_SECRET` in your hosting provider's environment variables.
3. Build and start:
   ```bash
   npm run build
   npm run start
   ```
   `start` runs `prisma db push` before booting, so the schema is created
   automatically; run `npm run db:seed` separately if you want sample data.

## What's next

This build intentionally leaves a few features as placeholders so the core
directory ships on a solid foundation:

- Real appointment booking (the `AvailabilitySlot` / `Appointment` models and
  "Book online" buttons are in place; booking flow UI is not yet wired up).
- Patient-submitted reviews (moderation is fully built; the public submission
  form is not yet exposed).
- Insurance-based filtering is live in search; deeper plan-level filtering can
  build on the existing `InsurancePlan` / `ProviderInsurance` models.
- Patient and provider accounts (`Patient` / `ProviderUser` models exist; login
  flows are not yet built).
