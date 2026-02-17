import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { createDocumentSchema, listDocumentsQuerySchema } from "@/features/documents/schemas";
import * as service from "@/features/documents/service";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = listDocumentsQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      type: searchParams.get("type") ?? undefined,
    });

    const user = await requireAuth();
    const result = await service.listDocuments(user.orgId, query);
    return NextResponse.json(successResponse(result.items, result.meta));
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = createDocumentSchema.parse(payload);
    const user = await requireAuth();
    const document = await service.createDocument(input, user.orgId, user.id);
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "DOCUMENT_CREATED" satisfies AuditAction,
      targetType: "DOCUMENT" satisfies AuditTargetType,
      targetId: document.id,
      metadata: {
        title: document.title,
        type: document.type,
      },
    });

    return NextResponse.json(successResponse(document), { status: 201 });
  } catch (error) {
    return handleApiError(error, request);
  }
}
