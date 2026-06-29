-- connectNPO Intake Dashboard — Supabase schema
-- Paste this entire file into the Supabase SQL Editor and run it.
-- Safe to re-run.

-- Extensions ----------------------------------------------------------------
create extension if not exists pgcrypto;

-- Table: organizations ------------------------------------------------------
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
  status text not null default 'draft_created', -- includes archived for soft-hide from admin list
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

-- Table: intake_responses ---------------------------------------------------
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

-- Table: admin_notes --------------------------------------------------------
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

-- Table: hermes_workspaces --------------------------------------------------
-- Operator-managed records for client/staff Hermes environments. No bot
-- tokens, API keys, or .env values are stored here.
create table if not exists public.hermes_workspaces (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  workspace_key text not null unique,
  workspace_type text not null default 'client'
    check (workspace_type in ('internal','client','staff','pilot')),
  isolation_model text not null default 'dedicated_vps'
    check (isolation_model in ('dedicated_vps','shared_vps_profile')),
  vps_hostname text,
  hermes_profile text,
  dashboard_port integer,
  discord_bot_name text,
  discord_channel_name text,
  status text not null default 'planning'
    check (status in ('planning','setup','active','paused','retired')),
  support_status text not null default 'not_started'
    check (support_status in ('not_started','needs_setup','monitoring','issue','ok')),
  monthly_cost numeric(10,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hermes_workspaces_status_idx
  on public.hermes_workspaces (status);

create index if not exists hermes_workspaces_updated_at_idx
  on public.hermes_workspaces (updated_at desc);

-- Table: client_reports -----------------------------------------------------
-- Approved, customer-facing Growth Advisor reports. Public access happens only
-- through /reports/[token], which looks up approved/client_ready reports by the
-- unguessable secure_token. Drafts and disabled reports should not render.
create table if not exists public.client_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  secure_token text not null,
  title text not null,
  report_html text not null,
  report_markdown text,
  status text not null default 'draft',
  approved_at timestamptz,
  disabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists client_reports_secure_token_idx
  on public.client_reports (secure_token);

create index if not exists client_reports_organization_id_idx
  on public.client_reports (organization_id);

create index if not exists client_reports_status_idx
  on public.client_reports (status);

-- updated_at trigger --------------------------------------------------------
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

drop trigger if exists set_client_reports_updated_at on public.client_reports;
create trigger set_client_reports_updated_at
  before update on public.client_reports
  for each row execute function public.set_updated_at();

drop trigger if exists set_hermes_workspaces_updated_at on public.hermes_workspaces;
create trigger set_hermes_workspaces_updated_at
  before update on public.hermes_workspaces
  for each row execute function public.set_updated_at();

-- Row Level Security --------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.intake_responses enable row level security;
alter table public.admin_notes enable row level security;
alter table public.client_reports enable row level security;
alter table public.hermes_workspaces enable row level security;

-- RLS policies (MVP: any authenticated user is treated as an admin) ----------
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

drop policy if exists "Authenticated users can manage client reports" on public.client_reports;
create policy "Authenticated users can manage client reports"
  on public.client_reports
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can manage hermes workspaces" on public.hermes_workspaces;
create policy "Authenticated users can manage hermes workspaces"
  on public.hermes_workspaces
  for all
  to authenticated
  using (true)
  with check (true);
