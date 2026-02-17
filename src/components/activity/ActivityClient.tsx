"use client";

import { useMemo, useState } from "react";
import { useListAuditEventsQuery } from "@/lib/api/audit-api";
import { auditActionValues, auditTargetTypeValues, type AuditAction, type AuditTargetType } from "@/types/audit";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";

const humanize = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

export function ActivityClient() {
  const [action, setAction] = useState<AuditAction | "">("");
  const [targetType, setTargetType] = useState<AuditTargetType | "">("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      action: action || undefined,
      targetType: targetType || undefined,
    }),
    [page, pageSize, action, targetType],
  );

  const { data, isLoading, isError } = useListAuditEventsQuery(queryParams);

  if (isLoading) {
    return <LoadingState label="Loading activity feed..." />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Activity unavailable"
        description="We could not load the audit events right now."
      />
    );
  }

  const events = data.data;

  const handleFilterChange = (nextAction: AuditAction | "", nextTargetType: AuditTargetType | "") => {
    setAction(nextAction);
    setTargetType(nextTargetType);
    setPage(1);
  };

  const canPrev = data.meta.page > 1;
  const canNext = data.meta.page < data.meta.totalPages;

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5 md:p-6">
        <PageHeader
          title="Activity"
          description="Track key actions across documents, teams, and shared links."
          action={
            <div className="flex flex-wrap gap-2">
              <Select
                className="w-auto min-w-[160px] bg-[var(--surface-2)] text-xs font-semibold"
                value={action}
                onChange={(event) =>
                  handleFilterChange(event.target.value as AuditAction | "", targetType)
                }
              >
                <option value="">All actions</option>
                {auditActionValues.map((value) => (
                  <option key={value} value={value}>
                    {humanize(value)}
                  </option>
                ))}
              </Select>
              <Select
                className="w-auto min-w-[160px] bg-[var(--surface-2)] text-xs font-semibold"
                value={targetType}
                onChange={(event) =>
                  handleFilterChange(action, event.target.value as AuditTargetType | "")
                }
              >
                <option value="">All targets</option>
                {auditTargetTypeValues.map((value) => (
                  <option key={value} value={value}>
                    {humanize(value)}
                  </option>
                ))}
              </Select>
            </div>
          }
        />
      </Card>

      {events.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Actions such as invites, document updates, and draft generation will appear here."
        />
      ) : (
        <DataTable columns={["Time", "Actor", "Action", "Target", "Details"]}>
          {events.map((event) => {
            const actorName =
              event.actor?.name ?? event.actor?.email ?? (event.actorUserId ? "User" : "System");
            const targetLabel = event.targetId
              ? `${humanize(event.targetType)} · ${event.targetId.slice(0, 6)}`
              : humanize(event.targetType);
            const metadataEntries =
              event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
                ? Object.entries(event.metadata)
                : [];
            const details =
              metadataEntries.length > 0
                ? metadataEntries
                    .map(([key, value]) => `${key}: ${formatValue(value)}`)
                    .join(" · ")
                : "—";

            return (
              <tr
                key={event.id}
                className="border-t border-[color:var(--border)]"
              >
                <td className="px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
                  {new Date(event.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
                  {actorName}
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--foreground)]">
                  {humanize(event.action)}
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
                  {targetLabel}
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--muted-foreground)]">{details}</td>
              </tr>
            );
          })}
        </DataTable>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
        <span>
          Page {data.meta.page} of {data.meta.totalPages} · {data.meta.total} events
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={!canPrev} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="secondary" size="sm" disabled={!canNext} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
