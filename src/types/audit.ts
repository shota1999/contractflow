export const auditActionValues = [
  "INVITE_CREATED",
  "INVITE_ACCEPTED",
  "MEMBER_ROLE_UPDATED",
  "MEMBER_REMOVED",
  "DOCUMENT_CREATED",
  "DOCUMENT_UPDATED",
  "DOCUMENT_SECTIONS_UPDATED",
  "DOCUMENT_SHARING_UPDATED",
  "DOCUMENT_APPROVAL_UPDATED",
  "DRAFT_ENQUEUED",
  "DRAFT_SUCCEEDED",
  "DRAFT_FAILED",
] as const;

export type AuditAction = (typeof auditActionValues)[number];

export const auditTargetTypeValues = [
  "ORGANIZATION",
  "INVITE",
  "MEMBER",
  "DOCUMENT",
  "DOCUMENT_SECTION",
  "DRAFT",
] as const;

export type AuditTargetType = (typeof auditTargetTypeValues)[number];
