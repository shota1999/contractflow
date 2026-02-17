import { z } from "zod";
import { MembershipRole } from "@prisma/client";

export const inviteCreateSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(MembershipRole),
});

export const inviteAcceptSchema = z.object({
  token: z.string().min(1, "Invite token is required."),
});

export const memberRoleSchema = z.object({
  role: z.nativeEnum(MembershipRole),
});

export const memberIdSchema = z.string().min(1, "Member id is required.");

export type InviteCreateInput = z.infer<typeof inviteCreateSchema>;
export type InviteAcceptInput = z.infer<typeof inviteAcceptSchema>;
export type MemberRoleInput = z.infer<typeof memberRoleSchema>;
