import Link from 'next/link';
import { signOut } from '@/app/login/actions';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 w-full max-w-[1200px] items-center justify-between px-4">
          <div className="flex h-16 items-center gap-8">
            <div className="flex w-[120px] items-center">
              <Logo />
            </div>
            <nav className="hidden h-16 items-center gap-2 sm:flex">
              <Link
                href="/admin"
                className="rounded-[7px] px-3 py-2 text-sm font-medium text-muted hover:bg-primary-soft hover:text-main"
              >
                Organizations
              </Link>
              <Link
                href="/admin/organizations/new"
                className="rounded-[7px] px-3 py-2 text-sm font-medium text-muted hover:bg-primary-soft hover:text-main"
              >
                New Intake
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

      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8">{children}</div>
    </div>
  );
}
