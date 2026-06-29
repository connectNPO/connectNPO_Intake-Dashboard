import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { createHermesWorkspace } from './actions';

export default async function NewHermesWorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
          Add Hermes workspace
        </h1>
        <p className="mt-1 text-sm text-muted">
          Record metadata only. Do not enter Discord tokens, API keys,
          passwords, or .env values — those stay on the VPS.
        </p>
      </div>

      <Card>
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-[5px] border border-[#eccaca] bg-[#f7e3e3] px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <form action={createHermesWorkspace} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="client_name" label="Client or team name" required>
              <Input id="client_name" name="client_name" required />
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
                placeholder="e.g. acme-foundation"
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="workspace_type" label="Workspace type">
              <Select id="workspace_type" name="workspace_type" defaultValue="client">
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
                defaultValue="dedicated_vps"
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
              <Input id="discord_bot_name" name="discord_bot_name" />
            </Field>
            <Field htmlFor="discord_channel_name" label="Discord channel">
              <Input
                id="discord_channel_name"
                name="discord_channel_name"
                placeholder="#hermes-acme"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="status" label="Lifecycle status">
              <Select id="status" name="status" defaultValue="planning">
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
                defaultValue="not_started"
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
              placeholder="Anything an operator should know — onboarding context, SSH tunnel command, scheduled review."
            />
          </Field>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit">Create workspace</Button>
            <Link href="/admin/apps/hermes-workspaces">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
