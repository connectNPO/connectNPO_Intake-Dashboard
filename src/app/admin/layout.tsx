import Link from 'next/link';
import { signOut } from '@/app/login/actions';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { href: '/admin', label: 'Organizations', icon: '◌' },
      { href: '/request-review', label: 'Public request form', icon: '↗', target: '_blank' },
      { href: '/admin/organizations/new', label: 'New Intake', icon: '+' },
      { href: '/admin/operations-checklist', label: 'Checklist', icon: '☑' },
    ],
  },
  {
    label: 'Library',
    items: [
      { href: '/admin/report-template', label: 'Report Template', icon: '◇' },
      { href: '/admin/report-writer-prompt', label: 'Writer Prompt', icon: '✎' },
      { href: '/admin/research-agent-prompt', label: 'Research Prompt', icon: '⌕' },
    ],
  },
  {
    label: 'System',
    items: [{ href: '/admin/system-check', label: 'System Check', icon: '⚙' }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-background lg:block">
      <aside className="border-b border-border bg-[var(--sidebar)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-72 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 lg:min-h-full lg:flex-col lg:items-stretch lg:justify-start lg:gap-8 lg:px-4 lg:py-5">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div className="rounded-2xl border border-border bg-[var(--surface-elevated)] px-3 py-3 shadow-[0_0_0_1px_var(--ring)]">
              <Logo />
              <p className="mt-3 hidden text-xs uppercase tracking-[0.18em] text-muted lg:block">
                Platform dashboard
              </p>
            </div>
          </div>

          <nav className="hidden flex-1 flex-col gap-6 lg:flex" aria-label="Admin navigation">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <p className="px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={'target' in item ? item.target : undefined}
                      className="group inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-primary-soft hover:text-main"
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-lg border border-border bg-[var(--surface-elevated)] text-xs text-main shadow-[0_0_0_1px_var(--ring)]">
                        {item.icon}
                      </span>
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
                target={'target' in item ? item.target : undefined}
                className="whitespace-nowrap rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-muted hover:bg-primary-soft hover:text-main"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
            <ThemeToggle />
            <form action={signOut} className="lg:w-full">
              <Button type="submit" variant="ghost" size="sm" className="w-full lg:justify-start">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      <main className="w-full flex-1 px-4 py-8 lg:ml-72 lg:px-8">
        <div className="mx-auto w-full max-w-[1180px]">{children}</div>
      </main>
    </div>
  );
}
