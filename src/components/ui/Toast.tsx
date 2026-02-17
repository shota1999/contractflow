import type { HTMLAttributes } from "react";

type ToastTone = "default" | "success" | "warning" | "danger";

const toneStyles: Record<ToastTone, string> = {
  default: "border-[color:var(--border)] bg-[var(--surface)] text-[var(--foreground)]",
  success: "border-[color:var(--success)]/40 bg-[color:var(--success)]/10 text-[color:var(--success)]",
  warning: "border-[color:var(--warning)]/40 bg-[color:var(--warning)]/10 text-[color:var(--warning)]",
  danger: "border-[color:var(--danger)]/40 bg-[color:var(--danger)]/10 text-[color:var(--danger)]",
};

type ToastProps = HTMLAttributes<HTMLDivElement> & {
  tone?: ToastTone;
};

export function Toast({ tone = "default", className = "", ...props }: ToastProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border px-4 py-3 text-sm shadow-[var(--shadow-min)] ${toneStyles[tone]} ${className}`}
      {...props}
    />
  );
}
