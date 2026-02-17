export const documentRoleMatrix = {
  read: ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
  update: ["OWNER", "ADMIN", "MEMBER"],
  delete: ["OWNER", "ADMIN"],
  generateDraft: ["OWNER", "ADMIN", "MEMBER"],
  share: ["OWNER", "ADMIN"],
} as const;

export type DocumentAction = keyof typeof documentRoleMatrix;
