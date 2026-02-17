type BadgeProps = {
  label: string;
  tone?:
    | "neutral"
    | "brand"
    | "draft"
    | "review"
    | "sent"
    | "signed"
    | "paid";
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const toneClasses =
    tone === "brand"
      ? "border-[color:var(--brand)]/30 bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
      : tone === "review"
        ? "border-[color:rgba(217,119,6,0.35)] bg-[rgba(217,119,6,0.08)] text-[#b45309]"
      : tone === "sent"
          ? "border-[color:rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.08)] text-[#2563eb]"
          : tone === "signed"
            ? "border-[color:rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.08)] text-[#15803d]"
            : tone === "paid"
              ? "border-[color:rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.08)] text-[#047857]"
              : "border-[color:var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)]";

  const dotClasses =
    tone === "brand"
      ? "bg-[color:var(--brand)]"
      : tone === "review"
        ? "bg-[#d97706]"
        : tone === "sent"
          ? "bg-[#3b82f6]"
          : tone === "signed"
            ? "bg-[#22c55e]"
            : tone === "paid"
              ? "bg-[#10b981]"
              : "bg-[#9ca3af]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${toneClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses}`} />
      {label}
    </span>
  );
}
