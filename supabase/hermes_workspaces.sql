-- Hermes workspace records for the connectNPO Hermes Workspace Manager.
-- Stores operator-managed metadata only — no bot tokens, API keys, or .env values.
-- Run this once in the Supabase SQL Editor. Safe to re-run.

create extension if not exists pgcrypto;

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

alter table public.hermes_workspaces enable row level security;

drop policy if exists "Authenticated users can manage hermes workspaces"
  on public.hermes_workspaces;
create policy "Authenticated users can manage hermes workspaces"
  on public.hermes_workspaces
  for all
  to authenticated
  using (true)
  with check (true);
