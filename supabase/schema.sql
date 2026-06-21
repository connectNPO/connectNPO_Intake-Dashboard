-- connectNPO Intake Dashboard — initial schema
-- Run this in the Supabase SQL editor.

-- Extensions ---------------------------------------------------------------
create extension if not exists pgcrypto;

-- Table: organizations -----------------------------------------------------
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

create unique index if not exists organizations_intake_token_idx
on public.organizations (intake_token);

create index if not exists organizations_status_idx
on public.organizations (status);

create index if not exists organizations_created_at_idx
on public.organizations (created_at desc);

-- Table: intake_responses --------------------------------------------------
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

create index if not exists intake_responses_organization_id_idx
on public.intake_responses (organization_id);

create index if not exists intake_responses_section_key_idx
on public.intake_responses (section_key);

-- Table: admin_notes -------------------------------------------------------
create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  note text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists admin_notes_organization_id_idx
on public.admin_notes (organization_id);

create index if not exists admin_notes_created_at_idx
on public.admin_notes (created_at desc);

-- updated_at trigger -------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists set_intake_responses_updated_at on public.intake_responses;
create trigger set_intake_responses_updated_at
before update on public.intake_responses
for each row execute function public.set_updated_at();

-- Row Level Security -------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.intake_responses enable row level security;
alter table public.admin_notes enable row level security;

-- Admin access: any authenticated user is treated as an admin in the MVP.
-- Public intake writes are performed server-side with the service role key,
-- which bypasses RLS, so no anon policies are needed.

drop policy if exists "Authenticated users can manage organizations" on public.organizations;
create policy "Authenticated users can manage organizations"
on public.organizations
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage intake responses" on public.intake_responses;
create policy "Authenticated users can manage intake responses"
on public.intake_responses
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage admin notes" on public.admin_notes;
create policy "Authenticated users can manage admin notes"
on public.admin_notes
for all
to authenticated
using (true)
with check (true);
