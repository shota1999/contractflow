import { z } from "zod";
import { ApprovalStatus, DocumentStatus, DocumentType } from "@prisma/client";

export const documentIdSchema = z.string().min(1, "Document id is required.");
export const documentPublicTokenSchema = z.string().min(1, "Public token is required.");

export const documentSectionInputSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(5000).optional().default(""),
  order: z.number().int().min(1),
});

export const documentSectionsSchema = z.object({
  sections: z.array(documentSectionInputSchema).min(1),
});

export const listDocumentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.nativeEnum(DocumentStatus).optional(),
  type: z.nativeEnum(DocumentType).optional(),
});

export const createDocumentSchema = z.object({
  clientId: z.string().min(1).optional(),
  projectId: z.string().min(1).optional(),
  type: z.nativeEnum(DocumentType),
  status: z.nativeEnum(DocumentStatus).optional(),
  title: z.string().min(2).max(200),
  version: z.number().int().min(1).optional(),
  sections: z.array(documentSectionInputSchema).optional(),
});

export const updateDocumentSchema = z
  .object({
    clientId: z.string().min(1).optional(),
    projectId: z.string().min(1).optional(),
    type: z.nativeEnum(DocumentType).optional(),
    status: z.nativeEnum(DocumentStatus).optional(),
    title: z.string().min(2).max(200).optional(),
    version: z.number().int().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (Object.keys(value).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided for update.",
      });
    }
  });

export const documentPublicSharingSchema = z.object({
  isPublic: z.boolean(),
});

export const documentApprovalSchema = z.object({
  status: z.nativeEnum(ApprovalStatus),
  note: z
    .string()
    .trim()
    .max(500, "Approval note must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

export type ListDocumentsQuery = z.infer<typeof listDocumentsQuerySchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type DocumentSectionInput = z.infer<typeof documentSectionInputSchema>;
export type DocumentPublicSharingInput = z.infer<typeof documentPublicSharingSchema>;
export type DocumentApprovalInput = z.infer<typeof documentApprovalSchema>;
