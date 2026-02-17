import type { ReactNode } from "react";

type DataTableProps = {
  columns: string[];
  children: ReactNode;
};

export function DataTable({ columns, children }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] shadow-[var(--shadow-min)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--surface-2)] text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:hover]:bg-[var(--surface-2)]">{children}</tbody>
      </table>
    </div>
  );
}
