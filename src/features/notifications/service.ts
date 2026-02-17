import type { NotificationType } from "@prisma/client";
import { AppError } from "@/lib/errors";
import type { ListNotificationsQuery } from "./schemas";
import * as repo from "./repo";
import * as orgRepo from "@/features/org/repo";

export async function listNotifications(
  userId: string,
  organizationId: string,
  query: ListNotificationsQuery,
) {
  const [items, total, unread] = await Promise.all([
    repo.listNotifications(userId, organizationId, query),
    repo.countNotifications(userId, organizationId),
    repo.countNotifications(userId, organizationId, true),
  ]);

  const totalPages = Math.ceil(total / query.pageSize) || 1;

  return {
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages,
      unreadCount: unread,
    },
  };
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const result = await repo.markNotificationRead(notificationId, userId);
  if (result.count === 0) {
    throw new AppError("NOT_FOUND", "Notification not found.", 404);
  }
  return result;
}

export async function createApprovalNotifications(input: {
  organizationId: string;
  actorUserId: string;
  documentId: string;
  documentTitle: string;
  status: "REVIEW" | "APPROVED" | "DRAFT";
}) {
  const members = await orgRepo.listMembers(input.organizationId);
  const recipients = members.map((membership) => membership.user.id).filter((id) => id !== input.actorUserId);

  if (recipients.length === 0) {
    return { count: 0 };
  }

  const typeMap: Record<typeof input.status, NotificationType> = {
    REVIEW: "DOCUMENT_REVIEW_REQUESTED",
    APPROVED: "DOCUMENT_APPROVED",
    DRAFT: "DOCUMENT_SENT_BACK",
  };

  const type = typeMap[input.status];

  await Promise.all(
    recipients.map((userId) =>
      repo.createNotification({
        organizationId: input.organizationId,
        userId,
        actorUserId: input.actorUserId,
        type,
        metadata: {
          documentId: input.documentId,
          documentTitle: input.documentTitle,
          approvalStatus: input.status,
        },
      }),
    ),
  );

  return { count: recipients.length };
}
