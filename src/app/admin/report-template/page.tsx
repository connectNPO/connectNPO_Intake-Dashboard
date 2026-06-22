import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const dynamic = 'force-dynamic';

export default async function ReportTemplatePage() {
  const templatePath = path.join(
    process.cwd(),
    'docs',
    'GROWTH_READINESS_REPORT_TEMPLATE.md',
  );
  const template = await readFile(templatePath, 'utf8');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-main">
          ← Back to organizations
        </Link>
        <div className="mt-2">
          <SectionHeader
            title="Growth Readiness Report Template"
            description="Internal operator template for turning an agent packet into a human-reviewed draft."
          />
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-4 py-3 text-sm text-muted">
          This page reads from <code>docs/GROWTH_READINESS_REPORT_TEMPLATE.md</code>,
          so operators can view the template without opening GitHub.
        </div>
        <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-[7px] border border-border bg-[#111827] p-4 text-sm leading-6 text-[#f9fafb]">
          {template}
        </pre>
      </Card>
    </div>
  );
}
