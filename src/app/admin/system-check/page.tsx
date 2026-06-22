import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';

type CheckStatus = 'ok' | 'warning';

type SystemCheck = {
  label: string;
  envName: string;
  status: CheckStatus;
  detail: string;
  nextAction: string;
};

type CheckGroup = {
  title: string;
  description: string;
  checks: SystemCheck[];
};

function isConfigured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function configuredCheck(
  label: string,
  envName: string,
  detail: string,
  nextAction: string,
): SystemCheck {
  const configured = isConfigured(envName);
  return {
    label,
    envName,
    status: configured ? 'ok' : 'warning',
    detail: configured ? detail : `Missing ${envName}`,
    nextAction: configured ? 'No action needed.' : nextAction,
  };
}

export default function SystemCheckPage() {
  const groups: CheckGroup[] = [
    {
      title: 'Core app',
      description: 'Required for login, admin pages, intake links, and database access.',
      checks: [
        configuredCheck(
          'Public site URL',
          'NEXT_PUBLIC_SITE_URL',
          'Used to build intake and email links.',
          'Set NEXT_PUBLIC_SITE_URL to the production website origin, then redeploy.',
        ),
        configuredCheck(
          'Supabase URL',
          'NEXT_PUBLIC_SUPABASE_URL',
          'Required for auth and database access.',
          'Add the Supabase project URL in the app environment settings.',
        ),
        configuredCheck(
          'Supabase anon key',
          'NEXT_PUBLIC_SUPABASE_ANON_KEY',
          'Required for browser and server Supabase clients.',
          'Add the public Supabase anon key in the app environment settings.',
        ),
        configuredCheck(
          'Supabase service role key',
          'SUPABASE_SERVICE_ROLE_KEY',
          'Required for admin-side service operations.',
          'Add the service role key only as a server-side secret; never expose it in browser code.',
        ),
      ],
    },
    {
      title: 'Email & request review',
      description: 'Required for the public request-review flow to notify connectNPO.',
      checks: [
        configuredCheck(
          'Resend API key',
          'RESEND_API_KEY',
          'Required to send request-review notification emails.',
          'Add RESEND_API_KEY in the deployment environment and send a test request.',
        ),
        configuredCheck(
          'Resend from email',
          'RESEND_FROM_EMAIL',
          'Required to send request-review notification emails.',
          'Set RESEND_FROM_EMAIL to a verified sender address in Resend.',
        ),
      ],
    },
    {
      title: 'Spam protection',
      description: 'Required to keep the public request-review form protected from bots.',
      checks: [
        configuredCheck(
          'Turnstile site key',
          'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
          'Required for public request-review spam protection.',
          'Add the public Turnstile site key for the production domain.',
        ),
        configuredCheck(
          'Turnstile secret key',
          'TURNSTILE_SECRET_KEY',
          'Required to verify public request-review submissions.',
          'Add the Turnstile secret key as a server-side secret, then test the form.',
        ),
      ],
    },
  ];

  const checks = groups.flatMap((group) => group.checks);
  const warnings = checks.filter((check) => check.status === 'warning').length;
  const configured = checks.length - warnings;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-main">
          ← Back to organizations
        </Link>
        <div className="mt-2">
          <SectionHeader
            title="System Check"
            description="Quick operator check for required configuration. Secret values are never displayed."
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Configured" value={`${configured} / ${checks.length}`} />
        <MetricCard label="Needs setup" value={String(warnings)} tone={warnings > 0 ? 'warning' : 'ok'} />
        <MetricCard label="Secret values" value="Hidden" />
      </div>

      <Card className="flex flex-col gap-3 border-dashed">
        <p className="text-sm font-semibold text-main">
          {warnings === 0
            ? 'All required configuration checks passed.'
            : `${warnings} configuration item${warnings === 1 ? '' : 's'} need attention.`}
        </p>
        <p className="text-sm leading-6 text-muted">
          Next action: {warnings === 0
            ? 'Run a public request-review test and confirm the notification email arrives.'
            : 'Fix the items marked Needs setup, redeploy, then run this page again.'}
        </p>
      </Card>

      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <Card key={group.title} className="flex flex-col gap-4">
            <SectionHeader title={group.title} description={group.description} />
            <ul className="grid gap-3 md:grid-cols-2">
              {group.checks.map((check) => (
                <li
                  key={check.envName}
                  className="rounded-[7px] border border-border bg-[#faf9f5] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-main">{check.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        check.status === 'ok'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {check.status === 'ok' ? 'Configured' : 'Needs setup'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{check.detail}</p>
                  <p className="mt-2 text-xs text-muted">
                    <span className="font-medium text-main">Next action:</span> {check.nextAction}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = 'ok',
}: {
  label: string;
  value: string;
  tone?: 'ok' | 'warning';
}) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={tone === 'warning' ? 'text-2xl font-semibold text-danger' : 'text-2xl font-semibold text-main'}>
        {value}
      </p>
    </Card>
  );
}
