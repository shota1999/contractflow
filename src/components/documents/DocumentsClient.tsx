"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ApprovalStatus,
  DocumentStatus,
  DocumentType,
  useListDocumentsQuery,
} from "@/lib/api/documents-api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select } from "@/components/ui/Select";

const statusOptions: DocumentStatus[] = ["DRAFT", "REVIEW", "SENT", "SIGNED", "PAID"];
const typeOptions: DocumentType[] = ["CONTRACT", "PROPOSAL"];
const approvalTones: Record<ApprovalStatus, "draft" | "review" | "signed"> = {
  DRAFT: "draft",
  REVIEW: "review",
  APPROVED: "signed",
};

export function DocumentsClient() {
  const [status, setStatus] = useState<DocumentStatus | "">("");
  const [type, setType] = useState<DocumentType | "">("");
  const { data: session } = useSession();
  const isViewer = session?.user?.role === "VIEWER";

  const queryParams = useMemo(
    () => ({
      status: status || undefined,
      type: type || undefined,
      page: 1,
      pageSize: 20,
    }),
    [status, type],
  );

  const { data, isLoading, isError } = useListDocumentsQuery(queryParams);

  if (isLoading) {
    return <LoadingState label="Loading documents..." />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Documents unavailable"
        description="We could not load the documents right now. Please try again."
      />
    );
  }

  if (data.data.length === 0) {
    return (
      <EmptyState
        title="No documents yet"
        description="Create a new contract or proposal to see it here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Documents
            </div>
            <div className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              Contracts & proposals
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-3">
            {!isViewer ? (
              <Button href="/documents/new" size="default">
                New document
              </Button>
            ) : null}
            <Select
              className="w-auto min-w-[140px] bg-[var(--surface-2)] text-xs font-semibold"
              value={status}
              onChange={(event) => setStatus(event.target.value as DocumentStatus | "")}
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select
              className="w-auto min-w-[130px] bg-[var(--surface-2)] text-xs font-semibold"
              value={type}
              onChange={(event) => setType(event.target.value as DocumentType | "")}
            >
              <option value="">All types</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] shadow-[var(--shadow-min)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Approval</th>
              <th className="px-6 py-3">Version</th>
              <th className="px-6 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((doc) => (
              <tr
                key={doc.id}
                className="border-t border-[color:var(--border)] transition-colors hover:bg-[var(--surface-2)]"
              >
                <td className="px-6 py-3.5">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="font-semibold text-[var(--foreground)]"
                  >
                    {doc.title}
                  </Link>
                  <div className="text-xs text-[var(--muted-foreground)]">{doc.publicToken}</div>
                </td>
                <td className="px-6 py-3.5 text-[var(--muted-foreground)]">{doc.type}</td>
                <td className="px-6 py-3.5">
                  <Badge
                    label={doc.status}
                    tone={
                      doc.status === "REVIEW"
                        ? "review"
                        : doc.status === "SENT"
                          ? "sent"
                          : doc.status === "SIGNED"
                            ? "signed"
                            : doc.status === "PAID"
                              ? "paid"
                      : "draft"
                  }
                />
              </td>
                <td className="px-6 py-3.5">
                  <Badge
                    label={doc.approvalStatus}
                    tone={approvalTones[doc.approvalStatus]}
                  />
                </td>
                <td className="px-6 py-3.5 text-[var(--muted-foreground)]">v{doc.version}</td>
                <td className="px-6 py-3.5 text-[var(--muted-foreground)]">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
