import { z } from "zod";

export const listProjectsQuerySchema = z.object({
  clientId: z.string().min(1).optional(),
});

export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
