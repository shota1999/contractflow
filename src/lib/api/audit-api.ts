import { apiSlice } from "@/lib/api/api-slice";
import type { AuditAction, AuditTargetType } from "@/types/audit";

export type AuditEventActor = {
  id: string;
  name: string;
  email: string;
} | null;

export type AuditEventDto = {
  id: string;
  organizationId: string;
  actorUserId: string | null;
  actor: AuditEventActor;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AuditEventsResponse = {
  ok: true;
  data: AuditEventDto[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listAuditEvents: builder.query<
      AuditEventsResponse,
      { page?: number; pageSize?: number; action?: AuditAction; targetType?: AuditTargetType }
    >({
      query: (params) => ({
        url: "/audit/events",
        params,
      }),
      providesTags: ["AuditEvents"],
    }),
  }),
});

export const { useListAuditEventsQuery } = auditApi;
