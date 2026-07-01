import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  HERMES_CHECKLIST_KEYS,
  type HermesWorkspace,
  type HermesWorkspaceChecklistKey,
} from '@/lib/types';
import {
  deleteHermesWorkspace,
  retireHermesWorkspace,
  updateHermesWorkspace,
} from './actions';

export const dynamic = 'force-dynamic';

function nextOperatorAction(workspace: HermesWorkspace): string {
  if (workspace.support_status === 'issue')
    return 'Resolve the active issue, then update support status.';
  if (!workspace.checklist_profile_exists)
    return 'Create or confirm the Hermes profile on the VPS.';
  if (!workspace.checklist_discord_connected)
    return 'Connect the Discord bot to the channel.';
  if (!workspace.checklist_message_content_intent_on)
    return 'Enable Message Content Intent in the Discord portal.';
  if (!workspace.checklist_service_restarted)
    return 'Restart the gateway service after the latest change.';
  if (!workspace.checklist_test_message_passed)
    return 'Send a test message and confirm Hermes replies.';
  if (workspace.support_status === 'needs_setup')
    return 'Final review, then mark support status OK.';
  return 'Monitor during normal operations.';
}

type CommandGroup = {
  title: string;
  commands: string[];
};

function buildCommandGroups(workspace: HermesWorkspace): CommandGroup[] {
  const groups: CommandGroup[] = [];

  if (workspace.hermes_profile) {
    groups.push({
      title: 'Open profile on VPS',
      commands: [`hermes --profile ${workspace.hermes_profile}`],
    });
  }

  if (workspace.service_name) {
    groups.push({
      title: 'Gateway service',
      commands: [
        `systemctl --user status ${workspace.service_name}`,
        `journalctl --user -u ${workspace.service_name} -n 80 --no-pager`,
        `systemctl --user restart ${workspace.service_name}`,
      ],
    });
  }

  if (workspace.dashboard_port) {
    const host = workspace.vps_hostname ?? '<vps-host>';
    groups.push({
      title: 'Dashboard tunnel',
      commands: [
        `ssh -N -L ${workspace.dashboard_port}:127.0.0.1:${workspace.dashboard_port} <user>@${host}`,
      ],
    });
  }

  return groups;
}

const PRIMARY_CHECKLIST: {
  key: HermesWorkspaceChecklistKey;
  label: string;
}[] = [
  { key: 'profile_exists', label: 'Profile exists on VPS' },
  { key: 'discord_connected', label: 'Discord bot connected' },
  { key: 'message_content_intent_on', label: 'Message Content Intent on' },
  { key: 'service_restarted', label: 'Gateway restarted after change' },
  { key: 'test_message_passed', label: 'Test message passed' },
];

