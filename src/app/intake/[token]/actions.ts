'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { INTAKE_SECTIONS } from '@/lib/intake/questions';
import { escapeHtml, notificationEmail, sendEmail } from '@/lib/email';
import type { IntakeResponseInput } from '@/lib/types';

/** Field name used in the form for a given question. */
function fieldName(sectionKey: string, questionKey: string): string {
  return `${sectionKey}__${questionKey}`;
}

async function getBaseSiteUrl(): Promise<string | null> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  if (!host) return null;

  const proto = requestHeaders.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`.replace(/\/$/, '');
}

async function sendInternalIntakeSubmittedNotification({
  organizationId,
  organizationName,
  contactName,
  contactEmail,
  responseCount,
  adminUrl,
}: {
  organizationId: string;
  organizationName: string;
  contactName: string | null;
  contactEmail: string | null;
  responseCount: number;
  adminUrl: string | null;
}): Promise<void> {
  const rows = [
    ['Organization', organizationName],
    ['Contact', contactName ?? '—'],
    ['Email', contactEmail ?? '—'],
    ['Answers saved', String(responseCount)],
  ];

  await sendEmail({
    to: notificationEmail(),
    subject: `Intake submitted: ${organizationName}`,
    html: `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#1f1f1f;">
  <h1 style="font-size:20px;">Growth Readiness Intake Submitted</h1>
  <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="font-weight:600; color:#555;">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
      )
      .join('')}
  </table>
  ${adminUrl ? `<p><a href="${escapeHtml(adminUrl)}">Open submission in admin dashboard</a></p>` : ''}
</body></html>`,
    text: [
      'Growth Readiness Intake Submitted',
      '',
      ...rows.map(([label, value]) => `${label}: ${value}`),
      '',
      adminUrl ? `Admin: ${adminUrl}` : `Organization ID: ${organizationId}`,
    ].join('\n'),
  });
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
    .select('id, name, contact_name, contact_email, intake_token')
    .eq('intake_token', token)
    .maybeSingle();

  if (orgError || !org) {
    redirect(`/intake/${token}?error=` + encodeURIComponent('This intake link is no longer valid.'));
  }

  // Build response rows from the question config (single source of truth).
  const rows: (IntakeResponseInput & { organization_id: string })[] = [];
  const missingRequired: string[] = [];
  for (const section of INTAKE_SECTIONS) {
    for (const question of section.questions) {
      const name = fieldName(section.key, question.key);
      let answer: IntakeResponseInput['answer'];

      if (question.type === 'checkbox') {
        const values = formData
          .getAll(name)
          .map((item) => String(item).trim())
          .filter(Boolean);
        answer = values;
      } else {
        const raw = formData.get(name);
        let value = raw === null ? '' : String(raw).trim();
        if (
          value === 'Other' &&
          question.type === 'select' &&
          question.allowOther &&
          question.options?.includes('Other')
        ) {
          const otherRaw = formData.get(`${name}__other`);
          const otherValue = otherRaw === null ? '' : String(otherRaw).trim();
          value = otherValue ? `Other: ${otherValue}` : 'Other';
        }
        answer = value;
      }

      const isEmpty = Array.isArray(answer) ? answer.length === 0 : String(answer ?? '').trim() === '';
      if (question.required && isEmpty) {
        missingRequired.push(question.label);
      }
      if (isEmpty) continue; // skip unanswered questions

      rows.push({
        organization_id: org.id,
        section_key: section.key,
        question_key: question.key,
        question_label: question.label,
        answer,
      });
    }
  }

  if (missingRequired.length > 0) {
    redirect(
      `/intake/${token}?error=` +
        encodeURIComponent('Please complete the required questions before submitting.'),
    );
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

  const baseSiteUrl = await getBaseSiteUrl();
  const adminUrl = baseSiteUrl ? `${baseSiteUrl}/admin/organizations/${org.id}` : null;

  await sendInternalIntakeSubmittedNotification({
    organizationId: org.id,
    organizationName: org.name,
    contactName: org.contact_name,
    contactEmail: org.contact_email,
    responseCount: rows.length,
    adminUrl,
  });

  redirect(`/intake/${token}/complete`);
}
