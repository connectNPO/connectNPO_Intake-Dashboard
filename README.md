# connectNPO Intake Dashboard

A warm, nonprofit-friendly intake dashboard for collecting structured,
**non-sensitive** organization information. Admins create organization records,
share private intake links, review submitted answers, add internal notes, update
status, and export a clean JSON packet for a future AI report agent.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase**.

> This is the MVP. It does **not** include AI report generation, file uploads,
> payments, customer accounts, website scraping, or email automation. It never
> collects sensitive data (EIN, bank info, passwords, donor lists, financials,
> employee records, confidential documents).

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Supabase project** and run the schema

   In the Supabase SQL editor, paste and run [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `organizations`, `intake_responses`, and `admin_notes`
   tables, indexes, the `updated_at` trigger, and RLS policies.

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in your Supabase values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — never expose it to the
   browser or commit it.

4. **Create an admin user**

   In Supabase → Authentication → Users, add a user (email + password). Any
   authenticated user is treated as an admin in the MVP.

5. **Run the app**

   ```bash
   npm run dev
   ```

## How it works

- **Admin** (`/admin`, protected): list organizations, create new ones, and open
  a detail page to review responses, copy the private intake link, update status,
  add internal notes, and download the JSON export.
- **Public intake** (`/intake/[token]`, no login): the organization completes a
  friendly multi-section form. Answers are written **server-side** using the
  service-role key (the token is validated first), so no privileged keys ever
  reach the browser.
- **JSON export** (`/api/admin/organizations/[id]/export`): admin-only structured
  packet (organization + responses + notes) for a future report agent.

Intake questions live in [`src/lib/intake/questions.ts`](src/lib/intake/questions.ts)
— the single source of truth for both the public form and admin labels.

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run lint    # eslint
```

## Deployment

Deploy to Vercel and set the same environment variables there. Do not commit
`.env.local`.

## Project docs

See [`docs/`](docs/) for the product, design, schema, and implementation briefs.
