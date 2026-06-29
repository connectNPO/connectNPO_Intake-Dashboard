import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

type AppCard = {
  title: string;
  description: string;
  href: string;
  eyebrow: string;
  status: 'live' | 'planned';
  action: string;
};

const apps: AppCard[] = [
  {
    title: 'Growth Readiness',
    description: 'Manage nonprofit requests, intake submissions, and report-ready handoffs.',
    href: '/admin/apps/growth-readiness',
    eyebrow: 'Intake app',
    status: 'live',
    action: 'Open intake dashboard',
  },
  {
    title: 'Client Hermes Workspaces',
    description: 'Future home for dedicated client VPS/Hermes workspace monitoring.',
    href: '#client-hermes-workspaces',
    eyebrow: 'Managed AI',
    status: 'planned',
    action: 'Coming soon',
  },
  {
    title: 'Website Review',
    description: 'Future app for nonprofit website diagnosis and improvement plans.',
    href: '#website-review',
    eyebrow: 'Audit app',
    status: 'planned',
    action: 'Coming soon',
  },
  {
    title: 'Content Support',
    description: 'Future app for donor emails, newsletters, social posts, and campaign copy.',
    href: '#content-support',
    eyebrow: 'Content app',
    status: 'planned',
    action: 'Coming soon',
  },
];

export default async function AdminPlatformHome() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizations')
    .select('id, status, submitted_at')
    .neq('status', 'archived');

  const organizations = data ?? [];
  const activeCount = organizations.length;
  const submittedCount = organizations.filter((org) => org.submitted_at).length;
  const awaitingCount = activeCount - submittedCount;

  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              connectNPO Operations
            </p>
            <h1 className="mt-2 font-editorial text-3xl text-main md:text-[2.5rem]">
              Main operations dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted md:text-base">
              A central place to manage connectNPO apps, nonprofit clients, reports,
              and future managed Hermes workspaces.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/apps/growth-readiness">
              <Button>Open Growth Readiness</Button>
            </Link>
            <Link href="/request-review" target="_blank">
              <Button variant="secondary">Public request form</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Active organizations" value={error ? '—' : activeCount} />
        <MetricCard label="Submitted intakes" value={error ? '—' : submittedCount} />
        <MetricCard label="Awaiting submission" value={error ? '—' : awaitingCount} />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Apps
          </p>
          <h2 className="mt-1 text-xl font-semibold text-main">Workspace modules</h2>
          <p className="mt-1 text-sm text-muted">
            Growth Readiness is live now. The other modules define the platform direction.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {apps.map((app) => (
            <AppModuleCard key={app.title} app={app} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Recommended next step
          </p>
          <h2 className="mt-2 text-lg font-semibold text-main">
            Keep intake work inside Growth Readiness
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use the main dashboard as the connectNPO control center. Keep detailed nonprofit intake
            workflows inside the Growth Readiness app so future tools can be added without making
            the admin home crowded.
          </p>
          <div className="mt-4">
            <Link href="/admin/apps/growth-readiness">
              <Button variant="secondary" size="sm">Go to intake dashboard</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            System
          </p>
          <h2 className="mt-2 text-lg font-semibold text-main">Operational checks</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use system checks and workflow docs before sending customer links or launching new modules.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/system-check">
              <Button variant="secondary" size="sm">System check</Button>
            </Link>
            <Link href="/admin/operations-checklist">
              <Button variant="ghost" size="sm">Checklist</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-soft)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-1 font-editorial text-2xl text-main">{value}</p>
    </div>
  );
}

function AppModuleCard({ app }: { app: AppCard }) {
  const isLive = app.status === 'live';
  const content = (
    <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_50px_rgba(73,55,43,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            {app.eyebrow}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-main">{app.title}</h3>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${
            isLive
              ? 'border-primary/30 bg-primary-soft text-primary'
              : 'border-border bg-background text-muted'
          }`}
        >
          {isLive ? 'Live' : 'Planned'}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{app.description}</p>
      <p className="mt-5 text-sm font-medium text-primary">{app.action} →</p>
    </Card>
  );

  if (!isLive) {
    return (
      <div id={app.href.replace('#', '')} aria-disabled="true">
        {content}
      </div>
    );
  }

  return <Link href={app.href}>{content}</Link>;
}
