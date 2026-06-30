import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import {
  HERMES_CHECKLIST_KEYS,
  type HermesWorkspace,
  type HermesWorkspaceEnvironment,
  type HermesWorkspaceOrganization,
  type HermesWorkspacePurpose,
  type HermesWorkspaceStatus,
  type HermesWorkspaceSupportStatus,
} from '@/lib/types';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<HermesWorkspaceStatus, string> = {
  planning: 'Planning',
  setup: 'Setup',
  active: 'Active',
  paused: 'Paused',
  retired: 'Retired',
};

const STATUS_CLASS: Record<HermesWorkspaceStatus, string> = {
  planning: 'bg-[#f0eee8] text-[#6F6A63] border-[#E8E4DC]',
  setup: 'bg-[#fff4d6] text-[#8a6d1f] border-[#f0e2a6]',
  active: 'bg-primary-soft text-primary border-primary/30',
  paused: 'bg-[#f5e9d4] text-[#8a5b1f] border-[#ecd3a6]',
  retired: 'bg-[#eceae3] text-[#6f6a63] border-[#dcd7cb]',
};

const SUPPORT_LABEL: Record<HermesWorkspaceSupportStatus, string> = {
  not_started: 'Not started',
  needs_setup: 'Needs setup',
  monitoring: 'Monitoring',
  issue: 'Issue',
  ok: 'OK',
};

const SUPPORT_CLASS: Record<HermesWorkspaceSupportStatus, string> = {
  not_started: 'bg-[#f0eee8] text-[#6F6A63] border-[#E8E4DC]',
  needs_setup: 'bg-[#fff4d6] text-[#8a6d1f] border-[#f0e2a6]',
  monitoring: 'bg-primary-soft text-primary border-primary/30',
  issue: 'bg-[#f7e3e3] text-danger border-[#eccaca]',
  ok: 'bg-[#e2f0e6] text-[#2f6b46] border-[#c6dccd]',
};

const ORGANIZATION_LABEL: Record<HermesWorkspaceOrganization, string> = {
  connectnpo: 'connectNPO',
  givingarc: 'GivingArc',
  wife_cpa: 'Wife CPA',
  client: 'Client',
  internal: 'Internal',
};

const ORGANIZATION_ORDER: HermesWorkspaceOrganization[] = [
  'connectnpo',
  'givingarc',
  'wife_cpa',
  'client',
  'internal',
];

const PURPOSE_LABEL: Record<HermesWorkspacePurpose, string> = {
  dashboard: 'Dashboard',
  content: 'Content',
  meeting_intel: 'Meeting intel',
  accounting: 'Accounting',
  customer_support: 'Customer support',
  automation: 'Automation',
  client_ops: 'Client ops',
  other: 'Other',
};

const ENVIRONMENT_LABEL: Record<HermesWorkspaceEnvironment, string> = {
  internal: 'Internal',
  client: 'Client',
  pilot: 'Pilot',
};

const SUPPORT_FILTER_VALUES: HermesWorkspaceSupportStatus[] = [
  'not_started',
  'needs_setup',
  'monitoring',
  'issue',
  'ok',
];

const CURRENT_WORKSPACE_COLUMNS =
  'id, client_name, workspace_key, workspace_type, organization, purpose, environment, isolation_model, vps_hostname, hermes_profile, service_name, dashboard_port, status, support_status, checklist_profile_exists, checklist_dashboard_running, checklist_discord_connected, checklist_message_content_intent_on, checklist_service_restarted, checklist_test_message_passed, updated_at';

const LEGACY_WORKSPACE_COLUMNS =
  'id, client_name, workspace_key, workspace_type, isolation_model, vps_hostname, hermes_profile, dashboard_port, status, support_status, updated_at';

const buildOrderSteps = [
  {
    n: 1,
    title: 'Internal Hermes Operations HQ',
    body: 'Use this console first for connectNPO, GivingArc, Wife CPA, staff bots, profiles, VPS notes, Discord channels, and support status.',
  },
  {
    n: 2,
    title: 'Staff operating workflow',
    body: 'Turn repeated setup, support, and health-check steps into a simple staff workflow before exposing anything to customers.',
  },
  {
    n: 3,
    title: 'Client VPS template',
    body: 'Standardize the per-client VPS/profile/bot pattern only after our internal records, checklist, and runbooks are reliable.',
  },
  {
    n: 4,
    title: 'Customer dashboard',
    body: 'Split out a customer-facing dashboard later with only safe client status, reports, requests, and files — never internal ops data.',
  },
];

