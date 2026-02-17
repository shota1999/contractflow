type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-min)]">
      <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--brand)]" />
        {label}
      </div>
    </div>
  );
}
