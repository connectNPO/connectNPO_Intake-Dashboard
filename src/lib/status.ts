import type { OrganizationStatus } from './types';

type StatusMeta = {
  label: string;
  /** Tailwind classes for the badge (background + text + border). */
  className: string;
};

/** Display metadata for each organization status. */
export const STATUS_META: Record<OrganizationStatus, StatusMeta> = {
  draft_created: {
    label: 'Draft created',
    className: 'bg-[#f0eee8] text-[#6F6A63] border-[#E8E4DC]',
  },
  intake_sent: {
    label: 'Intake sent',
    className: 'bg-[#ECECFF] text-[#4a55c7] border-[#d6d6ff]',
  },
  email_failed: {
    label: 'Email failed',
    className: 'bg-[#f7e3e3] text-[#C24141] border-[#eccaca]',
  },
  in_progress: {
    label: 'In progress',
    className: 'bg-[#ECECFF] text-[#4a55c7] border-[#d6d6ff]',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-[#e3f3ec] text-[#2F9E6D] border-[#c3e6d6]',
  },
  under_review: {
    label: 'Under review',
    className: 'bg-[#fbf0db] text-[#C88719] border-[#f0ddb4]',
  },
  needs_clarification: {
    label: 'Needs clarification',
    className: 'bg-[#f7e3e3] text-[#C24141] border-[#eccaca]',
  },
  ready_for_report: {
    label: 'Ready for report',
    className: 'bg-[#e3f3ec] text-[#2F9E6D] border-[#c3e6d6]',
  },
  report_created: {
    label: 'Report created',
    className: 'bg-[#111111] text-white border-[#111111]',
  },
};

/** Ordered list of statuses for selectors. */
export const STATUS_ORDER: OrganizationStatus[] = [
  'draft_created',
  'intake_sent',
  'email_failed',
  'in_progress',
  'submitted',
  'under_review',
  'needs_clarification',
  'ready_for_report',
  'report_created',
];

export function statusLabel(status: string): string {
  return (STATUS_META as Record<string, StatusMeta>)[status]?.label ?? status;
}
