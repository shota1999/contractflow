import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import * as service from "@/features/clients/service";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const clients = await service.listClients(user.orgId);
    return NextResponse.json(successResponse(clients));
  } catch (error) {
    return handleApiError(error, request);
  }
}
