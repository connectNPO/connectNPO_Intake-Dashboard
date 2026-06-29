import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-[var(--primary-hover)] disabled:opacity-60 shadow-[0_0_0_1px_var(--primary)]',
  secondary:
    'bg-[var(--surface-elevated)] text-main border border-border hover:bg-primary-soft disabled:opacity-60 shadow-[0_0_0_1px_var(--ring)]',
  ghost:
    'bg-transparent text-muted hover:bg-primary-soft hover:text-main disabled:opacity-60',
  danger:
    'bg-danger text-white hover:brightness-95 disabled:opacity-60 shadow-[0_0_0_1px_var(--danger)]',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', className = '', ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  },
);
