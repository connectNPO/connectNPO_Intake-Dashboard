import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';

export default function RequestReviewSentPage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-[900px] items-center gap-2 px-4 py-4">
          <Logo href="/" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[640px] flex-1 px-4 py-16">
        <Card className="text-center">
          <h1 className="text-2xl font-semibold text-main">
            Check your inbox
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Thanks for requesting a Growth Readiness Review. We just sent a
            private intake link to the email address you provided. If you do not
            see it within a few minutes, please check your spam folder.
          </p>
          <p className="mt-6 text-sm text-muted">
            Need help?{' '}
            <Link href="/" className="text-primary hover:underline">
              Return home
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  );
}
