import type { ReactNode } from 'react';

type FieldProps = {
  htmlFor: string;
  label: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
};

/** Accessible wrapper that pairs a label + optional helper text with a control. */
export function Field({
  htmlFor,
  label,
  helper,
  required,
  children,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-main">
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
      </label>
      {helper && <p className="text-sm text-muted">{helper}</p>}
      {children}
    </div>
  );
}
