import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-main">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="secondary">Go home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
