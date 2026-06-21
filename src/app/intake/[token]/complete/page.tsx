import { Card } from '@/components/ui/Card';

export default function IntakeCompletePage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-4">
          <span className="text-sm font-semibold tracking-wide text-primary">
            connectNPO
          </span>
          <span className="text-sm text-muted">Readiness Intake</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f3ec] text-2xl text-success">
            ✓
          </div>
          <h1 className="text-2xl font-semibold text-main">
            Thank you. Your intake has been submitted.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            The connectNPO team will review your responses and follow up with
            next steps.
          </p>
        </Card>
      </div>
    </main>
  );
}
