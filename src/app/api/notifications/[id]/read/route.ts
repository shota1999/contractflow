import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { notificationIdSchema } from "@/features/notifications/schemas";
import * as service from "@/features/notifications/service";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const notificationId = notificationIdSchema.parse(id);
    const user = await requireAuth();
    await service.markNotificationRead(notificationId, user.id);
    return NextResponse.json(successResponse({ id: notificationId }));
  } catch (error) {
    return handleApiError(error, request);
  }
}
