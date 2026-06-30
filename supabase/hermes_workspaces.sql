-- Hermes Operations HQ records for the connectNPO internal operations console.
-- Tracks workspaces for connectNPO, GivingArc, NPO Accounting, clients, and internal tools.
-- Stores operator-managed metadata only — no bot tokens, API keys, or .env values.
-- Run this once in the Supabase SQL Editor. Safe to re-run.

create extension if not exists pgcrypto;

create table if not exists public.hermes_workspaces (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  workspace_key text not null unique,
  workspace_type text not null default 'client'
    check (workspace_type in ('internal','client','staff','pilot')),
  organization text not null default 'client'
    check (organization in ('connectnpo','givingarc','wife_cpa','client','internal')),
  purpose text not null default 'other'
    check (purpose in ('dashboard','content','meeting_intel','accounting','customer_support','automation','client_ops','other')),
  environment text not null default 'client'
    check (environment in ('internal','client','pilot')),
  isolation_model text not null default 'dedicated_vps'
    check (isolation_model in ('dedicated_vps','shared_vps_profile')),
  vps_hostname text,
  hermes_profile text,
  profile_path text,
  service_name text,
  dashboard_url text,
  dashboard_port integer,
  discord_bot_name text,
  discord_server_name text,
  discord_channel_name text,
  discord_channel_id text,
  status text not null default 'planning'
    check (status in ('planning','setup','active','paused','retired')),
  support_status text not null default 'not_started'
    check (support_status in ('not_started','needs_setup','monitoring','issue','ok')),
  checklist_profile_exists boolean not null default false,
  checklist_dashboard_running boolean not null default false,
  checklist_discord_connected boolean not null default false,
  checklist_message_content_intent_on boolean not null default false,
  checklist_service_restarted boolean not null default false,
  checklist_test_message_passed boolean not null default false,
  monthly_cost numeric(10,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotent additive columns for installs that already created the table
-- before the Hermes Operations HQ rename.
alter table public.hermes_workspaces
  add column if not exists organization text not null default 'client'
    check (organization in ('connectnpo','givingarc','wife_cpa','client','internal'));
alter table public.hermes_workspaces
  add column if not exists purpose text not null default 'other'
    check (purpose in ('dashboard','content','meeting_intel','accounting','customer_support','automation','client_ops','other'));
alter table public.hermes_workspaces
  add column if not exists environment text not null default 'client'
    check (environment in ('internal','client','pilot'));
alter table public.hermes_workspaces
  add column if not exists profile_path text;
alter table public.hermes_workspaces
  add column if not exists service_name text;
alter table public.hermes_workspaces
  add column if not exists dashboard_url text;
alter table public.hermes_workspaces
  add column if not exists discord_server_name text;
alter table public.hermes_workspaces
  add column if not exists discord_channel_id text;
alter table public.hermes_workspaces
  add column if not exists checklist_profile_exists boolean not null default false;
alter table public.hermes_workspaces
  add column if not exists checklist_dashboard_running boolean not null default false;
alter table public.hermes_workspaces
  add column if not exists checklist_discord_connected boolean not null default false;
alter table public.hermes_workspaces
  add column if not exists checklist_message_content_intent_on boolean not null default false;
alter table public.hermes_workspaces
  add column if not exists checklist_service_restarted boolean not null default false;
alter table public.hermes_workspaces
  add column if not exists checklist_test_message_passed boolean not null default false;

-- Value constraints. Idempotent: drop the named constraint first so re-runs
-- pick up any tightening here without raising "already exists".
alter table public.hermes_workspaces
  drop constraint if exists hermes_workspaces_dashboard_port_range;
alter table public.hermes_workspaces
  add constraint hermes_workspaces_dashboard_port_range
  check (dashboard_port is null or (dashboard_port between 1 and 65535));

alter table public.hermes_workspaces
  drop constraint if exists hermes_workspaces_monthly_cost_nonneg;
alter table public.hermes_workspaces
  add constraint hermes_workspaces_monthly_cost_nonneg
  check (monthly_cost is null or monthly_cost >= 0);

create index if not exists hermes_workspaces_status_idx
  on public.hermes_workspaces (status);

create index if not exists hermes_workspaces_updated_at_idx
  on public.hermes_workspaces (updated_at desc);

create index if not exists hermes_workspaces_organization_idx
  on public.hermes_workspaces (organization);

create index if not exists hermes_workspaces_support_status_idx
  on public.hermes_workspaces (support_status);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_hermes_workspaces_updated_at on public.hermes_workspaces;
create trigger set_hermes_workspaces_updated_at
  before update on public.hermes_workspaces
  for each row execute function public.set_updated_at();

-- Admin operator gate ------------------------------------------------------
-- Hermes Operations HQ stores internal ops metadata that should NOT be
-- visible to every authenticated Supabase user (e.g. nonprofits filling out
-- an intake form do not need to see VPS hostnames or Discord channel IDs).
--
-- The admin_operators table is the allow-list of Supabase auth users who
-- may read/write Hermes workspace rows. The is_admin_operator() helper is
-- referenced by the RLS policy below.
--
-- BOOTSTRAP (run once after the first admin signs in via Supabase Auth):
--   1. In the Supabase dashboard, find the admin's UUID in Authentication → Users.
--   2. Run, in the SQL Editor:
--        insert into public.admin_operators (user_id, note)
--        values ('00000000-0000-0000-0000-000000000000', 'first ops admin')
--        on conflict (user_id) do nothing;
--   3. Re-run any Hermes query — it should now return rows for that user.

create table if not exists public.admin_operators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table public.admin_operators enable row level security;

create or replace function public.is_admin_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_operators ao
    where ao.user_id = auth.uid()
  );
$$;

-- Only existing admin operators can see or change the allow-list itself.
-- This avoids a chicken-and-egg lockout: the very first row must be inserted
-- by the postgres/service role from the SQL Editor (per the bootstrap above),
-- which bypasses RLS. Use the security-definer helper to avoid recursive RLS
-- checks on admin_operators.
drop policy if exists "Admin operators manage their allow-list"
  on public.admin_operators;
create policy "Admin operators manage their allow-list"
  on public.admin_operators
  for all
  to authenticated
  using (public.is_admin_operator())
  with check (public.is_admin_operator());

alter table public.hermes_workspaces enable row level security;

-- Replace the older "any authenticated user" policy with an admin-operator
-- gate. Internal ops metadata (VPS hosts, Discord channel IDs, profile paths)
-- should never be readable by intake-form users who happen to be signed in.
drop policy if exists "Authenticated users can manage hermes workspaces"
  on public.hermes_workspaces;
drop policy if exists "Admin operators manage hermes workspaces"
  on public.hermes_workspaces;
create policy "Admin operators manage hermes workspaces"
  on public.hermes_workspaces
  for all
  to authenticated
  using (public.is_admin_operator())
  with check (public.is_admin_operator());
