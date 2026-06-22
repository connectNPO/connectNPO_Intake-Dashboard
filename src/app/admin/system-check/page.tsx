import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';

type CheckStatus = 'ok' | 'warning';

type SystemCheck = {
  label: string;
  status: CheckStatus;
  detail: string;
};

function isConfigured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function configuredCheck(label: string, envName: string, detail: string): SystemCheck {
  const configured = isConfigured(envName);
  return {
    label,
    status: configured ? 'ok' : 'warning',
    detail: configured ? detail : `Missing ${envName}`,
  };
}

export default function SystemCheckPage() {
  const checks: SystemCheck[] = [
    configuredCheck(
      'Public site URL',
      'NEXT_PUBLIC_SITE_URL',
      'Used to build intake and email links.',
    ),
    configuredCheck(
      'Supabase URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'Required for auth and database access.',
    ),
    configuredCheck(
      'Supabase anon key',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'Required for browser and server Supabase clients.',
    ),
    configuredCheck(
      'Supabase service role key',
      'SUPABASE_SERVICE_ROLE_KEY',
      'Required for admin-side service operations.',
    ),
    configuredCheck(
      'Resend API key',
      'RESEND_API_KEY',
      'Required to send request-review notification emails.',
    ),
    configuredCheck(
      'Resend from email',
      'RESEND_FROM_EMAIL',
      'Required to send request-review notification emails.',
    ),
    configuredCheck(
      'Turnstile site key',
      'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
      'Required for public request-review spam protection.',
    ),
    configuredCheck(
      'Turnstile secret key',
      'TURNSTILE_SECRET_KEY',
      'Required to verify public request-review submissions.',
    ),
  ];

  const warnings = checks.filter((check) => check.status === 'warning').length;

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

      <Card className="flex flex-col gap-4">
        <div className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-4 py-3 text-sm text-muted">
          {warnings === 0
            ? 'All required configuration checks passed.'
            : `${warnings} configuration item${warnings === 1 ? '' : 's'} need attention.`}
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {checks.map((check) => (
            <li
              key={check.label}
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
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
