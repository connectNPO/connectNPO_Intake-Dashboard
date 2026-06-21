import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-main placeholder:text-muted/70 focus:border-primary focus:outline-none ${className}`}
      {...props}
    />
  );
});
