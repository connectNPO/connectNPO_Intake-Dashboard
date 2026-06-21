import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signIn } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // If already signed in, go straight to the dashboard.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/admin');

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold tracking-wide text-primary">
            connectNPO
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-main">
            Admin sign in
          </h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to review nonprofit intake submissions.
          </p>
        </div>

        <Card>
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-[#eccaca] bg-[#f7e3e3] px-3.5 py-2.5 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <form action={signIn} className="flex flex-col gap-4">
            <Field htmlFor="email" label="Email" required>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@connectnpo.com"
              />
            </Field>

            <Field htmlFor="password" label="Password" required>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>

            <Button type="submit" className="mt-1 w-full">
              Sign in
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-muted">
          Admin accounts are created by connectNPO in Supabase.
        </p>
      </div>
    </main>
  );
}
