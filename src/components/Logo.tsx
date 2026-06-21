import Image from 'next/image';
import Link from 'next/link';

export function Logo({ href = '/admin' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center"
      aria-label="connectNPO home"
    >
      <Image
        src="/connectnpo-logo.png"
        alt="connectNPO"
        width={500}
        height={120}
        priority
        className="h-7 w-auto"
      />
    </Link>
  );
}
