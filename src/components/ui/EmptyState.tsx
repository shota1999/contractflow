type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-min)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-2)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-[var(--muted-foreground)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h10" />
          <path d="M7 12h6" />
          <path d="M5 3h10l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        </svg>
      </span>
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
