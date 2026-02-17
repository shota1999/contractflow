import { randomUUID } from "crypto";
import type { MembershipRole } from "@prisma/client";
import { AppError } from "@/lib/errors";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";
import { findUserById } from "@/features/auth/repo";
import * as repo from "./repo";

const inviteLifetimeMs = 7 * 24 * 60 * 60 * 1000;

export async function listOrganizations(userId: string) {
  const memberships = await repo.listUserOrganizations(userId);
  return memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    role: membership.role,
  }));
}

export async function listMembers(organizationId: string) {
  const members = await repo.listMembers(organizationId);
  return members.map((membership) => ({
    userId: membership.user.id,
    name: membership.user.name,
    email: membership.user.email,
    role: membership.role,
    joinedAt: membership.createdAt,
  }));
}

export async function createInvite(organizationId: string, email: string, role: MembershipRole) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await repo.findMembershipByEmail(organizationId, normalizedEmail);
  if (existing) {
    throw new AppError("CONFLICT", "User is already a member of this organization.", 409);
  }

  return repo.createInvite({
    organization: { connect: { id: organizationId } },
    email: normalizedEmail,
    role,
    token: randomUUID(),
    expiresAt: new Date(Date.now() + inviteLifetimeMs),
  });
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  role: MembershipRole,
) {
  const membership = await repo.getMembership(organizationId, userId);
  if (!membership) {
    throw new AppError("NOT_FOUND", "Member not found.", 404);
  }

  return repo.updateMemberRole(organizationId, userId, role);
}

export async function removeMember(organizationId: string, userId: string) {
  const membership = await repo.getMembership(organizationId, userId);
  if (!membership) {
    throw new AppError("NOT_FOUND", "Member not found.", 404);
  }

  return repo.removeMember(organizationId, userId);
}

export async function getMember(organizationId: string, userId: string) {
  const membership = await repo.getMembership(organizationId, userId);
  if (!membership) {
    throw new AppError("NOT_FOUND", "Member not found.", 404);
  }
  return membership;
}

export async function acceptInvite(token: string, userId: string) {
  const invite = await repo.getInviteByToken(token);
  if (!invite) {
    throw new AppError("NOT_FOUND", "Invite not found.", 404);
  }
  if (invite.acceptedAt) {
    throw new AppError("CONFLICT", "Invite already accepted.", 409);
  }
  if (invite.expiresAt < new Date()) {
    throw new AppError("CONFLICT", "Invite expired.", 409);
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.", 404);
  }

  const normalizedUserEmail = user.email.trim().toLowerCase();
  const normalizedInviteEmail = invite.email.trim().toLowerCase();
  if (normalizedUserEmail !== normalizedInviteEmail) {
    throw new AppError("FORBIDDEN", "Invite email does not match the signed-in user.", 403, {
      inviteEmail: invite.email,
      userEmail: user.email,
    });
  }

  if (!user.emailVerifiedAt) {
    throw new AppError("FORBIDDEN", "Email verification required before accepting invite.", 403, {
      action: "verify_email",
    });
  }

  const existing = await repo.getMembership(invite.organizationId, userId);
  if (existing) {
    throw new AppError("CONFLICT", "User is already a member of this organization.", 409);
  }

  const membership = await repo.createMembershipFromInvite({
    inviteId: invite.id,
    organizationId: invite.organizationId,
    userId,
    role: invite.role,
  });

  try {
    await createEvent({
      organizationId: invite.organizationId,
      actorUserId: userId,
      action: "INVITE_ACCEPTED" satisfies AuditAction,
      targetType: "INVITE" satisfies AuditTargetType,
      targetId: invite.id,
      metadata: {
        email: invite.email,
        role: invite.role,
        acceptedUserId: userId,
      },
    });
  } catch {
    // Best-effort audit logging.
  }

  return membership;
}