export default async function HermesWorkspaceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from('hermes_workspaces')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!data) notFound();
  const workspace = data as HermesWorkspace;

  const checklistDone = HERMES_CHECKLIST_KEYS.reduce(
    (acc, key) => acc + (workspace[`checklist_${key}`] ? 1 : 0),
    0,
  );
  const checklistTotal = HERMES_CHECKLIST_KEYS.length;
  const nextAction = nextOperatorAction(workspace);
  const commandGroups = buildCommandGroups(workspace);

  return (
    <div className="flex w-full max-w-none flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link
            href="/admin/apps/hermes-workspaces"
            className="text-xs text-muted hover:text-main"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-semibold text-main">
            {workspace.client_name}
          </h1>
          {workspace.hermes_profile && (
            <span className="font-mono text-xs text-muted">
              {workspace.hermes_profile}
            </span>
          )}
          <span className="font-mono text-[11px] text-muted/80">
            {workspace.workspace_key}
          </span>
        </div>
        <span className="text-[11px] text-muted">
          {checklistDone}/{checklistTotal} checks · {workspace.status} ·{' '}
          {workspace.support_status.replace('_', ' ')}
        </span>
      </div>

      {saved && (
        <div
          role="status"
          className="rounded-[5px] border border-primary/30 bg-primary-soft px-3 py-1.5 text-xs text-main"
        >
          Workspace saved.
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-[5px] border border-[#eccaca] bg-[#f7e3e3] px-3 py-1.5 text-xs text-danger"
        >
          {error}
        </div>
      )}

      <form action={updateHermesWorkspace} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={workspace.id} />
        {/* Preserve fields the action expects but we no longer expose. */}
        <input
          type="hidden"
          name="client_name"
          value={workspace.client_name}
        />
        <input
          type="hidden"
          name="workspace_key"
          value={workspace.workspace_key}
        />
        <input
          type="hidden"
          name="workspace_type"
          value={workspace.workspace_type}
        />
        <input
          type="hidden"
          name="organization"
          value={workspace.organization}
        />
        <input type="hidden" name="purpose" value={workspace.purpose} />
        <input
          type="hidden"
          name="environment"
          value={workspace.environment}
        />
        <input
          type="hidden"
          name="isolation_model"
          value={workspace.isolation_model}
        />
        <input
          type="hidden"
          name="vps_hostname"
          value={workspace.vps_hostname ?? ''}
        />
        <input
          type="hidden"
          name="hermes_profile"
          value={workspace.hermes_profile ?? ''}
        />
        <input
          type="hidden"
          name="profile_path"
          value={workspace.profile_path ?? ''}
        />
        <input
          type="hidden"
          name="dashboard_url"
          value={workspace.dashboard_url ?? ''}
        />
        <input
          type="hidden"
          name="discord_server_name"
          value={workspace.discord_server_name ?? ''}
        />
        <input
          type="hidden"
          name="monthly_cost"
          value={workspace.monthly_cost ?? ''}
        />
        <input
          type="hidden"
          name="checklist_dashboard_running"
          value={workspace.checklist_dashboard_running ? 'on' : ''}
        />

        <div className="grid gap-3 lg:grid-cols-3">
          {/* Col 1: Next action + checklist + status + notes + save */}
          <Card className="flex flex-col gap-3 border-primary/30 bg-primary-soft/40 p-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                Next action
              </p>
              <p className="text-sm font-medium text-main">{nextAction}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <TinyField htmlFor="status" label="Status">
                <Select
                  id="status"
                  name="status"
                  defaultValue={workspace.status}
                >
                  <option value="planning">Planning</option>
                  <option value="setup">Setup</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="retired">Retired</option>
                </Select>
              </TinyField>
              <TinyField htmlFor="support_status" label="Support">
                <Select
                  id="support_status"
                  name="support_status"
                  defaultValue={workspace.support_status}
                >
                  <option value="not_started">Not started</option>
                  <option value="needs_setup">Needs setup</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="issue">Issue</option>
                  <option value="ok">OK</option>
                </Select>
              </TinyField>
            </div>

            <fieldset className="rounded-[5px] border border-border bg-surface p-2">
              <legend className="px-1 text-[10px] uppercase tracking-[0.16em] text-muted">
                Setup checklist · {checklistDone}/{checklistTotal}
              </legend>
              <div className="flex flex-col gap-1">
                {PRIMARY_CHECKLIST.map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-xs text-main"
                  >
                    <input
                      type="checkbox"
                      name={`checklist_${key}`}
                      defaultChecked={workspace[`checklist_${key}`]}
                      className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <TinyField htmlFor="notes" label="Notes">
              <Textarea
                id="notes"
                name="notes"
                defaultValue={workspace.notes ?? ''}
                rows={2}
                placeholder="Anything the next operator should know."
              />
            </TinyField>

            <div className="flex items-center gap-2">
              <Button type="submit" size="sm">
                Save
              </Button>
              <Link href="/admin/apps/hermes-workspaces">
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </Link>
            </div>

            <div className="flex flex-col gap-2 rounded-[5px] border border-[#eccaca] bg-[#fdf5f5] p-2">
              <p className="text-[10px] uppercase tracking-[0.16em] text-danger">
                Manage record
              </p>
              <p className="text-[11px] text-muted">
                Delete removes only this dashboard record. It does not delete
                the VPS profile or Discord bot.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  formAction={retireHermesWorkspace}
                >
                  Retire
                </Button>
                <span className="text-[11px] text-muted">
                  Marks status retired.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  name="delete_confirm"
                  placeholder="Type DELETE to delete"
                  aria-label="Type DELETE to delete"
                  className="max-w-[10rem]"
                />
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  formAction={deleteHermesWorkspace}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>

          {/* Col 2: Connection */}
          <Card className="flex flex-col gap-2 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Connection
            </p>
            <TinyField htmlFor="discord_channel_name" label="Discord channel">
              <Input
                id="discord_channel_name"
                name="discord_channel_name"
                defaultValue={workspace.discord_channel_name ?? ''}
                placeholder="#hermes-connectnpo"
              />
            </TinyField>
            <TinyField htmlFor="discord_channel_id" label="Channel ID">
              <Input
                id="discord_channel_id"
                name="discord_channel_id"
                defaultValue={workspace.discord_channel_id ?? ''}
                placeholder="123456789012345678"
              />
            </TinyField>
            <TinyField htmlFor="discord_bot_name" label="Discord bot">
              <Input
                id="discord_bot_name"
                name="discord_bot_name"
                defaultValue={workspace.discord_bot_name ?? ''}
              />
            </TinyField>
            <TinyField htmlFor="service_name" label="Gateway service">
              <Input
                id="service_name"
                name="service_name"
                defaultValue={workspace.service_name ?? ''}
                placeholder="hermes-connectnpo.service"
              />
            </TinyField>
            <TinyField htmlFor="dashboard_port" label="Dashboard port">
              <Input
                id="dashboard_port"
                name="dashboard_port"
                type="number"
                min={1}
                max={65535}
                defaultValue={workspace.dashboard_port ?? ''}
                placeholder="9120"
              />
            </TinyField>
            <TinyField htmlFor="soul_md_content" label="SOUL.md">
              <Textarea
                id="soul_md_content"
                name="soul_md_content"
                rows={4}
                defaultValue={workspace.soul_md_content ?? ''}
                placeholder={'# Role\nYou are...\n\n# Style\n...'}
              />
            </TinyField>
          </Card>

          {/* Col 3: VPS commands */}
          <Card className="flex flex-col gap-2 p-3">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                VPS commands
              </p>
              <p className="text-[11px] text-muted">
                Run these after SSH into the VPS. They will not work in a local
                Mac or Windows terminal.
              </p>
            </div>
            {commandGroups.length === 0 ? (
              <p className="text-[11px] text-muted">
                Add a Hermes profile, gateway service, or dashboard port to
                generate copy-paste commands.
              </p>
            ) : (
              commandGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-1">
                  <p className="text-[10px] uppercase tracking-wide text-muted">
                    {group.title}
                  </p>
                  {group.commands.map((command) => (
                    <div
                      key={command}
                      className="flex items-center gap-1.5"
                    >
                      <code className="flex-1 break-all rounded-[5px] border border-[#374151] bg-[#111827] px-2 py-1 font-mono text-[11px] text-[#f9fafb]">
                        {command}
                      </code>
                      <CopyButton value={command} label="Copy" />
                    </div>
                  ))}
                </div>
              ))
            )}
          </Card>
        </div>
      </form>
    </div>
  );
}

function TinyField({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
