"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ApprovalStatus,
  DocumentStatus,
  DocumentSectionDto,
  useGenerateDraftMutation,
  useGetDocumentQuery,
  useUpdateDocumentApprovalMutation,
  useUpdateDocumentSharingMutation,
  useUpdateDocumentMutation,
  useUpdateDocumentSectionsMutation,
} from "@/lib/api/documents-api";
import { useListDraftJobsQuery, useRetryDraftJobMutation } from "@/lib/api/draft-jobs-api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { ModalShell } from "@/components/ui/ModalShell";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Toast } from "@/components/ui/Toast";

const statusOptions: DocumentStatus[] = ["DRAFT", "REVIEW", "SENT", "SIGNED", "PAID"];

type DocumentDetailClientProps = {
  documentId: string;
  appUrl: string;
};

type SectionDraft = Omit<DocumentSectionDto, "createdAt" | "updatedAt">;

export function DocumentDetailClient({ documentId, appUrl }: DocumentDetailClientProps) {
  const { data: session } = useSession();
  const isViewer = session?.user?.role === "VIEWER";
  const canShare = session?.user?.role === "OWNER" || session?.user?.role === "ADMIN";
  const isAdmin = session?.user?.role === "OWNER" || session?.user?.role === "ADMIN";
  const { data, isLoading, isError, refetch } = useGetDocumentQuery(documentId);
  const [updateDocument, { isLoading: isSavingDocument }] = useUpdateDocumentMutation();
  const [updateSections, { isLoading: isSavingSections }] = useUpdateDocumentSectionsMutation();
  const [generateDraft, { isLoading: isGenerating }] = useGenerateDraftMutation();
  const [updateApproval, { isLoading: isUpdatingApproval }] = useUpdateDocumentApprovalMutation();
  const [updateSharing, { isLoading: isUpdatingSharing }] = useUpdateDocumentSharingMutation();
  const {
    data: draftJobs,
    isLoading: isDraftJobsLoading,
    isError: isDraftJobsError,
  } = useListDraftJobsQuery({ page: 1, pageSize: 5, documentId });
  const [retryDraftJob, { isLoading: isRetryingDraft }] = useRetryDraftJobMutation();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<DocumentStatus>("DRAFT");
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [hasEdits, setHasEdits] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");
  const [pendingPublic, setPendingPublic] = useState<boolean | null>(null);
  const [approvalNote, setApprovalNote] = useState("");

  const document = data?.data;
  const mappedSections = useMemo(
    () =>
      (document?.sections ?? []).map((section) => ({
        id: section.id,
        documentId: section.documentId,
        title: section.title,
        content: section.content,
        order: section.order,
      })),
    [document?.sections],
  );

  useEffect(() => {
    const shouldPoll =
      document?.generationStatus === "QUEUED" || document?.generationStatus === "PROCESSING";
    if (!shouldPoll) {
      return;
    }

    const interval = setInterval(() => {
      void refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [document?.generationStatus, refetch]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);


  const isSaving = isSavingDocument || isSavingSections;

  const generationStatusTone = useMemo(() => {
    switch (document?.generationStatus) {
      case "FAILED":
        return "review";
      case "QUEUED":
      case "PROCESSING":
        return "sent";
      case "SUCCEEDED":
        return "paid";
      default:
        return "draft";
    }
  }, [document?.generationStatus]);

  const latestDraftJob = draftJobs?.data?.[0];
  const draftJobStatusTone = useMemo(() => {
    switch (latestDraftJob?.status) {
      case "FAILED":
        return "review";
      case "PROCESSING":
      case "QUEUED":
        return "sent";
      case "SUCCEEDED":
        return "paid";
      default:
        return "draft";
    }
  }, [latestDraftJob?.status]);

  if (isLoading) {
    return <LoadingState label="Loading document..." />;
  }

  if (isError || !document) {
    return (
      <EmptyState
        title="Document unavailable"
        description="We could not load the document right now."
      />
    );
  }

  const ensureDraft = () => {
    if (!document || hasEdits) {
      return;
    }
    setTitle(document.title);
    setStatus(document.status);
    setHasEdits(true);
  };

  const activeTitle = hasEdits ? title : document.title;
  const activeStatus = hasEdits ? status : document.status;
  const activeSections = hasEdits ? sections : mappedSections;

  const reorderSection = (index: number, direction: "up" | "down") => {
    const baseSections = hasEdits ? sections : mappedSections;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= baseSections.length) {
      return;
    }

    const updated = [...baseSections];
    const [moved] = updated.splice(index, 1);
    updated.splice(nextIndex, 0, moved);
    setSections(
      updated.map((section, idx) => ({
        ...section,
        order: idx + 1,
      })),
    );
    ensureDraft();
    setHasEdits(true);
  };

  const updateSection = (index: number, key: "title" | "content", value: string) => {
    const baseSections = hasEdits ? sections : mappedSections;
    const updated = baseSections.map((section, idx) =>
      idx === index ? { ...section, [key]: value } : section,
    );
    setSections(updated);
    ensureDraft();
    setHasEdits(true);
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        updateDocument({
          id: document.id,
          data: {
            title,
            status,
          },
        }).unwrap(),
        updateSections({
          id: document.id,
          sections: sections.map((section, index) => ({
            title: section.title,
            content: section.content,
            order: index + 1,
          })),
        }).unwrap(),
      ]);
      setHasEdits(false);
      setToast("Changes saved.");
    } catch {
      setToast("Save failed. Please try again.");
    }
  };

  const handleGenerate = async () => {
    try {
      await generateDraft(document.id).unwrap();
      setToast("Draft generation started.");
    } catch {
      setToast("Unable to start draft generation.");
    }
  };

  const handleApprovalUpdate = async (nextStatus: ApprovalStatus) => {
    try {
      await updateApproval({
        id: document.id,
        status: nextStatus,
        note: approvalNote.trim() || undefined,
      }).unwrap();
      setToast(
        nextStatus === "REVIEW"
          ? "Sent for review."
          : nextStatus === "APPROVED"
            ? "Document approved."
            : "Moved back to draft.",
      );
      setApprovalNote("");
    } catch {
      setToast("Unable to update approval status.");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/pdf`);
      if (!response.ok) {
        throw new Error("PDF download failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = `${document.title.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.pdf`;
      const anchor = globalThis.document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setToast("PDF downloaded.");
    } catch {
      setToast("Unable to download PDF.");
    }
  };

  const handleRetryDraftJob = async () => {
    if (!latestDraftJob) {
      return;
    }
    try {
      await retryDraftJob(latestDraftJob.id).unwrap();
      setToast("Draft retry queued.");
    } catch {
      setToast("Unable to retry draft job.");
    }
  };

  const normalizedAppUrl = appUrl.replace(/\/$/, "");
  const publicLink = `${normalizedAppUrl}/public/doc/${document.publicToken}`;

  const isPublic = pendingPublic ?? document.isPublic;

  const handleToggleSharing = async (nextValue: boolean) => {
    setPendingPublic(nextValue);
    try {
      await updateSharing({ id: document.id, isPublic: nextValue }).unwrap();
      setToast(nextValue ? "Public sharing enabled." : "Public sharing disabled.");
    } catch {
      setToast("Unable to update public sharing.");
    } finally {
      setPendingPublic(null);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setToast("Public link copied.");
    } catch {
      setToast("Unable to copy. Please copy the link manually.");
    }
  };

  const handleAddSection = () => {
    const baseSections = hasEdits ? sections : mappedSections;
    const titleValue = newSectionTitle.trim() || `Section ${baseSections.length + 1}`;
    const updated = [
      ...baseSections,
      {
        id: `new-${Date.now()}`,
        documentId: document.id,
        title: titleValue,
        content: newSectionContent,
        order: baseSections.length + 1,
      },
    ];
    setSections(updated);
    setNewSectionTitle("");
    setNewSectionContent("");
    setModalOpen(false);
    ensureDraft();
    setHasEdits(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {toast ? <Toast>{toast}</Toast> : null}

      <Card className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Document
            </div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">{document.title}</h1>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
              <span>Version v{document.version}</span>
              <span>{document.type}</span>
              <Badge
                label={document.status}
                tone={
                  document.status === "REVIEW"
                    ? "review"
                    : document.status === "SENT"
                      ? "sent"
                      : document.status === "SIGNED"
                        ? "signed"
                        : document.status === "PAID"
                          ? "paid"
                  : "draft"
                }
              />
              <Badge
                label={`Approval: ${document.approvalStatus}`}
                tone={
                  document.approvalStatus === "APPROVED"
                    ? "signed"
                    : document.approvalStatus === "REVIEW"
                      ? "review"
                      : "draft"
                }
              />
              <Badge label={document.generationStatus} tone={generationStatusTone} />
              {hasEdits ? (
                <span className="rounded-full border border-[color:var(--border)] bg-[var(--muted)] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Unsaved changes
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating || isViewer}
            >
              {isGenerating ? "Generating..." : "Generate Draft"}
            </Button>
            {document.approvalStatus === "DRAFT" ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleApprovalUpdate("REVIEW")}
                disabled={isUpdatingApproval || isViewer}
              >
                Send to review
              </Button>
            ) : null}
            {document.approvalStatus === "REVIEW" ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleApprovalUpdate("DRAFT")}
                  disabled={isUpdatingApproval || !isAdmin}
                >
                  Send back
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprovalUpdate("APPROVED")}
                  disabled={isUpdatingApproval || !isAdmin}
                >
                  Approve
                </Button>
              </>
            ) : null}
            <Button variant="secondary" size="sm" onClick={handleDownloadPdf}>
              Download PDF
            </Button>
          </div>
        </div>
        <div className="mt-4 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Approval note
          </div>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Add a short rationale when sending for review, approving, or sending back.
          </p>
          <Textarea
            className="mt-3"
            rows={2}
            value={approvalNote}
            onChange={(event) => setApprovalNote(event.target.value)}
            placeholder="Optional note for the audit trail..."
            disabled={isViewer || isUpdatingApproval}
          />
        </div>
        {isViewer ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            You have view-only access. Editing and draft generation are disabled.
          </p>
        ) : null}
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Draft Jobs
            </div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Monitor automated draft generation attempts.
            </p>
          </div>
          {latestDraftJob?.status === "FAILED" && isAdmin ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRetryDraftJob}
              disabled={isRetryingDraft}
            >
              {isRetryingDraft ? "Retrying..." : "Retry draft"}
            </Button>
          ) : null}
        </div>

        {isDraftJobsLoading ? (
          <div className="mt-4">
            <LoadingState label="Loading draft jobs..." />
          </div>
        ) : isDraftJobsError ? (
          <div className="mt-4">
            <EmptyState
              title="Draft jobs unavailable"
              description="We could not load draft job history."
            />
          </div>
        ) : !draftJobs || draftJobs.data.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No draft jobs yet"
              description="Generate a draft to create the first job."
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {latestDraftJob ? (
              <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      Latest job
                    </div>
                    <div className="mt-2 text-sm text-[var(--foreground)]">
                      {new Date(latestDraftJob.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge label={latestDraftJob.status} tone={draftJobStatusTone} />
                </div>
                {latestDraftJob.lastError ? (
                  <p className="mt-3 text-xs text-[var(--danger)]">{latestDraftJob.lastError}</p>
                ) : null}
              </div>
            ) : null}

            <DataTable columns={["Time", "Status", "Attempts", "Error"]}>
              {draftJobs.data.map((job) => (
                <tr
                  key={job.id}
                  className="border-t border-[color:var(--border)] hover:bg-[var(--muted)]"
                >
                  <td className="px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-[var(--foreground)]">{job.status}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
                    {job.attempts}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
                    {job.lastError ?? "—"}
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Draft Workspace
              </h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Manage the order and content of each section.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(true)}
              disabled={isViewer}
            >
              Add section
            </Button>
          </div>

          {activeSections.length === 0 ? (
            <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[color:var(--border)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
              No sections loaded yet. Trigger Generate Draft or add a new section.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {activeSections.map((section, index) => (
                <div
                  key={section.id}
                  className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Input
                      className="bg-[var(--surface)] text-sm font-semibold"
                      value={section.title}
                      onChange={(event) => updateSection(index, "title", event.target.value)}
                      disabled={isViewer}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => reorderSection(index, "up")}
                        disabled={isViewer}
                      >
                        Up
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => reorderSection(index, "down")}
                        disabled={isViewer}
                      >
                        Down
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    className="mt-3"
                    rows={4}
                    value={section.content}
                    onChange={(event) => updateSection(index, "content", event.target.value)}
                    disabled={isViewer}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Details
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-sm">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Title
              </span>
              <Input
                className="bg-[var(--surface)]"
                value={activeTitle}
                onChange={(event) => {
                  if (!hasEdits) {
                    setSections(mappedSections);
                  }
                  ensureDraft();
                  setTitle(event.target.value);
                }}
                disabled={isViewer}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Status
              </span>
              <Select
                className="bg-[var(--surface)] text-sm"
                value={activeStatus}
                onChange={(event) => {
                  if (!hasEdits) {
                    setSections(mappedSections);
                  }
                  ensureDraft();
                  setStatus(event.target.value as DocumentStatus);
                }}
                disabled={isViewer}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </label>
          </div>
          <div className="mt-6 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Public sharing
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Enable a read-only link you can share with clients.
                </p>
              </div>
              <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                <span>Enable</span>
                <span className="relative inline-flex h-6 w-11 items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isPublic}
                    onChange={(event) => handleToggleSharing(event.target.checked)}
                    disabled={!canShare || isUpdatingSharing}
                  />
                  <span className="h-6 w-11 rounded-full bg-[color:var(--border)] transition peer-checked:bg-[var(--brand)] peer-disabled:opacity-60" />
                  <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                </span>
              </label>
            </div>
            {isPublic ? (
              <div className="mt-4 space-y-3">
                <Input
                  className="bg-[var(--surface)] text-xs"
                  value={publicLink}
                  readOnly
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyLink}
                    disabled={isUpdatingSharing}
                  >
                    Copy public link
                  </Button>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Anyone with the link can view this document.
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[color:var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--muted-foreground)]">
                Public sharing is disabled. Toggle it on to generate a shareable link.
                {!canShare ? " Only admins can enable sharing." : ""}
              </div>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || isViewer || !hasEdits}
            className="mt-6 w-full"
            size="lg"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Approval notes
            </div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Latest approval rationale and decision history.
            </p>
          </div>
        </div>
        {document.approvalComments && document.approvalComments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {document.approvalComments.slice(0, 5).map((comment) => (
              <div
                key={comment.id}
                className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">
                    {comment.actor?.name ??
                      comment.actor?.email ??
                      (comment.actorUserId ? "User" : "System")}
                  </span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {comment.status}
                </div>
                <p className="mt-2 text-sm text-[var(--foreground)]">{comment.note}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[color:var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted-foreground)]">
            No approval notes yet. Add a note when updating approval status.
          </div>
        )}
      </Card>

      <ModalShell
        title="Add new section"
        description="Create a new section for this document."
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddSection}>
              Add section
            </Button>
          </>
        }
      >
        <div className="grid gap-4 text-sm">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Title
            </span>
            <Input
              className="bg-[var(--surface)] text-sm"
              value={newSectionTitle}
              onChange={(event) => setNewSectionTitle(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Content
            </span>
            <Textarea
              rows={4}
              value={newSectionContent}
              onChange={(event) => setNewSectionContent(event.target.value)}
            />
          </label>
        </div>
      </ModalShell>
    </div>
  );
}
