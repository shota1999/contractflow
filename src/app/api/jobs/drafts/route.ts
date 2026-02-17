import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { listDraftJobsQuerySchema } from "@/features/jobs/drafts/schemas";
import * as service from "@/features/jobs/drafts/service";

const readRoles = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = listDraftJobsQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      documentId: searchParams.get("documentId") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    const user = await requireRole(readRoles);
    const result = await service.listJobs(user.orgId, query);
    return NextResponse.json(successResponse(result.items, result.meta));
  } catch (error) {
    return handleApiError(error, request);
  }
}
