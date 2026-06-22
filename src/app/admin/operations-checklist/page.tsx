import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const dynamic = 'force-dynamic';

export default async function OperationsChecklistPage() {
  const checklistPath = path.join(
    process.cwd(),
    'docs',
    'E2E_OPERATIONS_TEST_CHECKLIST.md',
  );
  const checklist = await readFile(checklistPath, 'utf8');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-main">
          ← Back to organizations
        </Link>
        <div className="mt-2">
          <SectionHeader
            title="E2E Operations Test Checklist"
            description="Internal checklist for safely rehearsing the dashboard workflow before using real nonprofit data."
          />
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-4 py-3 text-sm text-muted">
          <p>
            This page reads from <code>docs/E2E_OPERATIONS_TEST_CHECKLIST.md</code>,
            so operators can follow the manual workflow without opening GitHub.
          </p>
          <CopyButton value={checklist} label="Copy checklist" />
        </div>
        <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-[7px] border border-border bg-[#111827] p-4 text-sm leading-6 text-[#f9fafb]">
          {checklist}
        </pre>
      </Card>
    </div>
  );
}
