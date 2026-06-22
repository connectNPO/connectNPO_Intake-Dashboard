import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';
import { RequestReviewForm } from './RequestReviewForm';

export const dynamic = 'force-dynamic';

export default async function RequestReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null;

  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-[900px] items-center gap-2 px-4 py-4">
          <Logo href="/" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[760px] flex-1 px-4 py-10">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              connectNPO
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-main sm:text-3xl">
              Request a Growth Readiness Review
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Share a few basics so we can prepare a focused review for your
              nonprofit. We will email you a private link to your intake form —
              no account required.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-[7px] border border-[#eccaca] bg-[#f7e3e3] px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <Card>
            <RequestReviewForm turnstileSiteKey={turnstileSiteKey} />
          </Card>

          <p className="text-center text-xs text-muted">
            Already have a link?{' '}
            <Link href="/" className="text-primary hover:underline">
              Return home
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
