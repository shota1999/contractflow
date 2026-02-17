import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { listNotificationsQuerySchema } from "@/features/notifications/schemas";
import * as service from "@/features/notifications/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = listNotificationsQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      unreadOnly: searchParams.get("unreadOnly") ?? undefined,
    });

    const user = await requireAuth();
    const result = await service.listNotifications(user.id, user.orgId, query);
    return NextResponse.json(successResponse(result.items, result.meta));
  } catch (error) {
    return handleApiError(error, request);
  }
}
