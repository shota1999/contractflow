import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  fieldSize?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<InputProps["fieldSize"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-3.5 text-sm",
  lg: "h-11 px-4 text-sm",
};

export function Input({ fieldSize = "md", className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/20 ${sizeClasses[fieldSize]} ${className}`}
      {...props}
    />
  );
}
