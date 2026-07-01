import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  HERMES_CHECKLIST_KEYS,
  type HermesWorkspace,
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

type CurrentProfileMapRecord = {
  displayName: string;
  organization: HermesWorkspaceOrganization;
  purpose: HermesWorkspacePurpose;
  hermesProfile: string;
  discordBot: string;
  discordServer: string;
  discordChannel: string;
  discordChannelId: string;
  serviceName: string;
  description: string;
};

const CURRENT_PROFILE_MAP: CurrentProfileMapRecord[] = [
  {
    displayName: 'connectNPO ContentBot',
    organization: 'connectnpo',
    purpose: 'content',
    hermesProfile: 'connectnpo-content',
    discordBot: 'ContentBot#0838',
    discordServer: 'NPOBot',
    discordChannel: '#content-bot',
    discordChannelId: '1507203008482771054',
    serviceName: 'hermes-gateway-connectnpo-content.service',
    description:
      'connectNPO content, website copy, SEO, nonprofit marketing, and public-facing drafts.',
  },
  {
    displayName: 'Giving Arc Content',
    organization: 'givingarc',
    purpose: 'content',
    hermesProfile: 'givingarc-content',
    discordBot: 'Arcbot',
    discordServer: "givingarc's server",
    discordChannel: '#contents',
    discordChannelId: '1506758086378127362',
    serviceName: 'hermes-gateway-givingarc-content.service',
    description:
      'Giving Arc educational content, YouTube, newsletter, blog, and nonprofit accounting education drafts.',
  },
  {
    displayName: 'Giving Arc Meeting Intelligence',
    organization: 'givingarc',
    purpose: 'meeting_intel',
    hermesProfile: 'givingarc-meeting-intel',
    discordBot: 'MeetingIntelBot#9997',
    discordServer: "givingarc's server",
    discordChannel: '#meeting-intel',
    discordChannelId: '1515970894001082378',
    serviceName: 'hermes-gateway-givingarc-meeting-intel.service',
    description:
      'Pre-meeting nonprofit research, post-meeting transcript analysis, and anonymized insight building.',
  },
  {
    displayName: 'NPO Accounting',
    organization: 'wife_cpa',
    purpose: 'accounting',
    hermesProfile: 'wife-cpa',
    discordBot: 'CPATaxBot',
    discordServer: "givingarc's server",
    discordChannel: '#nonprofit-accounting',
    discordChannelId: '1506758170603819201',
    serviceName: 'hermes-gateway-wife-cpa.service',
    description:
      'Nonprofit CPA, accounting, tax, Form 990, bookkeeping, and review support.',
  },
];

const CURRENT_WORKSPACE_COLUMNS =
  'id, client_name, workspace_key, workspace_type, organization, purpose, environment, isolation_model, vps_hostname, hermes_profile, service_name, dashboard_port, discord_channel_name, status, support_status, checklist_profile_exists, checklist_dashboard_running, checklist_discord_connected, checklist_message_content_intent_on, checklist_service_restarted, checklist_test_message_passed, updated_at';

const LEGACY_WORKSPACE_COLUMNS =
  'id, client_name, workspace_key, workspace_type, isolation_model, vps_hostname, hermes_profile, dashboard_port, status, support_status, updated_at';

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
  | 'discord_channel_name'
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
    discord_channel_name: row.discord_channel_name ?? null,
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

