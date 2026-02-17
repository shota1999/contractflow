import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { listAuditEventsQuerySchema } from "@/features/audit/schemas";
import * as auditService from "@/features/audit/service";

const readRoles = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = listAuditEventsQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      action: searchParams.get("action") ?? undefined,
      targetType: searchParams.get("targetType") ?? undefined,
    });

    const user = await requireRole(readRoles);
    const result = await auditService.listEvents(user.orgId, query);
    return NextResponse.json(successResponse(result.items, result.meta));
  } catch (error) {
    return handleApiError(error, request);
  }
}
