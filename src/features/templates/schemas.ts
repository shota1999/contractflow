import { z } from "zod";
import { DocumentType } from "@prisma/client";

export const templateIdSchema = z.string().min(1, "Template id is required.");

export const templateSectionInputSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(5000).optional().default(""),
  order: z.number().int().min(1),
});

export const createTemplateSchema = z.object({
  name: z.string().min(2, "Template name is required.").max(120),
  description: z.string().max(300).optional(),
  type: z.nativeEnum(DocumentType),
  sections: z.array(templateSectionInputSchema).min(1),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

export const updateTemplateSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    description: z.string().max(300).optional(),
    type: z.nativeEnum(DocumentType).optional(),
    sections: z.array(templateSectionInputSchema).optional(),
  })
  .superRefine((value, ctx) => {
    if (Object.keys(value).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided for update.",
      });
    }
  });

export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
