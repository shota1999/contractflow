export const draftJobStatusValues = ["QUEUED", "PROCESSING", "SUCCEEDED", "FAILED"] as const;

export type DraftJobStatus = (typeof draftJobStatusValues)[number];
