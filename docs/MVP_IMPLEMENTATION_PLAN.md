# connectNPO Intake Dashboard MVP Implementation Plan

> **For Claude Code:** Implement this plan step by step. Do not build future AI report generation yet.

**Goal:** Build a Next.js + Supabase MVP that lets connectNPO create nonprofit organization records, send private intake links, collect non-sensitive intake answers, review them in admin, add notes, update status, and export structured JSON for a future AI agent.

**Architecture:** Next.js App Router with TypeScript and Tailwind CSS. Supabase handles auth and Postgres database. Public intake uses private token links. Admin pages require Supabase Auth. Server-side route handlers/actions should protect sensitive operations.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase, Vercel.

---

## Non-Negotiable MVP Rules

1. Do not build AI report generation yet.
2. Do not request sensitive information.
3. Do not add file uploads in MVP.
4. Do not expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
5. Keep UI warm, simple, nonprofit-friendly.
6. Keep code maintainable and easy to extend.

---

## Task 1: Create Project

**Objective:** Create a new Next.js app with TypeScript and Tailwind CSS.

**Files:**

- Create project root files through Next.js generator.

**Steps:**

```bash
npx create-next-app@latest connectnpo-intake-dashboard --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd connectnpo-intake-dashboard
```

**Verify:**

```bash
npm run dev
```

Expected: app starts locally.

Commit:

```bash
git init
git add .
git commit -m "chore: initialize Next.js app"
```

---

## Task 2: Add Project Documentation

**Objective:** Copy planning docs into the project so Claude Code has stable context.

**Files:**

- Create: `docs/PRODUCT_BRIEF.md`
- Create: `docs/DESIGN_BRIEF.md`
- Create: `docs/DATABASE_SCHEMA.md`
- Create: `docs/MVP_IMPLEMENTATION_PLAN.md`
- Create: `CLAUDE.md`

**Steps:**

Copy the four planning documents into `docs/`.

Create `CLAUDE.md`:

```md
# connectNPO Intake Dashboard

Build a nonprofit growth readiness intake dashboard for connectNPO.

Read these files before implementing:

- docs/PRODUCT_BRIEF.md
- docs/DESIGN_BRIEF.md
- docs/DATABASE_SCHEMA.md
- docs/MVP_IMPLEMENTATION_PLAN.md

## Rules

- Do not build AI report generation in MVP.
- Do not collect EIN, bank info, passwords, donor lists, private financial statements, employee records, Form 990 uploads, or confidential documents.
- Use Next.js App Router, TypeScript, Tailwind CSS, and Supabase.
- Keep design warm, clear, nonprofit-friendly, and simple.
- Protect admin routes.
- Do not expose service role keys to browser code.
```

**Verify:**

```bash
ls docs
```

Expected: all four docs exist.

Commit:

```bash
git add docs CLAUDE.md
git commit -m "docs: add MVP planning context"
```

---

## Task 3: Install Supabase Packages

**Objective:** Add Supabase client libraries.

**Files:**

- Modify: `package.json`

**Steps:**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Verify:**

```bash
npm run lint
```

Commit:

```bash
git add package.json package-lock.json
git commit -m "chore: add Supabase dependencies"
```

---

## Task 4: Add Environment Example

**Objective:** Document required environment variables.

**Files:**

- Create: `.env.example`

**Content:**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Verify:**

```bash
test -f .env.example && echo OK
```

Commit:

```bash
git add .env.example
git commit -m "chore: add environment example"
```

---

## Task 5: Create Supabase SQL Migration File

**Objective:** Add database schema SQL file.

**Files:**

- Create: `supabase/schema.sql`

**Steps:**

Use the SQL from `docs/DATABASE_SCHEMA.md`.

Include:

- `organizations`
- `intake_responses`
- `admin_notes`
- indexes
- updated_at trigger
- RLS policies

**Verify:**

Manual: SQL should run in Supabase SQL editor without syntax errors.

Commit:

```bash
git add supabase/schema.sql
git commit -m "db: add initial Supabase schema"
```

---

## Task 6: Add Supabase Clients

**Objective:** Create browser, server, and admin Supabase helpers.

**Files:**

- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`

**Requirements:**

- Browser client uses public env vars.
- Server client supports auth cookies.
- Admin client uses `SUPABASE_SERVICE_ROLE_KEY` and must only be imported by server-only code.

**Verify:**

```bash
npm run lint
```

Commit:

```bash
git add src/lib/supabase
ngit commit -m "chore: add Supabase client helpers"
```

Note: fix typo if generated: use `git commit`, not `ngit commit`.

---

## Task 7: Define App Types

**Objective:** Add shared TypeScript types for organization status and intake answers.

**Files:**

- Create: `src/lib/types.ts`

**Content requirements:**

Include:

- `OrganizationStatus`
- `IntakeAnswer`
- `IntakeQuestion`
- `IntakeSection`
- `IntakeResponseInput`

**Verify:**

```bash
npm run lint
```

Commit:

```bash
git add src/lib/types.ts
git commit -m "chore: add shared app types"
```

---

## Task 8: Create Intake Question Configuration

**Objective:** Store intake questions in a single config file.

**Files:**

- Create: `src/lib/intake/questions.ts`

**Requirements:**

Create 12 sections:

1. organization_basics
2. mission_community
3. programs_services
4. current_goals
5. challenges
6. website_digital_presence
7. donor_supporter_readiness
8. volunteer_readiness
9. trust_transparency
10. content_messaging
11. operations_automation
12. final_context

Each section should include 2–5 questions.

Do not ask for sensitive data.

**Verify:**

```bash
npm run lint
```

Commit:

```bash
git add src/lib/intake/questions.ts
git commit -m "feat: add intake question configuration"
```

---

## Task 9: Build Basic UI Components

**Objective:** Create simple reusable UI components.

**Files:**

- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Textarea.tsx`
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/StatusBadge.tsx`
- Create: `src/components/ui/CopyButton.tsx`

**Requirements:**

Use Tailwind CSS. Keep components simple.

**Verify:**

```bash
npm run lint
```

Commit:

```bash
git add src/components/ui
git commit -m "feat: add shared UI components"
```

---

## Task 10: Apply Global Styling

**Objective:** Apply connectNPO colors and base styles.

**Files:**

- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts` or `tailwind.config.js` if needed
- Modify: `src/app/layout.tsx`

**Requirements:**

Use:

- `#faf9f5` background
- `#7182FF` primary
- `#ECECFF` soft accent
- `#6F6A63` muted text
- `#111111` main text

**Verify:**

```bash
npm run lint
npm run build
```

Commit:

```bash
git add src/app/globals.css src/app/layout.tsx tailwind.config.*
git commit -m "style: apply connectNPO visual foundation"
```

---

## Task 11: Build Login Page

**Objective:** Add Supabase email login for admins.

**Files:**

- Create: `src/app/login/page.tsx`
- Create: `src/app/auth/callback/route.ts` if needed
- Create or modify auth actions as needed

**Requirements:**

- Admin can log in through Supabase Auth.
- Keep page simple and warm.

**Verify:**

Manual: login flow works with Supabase test user.

Commit:

```bash
git add src/app/login src/app/auth
 git commit -m "feat: add admin login"
```

---

## Task 12: Protect Admin Routes

**Objective:** Ensure `/admin` requires login.

**Files:**

- Create or modify: `src/middleware.ts`
- Use Supabase SSR auth helpers if needed.

**Requirements:**

- Unauthenticated users visiting `/admin` redirect to `/login`.
- Authenticated users can access `/admin`.

**Verify:**

Manual browser test.

Commit:

```bash
git add src/middleware.ts
git commit -m "feat: protect admin routes"
```

---

## Task 13: Build Admin Organization List

**Objective:** Show organizations to admins.

**Files:**

- Create: `src/app/admin/page.tsx`

**Requirements:**

Show:

- Name
- Website
- Contact email
- Status
- Created date
- Submitted date
- View link
- New Organization button

**Verify:**

Manual: page loads with empty state or records.

