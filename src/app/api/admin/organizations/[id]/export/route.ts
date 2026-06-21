import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin-only JSON export for a future AI report agent.
 * Returns organization metadata, all responses, and admin notes.
 * Requires an authenticated admin session; never includes secrets.
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

  const { data: org } = await supabase
    .from('organizations')
    .select(
      'id, name, website_url, contact_role, city, state, service_area, organization_category, annual_budget_range, status',
    )
    .eq('id', id)
    .maybeSingle();

  if (!org) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: responses } = await supabase
    .from('intake_responses')
    .select('section_key, question_key, question_label, answer')
    .eq('organization_id', id);

  const { data: notes } = await supabase
    .from('admin_notes')
    .select('note, created_at')
    .eq('organization_id', id)
    .order('created_at', { ascending: false });

  return NextResponse.json({
    organization: org,
    responses: responses ?? [],
    admin_notes: notes ?? [],
  });
}
