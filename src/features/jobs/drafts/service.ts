import { AppError } from "@/lib/errors";
import type { ListDraftJobsQuery } from "./schemas";
import * as repo from "./repo";

export async function createJob(organizationId: string, documentId: string) {
  return repo.createJob(organizationId, documentId);
}

export async function markProcessing(jobId: string) {
  return repo.markProcessing(jobId);
}

export async function markSucceeded(jobId: string) {
  return repo.markSucceeded(jobId);
}

export async function markFailed(jobId: string, error: string) {
  return repo.markFailed(jobId, error);
}

export async function listJobs(organizationId: string, query: ListDraftJobsQuery) {
  const { items, total } = await repo.listJobs(organizationId, query);
  const totalPages = Math.ceil(total / query.pageSize) || 1;

  return {
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages,
    },
  };
}

export async function retryJob(organizationId: string, jobId: string, actorUserId: string) {
  const job = await repo.getJobByIdForOrg(jobId, organizationId);
  if (!job) {
    throw new AppError("NOT_FOUND", "Draft job not found.", 404);
  }
  if (job.status !== "FAILED") {
    throw new AppError("CONFLICT", "Only failed jobs can be retried.", 409);
  }

  const updated = await repo.retryJob(jobId);

  return {
    job: updated,
    payload: {
      documentId: updated.documentId,
      organizationId,
      draftJobId: updated.id,
      actorUserId,
    },
  };
}
