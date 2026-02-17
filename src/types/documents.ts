export const documentTypeValues = ["CONTRACT", "PROPOSAL"] as const;
export type DocumentType = (typeof documentTypeValues)[number];

export const documentStatusValues = ["DRAFT", "REVIEW", "SENT", "SIGNED", "PAID"] as const;
export type DocumentStatus = (typeof documentStatusValues)[number];

export const documentGenerationStatusValues = [
  "IDLE",
  "QUEUED",
  "PROCESSING",
  "FAILED",
  "SUCCEEDED",
] as const;
export type DocumentGenerationStatus = (typeof documentGenerationStatusValues)[number];

export const approvalStatusValues = ["DRAFT", "REVIEW", "APPROVED"] as const;
export type ApprovalStatus = (typeof approvalStatusValues)[number];
