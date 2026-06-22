'use client';

import { useFormStatus } from 'react-dom';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TurnstileWidget } from './TurnstileWidget';
import { submitRequestReview } from './actions';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? 'Sending…' : 'Request my intake link'}
    </Button>
  );
}

export function RequestReviewForm({
  turnstileSiteKey,
}: {
  turnstileSiteKey: string | null;
}) {
  return (
    <form action={submitRequestReview} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="name" label="Organization name" required>
          <Input id="name" name="name" required autoComplete="organization" />
        </Field>
        <Field htmlFor="website_url" label="Website URL">
          <Input
            id="website_url"
            name="website_url"
            type="url"
            placeholder="https://"
            autoComplete="url"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="contact_name" label="Contact name" required>
          <Input
            id="contact_name"
            name="contact_name"
            required
            autoComplete="name"
          />
        </Field>
        <Field htmlFor="contact_email" label="Contact email" required>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            required
            autoComplete="email"
          />
        </Field>
      </div>

      <Field htmlFor="contact_role" label="Contact role">
        <Input
          id="contact_role"
          name="contact_role"
          placeholder="e.g. Executive Director"
          autoComplete="organization-title"
        />
      </Field>

      {/* Honeypot — invisible to humans, attractive to bots. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="company_website">
          Do not fill in this field
          <input
            type="text"
            id="company_website"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {turnstileSiteKey && (
        <div className="flex justify-start">
          <TurnstileWidget siteKey={turnstileSiteKey} />
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <SubmitButton disabled={!turnstileSiteKey} />
      </div>

      {!turnstileSiteKey && (
        <p className="text-xs text-muted">
          The security check is not configured yet. Please contact connectNPO to
          request your intake link.
        </p>
      )}
    </form>
  );
}
