'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { INTAKE_SECTIONS } from '@/lib/intake/questions';
import type { IntakeResponseInput } from '@/lib/types';

/** Field name used in the form for a given question. */
function fieldName(sectionKey: string, questionKey: string): string {
  return `${sectionKey}__${questionKey}`;
}

export async function submitIntake(formData: FormData) {
  const token = String(formData.get('token') ?? '').trim();
  if (!token) {
    redirect('/intake/invalid');
  }

  const supabase = createAdminClient();

  // Validate the token server-side before any write.
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, intake_token')
    .eq('intake_token', token)
    .maybeSingle();

  if (orgError || !org) {
    redirect(`/intake/${token}?error=` + encodeURIComponent('This intake link is no longer valid.'));
  }

  // Build response rows from the question config (single source of truth).
  const rows: (IntakeResponseInput & { organization_id: string })[] = [];
  for (const section of INTAKE_SECTIONS) {
    for (const question of section.questions) {
      const raw = formData.get(fieldName(section.key, question.key));
      let value = raw === null ? '' : String(raw).trim();
      if (
        value === 'Other' &&
        question.type === 'select' &&
        question.allowOther &&
        question.options?.includes('Other')
      ) {
        const otherRaw = formData.get(`${fieldName(section.key, question.key)}__other`);
        const otherValue = otherRaw === null ? '' : String(otherRaw).trim();
        value = otherValue ? `Other: ${otherValue}` : 'Other';
      }
      if (value === '') continue; // skip unanswered questions
      rows.push({
        organization_id: org.id,
        section_key: section.key,
        question_key: question.key,
        question_label: question.label,
        answer: value,
      });
    }
  }

  if (rows.length > 0) {
    const { error: upsertError } = await supabase
      .from('intake_responses')
      .upsert(rows, { onConflict: 'organization_id,section_key,question_key' });

    if (upsertError) {
      redirect(
        `/intake/${token}?error=` +
          encodeURIComponent('We couldn’t save your answers. Please try again.'),
      );
    }
  }

  const { error: statusError } = await supabase
    .from('organizations')
    .update({ status: 'submitted', submitted_at: new Date().toISOString() })
    .eq('id', org.id);

  if (statusError) {
    redirect(
      `/intake/${token}?error=` +
        encodeURIComponent('We couldn’t complete your submission. Please try again.'),
    );
  }

  redirect(`/intake/${token}/complete`);
}
