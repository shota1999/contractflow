import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());

const utmSchema = z
  .object({
    utmSource: z.string().trim().min(1).optional(),
    utmMedium: z.string().trim().min(1).optional(),
    utmCampaign: z.string().trim().min(1).optional(),
    utmTerm: z.string().trim().min(1).optional(),
    utmContent: z.string().trim().min(1).optional(),
  })
  .strict();

export const leadCreateSchema = z
  .object({
    email: emailSchema,
    source: z.string().trim().min(1),
    page: z.string().trim().min(1),
    utm: utmSchema.optional(),
  })
  .strict();

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
