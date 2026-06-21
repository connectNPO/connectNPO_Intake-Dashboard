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
    'bg-[#111111] text-white hover:bg-[#2b2b2b] disabled:bg-[#a3a3a3] shadow-sm',
  secondary:
    'bg-[#111111] text-white border border-[#111111] hover:bg-[#2b2b2b] disabled:opacity-60',
  ghost: 'bg-transparent text-main hover:bg-primary-soft disabled:opacity-60',
  danger: 'bg-danger text-white hover:bg-[#a93636] disabled:opacity-60 shadow-sm',
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
        className={`inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  },
);
