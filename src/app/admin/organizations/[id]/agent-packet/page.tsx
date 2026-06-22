import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildGrowthReadinessAgentPacket } from '@/lib/agent-packet';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { AdminNote, IntakeResponse, Organization } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AgentPacketPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from('organizations')
    .select(
      'id, name, website_url, contact_role, city, state, service_area, organization_category, nonprofit_status, annual_budget_range, status, submitted_at, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle();

  if (!org) notFound();

  const { data: responseRows } = await supabase
    .from('intake_responses')
    .select('id, organization_id, section_key, question_key, question_label, answer, created_at, updated_at')
    .eq('organization_id', id);

  const { data: noteRows } = await supabase
    .from('admin_notes')
    .select('note, created_at')
    .eq('organization_id', id)
    .order('created_at', { ascending: false });

  const packet = buildGrowthReadinessAgentPacket({
    organization: org as Pick<
      Organization,
      | 'id'
      | 'name'
      | 'website_url'
      | 'contact_role'
      | 'city'
      | 'state'
      | 'service_area'
      | 'organization_category'
      | 'nonprofit_status'
      | 'annual_budget_range'
      | 'status'
      | 'submitted_at'
      | 'created_at'
      | 'updated_at'
    >,
    responses: (responseRows ?? []) as IntakeResponse[],
    notes: (noteRows ?? []) as Pick<AdminNote, 'note' | 'created_at'>[],
  });

  const intakeSections = packet.intake.sections;
  const totalQuestions = intakeSections.reduce(
    (count, section) => count + section.questions.length,
    0,
  );
  const answeredQuestions = intakeSections.reduce(
    (count, section) =>
      count + section.questions.filter((question) => question.status === 'Found in intake').length,
    0,
  );
  const missingRequiredQuestions = intakeSections.flatMap(
    (section) => section.missing_required_questions,
  );
  const packetJson = JSON.stringify(packet, null, 2);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/admin/organizations/${id}`}
          className="text-sm text-muted hover:text-main"
        >
          ← Back to organization
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Agent packet preview</p>
            <h1 className="text-2xl font-semibold text-main">{packet.organization.name}</h1>
          </div>
          <Link href={`/api/admin/organizations/${id}/export`} target="_blank">
            <Button variant="secondary" size="sm">
              Download JSON
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Answered questions" value={`${answeredQuestions} / ${totalQuestions}`} />
        <MetricCard label="Missing required" value={String(missingRequiredQuestions.length)} />
        <MetricCard label="Admin notes" value={String(packet.internal_admin_notes.length)} />
      </div>

      {missingRequiredQuestions.length > 0 && (
        <Card className="flex flex-col gap-3 border-danger/30 bg-[#fff8f6]">
          <SectionHeader
            title="Missing required intake answers"
            description="These should be resolved before drafting a Growth Readiness Report."
          />
          <ul className="flex flex-col gap-2 text-sm text-main">
            {missingRequiredQuestions.map((question) => (
              <li
                key={question.question_key}
                className="rounded-[7px] border border-danger/20 bg-white px-3 py-2"
              >
                {question.question_label}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="flex flex-col gap-3">
        <SectionHeader
          title="Packet summary"
          description="Quick human check before sending this packet into research or report drafting."
        />
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <SummaryItem label="Packet version" value={packet.packet_version} />
          <SummaryItem label="Workflow status" value={packet.organization.workflow_status_label} />
          <SummaryItem label="Website" value={packet.organization.website_url} />
          <SummaryItem label="Template" value={packet.report_scope.template_reference} />
        </dl>
      </Card>

      <Card className="flex flex-col gap-3">
        <SectionHeader
          title="Raw JSON preview"
          description="Visible to admins only. Contact email and private intake token are intentionally excluded."
        />
        <pre className="max-h-[640px] overflow-auto rounded-[7px] border border-border bg-[#1f2937] p-4 text-xs leading-relaxed text-[#f9fafb]">
          {packetJson}
        </pre>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="text-2xl font-semibold text-main">{value}</p>
    </Card>
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
    <div className="rounded-[7px] border border-border bg-[#faf9f5] px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-main">{value || '—'}</dd>
    </div>
  );
}
