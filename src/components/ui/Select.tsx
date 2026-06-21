import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = '', children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-main focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});
