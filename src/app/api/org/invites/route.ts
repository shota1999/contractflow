import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { inviteCreateSchema } from "@/features/org/schemas";
import * as service from "@/features/org/service";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";

const manageRoles = ["OWNER", "ADMIN"];

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = inviteCreateSchema.parse(payload);
    const user = await requireRole(manageRoles);

    if (input.role === "OWNER" && user.role !== "OWNER") {
      throw new AppError("FORBIDDEN", "Only owners can invite new owners.", 403);
    }

    const invite = await service.createInvite(user.orgId, input.email, input.role);
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "INVITE_CREATED" satisfies AuditAction,
      targetType: "INVITE" satisfies AuditTargetType,
      targetId: invite.id,
      metadata: {
        email: invite.email,
        role: invite.role,
      },
    });
    return NextResponse.json(successResponse(invite));
  } catch (error) {
    return handleApiError(error, request);
  }
}
