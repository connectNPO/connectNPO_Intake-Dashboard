import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-main placeholder:text-muted/70 focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 ${className}`}
      {...props}
    />
  );
});
