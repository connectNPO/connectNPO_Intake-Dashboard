import Link from 'next/link';
import { signOut } from '@/app/login/actions';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';

type NavItem = {
  href: string;
  label: string;
  target?: string;
  icon: 'overview' | 'intake' | 'app' | 'system';
};

type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Platform home', icon: 'overview' }],
  },
  {
    label: 'Apps',
    items: [
      { href: '/admin/apps/growth-readiness', label: 'Growth Readiness', icon: 'intake' },
      { href: '/admin#client-hermes-workspaces', label: 'Client Hermes', icon: 'app' },
    ],
  },
  {
    label: 'System',
    items: [{ href: '/admin/system-check', label: 'System check', icon: 'system' }],
  },
];

function NavIcon({ name }: { name: NavItem['icon'] }) {
  const common = 'h-4 w-4';
  switch (name) {
    case 'overview':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="4" width="7" height="4" rx="1.5" />
          <rect x="13.5" y="11" width="7" height="9" rx="1.5" />
          <rect x="3.5" y="14" width="7" height="6" rx="1.5" />
        </svg>
      );
    case 'intake':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case 'app':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="7" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="13" width="7" height="7" rx="1.2" />
        </svg>
      );
    case 'system':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-background lg:block">
      <aside
        aria-label="Admin sidebar"
        className="border-b border-border bg-[var(--sidebar)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-60 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r"
      >
        <div className="flex min-h-16 items-center justify-between gap-3 px-5 lg:min-h-full lg:flex-col lg:items-stretch lg:justify-start lg:gap-7 lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start">
            <div className="flex flex-col gap-1">
              <Logo />
              <p className="hidden text-[11px] uppercase tracking-[0.18em] text-muted lg:block">
                Admin
              </p>
            </div>
          </div>

          <nav className="hidden flex-1 flex-col gap-5 lg:flex" aria-label="Admin navigation">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1.5">
                <p className="px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={item.target}
                      className="group inline-flex items-center gap-2.5 rounded-[5px] px-2 py-1.5 text-sm text-muted transition-colors hover:bg-primary-soft hover:text-main"
                    >
                      <span className="text-muted/80 group-hover:text-primary">
                        <NavIcon name={item.icon} />
                      </span>
                      <span className="truncate">{item.label}</span>
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
                target={item.target}
                className="whitespace-nowrap rounded-[5px] border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:bg-primary-soft hover:text-main"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:mt-auto lg:flex-col lg:items-stretch lg:gap-1.5 lg:border-t lg:border-border lg:pt-4">
            <form action={signOut} className="lg:w-full">
              <Button type="submit" variant="ghost" size="sm" className="w-full lg:justify-start lg:px-2">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      <main className="w-full flex-1 px-4 py-8 lg:ml-60 lg:px-8 lg:py-8">
        <div className="w-full max-w-none">{children}</div>
      </main>
    </div>
  );
}
