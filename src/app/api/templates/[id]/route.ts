import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { templateIdSchema, updateTemplateSchema } from "@/features/templates/schemas";
import * as service from "@/features/templates/service";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const templateId = templateIdSchema.parse(id);
    const payload = await request.json();
    const input = updateTemplateSchema.parse(payload);
    const user = await requireRole(["OWNER", "ADMIN"]);
    const template = await service.updateTemplate(templateId, input, user.orgId);
    return NextResponse.json(successResponse(template));
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const templateId = templateIdSchema.parse(id);
    const user = await requireRole(["OWNER", "ADMIN"]);
    const result = await service.deleteTemplate(templateId, user.orgId);
    return NextResponse.json(successResponse(result));
  } catch (error) {
    return handleApiError(error, request);
  }
}
