import type { NotificationType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ListNotificationsQuery } from "./schemas";

export async function listNotifications(
  userId: string,
  organizationId: string,
  query: ListNotificationsQuery,
) {
  return prisma.notification.findMany({
    where: {
      userId,
      organizationId,
      ...(query.unreadOnly ? { readAt: null } : {}),
    },
    include: {
      actor: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
  });
}

export async function countNotifications(
  userId: string,
  organizationId: string,
  unreadOnly?: boolean,
) {
  return prisma.notification.count({
    where: {
      userId,
      organizationId,
      ...(unreadOnly ? { readAt: null } : {}),
    },
  });
}

export async function createNotification(input: {
  organizationId: string;
  userId: string;
  actorUserId?: string | null;
  type: NotificationType;
  metadata: Prisma.InputJsonValue;
}) {
  return prisma.notification.create({
    data: {
      organizationId: input.organizationId,
      userId: input.userId,
      actorUserId: input.actorUserId ?? null,
      type: input.type,
      metadata: input.metadata,
    },
  });
}

export async function markNotificationRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string, organizationId: string) {
  return prisma.notification.updateMany({
    where: { userId, organizationId, readAt: null },
    data: { readAt: new Date() },
  });
}
