import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import * as service from "@/features/org/service";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const organizations = await service.listOrganizations(user.id);
    const activeOrg = organizations.find((org: { id: string }) => org.id === user.orgId);
    if (!activeOrg) {
      throw new AppError("FORBIDDEN", "Organization access denied.", 403);
    }
    return NextResponse.json(
      successResponse({
        activeOrgId: activeOrg.id,
        activeOrg,
        organizations,
      }),
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
