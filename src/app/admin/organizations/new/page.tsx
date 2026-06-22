import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createOrganization } from './actions';

export default async function NewOrganizationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-muted hover:text-main"
        >
          ← Back to organizations
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-main">
          New organization
        </h1>
        <p className="mt-1 text-sm text-muted">
          Create a record, then share its private intake link with the nonprofit
          contact.
        </p>
      </div>

      <Card>
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-[7px] border border-[#eccaca] bg-[#f7e3e3] px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <form action={createOrganization} className="flex flex-col gap-5">
          <Field htmlFor="name" label="Organization name" required>
            <Input id="name" name="name" required />
          </Field>

          <Field htmlFor="website_url" label="Website URL">
            <Input
              id="website_url"
              name="website_url"
              type="url"
              placeholder="https://"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="contact_name" label="Contact name">
              <Input id="contact_name" name="contact_name" />
            </Field>
            <Field htmlFor="contact_email" label="Contact email">
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
              />
            </Field>
          </div>

          <Field htmlFor="contact_role" label="Contact role">
            <Input
              id="contact_role"
              name="contact_role"
              placeholder="e.g. Executive Director"
            />
          </Field>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit">Create organization</Button>
            <Link href="/admin">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
