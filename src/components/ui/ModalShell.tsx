"use client";

import { ReactNode } from "react";

type ModalShellProps = {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function ModalShell({ title, description, open, onClose, children, footer }: ModalShellProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between border-b border-[color:var(--border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]"
          >
            Close
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-[color:var(--border)] px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
