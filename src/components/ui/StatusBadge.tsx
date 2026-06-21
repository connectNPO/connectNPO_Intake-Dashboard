import { Badge } from './Badge';
import { STATUS_META } from '@/lib/status';
import type { OrganizationStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: OrganizationStatus | string }) {
  const meta =
    (STATUS_META as Record<string, { label: string; className: string }>)[
      status
    ] ?? { label: status, className: 'bg-[#f0eee8] text-[#6F6A63] border-[#E8E4DC]' };

  return <Badge className={meta.className}>{meta.label}</Badge>;
}
