import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth, requireRole } from "@/lib/auth";
import { documentApprovalSchema, documentIdSchema } from "@/features/documents/schemas";
import * as service from "@/features/documents/service";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";
import { createApprovalNotifications } from "@/features/notifications/service";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const documentId = documentIdSchema.parse(id);
    const payload = await request.json();
    const input = documentApprovalSchema.parse(payload);
    const user = await requireAuth();

    if (input.status === "APPROVED" || input.status === "DRAFT") {
      await requireRole(["OWNER", "ADMIN"]);
    } else if (user.role === "VIEWER") {
      await requireRole(["OWNER", "ADMIN", "MEMBER"]);
    }

    const result = await service.updateApprovalStatus(documentId, user.orgId, input.status, {
      actorUserId: user.id,
      note: input.note || null,
    });

    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "DOCUMENT_APPROVAL_UPDATED" satisfies AuditAction,
      targetType: "DOCUMENT" satisfies AuditTargetType,
      targetId: documentId,
      metadata: {
        previousStatus: result.previousStatus,
        approvalStatus: input.status,
        note: input.note || null,
      },
    });

    try {
      await createApprovalNotifications({
        organizationId: user.orgId,
        actorUserId: user.id,
        documentId,
        documentTitle: result.document.title,
        status: input.status,
      });
    } catch {
      // Best-effort notifications.
    }

    return NextResponse.json(successResponse(result.document));
  } catch (error) {
    return handleApiError(error, request);
  }
}
