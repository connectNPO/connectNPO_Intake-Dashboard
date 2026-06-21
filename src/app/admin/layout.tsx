import Link from 'next/link';
import { signOut } from '@/app/login/actions';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-wide text-primary">
                connectNPO
              </span>
              <span className="text-sm text-muted">Intake</span>
            </Link>
            <nav className="hidden gap-4 sm:flex">
              <Link
                href="/admin"
                className="text-sm text-muted hover:text-main"
              >
                Organizations
              </Link>
              <Link
                href="/admin/organizations/new"
                className="text-sm text-muted hover:text-main"
              >
                New Organization
              </Link>
            </nav>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</div>
    </div>
  );
}
