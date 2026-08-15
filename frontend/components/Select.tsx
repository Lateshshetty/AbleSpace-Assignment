import { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({ label, children, ...props }: SelectProps) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <select
        className="min-h-11 w-full min-w-0 rounded-xl border border-line bg-panel px-4 text-sm text-ink outline-none transition focus:border-ink"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