Commit:

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add admin organization list"
```

---

## Task 14: Build Create Organization Page

**Objective:** Let admin create a new organization.

**Files:**

- Create: `src/app/admin/organizations/new/page.tsx`
- Create server action or route handler for insert.

**Fields:**

- name
- website_url
- contact_name
- contact_email
- contact_role
- city
- state
- service_area
- organization_category
- annual_budget_range

**Verify:**

Manual: submit creates organization and redirects to detail page.

Commit:

```bash
git add src/app/admin/organizations/new
git commit -m "feat: add organization creation"
```

---

## Task 15: Build Organization Detail Page

**Objective:** Let admin review metadata, status, intake link, responses, and notes.

**Files:**

- Create: `src/app/admin/organizations/[id]/page.tsx`

**Requirements:**

Show:

- Organization summary
- Intake link `/intake/[token]`
- Copy button
- Status selector
- Submitted responses grouped by section
- Admin notes
- Add note form
- JSON export link/button

**Verify:**

Manual: detail page loads for created organization.

Commit:

```bash
git add src/app/admin/organizations/[id]
git commit -m "feat: add organization review page"
```

---

## Task 16: Build Public Intake Page

**Objective:** Let nonprofit complete the intake form by private token.

**Files:**

- Create: `src/app/intake/[token]/page.tsx`
- Create server action or route handler for submit.

**Requirements:**

- Look up organization by token.
- Show welcome and privacy reminder.
- Render sections/questions from config.
- Save answers to `intake_responses`.
- Update organization status to `submitted` and set `submitted_at`.
- Redirect to completion page.

**Verify:**

Manual: complete intake form and confirm answers appear in admin.

Commit:

```bash
git add src/app/intake/[token]
git commit -m "feat: add public intake form"
```

---

## Task 17: Build Completion Page

**Objective:** Show confirmation after submission.

**Files:**

- Create: `src/app/intake/[token]/complete/page.tsx`

**Requirements:**

Show:

```text
Thank you. Your intake has been submitted.
The connectNPO team will review your responses and follow up with next steps.
```

**Verify:**

Manual: submit redirects correctly.

Commit:

```bash
git add src/app/intake/[token]/complete/page.tsx
git commit -m "feat: add intake completion page"
```

---

## Task 18: Add Admin Notes

**Objective:** Let admin add notes from organization detail page.

**Files:**

- Modify: `src/app/admin/organizations/[id]/page.tsx`
- Add server action or route handler.

**Requirements:**

- Notes are internal only.
- Notes show newest first.

**Verify:**

Manual: add note and refresh page.

Commit:

```bash
git add src/app/admin/organizations/[id]/page.tsx
git commit -m "feat: add admin notes"
```

---

## Task 19: Add Status Updates

**Objective:** Let admin update organization status.

**Files:**

- Modify: `src/app/admin/organizations/[id]/page.tsx`
- Add server action or route handler.

**Requirements:**

Allow status values:

- `draft_created`
- `intake_sent`
- `in_progress`
- `submitted`
- `under_review`
- `needs_clarification`
- `ready_for_report`
- `report_created`

**Verify:**

Manual: update status and confirm badge changes.

Commit:

```bash
git add src/app/admin/organizations/[id]/page.tsx
git commit -m "feat: add organization status updates"
```

---

## Task 20: Add JSON Export Endpoint

**Objective:** Provide admin-only structured JSON for future AI agent.

**Files:**

- Create: `src/app/api/admin/organizations/[id]/export/route.ts`

**Requirements:**

- Require authenticated admin.
- Return organization metadata.
- Return all responses.
- Return admin notes.
- Do not include secrets.

**Verify:**

Manual: logged-in request returns JSON; logged-out request fails.

Commit:

```bash
git add src/app/api/admin/organizations/[id]/export/route.ts
git commit -m "feat: add admin JSON export endpoint"
```

---

## Task 21: Add Empty and Error States

**Objective:** Make the app friendly when data is missing or token is invalid.

**Files:**

- Modify relevant pages.

**Requirements:**

- Admin list empty state.
- Invalid intake token page.
- No responses yet message.
- Form submission error message.

**Verify:**

Manual browser checks.

Commit:

```bash
git add src
git commit -m "ux: add empty and error states"
```

---

## Task 22: Final QA

**Objective:** Verify MVP works end to end.

**Commands:**

```bash
npm run lint
npm run build
```

**Manual Test Flow:**

1. Create Supabase project.
2. Run `supabase/schema.sql` in SQL editor.
3. Set `.env.local`.
4. Create admin user in Supabase Auth.
5. Log in at `/login`.
6. Create organization.
7. Copy intake link.
8. Open intake link in private/incognito browser.
9. Submit intake.
10. Review answers in admin.
11. Add note.
12. Update status to `ready_for_report`.
13. Open JSON export endpoint.

Commit:

```bash
git add .
git commit -m "chore: complete MVP QA fixes"
```

---

## Deployment Notes

Use Vercel.

Set environment variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit `.env.local`.

---

## Future Phase Ideas

After MVP works:

1. AI report agent
2. PDF report generator
3. Website scan integration
4. SEO/GEO readiness scoring
5. Customer accounts
6. File upload with stronger security
7. Email invitation automation
8. Report history
9. CRM integration
10. Analytics dashboard
