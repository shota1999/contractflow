import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findOrganizationBySlug(slug: string) {
  return prisma.organization.findUnique({ where: { slug } });
}

export async function createUserWithOrgAndMembership(input: {
  email: string;
  name: string;
  passwordHash: string;
  orgName: string;
  orgSlug: string;
}) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const organization = await tx.organization.create({
      data: {
        name: input.orgName,
        slug: input.orgSlug,
      },
    });

    const user = await tx.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash: input.passwordHash,
      },
    });

    const membership = await tx.membership.create({
      data: {
        organization: { connect: { id: organization.id } },
        user: { connect: { id: user.id } },
        role: "OWNER",
      },
    });

    return { organization, user, membership };
  });
}

export async function createEmailVerificationToken(input: {
  userId: string;
  token: string;
  expiresAt: Date;
}) {
  return prisma.emailVerificationToken.create({ data: input });
}

export async function getEmailVerificationTokenByToken(token: string) {
  return prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function deleteEmailVerificationToken(id: string) {
  return prisma.emailVerificationToken.delete({ where: { id } });
}

export async function deleteEmailVerificationTokensForUser(userId: string) {
  return prisma.emailVerificationToken.deleteMany({ where: { userId } });
}

export async function updateUserEmailVerifiedAt(userId: string, emailVerifiedAt: Date | null) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerifiedAt },
  });
}

export async function createPasswordResetToken(input: {
  userId: string;
  token: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({ data: input });
}

export async function getPasswordResetTokenByToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function deletePasswordResetToken(id: string) {
  return prisma.passwordResetToken.delete({ where: { id } });
}

export async function deletePasswordResetTokensForUser(userId: string) {
  return prisma.passwordResetToken.deleteMany({ where: { userId } });
}

export async function updateUserPasswordHash(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
