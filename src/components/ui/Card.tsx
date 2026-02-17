import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  muted?: boolean;
};

export function Card({ children, className = "", muted = false, ...props }: CardProps) {
  const base = "rounded-[var(--radius-lg)] border border-[color:var(--border)]";
  const surface = muted ? "bg-[var(--surface-2)]" : "bg-[var(--surface)]";
  const shadow = "shadow-[var(--shadow-min)]";

  return (
    <div className={`${base} ${surface} ${shadow} ${className}`} {...props}>
      {children}
    </div>
  );
}
