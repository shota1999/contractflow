import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { documentIdSchema, documentPublicSharingSchema } from "@/features/documents/schemas";
import * as service from "@/features/documents/service";
import { documentRoleMatrix } from "@/features/documents/roles";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const parsedId = documentIdSchema.parse(id);
    const payload = await request.json();
    const input = documentPublicSharingSchema.parse(payload);
    const user = await requireRole([...documentRoleMatrix.share]);
    const document = await service.updateDocumentPublicSharing(
      parsedId,
      user.orgId,
      input.isPublic,
    );
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "DOCUMENT_SHARING_UPDATED" satisfies AuditAction,
      targetType: "DOCUMENT" satisfies AuditTargetType,
      targetId: parsedId,
      metadata: {
        isPublic: input.isPublic,
      },
    });
    return NextResponse.json(successResponse(document));
  } catch (error) {
    return handleApiError(error, request);
  }
}
