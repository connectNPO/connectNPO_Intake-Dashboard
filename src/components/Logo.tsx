import Link from 'next/link';

export function Logo({ href = '/admin' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2" aria-label="connectNPO home">
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-sm font-black text-main">
        c
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-main">
          connectNPO
        </span>
        <span className="text-[11px] font-medium text-muted">Intake</span>
      </span>
    </Link>
  );
}
