import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/20 px-3.5 py-2 text-sm ${className}`}
      {...props}
    />
  );
}
