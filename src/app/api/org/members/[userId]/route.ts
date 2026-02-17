import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { memberIdSchema, memberRoleSchema } from "@/features/org/schemas";
import * as service from "@/features/org/service";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";

type RouteParams = {
  params: Promise<{ userId: string }>;
};

const manageRoles = ["OWNER", "ADMIN"];

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const parsedUserId = memberIdSchema.parse(userId);
    const payload = await request.json();
    const input = memberRoleSchema.parse(payload);
    const user = await requireRole(manageRoles);
    const member = await service.getMember(user.orgId, parsedUserId);

    if (member.role === "OWNER" && user.role !== "OWNER") {
      throw new AppError("FORBIDDEN", "Only owners can update owner roles.", 403);
    }
    if (input.role === "OWNER" && user.role !== "OWNER") {
      throw new AppError("FORBIDDEN", "Only owners can assign owner roles.", 403);
    }

    const updated = await service.updateMemberRole(user.orgId, parsedUserId, input.role);
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "MEMBER_ROLE_UPDATED" satisfies AuditAction,
      targetType: "MEMBER" satisfies AuditTargetType,
      targetId: parsedUserId,
      metadata: {
        fromRole: member.role,
        toRole: input.role,
      },
    });
    return NextResponse.json(successResponse(updated));
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const parsedUserId = memberIdSchema.parse(userId);
    const user = await requireRole(manageRoles);
    const member = await service.getMember(user.orgId, parsedUserId);

    if (member.role === "OWNER" && user.role !== "OWNER") {
      throw new AppError("FORBIDDEN", "Only owners can remove owners.", 403);
    }

    const removed = await service.removeMember(user.orgId, parsedUserId);
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "MEMBER_REMOVED" satisfies AuditAction,
      targetType: "MEMBER" satisfies AuditTargetType,
      targetId: parsedUserId,
      metadata: {
        userId: parsedUserId,
        role: member.role,
      },
    });
    return NextResponse.json(successResponse(removed));
  } catch (error) {
    return handleApiError(error, request);
  }
}
