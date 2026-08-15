import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: FieldProps) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <input
        className={clsx(
          'min-h-11 w-full min-w-0 rounded-xl border border-line bg-panel px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-ink',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <textarea
        className={clsx(
          'min-h-28 w-full min-w-0 resize-none rounded-xl border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-ink',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
