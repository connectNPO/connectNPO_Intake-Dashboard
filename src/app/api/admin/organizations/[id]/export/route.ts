import { NextResponse } from 'next/server';
import { getAgentPacketFilename } from '@/lib/agent-packet-filename';
import { buildGrowthReadinessAgentPacket } from '@/lib/agent-packet';
import { createClient } from '@/lib/supabase/server';
import type { AdminNote, IntakeResponse, Organization } from '@/lib/types';

/**
 * Admin-only Growth Readiness Agent Packet export.
 * Returns a structured, evidence-first JSON packet for future report agents.
 * Requires an authenticated admin session; never includes intake tokens, contact email,
 * passwords, API keys, or private credentials.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select(
      'id, name, website_url, contact_role, city, state, service_area, organization_category, nonprofit_status, annual_budget_range, status, submitted_at, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle();

  if (orgError) {
    return NextResponse.json(
      { error: 'Could not load organization' },
      { status: 500 },
    );
  }

  if (!org) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: responses, error: responsesError } = await supabase
    .from('intake_responses')
    .select('id, organization_id, section_key, question_key, question_label, answer, created_at, updated_at')
    .eq('organization_id', id);

  if (responsesError) {
    return NextResponse.json(
      { error: 'Could not load intake responses' },
      { status: 500 },
    );
  }

  const { data: notes, error: notesError } = await supabase
    .from('admin_notes')
    .select('note, created_at')
    .eq('organization_id', id)
    .order('created_at', { ascending: false });

  if (notesError) {
    return NextResponse.json(
      { error: 'Could not load admin notes' },
      { status: 500 },
    );
  }

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
    responses: (responses ?? []) as IntakeResponse[],
    notes: (notes ?? []) as Pick<AdminNote, 'note' | 'created_at'>[],
  });
  const filename = getAgentPacketFilename(org.name);

  return NextResponse.json(packet, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
