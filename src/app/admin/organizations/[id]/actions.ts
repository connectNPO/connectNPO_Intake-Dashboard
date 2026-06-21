'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { STATUS_ORDER } from '@/lib/status';
import type { OrganizationStatus } from '@/lib/types';

export async function updateStatus(formData: FormData) {
  const id = String(formData.get('organization_id') ?? '');
  const status = String(formData.get('status') ?? '');

  if (!id || !STATUS_ORDER.includes(status as OrganizationStatus)) {
    return;
  }

  const supabase = await createClient();
  await supabase
    .from('organizations')
    .update({ status })
    .eq('id', id);

  revalidatePath(`/admin/organizations/${id}`);
  revalidatePath('/admin');
}

export async function addNote(formData: FormData) {
  const id = String(formData.get('organization_id') ?? '');
  const note = String(formData.get('note') ?? '').trim();

  if (!id) return;
  if (!note) {
    redirect(
      `/admin/organizations/${id}?note_error=` +
        encodeURIComponent('Please enter a note before saving.'),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from('admin_notes').insert({
    organization_id: id,
    note,
    created_by: user?.id ?? null,
  });

  revalidatePath(`/admin/organizations/${id}`);
  redirect(`/admin/organizations/${id}`);
}
