import { randomUUID } from "crypto";
import { hash } from "bcryptjs";
import { AppError } from "@/lib/errors";
import type {
  RegisterInput,
  ResetPasswordConfirmInput,
  ResetPasswordRequestInput,
} from "./schemas";
import * as repo from "./repo";
import { enqueueVerificationEmail } from "@/features/email/service";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const buildDisplayName = (input: RegisterInput, normalizedEmail: string) =>
  input.name?.trim() || normalizedEmail.split("@")[0] || "New User";

const buildOrganizationName = (input: RegisterInput, fallbackName: string) =>
  input.orgName?.trim() || fallbackName || "My Workspace";

const verificationLifetimeMs = 24 * 60 * 60 * 1000;
const resetLifetimeMs = 45 * 60 * 1000;

async function generateUniqueSlug(seed: string) {
  const base = slugify(seed) || "workspace";
  let candidate = base;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await repo.findOrganizationBySlug(candidate);
    if (!existing) {
      return candidate;
    }
    candidate = `${base}-${randomUUID().slice(0, 6)}`;
  }

  throw new AppError("INTERNAL_ERROR", "Unable to create organization slug.", 500);
}

async function createVerificationTokenForUser(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + verificationLifetimeMs);
  await repo.deleteEmailVerificationTokensForUser(userId);
  await repo.createEmailVerificationToken({ userId, token, expiresAt });
  return { token, expiresAt };
}

export async function registerUser(input: RegisterInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await repo.findUserByEmail(normalizedEmail);
  if (existing) {
    throw new AppError("CONFLICT", "An account with this email already exists.", 409);
  }

  const displayName = buildDisplayName(input, normalizedEmail);
  const organizationName = buildOrganizationName(input, displayName);
  const slug = await generateUniqueSlug(input.orgName ?? displayName ?? normalizedEmail);
  const passwordHash = await hash(input.password, 10);

  const { user, organization } = await repo.createUserWithOrgAndMembership({
    email: normalizedEmail,
    name: displayName,
    passwordHash,
    orgName: organizationName,
    orgSlug: slug,
  });

  const verification = await createVerificationTokenForUser(user.id);
  await enqueueVerificationEmail({
    email: user.email,
    name: user.name,
    token: verification.token,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    organization: {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
    },
    verificationToken: verification.token,
  };
}

export async function verifyEmailToken(token: string) {
  const record = await repo.getEmailVerificationTokenByToken(token);
  if (!record) {
    throw new AppError("NOT_FOUND", "Verification link is invalid.", 404);
  }

  if (record.expiresAt < new Date()) {
    await repo.deleteEmailVerificationToken(record.id);
    throw new AppError("CONFLICT", "Verification link expired.", 409);
  }

  if (record.user.emailVerifiedAt) {
    await repo.deleteEmailVerificationToken(record.id);
    throw new AppError("CONFLICT", "Email already verified.", 409);
  }

  await repo.updateUserEmailVerifiedAt(record.userId, new Date());
  await repo.deleteEmailVerificationToken(record.id);

  return { userId: record.userId, email: record.user.email };
}

export async function resendVerification(userId: string) {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.", 404);
  }

  if (user.emailVerifiedAt) {
    throw new AppError("CONFLICT", "Email already verified.", 409);
  }

  const verification = await createVerificationTokenForUser(user.id);
  await enqueueVerificationEmail({
    email: user.email,
    name: user.name,
    token: verification.token,
  });

  return {
    userId: user.id,
    email: user.email,
    token: verification.token,
    expiresAt: verification.expiresAt,
  };
}

async function createPasswordResetTokenForUser(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + resetLifetimeMs);
  await repo.deletePasswordResetTokensForUser(userId);
  await repo.createPasswordResetToken({ userId, token, expiresAt });
  return { token, expiresAt };
}

export async function requestPasswordReset(input: ResetPasswordRequestInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = await repo.findUserByEmail(normalizedEmail);
  if (!user?.passwordHash) {
    return { delivered: true };
  }

  const reset = await createPasswordResetTokenForUser(user.id);
  return {
    delivered: true,
    userId: user.id,
    email: user.email,
    token: reset.token,
    expiresAt: reset.expiresAt,
  };
}

export async function confirmPasswordReset(input: ResetPasswordConfirmInput) {
  const record = await repo.getPasswordResetTokenByToken(input.token);
  if (!record) {
    throw new AppError("NOT_FOUND", "Reset link is invalid.", 404);
  }

  if (record.expiresAt < new Date()) {
    await repo.deletePasswordResetToken(record.id);
    throw new AppError("CONFLICT", "Reset link expired.", 409);
  }

  const passwordHash = await hash(input.password, 10);
  await repo.updateUserPasswordHash(record.userId, passwordHash);
  await repo.deletePasswordResetTokensForUser(record.userId);

  return { userId: record.userId, email: record.user.email };
}
