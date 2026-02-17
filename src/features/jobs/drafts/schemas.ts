import { z } from "zod";
import { DraftJobStatus } from "@prisma/client";

export const draftJobIdSchema = z.string().min(1, "Draft job id is required.");

export const listDraftJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  documentId: z.string().min(1).optional(),
  status: z.nativeEnum(DraftJobStatus).optional(),
});

export type ListDraftJobsQuery = z.infer<typeof listDraftJobsQuerySchema>;
