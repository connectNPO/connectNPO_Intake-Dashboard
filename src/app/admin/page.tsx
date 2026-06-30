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
    title: 'Hermes Operations HQ',
    description: 'Internal ops console for every Hermes workspace — connectNPO, GivingArc, Wife CPA, clients, and internal tooling.',
    href: '/admin/apps/hermes-workspaces',
    eyebrow: 'Internal operations',
    status: 'live',
    action: 'Open Hermes Operations HQ',
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
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-semibold text-main">Overview</h1>
          <p className="mt-0.5 text-sm text-muted">connectNPO platform home</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/apps/growth-readiness">
            <Button size="sm">Open Growth Readiness</Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Active organizations" value={error ? '—' : activeCount} />
        <MetricCard label="Submitted intakes" value={error ? '—' : submittedCount} />
        <MetricCard label="Awaiting submission" value={error ? '—' : awaitingCount} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold text-main">Apps</h2>
            <p className="mt-0.5 text-sm text-muted">
              Growth Readiness is live. Other modules define the platform direction.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {apps.map((app) => (
            <AppModuleCard key={app.title} app={app} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[5px] border border-border bg-surface px-4 py-3">
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
    <Card className="h-full transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            {app.eyebrow}
          </p>
          <h3 className="mt-2 text-base font-semibold text-main">{app.title}</h3>
        </div>
        <span
          className={`rounded-[5px] border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
            isLive
              ? 'border-primary/30 bg-primary-soft text-primary'
              : 'border-border bg-background text-muted'
          }`}
        >
          {isLive ? 'Live' : 'Planned'}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{app.description}</p>
      <p className="mt-4 text-sm font-medium text-primary">{app.action} →</p>
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
