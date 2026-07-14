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
- **Prisma ORM** with **SQLite** for local dev (one-line swap to PostgreSQL for prod)
- **Recharts** for admin dashboard charts
- **bcryptjs** for admin password hashing
- **papaparse** for CSV bulk import

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` (a working `.env` is already included for local dev)
and adjust as needed:

```bash
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@docofied.com"
ADMIN_PASSWORD="ChangeMe123!"
SESSION_SECRET="a-long-random-string"
```

`ADMIN_EMAIL` / `ADMIN_PASSWORD` are used to seed the initial admin account.
`SESSION_SECRET` signs the admin login cookie — use a long, random value in
production.

### 3. Set up the database

Runs Prisma client generation, pushes the schema to SQLite, and seeds sample data
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
| `npm run dev`   | Start the Next.js dev server                              |
| `npm run build` | `prisma generate && next build` — production build        |
| `npm run start` | Start the production server (after `build`)                |
| `npm run db:push` | Push the Prisma schema to the database                  |
| `npm run db:seed` | Seed the database with sample data                       |
| `npm run setup` | Generate client, push schema, and seed — first-time setup |

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

The Prisma schema (`prisma/schema.prisma`) is written for SQLite locally, with a
one-line change to switch to PostgreSQL for production:

```prisma
datasource db {
  provider = "postgresql"  // was "sqlite"
  url      = env("DATABASE_URL")
}
```

No model changes are required — just point `DATABASE_URL` at your Postgres
instance and run `npx prisma db push` (or migrate) again.

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

1. Provision a PostgreSQL database and update `datasource db` in
   `prisma/schema.prisma` to `provider = "postgresql"`.
2. Set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a strong
   `SESSION_SECRET` in your hosting provider's environment variables.
3. Run `npx prisma db push` (or set up migrations) against the production
   database, then `npm run db:seed` if you want the sample data.
4. Build and start:
   ```bash
   npm run build
   npm run start
   ```
   On platforms like Vercel, `npm run build` (which runs `prisma generate` first)
   is invoked automatically — just make sure the environment variables above are
   configured before the first deploy.

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
