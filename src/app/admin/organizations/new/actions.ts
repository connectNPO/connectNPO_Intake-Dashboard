'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function clean(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? '').trim();
  return s.length > 0 ? s : null;
}

export async function createOrganization(formData: FormData) {
  const name = clean(formData.get('name'));

  if (!name) {
    redirect(
      '/admin/organizations/new?error=' +
        encodeURIComponent('Organization name is required.'),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name,
      website_url: clean(formData.get('website_url')),
      contact_name: clean(formData.get('contact_name')),
      contact_email: clean(formData.get('contact_email')),
      contact_role: clean(formData.get('contact_role')),
      city: clean(formData.get('city')),
      state: clean(formData.get('state')),
      service_area: clean(formData.get('service_area')),
      organization_category: clean(formData.get('organization_category')),
      annual_budget_range: clean(formData.get('annual_budget_range')),
    })
    .select('id')
    .single();

  if (error || !data) {
    redirect(
      '/admin/organizations/new?error=' +
        encodeURIComponent('Could not create the organization. Please try again.'),
    );
  }

  revalidatePath('/admin');
  redirect(`/admin/organizations/${data.id}`);
}
