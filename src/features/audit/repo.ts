import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ListAuditEventsQuery } from "./schemas";

export type AuditEventListResult = {
  items: Prisma.AuditEventGetPayload<{
    include: {
      actor: { select: { id: true; name: true; email: true } };
    };
  }>[];
  total: number;
};

export async function createEvent(data: Prisma.AuditEventCreateInput) {
  return prisma.auditEvent.create({ data });
}

export async function listEvents(
  organizationId: string,
  query: ListAuditEventsQuery,
): Promise<AuditEventListResult> {
  const where: Prisma.AuditEventWhereInput = {
    organizationId,
    ...(query.action ? { action: query.action } : {}),
    ...(query.targetType ? { targetType: query.targetType } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.auditEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditEvent.count({ where }),
  ]);

  return { items, total };
}
