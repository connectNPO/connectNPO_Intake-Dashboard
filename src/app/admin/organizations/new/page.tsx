import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createOrganization } from './actions';

const CATEGORIES = [
  'Arts & Culture',
  'Education',
  'Environment',
  'Health',
  'Human Services',
  'Youth Services',
  'Community Development',
  'Animal Welfare',
  'Faith-based',
  'Other',
];

const BUDGET_RANGES = [
  'Under $100K',
  '$100K–$250K',
  '$250K–$500K',
  '$500K–$1M',
  '$1M–$5M',
  'Over $5M',
];

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
          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="name" label="Organization name" required>
              <Input id="name" name="name" required />
            </Field>
            <Field htmlFor="contact_role" label="Contact role">
              <Input
                id="contact_role"
                name="contact_role"
                placeholder="e.g. Executive Director"
              />
            </Field>
          </div>

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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="city" label="City">
              <Input id="city" name="city" />
            </Field>
            <Field htmlFor="state" label="State">
              <Input id="state" name="state" />
            </Field>
          </div>

          <Field
            htmlFor="service_area"
            label="Service area"
            helper="The community or region the organization serves."
          >
            <Input id="service_area" name="service_area" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="organization_category" label="Category">
              <Select id="organization_category" name="organization_category">
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field htmlFor="annual_budget_range" label="Annual budget range">
              <Select id="annual_budget_range" name="annual_budget_range">
                <option value="">Select a range</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

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
