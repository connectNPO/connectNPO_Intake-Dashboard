'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  HERMES_CHECKLIST_KEYS,
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

function bool(value: FormDataEntryValue | null): boolean {
  const s = String(value ?? '').trim().toLowerCase();
  return s === 'on' || s === 'true' || s === '1';
}

function parseHttpUrl(value: string): string | null {
  try {
    const u = new URL(value);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

function redirectWithError(id: string, message: string): never {
  redirect(
    `/admin/apps/hermes-workspaces/${id}?error=` + encodeURIComponent(message),
  );
}

export async function updateHermesWorkspace(formData: FormData) {
  const id = clean(formData.get('id'));
  if (!id) redirect('/admin/apps/hermes-workspaces');

  const clientName = clean(formData.get('client_name'));
  const rawKey = clean(formData.get('workspace_key'));

  if (!clientName) redirectWithError(id, 'Client or team name is required.');
  if (!rawKey) redirectWithError(id, 'Workspace key is required.');

  const workspaceKey = rawKey!.toLowerCase();
  if (!/^[a-z0-9][a-z0-9-_]*$/.test(workspaceKey)) {
    redirectWithError(
      id,
      'Workspace key must be lowercase letters, numbers, dashes, or underscores.',
    );
  }

  const portRaw = clean(formData.get('dashboard_port'));
  let dashboardPort: number | null = null;
  if (portRaw) {
    const n = Number.parseInt(portRaw, 10);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
      redirectWithError(id, 'Dashboard port must be between 1 and 65535.');
    }
    dashboardPort = n;
  }

  const costRaw = clean(formData.get('monthly_cost'));
  let monthlyCost: number | null = null;
  if (costRaw) {
    const n = Number.parseFloat(costRaw);
    if (!Number.isFinite(n) || n < 0) {
      redirectWithError(id, 'Monthly cost must be a positive number.');
    }
    monthlyCost = n;
  }

  const dashboardUrlRaw = clean(formData.get('dashboard_url'));
  let dashboardUrl: string | null = null;
  if (dashboardUrlRaw) {
    const parsed = parseHttpUrl(dashboardUrlRaw);
    if (!parsed) {
      redirectWithError(
        id,
        'Dashboard URL must be a full http:// or https:// URL.',
      );
    }
    dashboardUrl = parsed;
  }

  const checklist = Object.fromEntries(
    HERMES_CHECKLIST_KEYS.map((key) => [
      `checklist_${key}`,
      bool(formData.get(`checklist_${key}`)),
    ]),
  );

  const supabase = await createClient();
  const { error } = await supabase
    .from('hermes_workspaces')
    .update({
      client_name: clientName,
      workspace_key: workspaceKey,
      workspace_type: pick(
        formData.get('workspace_type'),
        WORKSPACE_TYPES,
        'client',
      ),
      organization: pick(
        formData.get('organization'),
        ORGANIZATIONS,
        'client',
      ),
      purpose: pick(formData.get('purpose'), PURPOSES, 'other'),
      environment: pick(
        formData.get('environment'),
        ENVIRONMENTS,
        'client',
      ),
      isolation_model: pick(
        formData.get('isolation_model'),
        ISOLATION_MODELS,
        'dedicated_vps',
      ),
      vps_hostname: clean(formData.get('vps_hostname')),
      hermes_profile: clean(formData.get('hermes_profile')),
      profile_path: clean(formData.get('profile_path')),
      service_name: clean(formData.get('service_name')),
      dashboard_url: dashboardUrl,
      dashboard_port: dashboardPort,
      soul_md_content: clean(formData.get('soul_md_content')),
      discord_bot_name: clean(formData.get('discord_bot_name')),
      discord_server_name: clean(formData.get('discord_server_name')),
      discord_channel_name: clean(formData.get('discord_channel_name')),
      discord_channel_id: clean(formData.get('discord_channel_id')),
      status: pick(formData.get('status'), STATUSES, 'planning'),
      support_status: pick(
        formData.get('support_status'),
        SUPPORT_STATUSES,
        'not_started',
      ),
      monthly_cost: monthlyCost,
      notes: clean(formData.get('notes')),
      ...checklist,
    })
    .eq('id', id);

  if (error) {
    const msg = error.message.includes('hermes_workspaces_workspace_key_key')
      ? 'A workspace with that key already exists. Choose a different key.'
      : 'Could not update the workspace. Please try again.';
    redirectWithError(id, msg);
  }

  revalidatePath('/admin/apps/hermes-workspaces');
  revalidatePath(`/admin/apps/hermes-workspaces/${id}`);
  redirect(`/admin/apps/hermes-workspaces/${id}?saved=1`);
}
