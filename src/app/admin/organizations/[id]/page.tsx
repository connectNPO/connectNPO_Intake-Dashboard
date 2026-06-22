import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CopyButton } from '@/components/ui/CopyButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { STATUS_ORDER, statusLabel } from '@/lib/status';
import { INTAKE_SECTIONS } from '@/lib/intake/questions';
import { formatDate, formatAnswer } from '@/lib/format';
import type { AdminNote, IntakeResponse, Organization } from '@/lib/types';
import { updateStatus, addNote, archiveOrganization, restoreOrganization } from './actions';

export const dynamic = 'force-dynamic';

async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}

export default async function OrganizationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ note_error?: string }>;
}) {
  const { id } = await params;
  const { note_error } = await searchParams;

  const supabase = await createClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!org) notFound();
  const organization = org as Organization;

  const { data: responseRows } = await supabase
    .from('intake_responses')
    .select('*')
    .eq('organization_id', id);
  const responses = (responseRows ?? []) as IntakeResponse[];

  const { data: noteRows } = await supabase
    .from('admin_notes')
    .select('*')
    .eq('organization_id', id)
    .order('created_at', { ascending: false });
  const notes = (noteRows ?? []) as AdminNote[];

  const baseUrl = await getBaseUrl();
  const intakeUrl = `${baseUrl}/intake/${organization.intake_token}`;
  const agentPacketFilename = `${organization.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'organization'}-agent-packet.json`;

  // Group responses by section, ordered by the question config.
  const responsesBySection = INTAKE_SECTIONS.map((section) => {
    const items = section.questions
      .map((q) => responses.find((r) => r.question_key === q.key && r.section_key === section.key))
      .filter((r): r is IntakeResponse => Boolean(r));
    return { section, items };
  }).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-main">
          ← Back to organizations
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-main">
            {organization.name}
          </h1>
          <StatusBadge status={organization.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: responses first, then compact summary */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Responses */}
          <Card className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionHeader
                title="Intake responses"
                description="Submitted answers are shown first so you do not have to scroll past organization details."
              />
            </div>
            {responsesBySection.length === 0 ? (
              <p className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-4 py-6 text-center text-sm text-muted">
                No responses yet. Responses will appear here after the
                organization submits the intake form.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {responsesBySection.map(({ section, items }) => (
                  <div key={section.key} className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-main">
                      {section.title}
                    </h3>
                    <dl className="flex flex-col gap-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[7px] border border-border bg-[#faf9f5] px-4 py-3"
                        >
                          <dt className="text-sm font-medium text-main">
                            {item.question_label}
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-muted">
                            {formatAnswer(item.answer)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column: intake link, status, export, notes */}
        <div className="flex flex-col gap-6">
          {/* Summary */}
          <Card className="flex flex-col gap-4 p-5">
            <SectionHeader title="Organization summary" />
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-1">
              <SummaryItem label="Website" value={organization.website_url} />
              <SummaryItem label="Contact" value={organization.contact_name} />
              <SummaryItem label="Email" value={organization.contact_email} />
              <SummaryItem label="Role" value={organization.contact_role} />
              <SummaryItem label="Location" value={[organization.city, organization.state].filter(Boolean).join(', ')} />
              <SummaryItem label="Service area" value={organization.service_area} />
              <SummaryItem label="Category" value={organization.organization_category} />
              <SummaryItem label="Budget" value={organization.annual_budget_range} />
              <SummaryItem label="Submitted" value={formatDate(organization.submitted_at)} />
            </dl>
          </Card>

          {/* Intake link */}
          <Card className="flex flex-col gap-3">
            <SectionHeader
              title="Private intake link"
              description="Share this link with the organization’s contact."
            />
            <p className="break-all rounded-[7px] border border-border bg-[#faf9f5] px-3.5 py-2.5 text-xs text-muted">
              {intakeUrl}
            </p>
            <div className="flex gap-2">
              <CopyButton value={intakeUrl} />
              <Link href={`/intake/${organization.intake_token}`} target="_blank">
                <Button variant="ghost" size="sm">
                  Open
                </Button>
              </Link>
            </div>
          </Card>

          {/* Status */}
          <Card className="flex flex-col gap-3">
            <SectionHeader title="Status" />
            <form action={updateStatus} className="flex flex-col gap-3">
              <input type="hidden" name="organization_id" value={organization.id} />
              <Field htmlFor="status" label="Update status">
                <Select
                  id="status"
                  name="status"
                  defaultValue={organization.status}
                >
                  {STATUS_ORDER.filter((s) => s !== 'archived').map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Button type="submit" variant="secondary" size="sm">
                Save status
              </Button>
            </form>
          </Card>

          {/* Agent packet */}
          <Card className="flex flex-col gap-3">
            <SectionHeader
              title="Agent packet"
              description="Evidence-first JSON for the future Growth Readiness Report workflow."
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                href={`/api/admin/organizations/${organization.id}/export`}
                download={agentPacketFilename}
              >
                <Button variant="secondary" size="sm" className="w-full">
                  Download JSON
                </Button>
              </Link>
              <Link href={`/admin/organizations/${organization.id}/agent-packet`}>
                <Button variant="secondary" size="sm" className="w-full">
                  Preview packet
                </Button>
              </Link>
            </div>
            <div className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-3 py-2 text-xs text-muted">
              <p className="font-medium text-main">Report template</p>
              <p className="mt-1">
                Use the internal Growth Readiness Report template when turning
                this packet into a human-reviewed draft.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  href="/admin/report-template"
                  className="inline-flex text-primary hover:underline"
                >
                  Open report template
                </Link>
                <Link
                  href="/admin/report-writer-prompt"
                  className="inline-flex text-primary hover:underline"
                >
                  Open report writer prompt
                </Link>
              </div>
            </div>
          </Card>

          {/* Report workflow */}
          <Card className="flex flex-col gap-4">
            <SectionHeader
              title="Report workflow"
              description="Preparation steps for a human-reviewed Growth Readiness Report."
            />
            <ol className="flex flex-col gap-3 text-sm">
              <WorkflowStep
                status="Ready"
                title="Agent packet"
                description="Intake answers, organization context, evidence rules, and report scope are ready for research."
              />
              <WorkflowStep
                status="Next"
                title="Website & public research"
                description="Future research agent should review the website, public sources, SEO/GEO visibility, donor trust signals, and grant readiness evidence."
              />
              <WorkflowStep
                status="Required"
                title="Fact-check log"
                description="Each finding should be labeled as found in intake, found on website, found in public source, not found, or needs confirmation."
              />
              <WorkflowStep
                status="Required"
                title="Human final review"
                description="A connectNPO reviewer should approve the draft before anything is delivered to the organization."
              />
            </ol>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <span className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-3 py-2 text-center text-muted">
                Research agent — future step
              </span>
              <span className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-3 py-2 text-center text-muted">
                Draft report — future step
              </span>
            </div>
          </Card>

          {/* Archive / restore */}
          <Card className="flex flex-col gap-3">
            <SectionHeader
              title={organization.status === 'archived' ? 'Restore organization' : 'Archive organization'}
              description={
                organization.status === 'archived'
                  ? 'Move this organization back to the active list.'
                  : 'Hide this organization from the default list without deleting its responses or notes.'
              }
            />
            {organization.status === 'archived' ? (
              <form action={restoreOrganization} className="flex flex-col gap-3">
                <input type="hidden" name="organization_id" value={organization.id} />
                <Button type="submit" variant="secondary" size="sm">
                  Restore to active list
                </Button>
              </form>
            ) : (
              <form action={archiveOrganization} className="flex flex-col gap-3">
                <input type="hidden" name="organization_id" value={organization.id} />
                <label className="flex items-start gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    name="confirm_archive"
                    required
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>I understand this will hide the organization from the default list.</span>
                </label>
                <Button type="submit" variant="ghost" size="sm">
                  Archive organization
                </Button>
              </form>
            )}
          </Card>

          {/* Notes */}
          <Card className="flex flex-col gap-4">
            <SectionHeader
              title="Internal notes"
              description="Only visible to connectNPO admins."
            />
            <form action={addNote} className="flex flex-col gap-2">
              <input type="hidden" name="organization_id" value={organization.id} />
              <Field htmlFor="note" label="Add a note">
                <Textarea
                  id="note"
                  name="note"
                  rows={3}
                  placeholder="Write an internal note…"
                />
              </Field>
              {note_error && (
                <p role="alert" className="text-sm text-danger">
                  {note_error}
                </p>
              )}
              <Button type="submit" variant="secondary" size="sm">
                Save note
              </Button>
            </form>

            {notes.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className="rounded-[7px] border border-border bg-[#faf9f5] px-3.5 py-3"
                  >
                    <p className="whitespace-pre-wrap text-sm text-main">
                      {n.note}
                    </p>
                    <p className="mt-1.5 text-xs text-muted">
                      {formatDate(n.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No notes yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-main">{value || '—'}</dd>
    </div>
  );
}

function WorkflowStep({
  status,
  title,
  description,
}: {
  status: string;
  title: string;
  description: string;
}) {
  return (
    <li className="rounded-[7px] border border-border bg-[#faf9f5] px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {status}
        </span>
        <span className="font-medium text-main">{title}</span>
      </div>
      <p className="mt-1.5 text-muted">{description}</p>
    </li>
  );
}
