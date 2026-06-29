import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const report = await getApprovedReport(token);

  if (!report) {
    return {
      title: 'Report not available — connectNPO',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${report.title} — connectNPO`,
    robots: { index: false, follow: false },
  };
}

async function getApprovedReport(token: string) {
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(token)) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('client_reports')
    .select('title, report_html, approved_at, status')
    .eq('secure_token', token)
    .in('status', ['approved', 'client_ready'])
    .is('disabled_at', null)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as {
    title: string;
    report_html: string;
    approved_at: string | null;
    status: string;
  };
}

export default async function ClientReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const report = await getApprovedReport(token);

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-4 py-8 text-main sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 rounded-[18px] border border-border bg-surface px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            connectNPO Growth Advisor Report
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-main sm:text-3xl">
            {report.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            This client-ready report was prepared for review and planning. It is
            not legal, tax, accounting, or financial advice.
          </p>
        </div>

        <article
          className="client-report rounded-[18px] border border-border bg-surface p-6 shadow-sm sm:p-8"
          dangerouslySetInnerHTML={{ __html: report.report_html }}
        />
      </div>
    </main>
  );
}
