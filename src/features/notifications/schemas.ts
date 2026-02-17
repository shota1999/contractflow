import { z } from "zod";

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  unreadOnly: z
    .preprocess((value) => (value === "true" ? true : value === "false" ? false : value), z.boolean())
    .optional(),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;

export const notificationIdSchema = z.string().min(1, "Notification id is required.");