const staffWorkflowSteps = [
  {
    title: 'Daily check',
    body: 'Open the attention filter first. Anything marked issue or needs setup is handled before normal content or automation work.',
  },
  {
    title: 'Workspace change',
    body: 'Update this metadata card whenever a profile, service, dashboard port, Discord channel, or VPS location changes.',
  },
  {
    title: 'Support handoff',
    body: 'Use the next operator action and notes field so another staff member can continue without asking Jay for context.',
  },
];

const clientTemplateSteps = [
  {
    title: 'One client = one isolated VPS',
    body: 'Default paid-client setup should be a dedicated VPS/profile/bot, not mixed with connectNPO or GivingArc internal data.',
  },
  {
    title: 'Metadata here, secrets there',
    body: 'This console records names, ports, channels, and status only. Tokens and API keys stay inside the client VPS .env.',
  },
  {
    title: 'Customer dashboard later',
    body: 'After the internal workflow is stable, expose only safe client-facing status, reports, files, and support requests.',
  },
];

const setupSteps = [
  {
    n: 1,
    title: 'Record the workspace',
    body: 'Capture the organization (connectNPO, GivingArc, Wife CPA, client, or internal), purpose, and naming so operators see one source of truth.',
  },
  {
    n: 2,
    title: 'Provision VPS or profile',
    body: 'Stand up the dedicated VPS or add a Hermes profile on a shared box. No commands run from this console.',
  },
  {
    n: 3,
    title: 'Connect Discord safely',
    body: 'Create the bot, invite it, and store the bot token in the VPS .env. Tokens never live here.',
  },
  {
    n: 4,
    title: 'Verify health',
    body: 'Open the Hermes dashboard via SSH tunnel, confirm Discord traffic, then flip support status to OK.',
  },
];

type WorkspaceRow = Pick<
  HermesWorkspace,
  | 'id'
  | 'client_name'
  | 'workspace_key'
  | 'workspace_type'
  | 'organization'
  | 'purpose'
  | 'environment'
  | 'isolation_model'
  | 'vps_hostname'
  | 'hermes_profile'
  | 'service_name'
  | 'dashboard_port'
  | 'status'
  | 'support_status'
  | 'checklist_profile_exists'
  | 'checklist_dashboard_running'
  | 'checklist_discord_connected'
  | 'checklist_message_content_intent_on'
  | 'checklist_service_restarted'
  | 'checklist_test_message_passed'
  | 'updated_at'
>;

type RawWorkspaceRow = Partial<WorkspaceRow> &
  Pick<
    WorkspaceRow,
    | 'id'
    | 'client_name'
    | 'workspace_key'
    | 'workspace_type'
    | 'isolation_model'
    | 'status'
    | 'support_status'
    | 'updated_at'
  >;

function normalizeWorkspace(row: RawWorkspaceRow): WorkspaceRow {
  const legacyInternal = row.workspace_type === 'internal';
  return {
    id: row.id,
    client_name: row.client_name,
    workspace_key: row.workspace_key,
    workspace_type: row.workspace_type,
    organization: row.organization ?? (legacyInternal ? 'internal' : 'client'),
    purpose: row.purpose ?? 'other',
    environment: row.environment ?? (legacyInternal ? 'internal' : 'client'),
    isolation_model: row.isolation_model,
    vps_hostname: row.vps_hostname ?? null,
    hermes_profile: row.hermes_profile ?? null,
    service_name: row.service_name ?? null,
    dashboard_port: row.dashboard_port ?? null,
    status: row.status,
    support_status: row.support_status,
    checklist_profile_exists: row.checklist_profile_exists ?? false,
    checklist_dashboard_running: row.checklist_dashboard_running ?? false,
    checklist_discord_connected: row.checklist_discord_connected ?? false,
    checklist_message_content_intent_on:
      row.checklist_message_content_intent_on ?? false,
    checklist_service_restarted: row.checklist_service_restarted ?? false,
    checklist_test_message_passed: row.checklist_test_message_passed ?? false,
    updated_at: row.updated_at,
  };
}

