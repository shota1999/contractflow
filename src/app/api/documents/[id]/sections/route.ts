import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { documentIdSchema, documentSectionsSchema } from "@/features/documents/schemas";
import { documentRoleMatrix } from "@/features/documents/roles";
import * as service from "@/features/documents/service";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const parsedId = documentIdSchema.parse(id);
    const payload = await request.json();
    const input = documentSectionsSchema.parse(payload);
    const user = await requireRole([...documentRoleMatrix.update]);
    const sections = await service.replaceDocumentSections(parsedId, user.orgId, input.sections);
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "DOCUMENT_SECTIONS_UPDATED" satisfies AuditAction,
      targetType: "DOCUMENT_SECTION" satisfies AuditTargetType,
      targetId: parsedId,
      metadata: {
        count: sections.length,
      },
    });
    return NextResponse.json(successResponse({ sections }));
  } catch (error) {
    return handleApiError(error, request);
  }
}
