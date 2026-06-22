'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const GENERIC_ERROR =
  'We could not submit your request right now. Please try again or contact connectNPO.';

function clean(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? '').trim();
  return s.length > 0 ? s : null;
}

function isValidEmail(email: string): boolean {
  // Minimal RFC-shaped check. Server keeps it simple; Resend will reject bad addresses.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeUrl(value: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function fail(message: string): never {
  redirect('/request-review?error=' + encodeURIComponent(message));
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

async function verifyTurnstile(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  if (!token) return false;

  try {
    const body = new URLSearchParams();
    body.append('secret', secret);
    body.append('response', token);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

function buildEmailHtml(intakeUrl: string, contactName: string | null): string {
  const greeting = contactName ? `Hi ${escapeHtml(contactName)},` : 'Hello,';
  const safeUrl = escapeHtml(intakeUrl);
  return `<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f7f5ef; padding:24px; color:#1f1f1f;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border:1px solid #e5e1d5; border-radius:8px; padding:32px;">
      <tr>
        <td>
          <h1 style="font-size:20px; margin:0 0 16px;">Your connectNPO Growth Readiness Intake</h1>
          <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">${greeting}</p>
          <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
            Thank you for requesting a Growth Readiness Review. You can begin your private intake using the secure link below.
          </p>
          <p style="margin:24px 0;">
            <a href="${safeUrl}" style="background:#6b7cf5; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:7px; font-weight:600; display:inline-block;">
              Open your intake
            </a>
          </p>
          <p style="font-size:13px; line-height:1.6; color:#5f5f5f; margin:0 0 8px;">
            Or paste this link into your browser:
          </p>
          <p style="font-size:13px; line-height:1.6; word-break:break-all; margin:0 0 24px;">
            <a href="${safeUrl}" style="color:#6b7cf5;">${safeUrl}</a>
          </p>
          <p style="font-size:13px; line-height:1.6; color:#5f5f5f; margin:0;">
            This link is private to your organization. Please do not share it publicly.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildEmailText(intakeUrl: string, contactName: string | null): string {
  const greeting = contactName ? `Hi ${contactName},` : 'Hello,';
  return [
    greeting,
    '',
    'Thank you for requesting a Growth Readiness Review from connectNPO.',
    'You can begin your private intake using the secure link below:',
    '',
    intakeUrl,
    '',
    'This link is private to your organization. Please do not share it publicly.',
  ].join('\n');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendIntakeEmail({
  to,
  contactName,
  intakeUrl,
}: {
  to: string;
  contactName: string | null;
  intakeUrl: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: 'Your connectNPO Growth Readiness Intake',
        html: buildEmailHtml(intakeUrl, contactName),
        text: buildEmailText(intakeUrl, contactName),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitRequestReview(formData: FormData) {
  // Honeypot: bots tend to fill every field. Real users leave this blank.
  const honeypot = String(formData.get('company_website') ?? '').trim();
  if (honeypot.length > 0) {
    redirect('/request-review/sent');
  }

  const name = clean(formData.get('name'));
  const contactName = clean(formData.get('contact_name'));
  const contactEmailRaw = clean(formData.get('contact_email'));
  const contactRole = clean(formData.get('contact_role'));
  const websiteUrl = normalizeUrl(clean(formData.get('website_url')));
  const turnstileToken = clean(formData.get('cf-turnstile-response'));

  if (!name) fail('Please share your organization name.');
  if (!contactName) fail('Please share a contact name.');
  if (!contactEmailRaw) fail('Please share a contact email.');
  if (!isValidEmail(contactEmailRaw!)) {
    fail('That email address does not look right. Please double-check it.');
  }

  const siteUrl = await getBaseSiteUrl();
  if (!siteUrl) fail(GENERIC_ERROR);

  const turnstileOk = await verifyTurnstile(turnstileToken);
  if (!turnstileOk) {
    fail('We could not verify the security check. Please refresh and try again.');
  }

  const supabase = createAdminClient();

  const { data: inserted, error: insertError } = await supabase
    .from('organizations')
    .insert({
      name,
      website_url: websiteUrl,
      contact_name: contactName,
      contact_email: contactEmailRaw,
      contact_role: contactRole,
      status: 'intake_sent',
    })
    .select('id, intake_token')
    .single();

  if (insertError || !inserted) {
    fail(GENERIC_ERROR);
  }

  const intakeUrl = `${siteUrl!.replace(/\/$/, '')}/intake/${inserted.intake_token}`;

  const emailOk = await sendIntakeEmail({
    to: contactEmailRaw!,
    contactName,
    intakeUrl,
  });

  if (!emailOk) {
    await supabase
      .from('organizations')
      .update({ status: 'email_failed' })
      .eq('id', inserted.id);

    fail(
      'We saved your request but could not send the email. Please contact connectNPO so we can share your intake link.',
    );
  }

  redirect('/request-review/sent');
}
