'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type {
  HermesWorkspaceIsolationModel,
  HermesWorkspaceStatus,
  HermesWorkspaceSupportStatus,
  HermesWorkspaceType,
} from '@/lib/types';

const WORKSPACE_TYPES: HermesWorkspaceType[] = [
  'internal',
  'client',
  'staff',
  'pilot',
];
const ISOLATION_MODELS: HermesWorkspaceIsolationModel[] = [
  'dedicated_vps',
  'shared_vps_profile',
];
const STATUSES: HermesWorkspaceStatus[] = [
  'planning',
  'setup',
  'active',
  'paused',
  'retired',
];
const SUPPORT_STATUSES: HermesWorkspaceSupportStatus[] = [
  'not_started',
  'needs_setup',
  'monitoring',
  'issue',
  'ok',
];

function clean(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? '').trim();
  return s.length > 0 ? s : null;
}

function pick<T extends string>(
  value: FormDataEntryValue | null,
  allowed: readonly T[],
  fallback: T,
): T {
  const s = String(value ?? '').trim();
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

function redirectWithError(message: string): never {
  redirect(
    '/admin/apps/hermes-workspaces/new?error=' + encodeURIComponent(message),
  );
}

export async function createHermesWorkspace(formData: FormData) {
  const clientName = clean(formData.get('client_name'));
  const rawKey = clean(formData.get('workspace_key'));

  if (!clientName) redirectWithError('Client name is required.');
  if (!rawKey) redirectWithError('Workspace key is required.');

  const workspaceKey = rawKey!.toLowerCase();
  if (!/^[a-z0-9][a-z0-9-_]*$/.test(workspaceKey)) {
    redirectWithError(
      'Workspace key must be lowercase letters, numbers, dashes, or underscores.',
    );
  }

  const portRaw = clean(formData.get('dashboard_port'));
  let dashboardPort: number | null = null;
  if (portRaw) {
    const n = Number.parseInt(portRaw, 10);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
      redirectWithError('Dashboard port must be between 1 and 65535.');
    }
    dashboardPort = n;
  }

  const costRaw = clean(formData.get('monthly_cost'));
  let monthlyCost: number | null = null;
  if (costRaw) {
    const n = Number.parseFloat(costRaw);
    if (!Number.isFinite(n) || n < 0) {
      redirectWithError('Monthly cost must be a positive number.');
    }
    monthlyCost = n;
  }

  const supabase = await createClient();
  const { error } = await supabase.from('hermes_workspaces').insert({
    client_name: clientName,
    workspace_key: workspaceKey,
    workspace_type: pick(
      formData.get('workspace_type'),
      WORKSPACE_TYPES,
      'client',
    ),
    isolation_model: pick(
      formData.get('isolation_model'),
      ISOLATION_MODELS,
      'dedicated_vps',
    ),
    vps_hostname: clean(formData.get('vps_hostname')),
    hermes_profile: clean(formData.get('hermes_profile')),
    dashboard_port: dashboardPort,
    discord_bot_name: clean(formData.get('discord_bot_name')),
    discord_channel_name: clean(formData.get('discord_channel_name')),
    status: pick(formData.get('status'), STATUSES, 'planning'),
    support_status: pick(
      formData.get('support_status'),
      SUPPORT_STATUSES,
      'not_started',
    ),
    monthly_cost: monthlyCost,
    notes: clean(formData.get('notes')),
  });

  if (error) {
    const msg = error.message.includes('hermes_workspaces_workspace_key_key')
      ? 'A workspace with that key already exists. Choose a different key.'
      : 'Could not create the workspace. Please try again.';
    redirectWithError(msg);
  }

  revalidatePath('/admin/apps/hermes-workspaces');
  redirect('/admin/apps/hermes-workspaces');
}
