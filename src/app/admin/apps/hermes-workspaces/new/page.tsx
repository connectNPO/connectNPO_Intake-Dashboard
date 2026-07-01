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
    <div className="flex w-full max-w-none flex-col gap-5">
      <div>
        <Link
          href="/admin/apps/hermes-workspaces"
          className="text-sm text-muted hover:text-main"
        >
          ← Back to Hermes Operations HQ
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-main">
          New Hermes profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Create the record first, then copy the VPS commands.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-[5px] border border-[#eccaca] bg-[#f7e3e3] px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </div>
      )}

      <form action={createHermesWorkspace} className="flex flex-col gap-5">
        <input type="hidden" name="workspace_type" value="internal" />
        <input type="hidden" name="environment" value="internal" />
        <input type="hidden" name="isolation_model" value="dedicated_vps" />
        <input type="hidden" name="status" value="setup" />
        <input type="hidden" name="support_status" value="needs_setup" />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="flex flex-col gap-4 p-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                Step 1
              </p>
              <h2 className="text-base font-semibold text-main">Purpose</h2>
            </div>

            <Field htmlFor="client_name" label="Display name" required>
              <Input
                id="client_name"
                name="client_name"
                placeholder="e.g. Test Discord Bot"
                required
              />
            </Field>

            <Field htmlFor="organization" label="Organization">
              <Select
                id="organization"
                name="organization"
                defaultValue="connectnpo"
              >
                <option value="connectnpo">connectNPO</option>
                <option value="givingarc">GivingArc</option>
                <option value="wife_cpa">NPO Accounting</option>
                <option value="client">Client</option>
                <option value="internal">Internal</option>
              </Select>
            </Field>

            <Field htmlFor="purpose" label="Purpose">
              <Select id="purpose" name="purpose" defaultValue="dashboard">
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

            <p className="text-xs text-muted">
              Leave the next two fields blank unless you need a custom name.
            </p>

            <Field
              htmlFor="workspace_key"
              label="Profile key"
              helper="Optional. Leave blank to auto-create from display name."
            >
              <Input
                id="workspace_key"
                name="workspace_key"
                placeholder="leave blank for auto-create"
              />
            </Field>

            <Field
              htmlFor="hermes_profile"
              label="Hermes profile"
              helper="Optional. Leave blank to use profile key."
            >
              <Input
                id="hermes_profile"
                name="hermes_profile"
                placeholder="leave blank to use profile key"
              />
            </Field>

            <Field
              htmlFor="soul_md_content"
              label="SOUL.md"
              helper="Optional. Paste the profile instructions here. No secrets."
            >
              <Textarea
                id="soul_md_content"
                name="soul_md_content"
                rows={5}
                placeholder={`# Role\nYou are...\n\n# Style\n...`}
                className="font-mono text-xs"
              />
            </Field>
          </Card>

          <Card className="flex flex-col gap-4 p-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                Step 2
              </p>
              <h2 className="text-base font-semibold text-main">Discord</h2>
              <p className="mt-1 text-xs text-muted">
                Token stays on VPS .env — never paste it here.
              </p>
            </div>

            <Field htmlFor="discord_server_name" label="Server name">
              <Input
                id="discord_server_name"
                name="discord_server_name"
                placeholder="e.g. NPOBot"
              />
            </Field>

            <Field htmlFor="discord_channel_name" label="Channel name">
              <Input
                id="discord_channel_name"
                name="discord_channel_name"
                placeholder="e.g. #test-bot"
              />
            </Field>

            <Field
              htmlFor="discord_channel_id"
              label="Channel ID"
              helper="Developer Mode → right-click channel → Copy Channel ID."
            >
              <Input
                id="discord_channel_id"
                name="discord_channel_id"
                placeholder="e.g. 123456789012345678"
              />
            </Field>

            <Field htmlFor="discord_bot_name" label="Bot display name">
              <Input
                id="discord_bot_name"
                name="discord_bot_name"
                placeholder="e.g. TestBot"
              />
            </Field>
          </Card>

          <Card className="flex flex-col gap-4 p-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                Step 3
              </p>
              <h2 className="text-base font-semibold text-main">
                VPS commands
              </h2>
              <p className="mt-1 text-xs text-muted">
                After saving, open the detail page for exact commands.
              </p>
            </div>

            <Field
              htmlFor="service_name"
              label="Gateway service name"
              helper="Optional. Leave blank to auto-create hermes-gateway-<profile>.service."
            >
              <Input
                id="service_name"
                name="service_name"
                placeholder="leave blank for auto-create"
              />
            </Field>

            <Field htmlFor="dashboard_port" label="Dashboard port">
              <Input
                id="dashboard_port"
                name="dashboard_port"
                type="number"
                min={1}
                max={65535}
                placeholder="optional, e.g. 9119"
              />
            </Field>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-main">Example commands</p>
              <CommandLine command="hermes profile create <profile-key>" />
              <CommandLine command="hermes --profile <profile-key> gateway install" />
              <CommandLine command="hermes --profile <profile-key> gateway start" />
              <CommandLine command="systemctl --user status hermes-gateway-<profile-key>.service" />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <Button type="submit">Create profile record</Button>
              <Link href="/admin/apps/hermes-workspaces">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

function CommandLine({ command }: { command: string }) {
  return (
    <code className="block break-all rounded-[5px] border border-[#374151] bg-[#111827] px-2.5 py-1.5 font-mono text-[11px] leading-5 text-[#f9fafb]">
      {command}
    </code>
  );
}
