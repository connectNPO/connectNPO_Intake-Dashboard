-- Run this once in Supabase SQL Editor before using /reports/{secure_token} links.
-- Safe to re-run.

create extension if not exists pgcrypto;

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

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_client_reports_updated_at on public.client_reports;
create trigger set_client_reports_updated_at
  before update on public.client_reports
  for each row execute function public.set_updated_at();

alter table public.client_reports enable row level security;

drop policy if exists "Authenticated users can manage client reports" on public.client_reports;
create policy "Authenticated users can manage client reports"
  on public.client_reports
  for all
  to authenticated
  using (true)
  with check (true);