export default async function HermesOperationsPage() {
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

  const knownProfileKeys = new Set(
    CURRENT_PROFILE_MAP.map((p) => p.hermesProfile),
  );
  const extraWorkspaces = allWorkspaces.filter((w) => {
    if (w.workspace_key && knownProfileKeys.has(w.workspace_key)) return false;
    if (w.hermes_profile && knownProfileKeys.has(w.hermes_profile)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="border-b border-border pb-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Internal operations
        </p>
        <h1 className="mt-0.5 text-xl font-semibold text-main">
          Hermes Operations HQ
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          One console for every Hermes workspace we run — connectNPO,
          GivingArc, NPO Accounting, client deployments, and internal tooling.
          Bot tokens, API keys, and .env values stay on each VPS.
        </p>
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
            to prefill our known connectNPO, GivingArc, and NPO Accounting operating records.
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

      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-main">What would you like to do?</h2>
          <p className="mt-0.5 text-xs text-muted">
            Add a new workspace profile or capture Discord details during setup.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/apps/hermes-workspaces/new">
            <Button size="sm">New profile</Button>
          </Link>
          <Link
            href="/admin/apps/hermes-workspaces/discord-setup"
            title="Step-by-step guide for adding a Discord bot to a Hermes profile."
          >
            <Button size="sm" variant="secondary">
              Discord setup
            </Button>
          </Link>
        </div>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CURRENT_PROFILE_MAP.map((profile) => {
          const workspace = allWorkspaces.find(
            (w) => w.workspace_key === profile.hermesProfile,
          );
          const done = workspace ? checklistDone(workspace) : null;
          const nextAction = workspace ? nextOperatorAction(workspace) : null;
          const status: HermesWorkspaceStatus = workspace?.status ?? 'active';
          const supportStatus: HermesWorkspaceSupportStatus =
            workspace?.support_status ?? 'monitoring';
          return (
            <Card
              key={profile.hermesProfile}
              className="flex flex-col gap-2 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {workspace ? (
                    <Link
                      href={`/admin/apps/hermes-workspaces/${workspace.id}`}
                      className="text-sm font-semibold text-main hover:text-primary"
                    >
                      {profile.displayName}
                    </Link>
                  ) : (
                    <h2 className="text-sm font-semibold text-main">
                      {profile.displayName}
                    </h2>
                  )}
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
                    {profile.hermesProfile}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge className={STATUS_CLASS[status]}>
                    {STATUS_LABEL[status]}
                  </Badge>
                  <Badge className={SUPPORT_CLASS[supportStatus]}>
                    {SUPPORT_LABEL[supportStatus]}
                  </Badge>
                </div>
              </div>

              <p className="truncate text-xs text-muted">
                {profile.discordChannel}
              </p>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2 text-xs text-muted">
                <span className="min-w-0 truncate">
                  {done === null ? (
                    'Seed profile to enable checklist'
                  ) : (
                    <>
                      <span className="font-mono text-main">
                        {done}/{HERMES_CHECKLIST_KEYS.length}
                      </span>{' '}
                      · {nextAction}
                    </>
                  )}
                </span>
                {workspace && (
                  <Link
                    href={`/admin/apps/hermes-workspaces/${workspace.id}`}
                    className="shrink-0 text-primary hover:underline"
                  >
                    View details →
                  </Link>
                )}
              </div>
            </Card>
          );
        })}

        {extraWorkspaces.map((workspace) => {
          const profileKey =
            workspace.hermes_profile ?? workspace.workspace_key;
          const channel =
            workspace.discord_channel_name ?? 'No Discord channel yet';
          const done = checklistDone(workspace);
          const nextAction = nextOperatorAction(workspace);
          return (
            <Card
              key={workspace.id}
              className="flex flex-col gap-2 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/admin/apps/hermes-workspaces/${workspace.id}`}
                    className="text-sm font-semibold text-main hover:text-primary"
                  >
                    {workspace.client_name}
                  </Link>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
                    {profileKey}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge className={STATUS_CLASS[workspace.status]}>
                    {STATUS_LABEL[workspace.status]}
                  </Badge>
                  <Badge className={SUPPORT_CLASS[workspace.support_status]}>
                    {SUPPORT_LABEL[workspace.support_status]}
                  </Badge>
                </div>
              </div>

              <p className="truncate text-xs text-muted">{channel}</p>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2 text-xs text-muted">
                <span className="min-w-0 truncate">
                  <span className="font-mono text-main">
                    {done}/{HERMES_CHECKLIST_KEYS.length}
                  </span>{' '}
                  · {nextAction}
                </span>
                <Link
                  href={`/admin/apps/hermes-workspaces/${workspace.id}`}
                  className="shrink-0 text-primary hover:underline"
                >
                  View details →
                </Link>
              </div>
            </Card>
          );
        })}
      </section>

      {!tableMissing && !workspaceError && allWorkspaces.length === 0 && (
        <EmptyState
          title="No workspaces yet"
          description="Add your first workspace — start with connectNPO, GivingArc, or NPO Accounting — so the team has a shared view of who runs on which VPS and profile."
          action={
            <Link href="/admin/apps/hermes-workspaces/new">
              <Button>New profile</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