function checklistDone(w: WorkspaceRow): number {
  return HERMES_CHECKLIST_KEYS.reduce<number>(
    (acc, key) => acc + (w[`checklist_${key}`] ? 1 : 0),
    0,
  );
}

function nextOperatorAction(w: WorkspaceRow): string {
  if (w.support_status === 'issue') return 'Open notes and resolve the active issue';
  if (!w.checklist_profile_exists) return 'Create or confirm the Hermes profile';
  if (!w.checklist_dashboard_running) return 'Start or verify the Hermes dashboard';
  if (!w.checklist_discord_connected) return 'Connect the Discord bot to the right channel';
  if (!w.checklist_message_content_intent_on) return 'Enable Message Content Intent';
  if (!w.checklist_service_restarted) return 'Restart the profile service after config changes';
  if (!w.checklist_test_message_passed) return 'Send and confirm a test message';
  if (w.support_status === 'needs_setup') return 'Mark support OK after final review';
  return 'Monitor';
}

function isOrganization(value: string): value is HermesWorkspaceOrganization {
  return (ORGANIZATION_ORDER as string[]).includes(value);
}

function isSupportStatus(
  value: string,
): value is HermesWorkspaceSupportStatus {
  return (SUPPORT_FILTER_VALUES as string[]).includes(value);
}

