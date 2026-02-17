import { apiSlice } from "@/lib/api/api-slice";
import type { NotificationType } from "@/types/notifications";

export type NotificationDto = {
  id: string;
  type: NotificationType;
  metadata: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type NotificationsResponse = {
  ok: true;
  data: NotificationDto[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    unreadCount: number;
  };
};

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<
      NotificationsResponse,
      { page?: number; pageSize?: number; unreadOnly?: boolean }
    >({
      query: (params) => ({
        url: "/notifications",
        params,
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<{ ok: true; data: { id: string } }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useListNotificationsQuery, useMarkNotificationReadMutation } = notificationsApi;
