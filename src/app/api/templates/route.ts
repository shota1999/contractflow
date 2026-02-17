import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth, requireRole } from "@/lib/auth";
import { createTemplateSchema } from "@/features/templates/schemas";
import * as service from "@/features/templates/service";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const templates = await service.listTemplates(user.orgId);
    return NextResponse.json(successResponse(templates));
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = createTemplateSchema.parse(payload);
    const user = await requireRole(["OWNER", "ADMIN"]);
    const template = await service.createTemplate(input, user.orgId, user.id);
    return NextResponse.json(successResponse(template), { status: 201 });
  } catch (error) {
    return handleApiError(error, request);
  }
}
