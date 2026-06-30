import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/format';
import {
  HERMES_CHECKLIST_KEYS,
  type HermesWorkspace,
  type HermesWorkspaceChecklistKey,
} from '@/lib/types';
import { updateHermesWorkspace } from './actions';

export const dynamic = 'force-dynamic';

const CHECKLIST_LABEL: Record<HermesWorkspaceChecklistKey, string> = {
  profile_exists: 'Profile exists on VPS',
  dashboard_running: 'Dashboard running',
  discord_connected: 'Discord bot connected',
  message_content_intent_on: 'Message Content Intent enabled',
  service_restarted: 'Service restarted after config change',
  test_message_passed: 'Test message passed end-to-end',
};

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

  const tunnelHost = workspace.vps_hostname ?? '<vps-host>';
  const checklistDone = HERMES_CHECKLIST_KEYS.reduce(
    (acc, key) => acc + (workspace[`checklist_${key}`] ? 1 : 0),
    0,
  );
  const checklistTotal = HERMES_CHECKLIST_KEYS.length;
  const derivedDashboardUrl =
    workspace.dashboard_url ??
    (workspace.dashboard_port
      ? `http://127.0.0.1:${workspace.dashboard_port}`
      : null);

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6">
      <div>
        <Link
          href="/admin/apps/hermes-workspaces"
          className="text-sm text-muted hover:text-main"
        >
          ← Back to Hermes Operations HQ
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-main">
          {workspace.client_name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {workspace.workspace_key} · Updated {formatDate(workspace.updated_at)}
        </p>
        <p className="mt-2 text-sm text-muted">
          Edit workspace metadata only. Do not enter Discord tokens, API keys,
          passwords, or .env values — those stay on the VPS.
        </p>
      </div>

      {saved && (
        <div
          role="status"
          className="rounded-[5px] border border-primary/30 bg-primary-soft px-3.5 py-2.5 text-sm text-main"
        >
          Workspace saved.
        </div>
      )}

      <Card className="flex flex-col gap-4 border-primary/20 bg-primary-soft/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-main">Operator card</p>
            <p className="mt-0.5 text-xs text-muted">
              Read-only summary for whoever is on call. No secrets are stored
              or executed from this console.
            </p>
          </div>
          <div className="rounded-[5px] border border-primary/40 bg-surface px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Checklist
            </p>
            <p className="font-editorial text-lg text-main">
              {checklistDone}/{checklistTotal} complete
            </p>
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <OperatorRow label="VPS host" value={workspace.vps_hostname} mono />
          <OperatorRow
            label="Hermes profile"
            value={workspace.hermes_profile}
            mono
          />
          <OperatorRow
            label="Profile path"
            value={workspace.profile_path}
            mono
          />
          <OperatorRow
            label="systemd service"
            value={workspace.service_name}
            mono
          />
          <OperatorRow
            label="Dashboard URL"
            value={derivedDashboardUrl}
            mono
          />
          <OperatorRow
            label="Dashboard port"
            value={
              workspace.dashboard_port !== null
                ? String(workspace.dashboard_port)
                : null
            }
            mono
          />
          <OperatorRow
            label="Discord server"
            value={workspace.discord_server_name}
          />
          <OperatorRow
            label="Discord bot"
            value={workspace.discord_bot_name}
          />
          <OperatorRow
            label="Discord channel"
            value={workspace.discord_channel_name}
          />
          <OperatorRow
            label="Discord channel ID"
            value={workspace.discord_channel_id}
            mono
          />
        </dl>
        {workspace.dashboard_port !== null && (
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-wide text-muted">
              SSH tunnel
            </p>
            <code className="break-all rounded-[5px] border border-border bg-surface px-3 py-2 font-mono text-xs text-main">
              ssh -L {workspace.dashboard_port}:127.0.0.1:
              {workspace.dashboard_port} &lt;user&gt;@{tunnelHost}
            </code>
          </div>
        )}
        <div className="rounded-[5px] border border-danger/30 bg-[#f7e3e3] px-3 py-2 text-sm text-danger">
          <p className="font-semibold">Tokens, API keys, and passwords stay on the VPS .env only.</p>
          <p className="mt-0.5 text-xs">
            Hermes Operations HQ stores operator metadata. It never holds the
            Discord bot token, OpenAI / Anthropic keys, or any credential
            material.
          </p>
        </div>
      </Card>

      <Card>
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-[5px] border border-[#eccaca] bg-[#f7e3e3] px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <form action={updateHermesWorkspace} className="flex flex-col gap-5">
          <input type="hidden" name="id" value={workspace.id} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="client_name" label="Client or team name" required>
              <Input
                id="client_name"
                name="client_name"
                defaultValue={workspace.client_name}
                required
              />
            </Field>
            <Field
              htmlFor="workspace_key"
              label="Workspace key"
              helper="Lowercase slug. Letters, numbers, dashes, underscores."
              required
            >
              <Input
                id="workspace_key"
                name="workspace_key"
                defaultValue={workspace.workspace_key}
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              htmlFor="organization"
              label="Organization"
              helper="connectNPO, GivingArc, Wife CPA, a client, or internal tooling."
            >
              <Select
                id="organization"
                name="organization"
                defaultValue={workspace.organization}
              >
                <option value="connectnpo">connectNPO</option>
                <option value="givingarc">GivingArc</option>
                <option value="wife_cpa">Wife CPA</option>
                <option value="client">Client</option>
                <option value="internal">Internal</option>
              </Select>
            </Field>
            <Field htmlFor="purpose" label="Workspace purpose">
              <Select
                id="purpose"
                name="purpose"
                defaultValue={workspace.purpose}
              >
                <option value="dashboard">Dashboard</option>
                <option value="content">Content</option>
                <option value="meeting_intel">Meeting intel</option>
                <option value="accounting">Accounting</option>
                <option value="customer_support">Customer support</option>
                <option value="automation">Automation</option>
                <option value="client_ops">Client ops</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field htmlFor="environment" label="Environment">
              <Select
                id="environment"
                name="environment"
                defaultValue={workspace.environment}
              >
                <option value="internal">Internal</option>
                <option value="client">Client</option>
                <option value="pilot">Pilot</option>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="workspace_type" label="Workspace type">
              <Select
                id="workspace_type"
                name="workspace_type"
                defaultValue={workspace.workspace_type}
              >
                <option value="internal">Internal</option>
                <option value="client">Client</option>
                <option value="staff">Staff</option>
                <option value="pilot">Pilot</option>
              </Select>
            </Field>
            <Field
              htmlFor="isolation_model"
              label="Isolation model"
              helper="Dedicated VPS is the default for paying clients."
            >
              <Select
                id="isolation_model"
                name="isolation_model"
                defaultValue={workspace.isolation_model}
              >
                <option value="dedicated_vps">Dedicated VPS</option>
                <option value="shared_vps_profile">Shared VPS profile</option>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              htmlFor="vps_hostname"
              label="VPS hostname"
              helper="Hostname or IP, no credentials."
            >
              <Input
                id="vps_hostname"
                name="vps_hostname"
                defaultValue={workspace.vps_hostname ?? ''}
                placeholder="e.g. hermes-connectnpo.example.com"
              />
            </Field>
            <Field
              htmlFor="hermes_profile"
              label="Hermes profile"
              helper="Profile name on the VPS (e.g. connectnpo, givingarc, wife-cpa)."
            >
              <Input
                id="hermes_profile"
                name="hermes_profile"
                defaultValue={workspace.hermes_profile ?? ''}
                placeholder="e.g. connectnpo"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              htmlFor="profile_path"
              label="Profile path"
              helper="Filesystem path on the VPS (e.g. /opt/hermes/connectnpo)."
            >
              <Input
                id="profile_path"
                name="profile_path"
                defaultValue={workspace.profile_path ?? ''}
                placeholder="/opt/hermes/connectnpo"
              />
            </Field>
            <Field
              htmlFor="service_name"
              label="systemd service name"
              helper="e.g. hermes-connectnpo.service"
            >
              <Input
                id="service_name"
                name="service_name"
                defaultValue={workspace.service_name ?? ''}
                placeholder="hermes-connectnpo.service"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              htmlFor="dashboard_url"
              label="Dashboard URL"
              helper="Optional. If empty, we derive http://127.0.0.1:PORT from the port below."
            >
              <Input
                id="dashboard_url"
                name="dashboard_url"
                defaultValue={workspace.dashboard_url ?? ''}
                placeholder="http://127.0.0.1:9120"
              />
            </Field>
            <Field htmlFor="dashboard_port" label="Dashboard port">
              <Input
                id="dashboard_port"
                name="dashboard_port"
                type="number"
                min={1}
                max={65535}
                defaultValue={workspace.dashboard_port ?? ''}
                placeholder="9120"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              htmlFor="discord_server_name"
              label="Discord server"
              helper="Server / guild display name only."
            >
              <Input
                id="discord_server_name"
                name="discord_server_name"
                defaultValue={workspace.discord_server_name ?? ''}
                placeholder="connectNPO Ops"
              />
            </Field>
            <Field
              htmlFor="discord_bot_name"
              label="Discord bot name"
              helper="Display name only. Never enter the bot token."
            >
              <Input
                id="discord_bot_name"
                name="discord_bot_name"
                defaultValue={workspace.discord_bot_name ?? ''}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="discord_channel_name" label="Discord channel">
              <Input
                id="discord_channel_name"
                name="discord_channel_name"
                defaultValue={workspace.discord_channel_name ?? ''}
                placeholder="#hermes-connectnpo"
              />
            </Field>
            <Field
              htmlFor="discord_channel_id"
              label="Discord channel ID"
              helper="Numeric channel ID. Public identifier only."
            >
              <Input
                id="discord_channel_id"
                name="discord_channel_id"
                defaultValue={workspace.discord_channel_id ?? ''}
                placeholder="123456789012345678"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="status" label="Lifecycle status">
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
            </Field>
            <Field htmlFor="support_status" label="Support status">
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
            </Field>
          </div>

          <Field htmlFor="monthly_cost" label="Monthly cost (USD)">
            <Input
              id="monthly_cost"
              name="monthly_cost"
              type="number"
              min={0}
              step="0.01"
              defaultValue={workspace.monthly_cost ?? ''}
              placeholder="e.g. 18.00"
            />
          </Field>

          <fieldset className="flex flex-col gap-2 rounded-[5px] border border-border bg-surface p-4">
            <legend className="px-1 text-sm font-semibold text-main">
              Operations checklist
            </legend>
            <p className="text-xs text-muted">
              Track the work the operator did on the VPS. None of this triggers
              anything here — it just lets the team see what is left.
            </p>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              {HERMES_CHECKLIST_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-start gap-2 text-sm text-main"
                >
                  <input
                    type="checkbox"
                    name={`checklist_${key}`}
                    defaultChecked={workspace[`checklist_${key}`]}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>{CHECKLIST_LABEL[key]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Field htmlFor="notes" label="Operator notes">
            <Textarea
              id="notes"
              name="notes"
              defaultValue={workspace.notes ?? ''}
              placeholder="Anything an operator should know — onboarding context, SSH tunnel command, scheduled review."
            />
          </Field>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit">Save changes</Button>
            <Link href="/admin/apps/hermes-workspaces">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      <Card className="border-primary/30 bg-primary-soft/40">
        <p className="text-sm font-semibold text-main">Safety note</p>
        <p className="mt-1 text-sm text-muted">
          Never paste Discord bot tokens, API keys, passwords, or .env values
          into Hermes Operations HQ. They belong only on the VPS that runs
          this Hermes profile.
        </p>
      </Card>
    </div>
  );
}

function OperatorRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </dt>
      <dd
        className={`break-all rounded-[5px] border border-border bg-surface px-3 py-2 text-xs ${
          mono ? 'font-mono' : ''
        } ${value ? 'text-main' : 'text-muted/70'}`}
      >
        {value ?? '—'}
      </dd>
    </div>
  );
}
