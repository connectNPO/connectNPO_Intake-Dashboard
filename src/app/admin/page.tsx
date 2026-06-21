import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import type { Organization } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizations')
    .select(
      'id, name, website_url, contact_email, status, created_at, submitted_at',
    )
    .order('created_at', { ascending: false });

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-main">Organizations</h1>
          <p className="mt-1 text-sm text-muted">
            Review nonprofit intake submissions and track their status.
          </p>
        </div>
        <Link href="/admin/organizations/new">
          <Button>New Organization</Button>
        </Link>
      </div>

      {error && (
        <Card className="border-[#eccaca] bg-[#f7e3e3]">
          <p className="text-sm text-danger">
            We couldn’t load organizations. Please check your Supabase
            configuration and try again.
          </p>
        </Card>
      )}

      {!error && organizations.length === 0 && (
        <EmptyState
          title="No organizations yet"
          description="Create your first organization to generate a private intake link you can share."
          action={
            <Link href="/admin/organizations/new">
              <Button>New Organization</Button>
            </Link>
          }
        />
      )}

      {organizations.length > 0 && (
        <Card className="overflow-hidden p-0">
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
                    className="border-b border-border last:border-0 hover:bg-[#faf9f5]"
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
