import { AlertCircle, ClipboardList, Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-muted">
      <Loader2 className="animate-spin" size={18} />
      {label}
    </div>
  );
}

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-line bg-panel p-8 text-center">
      <div>
        <ClipboardList className="mx-auto mb-4 text-muted" size={32} />
        <h2 className="text-lg font-semibold text-ink">No tasks yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">Create your first task and keep the board moving.</p>
        <button className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-panel" onClick={onCreate}>
          Add task
        </button>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
      <AlertCircle size={18} />
      {message}
    </div>
  );
}

