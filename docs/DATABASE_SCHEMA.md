# connectNPO Nonprofit Growth Readiness Intake Dashboard — Database Schema

## Database Provider

Use **Supabase Postgres**.

Use Supabase Auth for admin login.

## Design Principle

Keep the MVP schema flexible and simple.

Use:

- `organizations` for organization metadata and workflow status
- `intake_responses` for flexible question/answer storage
- `admin_notes` for internal notes

Do not create many specialized tables for every form section yet. The question set may change, so store answers with `section_key`, `question_key`, and `answer jsonb`.

## Required Extensions

Supabase usually supports `gen_random_uuid()` through `pgcrypto`.

```sql
create extension if not exists pgcrypto;
```

## Table: `organizations`

Stores one nonprofit/customer intake record.

```sql
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text,
  contact_name text,
  contact_email text,
  contact_role text,
  city text,
  state text,
  service_area text,
  organization_category text,
  nonprofit_status text,
  annual_budget_range text,
  status text not null default 'draft_created',
  intake_token uuid not null default gen_random_uuid(),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Status Values

Recommended status values:

```text
draft_created
intake_sent
in_progress
submitted
under_review
needs_clarification
ready_for_report
report_created
```

### Indexes

```sql
create unique index if not exists organizations_intake_token_idx
on public.organizations (intake_token);

create index if not exists organizations_status_idx
on public.organizations (status);

create index if not exists organizations_created_at_idx
on public.organizations (created_at desc);
```

## Table: `intake_responses`

Stores flexible answers. Each answer belongs to one organization and one question.

```sql
create table if not exists public.intake_responses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  section_key text not null,
  question_key text not null,
  question_label text not null,
  answer jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, section_key, question_key)
);
```

### Indexes

```sql
create index if not exists intake_responses_organization_id_idx
on public.intake_responses (organization_id);

create index if not exists intake_responses_section_key_idx
on public.intake_responses (section_key);
```

## Table: `admin_notes`

Stores internal notes by connectNPO admins.

```sql
create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  note text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
```

### Indexes

```sql
create index if not exists admin_notes_organization_id_idx
on public.admin_notes (organization_id);

create index if not exists admin_notes_created_at_idx
on public.admin_notes (created_at desc);
```

## Updated At Trigger

Use a single reusable function.

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger set_intake_responses_updated_at
before update on public.intake_responses
for each row execute function public.set_updated_at();
```

## Row Level Security

Enable RLS.

```sql
alter table public.organizations enable row level security;
alter table public.intake_responses enable row level security;
alter table public.admin_notes enable row level security;
```

## RLS Policies — MVP

### Admin Access

Authenticated admins can manage all records.

For MVP, any authenticated Supabase user is treated as an admin. Later, add an `admin_profiles` table or role check.

```sql
create policy "Authenticated users can manage organizations"
on public.organizations
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage intake responses"
on public.intake_responses
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage admin notes"
on public.admin_notes
for all
to authenticated
using (true)
with check (true);
```

### Public Intake Access

For public token-based intake, avoid exposing broad table reads through anon policies if possible.

Preferred implementation:

- Use server-side route handlers or server actions.
- Look up organization by `intake_token` on the server.
- Insert/update responses on the server.
- Do not expose Supabase service role key to the browser.

If using anon client directly, be very careful. The safer MVP is server-side writes.

## Environment Variables

Use these variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Important:

- `NEXT_PUBLIC_SUPABASE_URL` can be exposed to browser.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be exposed to browser.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to browser or committed to git.
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-only code.

## Suggested TypeScript Types

```ts
export type OrganizationStatus =
  | 'draft_created'
  | 'intake_sent'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'needs_clarification'
  | 'ready_for_report'
  | 'report_created';

export type IntakeAnswer = string | string[] | number | boolean | null;

export type IntakeResponseInput = {
  section_key: string;
  question_key: string;
  question_label: string;
  answer: IntakeAnswer;
};
```

## Future Tables — Do Not Build Yet

Later phases may add:

```text
reports
report_sections
agent_runs
files
audit_events
admin_profiles
```

Do not add these in the first MVP unless required.

## JSON Export Shape for Future AI Agent

Admin-only export endpoint should return:

```json
{
  "organization": {
    "id": "uuid",
    "name": "Example Nonprofit",
    "website_url": "https://example.org",
    "contact_role": "Executive Director",
    "city": "Los Angeles",
    "state": "CA",
    "service_area": "Southern California",
    "organization_category": "Youth services",
    "annual_budget_range": "$250K-$1M",
    "status": "ready_for_report"
  },
  "responses": [
    {
      "section_key": "mission_community",
      "question_key": "mission_statement",
      "question_label": "What is your organization's mission?",
      "answer": "..."
    }
  ],
  "admin_notes": [
    {
      "note": "Internal note here",
      "created_at": "2026-06-20T00:00:00Z"
    }
  ]
}
```

## Schema Acceptance Criteria

The schema is acceptable when:

1. Admin can create organizations.
2. Each organization has a unique private intake token.
3. Intake responses can be saved section by section.
4. Admin notes can be added.
5. Authenticated admin can review all data.
6. Public users cannot browse all organizations.
7. No sensitive document storage exists in MVP.
