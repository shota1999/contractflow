import type { AuditAction, AuditTargetType, Prisma } from "@prisma/client";
import type { ListAuditEventsQuery } from "./schemas";
import * as repo from "./repo";

export type { AuditAction, AuditTargetType };

export async function createEvent(input: {
  organizationId: string;
  actorUserId?: string | null;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  return repo.createEvent({
    organization: { connect: { id: input.organizationId } },
    actor: input.actorUserId ? { connect: { id: input.actorUserId } } : undefined,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId ?? null,
    metadata: input.metadata ?? {},
  });
}

export async function listEvents(organizationId: string, query: ListAuditEventsQuery) {
  const { items, total } = await repo.listEvents(organizationId, query);
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
