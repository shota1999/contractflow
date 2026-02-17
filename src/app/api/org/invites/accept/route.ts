import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { inviteAcceptSchema } from "@/features/org/schemas";
import * as service from "@/features/org/service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = inviteAcceptSchema.parse(payload);
    const user = await requireAuth();
    const membership = await service.acceptInvite(input.token, user.id);
    return NextResponse.json(successResponse(membership));
  } catch (error) {
    return handleApiError(error, request);
  }
}
