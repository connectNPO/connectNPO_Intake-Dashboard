import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import type { Organization } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage({
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
    // Sort by most recent activity so newly submitted older intake links rise to the top.
    .order('updated_at', { ascending: false });

  query = showArchived ? query.eq('status', 'archived') : query.neq('status', 'archived');

  const { data, error } = await query;

  const organizations = (data ?? []) as Pick<
    Organization,
    | 'id'
    | 'name'
    | 'website_url'
    | 'contact_email'
    | 'status'
    | 'created_at'
    | 'submitted_at'
  >[];

  const submittedCount = organizations.filter((org) => org.submitted_at).length;
  const activeCount = organizations.filter((org) => org.status !== 'archived').length;

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-medium text-muted shadow-[0_0_0_1px_var(--ring)]">
              <span className="text-primary">✽</span>
              connectNPO Growth Readiness
            </div>
            <h1 className="font-editorial text-4xl leading-[1.05] text-main md:text-5xl">
              {showArchived ? 'Archived organizations' : 'Evening, Jay'}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted md:text-base">
              {showArchived
                ? 'Review organizations that have been archived and restore them if needed.'
                : 'Review nonprofit intake submissions, prepare advisor reports, and move approved reports into client-ready links.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={showArchived ? '/admin' : '/admin?archived=1'}>
              <Button variant="secondary">
                {showArchived ? 'View active' : 'View archived'}
              </Button>
            </Link>
            {!showArchived && (
              <Link href="/admin/organizations/new">
                <Button>New Organization</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-[var(--surface-elevated)] p-4 shadow-[0_0_0_1px_var(--ring)]">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Organizations</p>
            <p className="mt-3 font-editorial text-3xl text-main">{organizations.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-[var(--surface-elevated)] p-4 shadow-[0_0_0_1px_var(--ring)]">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Submitted</p>
            <p className="mt-3 font-editorial text-3xl text-main">{submittedCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-[var(--surface-elevated)] p-4 shadow-[0_0_0_1px_var(--ring)]">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Active</p>
            <p className="mt-3 font-editorial text-3xl text-main">{activeCount}</p>
          </div>
        </div>
      </section>

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
              <Link href="/admin">
                <Button>View active organizations</Button>
              </Link>
            ) : (
              <Link href="/admin/organizations/new">
                <Button>New Organization</Button>
              </Link>
            )
          }
        />
      )}

      {organizations.length > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-editorial text-2xl text-main">Organizations</h2>
              <p className="mt-1 text-sm text-muted">Latest nonprofit intake activity</p>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
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
                    className="border-b border-border last:border-0 hover:bg-primary-soft/60"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-main">{org.name}</div>
                      {org.website_url && (
                        <div className="text-xs text-muted">
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
              <li key={org.id} className="p-4">
                <Link
                  href={`/admin/organizations/${org.id}`}
                  className="flex flex-col gap-2"
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
