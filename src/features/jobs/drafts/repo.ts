import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ListDraftJobsQuery } from "./schemas";

export type DraftJobListResult = {
  items: Prisma.DraftJobGetPayload<Record<string, never>>[];
  total: number;
};

export async function createJob(organizationId: string, documentId: string) {
  return prisma.draftJob.create({
    data: {
      organization: { connect: { id: organizationId } },
      document: { connect: { id: documentId } },
      status: "QUEUED",
    },
  });
}

export async function getJobByIdForOrg(jobId: string, organizationId: string) {
  return prisma.draftJob.findFirst({
    where: {
      id: jobId,
      organizationId,
    },
  });
}

export async function markProcessing(jobId: string) {
  return prisma.draftJob.update({
    where: { id: jobId },
    data: {
      status: "PROCESSING",
      lastError: null,
    },
  });
}

export async function markSucceeded(jobId: string) {
  return prisma.draftJob.update({
    where: { id: jobId },
    data: {
      status: "SUCCEEDED",
      lastError: null,
    },
  });
}

export async function markFailed(jobId: string, error: string) {
  return prisma.draftJob.update({
    where: { id: jobId },
    data: {
      status: "FAILED",
      lastError: error,
    },
  });
}

export async function retryJob(jobId: string) {
  return prisma.draftJob.update({
    where: { id: jobId },
    data: {
      status: "QUEUED",
      lastError: null,
      attempts: { increment: 1 },
    },
  });
}

export async function listJobs(
  organizationId: string,
  query: ListDraftJobsQuery,
): Promise<DraftJobListResult> {
  const where: Prisma.DraftJobWhereInput = {
    organizationId,
    ...(query.documentId ? { documentId: query.documentId } : {}),
    ...(query.status ? { status: query.status } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.draftJob.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.draftJob.count({ where }),
  ]);

  return { items, total };
}
