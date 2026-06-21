import { createAdminClient } from '@/lib/supabase/admin';
import { INTAKE_SECTIONS } from '@/lib/intake/questions';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';
import { IntakeForm } from './IntakeForm';

export const dynamic = 'force-dynamic';

export default async function IntakePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;

  const supabase = createAdminClient();
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, intake_token')
    .eq('intake_token', token)
    .maybeSingle();

  if (!org) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-xl font-semibold text-main">
            This intake link isn’t valid
          </h1>
          <p className="mt-2 text-sm text-muted">
            The link may be incorrect or expired. Please check the link in your
            email, or contact connectNPO for a new one.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-[900px] items-center gap-2 px-4 py-4">
          <Logo href="/" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[900px] flex-1 px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Welcome + privacy */}
          <Card className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-main">
                Welcome to your connectNPO readiness intake
              </h1>
              <p className="text-sm text-muted">
                This form helps us understand your organization, your goals, your
                website, and the areas where you may need support. Your answers
                will help us prepare a more useful review and recommendation.
              </p>
            </div>
            <div className="rounded-[7px] border border-primary bg-primary-soft px-4 py-3">
              <p className="text-sm text-main">
                <strong className="font-semibold">Privacy reminder:</strong>{' '}
                Please do not enter passwords, donor lists, private financial
                records, private client information, or confidential internal
                documents. This intake is only for general organization and
                digital readiness information.
              </p>
            </div>
          </Card>

          {error && (
            <div
              role="alert"
              className="rounded-[7px] border border-[#eccaca] bg-[#f7e3e3] px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <Card>
            <IntakeForm token={org.intake_token} sections={INTAKE_SECTIONS} />
          </Card>

          <p className="text-center text-xs text-muted">
            Your answers are saved when you submit. Thank you for taking the time
            to share your story with us.
          </p>
        </div>
      </div>
    </main>
  );
}
