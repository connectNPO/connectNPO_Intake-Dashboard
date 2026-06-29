import type { HTMLAttributes } from 'react';

export function Badge({
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-[5px] border px-2.5 py-0.5 text-xs font-medium ${className}`}
      {...props}
    />
  );
}
