import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { listProjectsQuerySchema } from "@/features/projects/schemas";
import * as service from "@/features/projects/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = listProjectsQuerySchema.parse({
      clientId: searchParams.get("clientId") ?? undefined,
    });
    const user = await requireAuth();
    const projects = await service.listProjects(user.orgId, query.clientId);
    return NextResponse.json(successResponse(projects));
  } catch (error) {
    return handleApiError(error, request);
  }
}
