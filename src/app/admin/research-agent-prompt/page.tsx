import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const dynamic = 'force-dynamic';

export default async function ResearchAgentPromptPage() {
  const promptPath = path.join(
    process.cwd(),
    'docs',
    'RESEARCH_AGENT_PROMPT.md',
  );
  const prompt = await readFile(promptPath, 'utf8');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/report-template" className="text-sm text-muted hover:text-main">
          ← Back to report template
        </Link>
        <div className="mt-2">
          <SectionHeader
            title="Research Agent Prompt"
            description="Internal prompt for collecting public website evidence before report writing."
          />
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[7px] border border-dashed border-border bg-[#faf9f5] px-4 py-3 text-sm text-muted">
          <p>
            This page reads from <code>docs/RESEARCH_AGENT_PROMPT.md</code>, so
            operators can copy the research prompt without opening GitHub.
          </p>
          <CopyButton value={prompt} label="Copy research prompt" />
        </div>
        <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-[7px] border border-border bg-[#111827] p-4 text-sm leading-6 text-[#f9fafb]">
          {prompt}
        </pre>
      </Card>
    </div>
  );
}
