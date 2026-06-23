import Link from 'next/link';
import { signOut } from '@/app/login/actions';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';

const navGroups = [
  {
    label: 'Operations',
    items: [
      { href: '/admin', label: 'Organizations' },
      { href: '/admin/organizations/new', label: 'New Intake' },
      { href: '/admin/operations-checklist', label: 'Checklist' },
    ],
  },
  {
    label: 'System',
    items: [{ href: '/admin/system-check', label: 'System Check' }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-[#f7f5ef] lg:flex-row">
      <aside className="border-b border-border bg-surface lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 lg:min-h-screen lg:flex-col lg:items-stretch lg:justify-start lg:gap-10 lg:px-5 lg:py-5">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Logo />
            <p className="hidden text-xs uppercase tracking-[0.18em] text-muted lg:mt-3 lg:block">
              Admin dashboard
            </p>
          </div>

          <nav className="hidden flex-1 flex-col gap-6 lg:flex" aria-label="Admin navigation">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#111111]">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-[7px] px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-primary-soft hover:text-main"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <nav
            className="hidden items-center gap-2 overflow-x-auto sm:flex lg:hidden"
            aria-label="Admin navigation"
          >
            {navGroups.flatMap((group) => group.items).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-[7px] px-3 py-2 text-sm font-medium text-muted hover:bg-primary-soft hover:text-main"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={signOut} className="lg:mt-auto">
            <Button type="submit" variant="ghost" size="sm" className="w-full lg:justify-start">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="w-full flex-1 px-4 py-8 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">{children}</div>
      </main>
    </div>
  );
}
