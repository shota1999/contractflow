import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { documentIdSchema, updateDocumentSchema } from "@/features/documents/schemas";
import * as service from "@/features/documents/service";
import { documentRoleMatrix } from "@/features/documents/roles";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const parsedId = documentIdSchema.parse(id);
    const user = await requireRole([...documentRoleMatrix.read]);
    const document = await service.getDocument(parsedId, user.orgId);
    return NextResponse.json(successResponse(document));
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const parsedId = documentIdSchema.parse(id);
    const payload = await request.json();
    const input = updateDocumentSchema.parse(payload);
    const user = await requireRole([...documentRoleMatrix.update]);
    const document = await service.updateDocument(parsedId, input, user.orgId);
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "DOCUMENT_UPDATED" satisfies AuditAction,
      targetType: "DOCUMENT" satisfies AuditTargetType,
      targetId: parsedId,
      metadata: {
        fields: Object.keys(input),
      },
    });
    return NextResponse.json(successResponse(document));
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const parsedId = documentIdSchema.parse(id);
    const user = await requireRole([...documentRoleMatrix.delete]);
    const document = await service.deleteDocument(parsedId, user.orgId);
    return NextResponse.json(successResponse(document));
  } catch (error) {
    return handleApiError(error, request);
  }
}
