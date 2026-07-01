'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  type HermesWorkspaceEnvironment,
  type HermesWorkspaceIsolationModel,
  type HermesWorkspaceOrganization,
  type HermesWorkspacePurpose,
  type HermesWorkspaceStatus,
  type HermesWorkspaceSupportStatus,
  type HermesWorkspaceType,
} from '@/lib/types';

const WORKSPACE_TYPES: HermesWorkspaceType[] = [
  'internal',
  'client',
  'staff',
  'pilot',
];
const ORGANIZATIONS: HermesWorkspaceOrganization[] = [
  'connectnpo',
  'givingarc',
  'wife_cpa',
  'client',
  'internal',
];
const PURPOSES: HermesWorkspacePurpose[] = [
  'dashboard',
  'content',
  'meeting_intel',
  'accounting',
  'customer_support',
  'automation',
  'client_ops',
  'other',
];
const ENVIRONMENTS: HermesWorkspaceEnvironment[] = [
  'internal',
  'client',
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

function slugify(value: string): string {
  const s = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s.length > 0 ? s : 'hermes-profile';
}

function redirectWithError(message: string): never {
  redirect(
    '/admin/apps/hermes-workspaces/new?error=' + encodeURIComponent(message),
  );
}

export async function createHermesWorkspace(formData: FormData) {
  const clientName = clean(formData.get('client_name'));
  if (!clientName) redirectWithError('Display name is required.');

  const rawKey = clean(formData.get('workspace_key'));
  const workspaceKey = (rawKey ?? slugify(clientName!)).toLowerCase();
  if (!/^[a-z0-9][a-z0-9-_]*$/.test(workspaceKey)) {
    redirectWithError(
      'Profile key must be lowercase letters, numbers, dashes, or underscores.',
    );
  }

  const hermesProfile = clean(formData.get('hermes_profile')) ?? workspaceKey;

  const rawServiceName = clean(formData.get('service_name'));
  const serviceName =
    rawServiceName ?? `hermes-gateway-${hermesProfile}.service`;

  const portRaw = clean(formData.get('dashboard_port'));
  let dashboardPort: number | null = null;
  if (portRaw) {
    const n = Number.parseInt(portRaw, 10);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
      redirectWithError('Dashboard port must be between 1 and 65535.');
    }
    dashboardPort = n;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hermes_workspaces')
    .insert({
      client_name: clientName,
      workspace_key: workspaceKey,
      workspace_type: pick(
        formData.get('workspace_type'),
        WORKSPACE_TYPES,
        'internal',
      ),
      organization: pick(
        formData.get('organization'),
        ORGANIZATIONS,
        'internal',
      ),
      purpose: pick(formData.get('purpose'), PURPOSES, 'other'),
      environment: pick(
        formData.get('environment'),
        ENVIRONMENTS,
        'internal',
      ),
      isolation_model: pick(
        formData.get('isolation_model'),
        ISOLATION_MODELS,
        'dedicated_vps',
      ),
      vps_hostname: null,
      hermes_profile: hermesProfile,
      profile_path: null,
      service_name: serviceName,
      dashboard_url: null,
      dashboard_port: dashboardPort,
      soul_md_content: clean(formData.get('soul_md_content')),
      discord_bot_name: clean(formData.get('discord_bot_name')),
      discord_server_name: clean(formData.get('discord_server_name')),
      discord_channel_name: clean(formData.get('discord_channel_name')),
      discord_channel_id: clean(formData.get('discord_channel_id')),
      status: pick(formData.get('status'), STATUSES, 'setup'),
      support_status: pick(
        formData.get('support_status'),
        SUPPORT_STATUSES,
        'needs_setup',
      ),
      monthly_cost: null,
      notes: null,
      checklist_profile_exists: false,
      checklist_dashboard_running: false,
      checklist_discord_connected: false,
      checklist_message_content_intent_on: false,
      checklist_service_restarted: false,
      checklist_test_message_passed: false,
    })
    .select('id')
    .single();

  if (error) {
    const msg = error.message.includes('hermes_workspaces_workspace_key_key')
      ? 'A profile with that key already exists. Choose a different key.'
      : 'Could not create the profile. Please try again.';
    redirectWithError(msg);
  }

  revalidatePath('/admin/apps/hermes-workspaces');

  if (data?.id) {
    redirect(`/admin/apps/hermes-workspaces/${data.id}`);
  }
  redirect('/admin/apps/hermes-workspaces');
}