export default async function HermesOperationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    organization?: string;
    support_status?: string;
    attention?: string;
  }>;
}) {
  const sp = await searchParams;
  const organizationFilter =
    sp.organization && isOrganization(sp.organization)
      ? sp.organization
      : null;
  const supportFilter =
    sp.support_status && isSupportStatus(sp.support_status)
      ? sp.support_status
      : null;
  const attentionFilter = sp.attention === '1';

  const supabase = await createClient();
  let legacySchema = false;
  let workspaceData: RawWorkspaceRow[] | null = null;
  let workspaceError = null;

  const currentResult = await supabase
    .from('hermes_workspaces')
    .select(CURRENT_WORKSPACE_COLUMNS)
    .order('updated_at', { ascending: false });

  workspaceData = currentResult.data as RawWorkspaceRow[] | null;
  workspaceError = currentResult.error;

  if (workspaceError?.code === '42703') {
    legacySchema = true;
    const legacyResult = await supabase
      .from('hermes_workspaces')
      .select(LEGACY_WORKSPACE_COLUMNS)
      .order('updated_at', { ascending: false });
    workspaceData = legacyResult.data as RawWorkspaceRow[] | null;
    workspaceError = legacyResult.error;
  }

  const allWorkspaces = (workspaceData ?? []).map(normalizeWorkspace);
  const tableMissing =
    workspaceError &&
    /relation .*hermes_workspaces.* does not exist/i.test(workspaceError.message);

  const workspaces = allWorkspaces.filter((w) => {
    if (organizationFilter && w.organization !== organizationFilter) return false;
    if (supportFilter && w.support_status !== supportFilter) return false;
    if (
      attentionFilter &&
      w.support_status !== 'needs_setup' &&
      w.support_status !== 'issue'
    )
      return false;
    return true;
  });

  const total = allWorkspaces.length;
  const internalCount = allWorkspaces.filter(
    (w) => w.environment === 'internal',
  ).length;
  const activeCount = allWorkspaces.filter((w) => w.status === 'active').length;
  const attentionCount = allWorkspaces.filter(
    (w) => w.support_status === 'needs_setup' || w.support_status === 'issue',
  ).length;
  const orgBreakdown = ORGANIZATION_ORDER.map((org) => ({
    org,
    label: ORGANIZATION_LABEL[org],
    count: allWorkspaces.filter((w) => w.organization === org).length,
  })).filter((row) => row.count > 0);

  const baseHref = '/admin/apps/hermes-workspaces';
  function filterHref(
    patch: Partial<{
      organization: HermesWorkspaceOrganization | null;
      support_status: HermesWorkspaceSupportStatus | null;
      attention: boolean;
    }>,
  ): string {
    const next = new URLSearchParams();
    const org =
      patch.organization === undefined ? organizationFilter : patch.organization;
    const sup =
      patch.support_status === undefined ? supportFilter : patch.support_status;
    const att = patch.attention === undefined ? attentionFilter : patch.attention;
    if (org) next.set('organization', org);
    if (sup) next.set('support_status', sup);
    if (att) next.set('attention', '1');
    const qs = next.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  }

  const hasActiveFilter =
    Boolean(organizationFilter) || Boolean(supportFilter) || attentionFilter;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Internal operations
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-main">
            Hermes Operations HQ
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            One console for every Hermes workspace we run — connectNPO,
            GivingArc, Wife CPA, client deployments, and internal tooling.
            Bot tokens, API keys, and .env values stay on each VPS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/apps/hermes-workspaces/new">
            <Button size="sm">Add workspace</Button>
          </Link>
        </div>
      </header>

      {tableMissing && (
        <Card className="border-[#f0e2a6] bg-[#fff8e1]">
          <p className="text-sm font-medium text-[#8a6d1f]">
            Hermes Operations HQ table not found
          </p>
          <p className="mt-1 text-sm text-[#8a6d1f]">
            Run <code className="rounded bg-[#f7edc8] px-1 py-0.5 text-xs">supabase/hermes_workspaces.sql</code>{' '}
            in the Supabase SQL Editor to create the table and policies. Then optionally run{' '}
            <code className="rounded bg-[#f7edc8] px-1 py-0.5 text-xs">supabase/hermes_workspaces_internal_seed.sql</code>{' '}
            to prefill our known connectNPO, GivingArc, and Wife CPA operating records.
          </p>
        </Card>
      )}

      {workspaceError && !tableMissing && !legacySchema && (
        <Card className="border-[#b53333]/30 bg-[#b53333]/10">
          <p className="text-sm text-danger">
            We couldn’t load Hermes workspaces. Check your Supabase
            configuration and try again.
          </p>
        </Card>
      )}

      {legacySchema && !workspaceError && (
        <Card className="border-[#f0e2a6] bg-[#fff8e1]">
          <p className="text-sm font-medium text-[#8a6d1f]">
            Supabase schema update needed
          </p>
          <p className="mt-1 text-sm text-[#8a6d1f]">
            This page is showing the older Hermes workspace table safely. Run{' '}
            <code className="rounded bg-[#f7edc8] px-1 py-0.5 text-xs">supabase/hermes_workspaces.sql</code>{' '}
            and then{' '}
            <code className="rounded bg-[#f7edc8] px-1 py-0.5 text-xs">supabase/hermes_workspaces_internal_seed.sql</code>{' '}
            in Supabase SQL Editor to enable the full Operations HQ fields.
          </p>
        </Card>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total workspaces" value={tableMissing ? '—' : total} />
        <StatTile
          label="Internal environments"
          value={tableMissing ? '—' : internalCount}
        />
        <StatTile label="Active" value={tableMissing ? '—' : activeCount} />
        <StatTile
          label="Needs setup or issue"
          value={tableMissing ? '—' : attentionCount}
          accent={attentionCount > 0}
        />
      </section>

      <Card className="border-primary/30 bg-primary-soft/35">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-main">Build order decision</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
              This dashboard is intentionally internal-first. We prove our own
              Hermes operations here before creating a lighter customer
              dashboard for separate client VPS deployments.
            </p>
          </div>
          <span className="rounded-full border border-primary/30 bg-surface px-3 py-1 text-xs text-primary">
            Internal first
          </span>
        </div>
        <div className="mt-4 grid gap-2 lg:grid-cols-4">
          {buildOrderSteps.map((step) => (
            <div
              key={step.n}
              className="rounded-[5px] border border-border bg-surface px-3 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {step.n}
                </span>
                <p className="text-sm font-medium text-main">{step.title}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-3 lg:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-main">Staff operating workflow</p>
            <p className="mt-1 text-sm text-muted">
              The team should use this as the simple daily operating rhythm
              before we design any customer-facing dashboard.
            </p>
          </div>
          <div className="grid gap-2">
            {staffWorkflowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-[5px] border border-border bg-surface px-3 py-2"
              >
                <p className="text-sm font-medium text-main">{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{step.body}</p>
              </div>
            ))}
          </div>
          <Link
            href={filterHref({ attention: true })}
            className="text-xs font-medium text-primary hover:text-main"
          >
            Open workspaces needing attention →
          </Link>
        </Card>

        <Card className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-main">Client VPS template guardrails</p>
            <p className="mt-1 text-sm text-muted">
              This is the future client pattern, but it should be copied only
              after our internal Hermes operations are reliable.
            </p>
          </div>
          <div className="grid gap-2">
            {clientTemplateSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-[5px] border border-border bg-surface px-3 py-2"
              >
                <p className="text-sm font-medium text-main">{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{step.body}</p>
              </div>
            ))}
          </div>
          <Link
            href={filterHref({ organization: 'client' })}
            className="text-xs font-medium text-primary hover:text-main"
          >
            View client workspaces →
          </Link>
        </Card>
      </section>

      {!tableMissing && orgBreakdown.length > 0 && (
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-main">By organization</p>
            <p className="text-xs text-muted">Counts across all environments</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {orgBreakdown.map((row) => (
              <Link
                key={row.org}
                href={filterHref({ organization: row.org })}
                className={`flex items-center justify-between rounded-[5px] border px-3 py-2 text-sm transition-colors ${
                  organizationFilter === row.org
                    ? 'border-primary/40 bg-primary-soft text-main'
                    : 'border-border bg-surface text-muted hover:border-primary/30 hover:bg-primary-soft/40'
                }`}
              >
                <span>{row.label}</span>
                <span className="font-editorial text-lg text-main">
                  {row.count}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {!tableMissing && (
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-main">Filters</p>
            {hasActiveFilter && (
              <Link
                href={baseHref}
                className="text-xs text-muted hover:text-primary"
              >
                Clear all
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <FilterPill
              href={filterHref({ organization: null })}
              active={!organizationFilter}
            >
              All organizations
            </FilterPill>
            {ORGANIZATION_ORDER.map((org) => (
              <FilterPill
                key={org}
                href={filterHref({ organization: org })}
                active={organizationFilter === org}
              >
                {ORGANIZATION_LABEL[org]}
              </FilterPill>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <FilterPill
              href={filterHref({ support_status: null })}
              active={!supportFilter}
            >
              All support states
            </FilterPill>
            {SUPPORT_FILTER_VALUES.map((status) => (
              <FilterPill
                key={status}
                href={filterHref({ support_status: status })}
                active={supportFilter === status}
              >
                {SUPPORT_LABEL[status]}
              </FilterPill>
            ))}
            <FilterPill
              href={filterHref({ attention: !attentionFilter })}
              active={attentionFilter}
            >
              Needs attention
            </FilterPill>
          </div>
        </Card>
      )}

      {!tableMissing && !workspaceError && allWorkspaces.length === 0 && (
        <EmptyState
          title="No workspaces yet"
          description="Add your first workspace — start with connectNPO, GivingArc, or Wife CPA — so the team has a shared view of who runs on which VPS and profile."
          action={
            <Link href="/admin/apps/hermes-workspaces/new">
              <Button>Add workspace</Button>
            </Link>
          }
        />
      )}

      {!tableMissing &&
        !workspaceError &&
        allWorkspaces.length > 0 &&
        workspaces.length === 0 && (
          <EmptyState
            title="No workspaces match these filters"
            description="Try clearing one of the filters above to widen the list."
            action={
              <Link href={baseHref}>
                <Button variant="ghost">Clear filters</Button>
              </Link>
            }
          />
        )}

      {workspaces.length > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-3 font-medium">Workspace</th>
                  <th className="px-5 py-3 font-medium">Org / purpose</th>
                  <th className="px-5 py-3 font-medium">Host / profile</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Support</th>
                  <th className="px-5 py-3 font-medium">Checklist</th>
                  <th className="px-5 py-3 font-medium">Next action</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.map((w) => {
                  const done = checklistDone(w);
                  const nextAction = nextOperatorAction(w);
                  return (
                    <tr
                      key={w.id}
                      className="group relative border-b border-border transition-colors last:border-0 hover:bg-primary-soft/40"
                    >
                      <td className="relative px-5 py-3">
                        <Link
                          href={`/admin/apps/hermes-workspaces/${w.id}`}
                          className="font-medium text-main outline-none before:absolute before:inset-0 before:content-[''] focus-visible:underline"
                        >
                          {w.client_name}
                        </Link>
                        <div className="text-xs text-muted">
                          {w.workspace_key} ·{' '}
                          {ENVIRONMENT_LABEL[w.environment]} ·{' '}
                          {w.isolation_model === 'dedicated_vps'
                            ? 'Dedicated VPS'
                            : 'Shared VPS profile'}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        <div>{ORGANIZATION_LABEL[w.organization]}</div>
                        <div className="text-xs">
                          {PURPOSE_LABEL[w.purpose]}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        <div>{w.vps_hostname ?? '—'}</div>
                        <div className="text-xs">
                          {w.hermes_profile ?? '—'}
                          {w.dashboard_port ? ` · :${w.dashboard_port}` : ''}
                          {w.service_name ? ` · ${w.service_name}` : ''}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={STATUS_CLASS[w.status]}>
                          {STATUS_LABEL[w.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={SUPPORT_CLASS[w.support_status]}>
                          {SUPPORT_LABEL[w.support_status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        <span className="font-mono text-xs">
                          {done}/{HERMES_CHECKLIST_KEYS.length}
                        </span>
                      </td>
                      <td className="max-w-[220px] px-5 py-3 text-xs leading-5 text-muted">
                        {nextAction}
                      </td>
                      <td className="px-5 py-3 text-right text-muted">
                        <div>{formatDate(w.updated_at)}</div>
                        <Link
                          href={`/admin/apps/hermes-workspaces/${w.id}`}
                          className="relative z-10 mt-0.5 inline-flex text-[11px] text-muted/80 hover:text-primary focus-visible:text-primary focus-visible:underline focus-visible:outline-none"
                        >
                          View / edit →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border md:hidden">
            {workspaces.map((w) => {
              const done = checklistDone(w);
              const nextAction = nextOperatorAction(w);
              return (
                <li key={w.id}>
                  <Link
                    href={`/admin/apps/hermes-workspaces/${w.id}`}
                    className="flex flex-col gap-2 p-4 transition-colors hover:bg-primary-soft/40 focus:bg-primary-soft/40 focus:outline-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-main">
                        {w.client_name}
                      </span>
                      <Badge className={STATUS_CLASS[w.status]}>
                        {STATUS_LABEL[w.status]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted">
                      {w.workspace_key} ·{' '}
                      {ORGANIZATION_LABEL[w.organization]} ·{' '}
                      {PURPOSE_LABEL[w.purpose]}
                    </div>
                    <div className="text-xs text-muted">
                      {w.vps_hostname ?? 'No host'}
                      {w.hermes_profile ? ` · ${w.hermes_profile}` : ''}
                      {w.dashboard_port ? ` · :${w.dashboard_port}` : ''}
                    </div>
                    <div className="text-xs leading-5 text-muted">
                      Next: {nextAction}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <Badge className={SUPPORT_CLASS[w.support_status]}>
                        {SUPPORT_LABEL[w.support_status]}
                      </Badge>
                      <span>
                        Checklist {done}/{HERMES_CHECKLIST_KEYS.length} ·
                        Updated {formatDate(w.updated_at)} →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold text-main">Setup workflow</h2>
          <p className="mt-0.5 text-sm text-muted">
            Walk a new workspace through these four steps. Each step happens
            outside this console — operators just record progress here.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {setupSteps.map((step) => (
            <Card key={step.n}>
              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-2xl text-primary">
                  {step.n}
                </span>
                <h3 className="text-sm font-semibold text-main">{step.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-primary/30 bg-primary-soft/40">
        <p className="text-sm font-semibold text-main">Safety note</p>
        <p className="mt-1 text-sm text-muted">
          No Discord bot tokens, API keys, passwords, or .env values are stored
          in Hermes Operations HQ. Keep secrets on the VPS that runs each
          Hermes profile.
        </p>
      </Card>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[5px] border px-4 py-3 ${
        accent
          ? 'border-[#eccaca] bg-[#f7e3e3]'
          : 'border-border bg-surface'
      }`}
    >
      <p
        className={`text-[11px] font-medium uppercase tracking-[0.16em] ${
          accent ? 'text-danger' : 'text-muted'
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 font-editorial text-2xl ${
          accent ? 'text-danger' : 'text-main'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border px-3 py-1 transition-colors ${
        active
          ? 'border-primary/40 bg-primary-soft text-main'
          : 'border-border bg-surface text-muted hover:border-primary/30 hover:bg-primary-soft/40'
      }`}
    >
      {children}
    </Link>
  );
}
