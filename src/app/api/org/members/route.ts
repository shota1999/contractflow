import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import * as service from "@/features/org/service";

const readRoles = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

export async function GET(request: Request) {
  try {
    const user = await requireRole(readRoles);
    const members = await service.listMembers(user.orgId);
    return NextResponse.json(successResponse(members));
  } catch (error) {
    return handleApiError(error, request);
  }
}
