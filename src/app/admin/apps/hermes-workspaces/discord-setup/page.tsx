import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

const CODE_BLOCK_CLASS =
  'block overflow-x-auto rounded-[5px] border border-[#374151] bg-[#111827] px-3 py-2 font-mono text-xs text-[#f9fafb]';

function Code({ children }: { children: React.ReactNode }) {
  return <code className={CODE_BLOCK_CLASS}>{children}</code>;
}

export default function DiscordSetupGuidePage() {
  return (
    <div className="flex w-full max-w-none flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/apps/hermes-workspaces"
          className="text-sm text-muted hover:text-main"
        >
          ← Back to Hermes Operations HQ
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-main">Discord setup</h1>
            <p className="mt-1 text-sm text-muted">
              Create the bot in Discord, save the token on the VPS, then restart
              and test.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/apps/hermes-workspaces/new">
              <Button size="sm">New profile record</Button>
            </Link>
            <Link href="/admin/apps/hermes-workspaces">
              <Button size="sm" variant="secondary">
                Back to Hermes Ops
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="flex flex-col gap-3 p-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Step 1
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-main">
              User does this in Discord
            </h2>
          </div>
          <ul className="flex flex-col gap-1.5 text-sm text-main">
            <li className="flex gap-2">
              <span className="text-muted">☐</span>
              <span>Create application in Discord Developer Portal</span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted">☐</span>
              <span>Add bot</span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted">☐</span>
              <span>
                Enable <span className="font-mono text-xs">Message Content Intent</span>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted">☐</span>
              <span>
                Enable <span className="font-mono text-xs">Server Members Intent</span>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted">☐</span>
              <span>Invite bot to server</span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted">☐</span>
              <span>Copy Channel ID</span>
            </li>
          </ul>
          <p className="rounded-[5px] border border-[#eccaca] bg-[#f7e3e3] px-2.5 py-2 text-xs text-danger">
            Do not paste the bot token into this dashboard or chat.
          </p>
        </Card>

        <Card className="flex flex-col gap-3 p-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Step 2
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-main">
              Save on VPS
            </h2>
          </div>
          <ol className="flex flex-col gap-2 text-sm text-main">
            <li className="flex flex-col gap-1">
              <span>Find the profile&apos;s env file:</span>
              <Code>hermes --profile &lt;profile&gt; config env-path</Code>
            </li>
            <li>Open the shown <span className="font-mono text-xs">.env</span> file on VPS.</li>
            <li className="flex flex-col gap-1">
              <span>Add or update:</span>
              <Code>DISCORD_BOT_TOKEN=...</Code>
            </li>
            <li>Add or update allowed user/channel settings if needed.</li>
          </ol>
          <p className="rounded-[5px] border border-[#f0e2a6] bg-[#fff8e1] px-2.5 py-2 text-xs text-[#8a6d1f]">
            Token stays only in the VPS .env.
          </p>
        </Card>

        <Card className="flex flex-col gap-3 p-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Step 3
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-main">
              Restart and test
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <Code>
              systemctl --user restart hermes-gateway-&lt;profile&gt;.service
            </Code>
            <Code>
              systemctl --user status hermes-gateway-&lt;profile&gt;.service
            </Code>
            <Code>
              journalctl --user -u hermes-gateway-&lt;profile&gt;.service -n 80 --no-pager
            </Code>
          </div>
          <p className="text-sm text-main">
            Then send a test message in the Discord channel.
          </p>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Card className="flex flex-col gap-2 p-4">
          <h3 className="text-sm font-semibold text-main">What I can check</h3>
          <ul className="flex flex-col gap-1 text-sm text-muted">
            <li>· Gateway status and logs</li>
            <li>· <span className="font-mono text-xs">config.yaml</span> allowed / free response channels</li>
            <li>· Channel ID recorded in profile</li>
            <li>· Test result troubleshooting</li>
          </ul>
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <h3 className="text-sm font-semibold text-main">What you must do</h3>
          <ul className="flex flex-col gap-1 text-sm text-muted">
            <li>· Create Discord app and bot</li>
            <li>· Enable intents</li>
            <li>· Invite bot</li>
            <li>· Save token in VPS <span className="font-mono text-xs">.env</span></li>
          </ul>
        </Card>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
        <Link href="/admin/apps/hermes-workspaces/new">
          <Button size="sm">New profile record</Button>
        </Link>
        <Link href="/admin/apps/hermes-workspaces">
          <Button size="sm" variant="secondary">
            Back to Hermes Ops
          </Button>
        </Link>
      </div>
    </div>
  );
}
