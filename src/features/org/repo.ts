import type { MembershipRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type OrganizationMembershipRecord = {
  id: string;
  role: MembershipRole;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export async function listUserOrganizations(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function listMembers(organizationId: string): Promise<OrganizationMembershipRecord[]> {
  return prisma.membership.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getMembership(organizationId: string, userId: string) {
  return prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
}

export async function findMembershipByEmail(organizationId: string, email: string) {
  return prisma.membership.findFirst({
    where: {
      organizationId,
      user: {
        email,
      },
    },
  });
}

export async function updateMemberRole(organizationId: string, userId: string, role: MembershipRole) {
  return prisma.membership.update({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    data: { role },
  });
}

export async function removeMember(organizationId: string, userId: string) {
  return prisma.membership.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
}

export async function createInvite(data: Prisma.InviteCreateInput) {
  return prisma.invite.create({ data });
}

export async function getInviteByToken(token: string) {
  return prisma.invite.findUnique({ where: { token } });
}

export async function markInviteAccepted(inviteId: string) {
  return prisma.invite.update({
    where: { id: inviteId },
    data: { acceptedAt: new Date() },
  });
}

export async function createMembership(data: Prisma.MembershipCreateInput) {
  return prisma.membership.create({ data });
}

export async function createMembershipFromInvite(input: {
  inviteId: string;
  organizationId: string;
  userId: string;
  role: MembershipRole;
}) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const membership = await tx.membership.create({
      data: {
        organization: { connect: { id: input.organizationId } },
        user: { connect: { id: input.userId } },
        role: input.role,
      },
    });
    await tx.invite.update({
      where: { id: input.inviteId },
      data: { acceptedAt: new Date() },
    });
    return membership;
  });
}
