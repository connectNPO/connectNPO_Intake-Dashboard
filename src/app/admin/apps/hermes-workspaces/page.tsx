import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import type {
  HermesWorkspace,
  HermesWorkspaceStatus,
  HermesWorkspaceSupportStatus,
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

const setupSteps = [
  {
    n: 1,
    title: 'Create or record workspace',
    body: 'Capture the client, isolation model, and key naming so operators see a single source of truth.',
  },
  {
    n: 2,
    title: 'Provision VPS or profile',
    body: 'Stand up a dedicated VPS or add a Hermes profile on a shared box. No commands run from this dashboard.',
  },
  {
    n: 3,
    title: 'Connect Discord safely',
    body: 'Create the bot in Discord, invite it, and store the bot token in the VPS .env. Tokens never live here.',
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
  | 'isolation_model'
  | 'vps_hostname'
  | 'hermes_profile'
  | 'dashboard_port'
  | 'status'
  | 'support_status'
  | 'updated_at'
>;

export default async function HermesWorkspacesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hermes_workspaces')
    .select(
      'id, client_name, workspace_key, workspace_type, isolation_model, vps_hostname, hermes_profile, dashboard_port, status, support_status, updated_at',
    )
    .order('updated_at', { ascending: false });

  const workspaces = (data ?? []) as WorkspaceRow[];
  const tableMissing =
    error && /relation .*hermes_workspaces.* does not exist/i.test(error.message);

  const total = workspaces.length;
  const activeCount = workspaces.filter((w) => w.status === 'active').length;
  const attentionCount = workspaces.filter(
    (w) => w.support_status === 'needs_setup' || w.support_status === 'issue',
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Managed AI
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-main">
            Hermes Workspaces
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Manage staff and client Hermes environments without storing secrets
            here. This dashboard tracks records and workflow — bot tokens, API
            keys, and .env values stay on each VPS.
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
            Hermes Workspaces table not found
          </p>
          <p className="mt-1 text-sm text-[#8a6d1f]">
            Run <code className="rounded bg-[#f7edc8] px-1 py-0.5 text-xs">supabase/hermes_workspaces.sql</code>{' '}
            in the Supabase SQL Editor to create the table and policies, then
            reload this page.
          </p>
        </Card>
      )}

      {error && !tableMissing && (
        <Card className="border-[#b53333]/30 bg-[#b53333]/10">
          <p className="text-sm text-danger">
            We couldn’t load Hermes workspaces. Check your Supabase
            configuration and try again.
          </p>
        </Card>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <StatTile label="Total workspaces" value={tableMissing ? '—' : total} />
        <StatTile label="Active" value={tableMissing ? '—' : activeCount} />
        <StatTile
          label="Needs setup or issue"
          value={tableMissing ? '—' : attentionCount}
        />
      </section>

      {!tableMissing && !error && workspaces.length === 0 && (
        <EmptyState
          title="No workspaces yet"
          description="Add your first workspace record so the team has a shared view of who is running on which VPS and profile."
          action={
            <Link href="/admin/apps/hermes-workspaces/new">
              <Button>Add workspace</Button>
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
                  <th className="px-5 py-3 font-medium">Host / profile</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Support</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-main">{w.client_name}</div>
                      <div className="text-xs text-muted">
                        {w.workspace_key} · {w.workspace_type} ·{' '}
                        {w.isolation_model === 'dedicated_vps'
                          ? 'Dedicated VPS'
                          : 'Shared VPS profile'}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      <div>{w.vps_hostname ?? '—'}</div>
                      <div className="text-xs">
                        {w.hermes_profile ?? '—'}
                        {w.dashboard_port ? ` · :${w.dashboard_port}` : ''}
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
                      {formatDate(w.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border md:hidden">
            {workspaces.map((w) => (
              <li key={w.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-main">{w.client_name}</span>
                  <Badge className={STATUS_CLASS[w.status]}>
                    {STATUS_LABEL[w.status]}
                  </Badge>
                </div>
                <div className="text-xs text-muted">
                  {w.workspace_key} · {w.workspace_type} ·{' '}
                  {w.isolation_model === 'dedicated_vps'
                    ? 'Dedicated VPS'
                    : 'Shared profile'}
                </div>
                <div className="text-xs text-muted">
                  {w.vps_hostname ?? 'No host'}
                  {w.hermes_profile ? ` · ${w.hermes_profile}` : ''}
                  {w.dashboard_port ? ` · :${w.dashboard_port}` : ''}
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <Badge className={SUPPORT_CLASS[w.support_status]}>
                    {SUPPORT_LABEL[w.support_status]}
                  </Badge>
                  <span>Updated {formatDate(w.updated_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold text-main">Setup workflow</h2>
          <p className="mt-0.5 text-sm text-muted">
            Walk a new workspace through these four steps. Each step happens
            outside this dashboard — operators just record progress here.
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
          in this dashboard. Keep secrets on the VPS that runs each Hermes
          profile.
        </p>
      </Card>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[5px] border border-border bg-surface px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-1 font-editorial text-2xl text-main">{value}</p>
    </div>
  );
}
