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
import type { HermesWorkspace } from '@/lib/types';
import { updateHermesWorkspace } from './actions';

export const dynamic = 'force-dynamic';

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
  const hasHelperInfo =
    workspace.dashboard_port !== null || workspace.hermes_profile !== null;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6">
      <div>
        <Link
          href="/admin/apps/hermes-workspaces"
          className="text-sm text-muted hover:text-main"
        >
          ← Back to Hermes workspaces
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-main">
          {workspace.client_name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {workspace.workspace_key} · Updated {formatDate(workspace.updated_at)}
        </p>
        <p className="mt-2 text-sm text-muted">
          Edit workspace metadata. Do not enter Discord tokens, API keys,
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

      {hasHelperInfo && (
        <Card className="flex flex-col gap-3 border-primary/20 bg-primary-soft/40">
          <div>
            <p className="text-sm font-semibold text-main">
              Connection helper
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Operator notes only. No secrets are stored or executed from this
              dashboard.
            </p>
          </div>
          <dl className="flex flex-col gap-2 text-sm">
            {workspace.dashboard_port !== null && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Remote URL
                </dt>
                <dd className="break-all rounded-[5px] border border-border bg-surface px-3 py-2 font-mono text-xs text-main">
                  http://127.0.0.1:{workspace.dashboard_port}
                </dd>
              </div>
            )}
            {workspace.dashboard_port !== null && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  SSH tunnel
                </dt>
                <dd className="break-all rounded-[5px] border border-border bg-surface px-3 py-2 font-mono text-xs text-main">
                  ssh -L {workspace.dashboard_port}:127.0.0.1:
                  {workspace.dashboard_port} &lt;user&gt;@{tunnelHost}
                </dd>
              </div>
            )}
            {workspace.hermes_profile && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Hermes profile
                </dt>
                <dd className="break-all rounded-[5px] border border-border bg-surface px-3 py-2 font-mono text-xs text-main">
                  {workspace.hermes_profile}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      )}

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
                placeholder="e.g. hermes-acme.example.com"
              />
            </Field>
            <Field
              htmlFor="hermes_profile"
              label="Hermes profile"
              helper="Profile name on the VPS (e.g. connectnpo, acme)."
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
            <Field htmlFor="discord_channel_name" label="Discord channel">
              <Input
                id="discord_channel_name"
                name="discord_channel_name"
                defaultValue={workspace.discord_channel_name ?? ''}
                placeholder="#hermes-acme"
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
          here. They belong only on the VPS that runs this Hermes profile.
        </p>
      </Card>
    </div>
  );
}
