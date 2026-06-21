import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <Image
          src="/connectnpo-logo.png"
          alt="connectNPO"
          width={500}
          height={120}
          priority
          className="mx-auto h-12 w-auto"
        />
        <h1 className="mt-2 text-3xl font-semibold text-main sm:text-4xl">
          Nonprofit Growth Readiness Intake
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          A warm, private way to share your organization’s story so the
          connectNPO team can prepare a more helpful review.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {user ? (
            <Link href="/admin">
              <Button>Go to dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Admin sign in</Button>
            </Link>
          )}
        </div>

        <p className="mt-6 text-sm text-muted">
          Have an intake link? Open it directly to begin your intake.
        </p>
      </div>
    </main>
  );
}
