import { INTAKE_SECTIONS } from '@/lib/intake/questions';
import { statusLabel } from '@/lib/status';
import type { AdminNote, IntakeResponse, Organization } from '@/lib/types';

type PublicOrganization = Pick<
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
>;

type PublicAdminNote = Pick<AdminNote, 'note' | 'created_at'>;

type EvidenceStatus =
  | 'Found in intake'
  | 'Found on website'
  | 'Found in public source'
  | 'Not found'
  | 'Needs confirmation';

const READINESS_CATEGORIES = [
  'Executive Summary',
  'Evidence Snapshot',
  'Website Clarity',
  'Donor Trust',
  'Volunteer Readiness',
  'Transparency Signals',
  'SEO Readiness',
  'GEO / AI Search Readiness',
  'Grant Readiness',
  'Operations & Automation Opportunities',
  'Missing / Needs Confirmation',
  '30-Day Action Plan',
  '90-Day Action Plan',
  'Appendix: Evidence Log',
] as const;

const EVIDENCE_STATUSES: EvidenceStatus[] = [
  'Found in intake',
  'Found on website',
  'Found in public source',
  'Not found',
  'Needs confirmation',
];

function hasAnswer(response: IntakeResponse | undefined): boolean {
  if (!response) return false;
  const { answer } = response;
  if (answer === null || answer === undefined) return false;
  if (Array.isArray(answer)) return answer.length > 0;
  if (typeof answer === 'string') return answer.trim().length > 0;
  return true;
}

function buildIntakeSections(responses: IntakeResponse[]) {
  return INTAKE_SECTIONS.map((section) => {
    const questions = section.questions.map((question) => {
      const response = responses.find(
        (item) =>
          item.section_key === section.key && item.question_key === question.key,
      );

      return {
        question_key: question.key,
        question_label: question.label,
        required: Boolean(question.required),
        status: hasAnswer(response) ? 'Found in intake' : 'Not found',
        answer: response?.answer ?? null,
        evidence: response
          ? {
              source: 'intake_responses',
              response_id: response.id,
              updated_at: response.updated_at,
            }
          : null,
      };
    });

    return {
      section_key: section.key,
      section_title: section.title,
      questions,
      missing_required_questions: questions
        .filter((question) => question.required && question.status === 'Not found')
        .map((question) => ({
          question_key: question.question_key,
          question_label: question.question_label,
        })),
    };
  });
}

function buildResearchTargets(organization: PublicOrganization) {
  return {
    primary_website_url: organization.website_url,
    public_sources_to_check: [
      'Organization website',
      'About / mission page',
      'Programs / services pages',
      'Donate page',
      'Volunteer page',
      'Impact / annual report pages',
      'Blog / news / updates',
      'Search engine results for organization name',
      'Public social profiles if linked from website',
      'Public grant/funder or partner mentions if discoverable',
    ],
    analysis_focus: [
      'website clarity',
      'donor trust signals',
      'volunteer path clarity',
      'grant readiness signals',
      'SEO basics',
      'GEO / AI-search discoverability',
      'automation opportunities',
    ],
  };
}

export function buildGrowthReadinessAgentPacket({
  organization,
  responses,
  notes,
}: {
  organization: PublicOrganization;
  responses: IntakeResponse[];
  notes: PublicAdminNote[];
}) {
  return {
    packet_version: 'growth-readiness-agent-packet/v1',
    generated_at: new Date().toISOString(),
    purpose:
      'Source packet for connectNPO Growth Readiness Report drafting. Use for research, fact-checking, recommendations, and human review preparation.',
    safety_rules: {
      human_final_review_required: true,
      do_not_auto_send_to_client: true,
      avoid_sensitive_data: true,
      do_not_invent_claims: true,
      mark_uncertain_items_as: 'Needs confirmation',
    },
    evidence_framework: {
      allowed_statuses: EVIDENCE_STATUSES,
      required_fields_for_findings: [
        'status',
        'evidence_or_source_url',
        'finding',
        'recommendation',
        'priority',
      ],
      priority_values: ['High', 'Medium', 'Low'],
    },
    report_scope: {
      report_name: 'Growth Readiness Report',
      template_reference: 'docs/GROWTH_READINESS_REPORT_TEMPLATE.md',
      categories: READINESS_CATEGORIES,
      target_outcome:
        'Help the nonprofit become clearer, more trustworthy, more discoverable, and easier to support.',
      writing_tone:
        'Public-facing English: warm, plain, practical, supportive but honest, and grounded in evidence.',
      output_contract: {
        format: 'Markdown draft for human review',
        every_finding_requires: [
          'Status',
          'Evidence / Source URL',
          'Finding',
          'Recommendation',
          'Priority',
        ],
        executive_summary_rule:
          'Write after analysis sections are complete; do not introduce new claims.',
        human_review_label: 'DRAFT — requires connectNPO human review before delivery',
      },
    },
    organization: {
      id: organization.id,
      name: organization.name,
      website_url: organization.website_url,
      contact_role: organization.contact_role,
      location: [organization.city, organization.state].filter(Boolean).join(', ') || null,
      service_area: organization.service_area,
      organization_category: organization.organization_category,
      nonprofit_status: organization.nonprofit_status,
      annual_budget_range: organization.annual_budget_range,
      workflow_status: organization.status,
      workflow_status_label: statusLabel(organization.status),
      submitted_at: organization.submitted_at,
      created_at: organization.created_at,
      updated_at: organization.updated_at,
    },
    research_targets: buildResearchTargets(organization),
    intake: {
      source: 'Supabase intake_responses',
      sections: buildIntakeSections(responses),
    },
    internal_admin_notes: notes.map((note) => ({
      note: note.note,
      created_at: note.created_at,
      status: 'Needs confirmation' as EvidenceStatus,
    })),
    agent_handoff: {
      next_recommended_agents: [
        'connectnpo-research-agent',
        'connectnpo-fact-check-agent',
        'connectnpo-report-writer-agent',
        'connectnpo-qa-review-agent',
      ],
      first_next_step:
        'Crawl and review the organization website, then create evidence entries using the allowed statuses before drafting recommendations.',
    },
  };
}
