import type { HTMLAttributes, ButtonHTMLAttributes } from "react";

export function Tabs({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col gap-3 ${className}`} {...props} />;
}

export function TabsList({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] p-1 ${className}`}
      {...props}
    />
  );
}

export function TabsTrigger({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`rounded-full px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] data-[active=true]:bg-[var(--surface)] data-[active=true]:text-[var(--foreground)] ${className}`}
      {...props}
    />
  );
}

export function TabsContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-[var(--radius-md)] ${className}`} {...props} />;
}
