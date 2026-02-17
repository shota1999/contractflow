export const membershipRoleValues = ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const;

export type MembershipRole = (typeof membershipRoleValues)[number];
