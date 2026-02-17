import { apiSlice } from "@/lib/api/api-slice";
import type { DraftJobStatus } from "@/types/draft-jobs";

export type DraftJobDto = {
  id: string;
  organizationId: string;
  documentId: string;
  status: DraftJobStatus;
  attempts: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DraftJobsResponse = {
  ok: true;
  data: DraftJobDto[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const draftJobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listDraftJobs: builder.query<
      DraftJobsResponse,
      { page?: number; pageSize?: number; documentId?: string; status?: DraftJobStatus }
    >({
      query: (params) => ({
        url: "/jobs/drafts",
        params,
      }),
      providesTags: ["DraftJobs"],
    }),
    retryDraftJob: builder.mutation<{ ok: true; data: { job: DraftJobDto; queueJobId: string } }, string>({
      query: (jobId) => ({
        url: `/jobs/drafts/${jobId}/retry`,
        method: "POST",
      }),
      invalidatesTags: ["DraftJobs"],
    }),
  }),
});

export const { useListDraftJobsQuery, useRetryDraftJobMutation } = draftJobsApi;
