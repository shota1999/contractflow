export const notificationTypeValues = [
  "DOCUMENT_REVIEW_REQUESTED",
  "DOCUMENT_APPROVED",
  "DOCUMENT_SENT_BACK",
] as const;

export type NotificationType = (typeof notificationTypeValues)[number];
