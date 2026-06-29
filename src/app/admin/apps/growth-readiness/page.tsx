import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import type { Organization } from '@/lib/types';

export const dynamic = 'force-dynamic';

type OrgRow = Pick<
  Organization,
  | 'id'
  | 'name'
  | 'website_url'
  | 'contact_email'
  | 'status'
  | 'created_at'
  | 'submitted_at'
>;

type AppAction = {
  href: string;
  label: string;
  description: string;
  target?: string;
};

const appActions: AppAction[] = [
  {
    href: '/admin/organizations/new',
    label: 'New intake',
    description: 'Create a private intake link for a nonprofit.',
  },
  {
    href: '/request-review',
    label: 'Public request form',
    description: 'Send the public request page to a prospective nonprofit.',
    target: '_blank',
  },
  {
    href: '/admin/operations-checklist',
    label: 'Checklist',
    description: 'E2E operations checklist for rehearsing the workflow.',
  },
];

export default async function GrowthReadinessAppPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const { archived } = await searchParams;
  const showArchived = archived === '1';
  const supabase = await createClient();
  let query = supabase
    .from('organizations')
    .select(
      'id, name, website_url, contact_email, status, created_at, submitted_at',
    )
    .order('updated_at', { ascending: false });

  query = showArchived ? query.eq('status', 'archived') : query.neq('status', 'archived');

  const { data, error } = await query;

  const organizations = (data ?? []) as OrgRow[];

  const submittedCount = organizations.filter((org) => org.submitted_at).length;
  const awaitingCount = organizations.length - submittedCount;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Growth Readiness
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-main">
            {showArchived ? 'Archived organizations' : 'Organizations'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {showArchived
              ? 'Organizations you have archived. Restore one to bring it back into the active list.'
              : 'Track nonprofit intakes from invitation through report-ready handoff.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={showArchived ? '/admin/apps/growth-readiness' : '/admin/apps/growth-readiness?archived=1'}>
            <Button variant="secondary" size="sm">
              {showArchived ? 'View active' : 'View archived'}
            </Button>
          </Link>
          {!showArchived && (
            <Link href="/admin/organizations/new">
              <Button size="sm">New organization</Button>
            </Link>
          )}
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <AppActionTile {...appActions[0]} />
        <AppActionTile {...appActions[1]} />
        <AppActionTile {...appActions[2]} />
      </section>

      {!error && organizations.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile
            label={showArchived ? 'Archived' : 'In view'}
            value={organizations.length}
          />
          <StatTile label="Submitted" value={submittedCount} />
          <StatTile
            label={showArchived ? 'Never submitted' : 'Awaiting submission'}
            value={awaitingCount}
          />
        </div>
      )}

      {error && (
        <Card className="border-[#b53333]/30 bg-[#b53333]/10">
          <p className="text-sm text-danger">
            We couldn’t load organizations. Please check your Supabase
            configuration and try again.
          </p>
        </Card>
      )}

      {!error && organizations.length === 0 && (
        <EmptyState
          title={showArchived ? 'No archived organizations' : 'No organizations yet'}
          description={
            showArchived
              ? 'Archived organizations will appear here after you archive them.'
              : 'Create your first organization to generate a private intake link you can share.'
          }
          action={
            showArchived ? (
              <Link href="/admin/apps/growth-readiness">
                <Button>View active organizations</Button>
              </Link>
            ) : (
              <Link href="/admin/organizations/new">
                <Button>New organization</Button>
              </Link>
            )
          }
        />
      )}

      {organizations.length > 0 && (
        <Card className="overflow-hidden p-0">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr
                    key={org.id}
                    className="border-b border-border last:border-0 hover:bg-primary-soft/40"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-main">{org.name}</div>
                      {org.website_url && (
                        <div className="truncate text-xs text-muted">
                          {org.website_url}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {org.contact_email ?? '—'}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={org.status} />
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {formatDate(org.created_at)}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {formatDate(org.submitted_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-border md:hidden">
            {organizations.map((org) => (
              <li key={org.id}>
                <Link
                  href={`/admin/organizations/${org.id}`}
                  className="flex flex-col gap-2 p-4 hover:bg-primary-soft/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-main">{org.name}</span>
                    <StatusBadge status={org.status} />
                  </div>
                  <div className="text-xs text-muted">
                    {org.contact_email ?? 'No contact email'}
                  </div>
                  <div className="text-xs text-muted">
                    Created {formatDate(org.created_at)} · Submitted{' '}
                    {formatDate(org.submitted_at)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[5px] border border-border bg-surface px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-1 font-editorial text-2xl text-main">{value}</p>
    </div>
  );
}

function AppActionTile({ href, label, description, target }: AppAction) {
  return (
    <Link
      href={href}
      target={target}
      className="group block rounded-[5px] border border-border bg-surface px-4 py-3 transition hover:border-primary/40"
    >
      <p className="text-sm font-semibold text-main group-hover:text-primary">{label}</p>
      <p className="mt-1 text-xs text-muted">{description}</p>
    </Link>
  );
}
