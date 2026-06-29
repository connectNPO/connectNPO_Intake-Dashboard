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
import { getAgentPacketFilename } from '@/lib/agent-packet-filename';
import { formatDate, formatAnswer } from '@/lib/format';
import type { AdminNote, IntakeResponse, Organization, OrganizationStatus } from '@/lib/types';
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
  const nextOperatorStep = getNextOperatorStep(organization.status);
  const agentPacketFilename = getAgentPacketFilename(organization.name);

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
        <Link href="/admin/apps/growth-readiness" className="text-sm text-muted hover:text-main">
          ← Back to organizations
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-main">
            {organization.name}
          </h1>
          <StatusBadge status={organization.status} />
        </div>
      </div>

      <Card className="flex flex-col gap-2 border-primary/20 bg-primary-soft/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Current status</p>
            <p className="text-sm font-semibold text-main">{statusLabel(organization.status)}</p>
          </div>
          <span className="rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary">
            Next operator step
          </span>
        </div>
        <div>
          <p className="text-base font-semibold text-main">{nextOperatorStep.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{nextOperatorStep.description}</p>
        </div>
      </Card>

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
              description="Evidence-first JSON that Hermes/Claude Code can use to draft a Growth Advisor Report."
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
              <p className="font-medium text-main">Report drafting resources</p>
              <p className="mt-1">
                These are internal instructions for Hermes/Claude Code. Operators usually ask Hermes to draft the report instead of copying prompts manually.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  href="/admin/report-template"
                  className="inline-flex text-primary hover:underline"
                >
                  Report structure
                </Link>
                <Link
                  href="/admin/research-agent-prompt"
                  className="inline-flex text-primary hover:underline"
                >
                  Website research instructions
                </Link>
                <Link
                  href="/admin/report-writer-prompt"
                  className="inline-flex text-primary hover:underline"
                >
                  Report drafting instructions
                </Link>
              </div>
            </div>
          </Card>

          {/* Report workflow */}
          <Card className="flex flex-col gap-4">
            <SectionHeader
              title="Report workflow"
              description="MVP workflow: operator reviews intake, asks Hermes to draft, then approves the client-ready link."
            />
            <ol className="flex flex-col gap-3 text-sm">
              <WorkflowStep
                status="Ready"
                title="Review intake and packet"
                description="Confirm responses, missing answers, admin notes, and the Download JSON packet before report work starts."
              />
              <WorkflowStep
                status="Next"
                title="Ask Hermes to draft the report"
                description="Tell Hermes: “Create a Growth Advisor Report for this organization.” Hermes will direct Claude Code to research and draft from the packet."
              />
              <WorkflowStep
                status="Required"
                title="Hermes reviews the draft"
                description="Hermes checks the category order, evidence, risky wording, missing context, and whether the report avoids legal/tax/accounting advice."
              />
              <WorkflowStep
                status="Required"
                title="Human approval before client link"
                description="Jay reviews the browser preview. Only after approval should a client-ready report link be created and sent."
              />
            </ol>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <span className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-3 py-2 text-center text-muted">
                Draft automation button — later
              </span>
              <span className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-3 py-2 text-center text-muted">
                API/job queue — later when needed
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

function getNextOperatorStep(status: OrganizationStatus): {
  title: string;
  description: string;
} {
  switch (status) {
    case 'draft_created':
      return {
        title: 'Send or copy the private intake link.',
        description:
          'Confirm the organization summary, then share the private intake link with the nonprofit contact.',
      };
    case 'intake_sent':
      return {
        title: 'Wait for the nonprofit to complete intake.',
        description:
          'Keep the record active. If the contact asks for help, use the private intake link card to reopen or copy the link.',
      };
    case 'email_failed':
      return {
        title: 'Fix delivery before continuing.',
        description:
          'Check the contact email, Resend configuration, and internal notes before resending or manually sharing the intake link.',
      };
    case 'in_progress':
      return {
        title: 'Monitor intake progress.',
        description:
          'The organization has started but not submitted. Follow up only if the intake has been idle too long.',
      };
    case 'submitted':
      return {
        title: 'Review the agent packet and missing answers.',
        description:
          'Open the packet preview, confirm required answers are present, add internal notes, then move to Under review or Needs clarification.',
      };
    case 'under_review':
      return {
        title: 'Complete human review before report work.',
        description:
          'Check responses, notes, public website context, and packet quality. Move to Ready for report only after the packet is safe to use.',
      };
    case 'needs_clarification':
      return {
        title: 'Request clarification before report work.',
        description:
          'Add an internal note describing what is missing, then contact the nonprofit manually. Do not draft a report yet.',
      };
    case 'ready_for_report':
      return {
        title: 'Prepare a human-reviewed report draft.',
        description:
          'Use the packet, report template, and report writer prompt. Keep the draft internal until a connectNPO reviewer signs off.',
      };
    case 'report_created':
      return {
        title: 'Follow up or archive when complete.',
        description:
          'Confirm any final reviewer notes, then decide whether this organization should stay active or move to the archive.',
      };
    case 'archived':
      return {
        title: 'Restore only if work should resume.',
        description:
          'Archived records are hidden from the default list. Restore this organization only when active follow-up is needed.',
      };
  }
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
