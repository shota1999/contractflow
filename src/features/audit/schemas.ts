import { z } from "zod";
import { AuditAction, AuditTargetType } from "@prisma/client";

export const listAuditEventsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  action: z.nativeEnum(AuditAction).optional(),
  targetType: z.nativeEnum(AuditTargetType).optional(),
});

export type ListAuditEventsQuery = z.infer<typeof listAuditEventsQuerySchema>;
