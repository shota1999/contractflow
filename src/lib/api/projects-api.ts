import { apiSlice } from "@/lib/api/api-slice";

export type ProjectDto = {
  id: string;
  organizationId: string;
  clientId: string | null;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectsResponse = {
  ok: true;
  data: ProjectDto[];
};

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listProjects: builder.query<ProjectsResponse, { clientId?: string } | void>({
      query: (params) => ({
        url: "/projects",
        params: params?.clientId ? { clientId: params.clientId } : undefined,
      }),
      providesTags: ["Projects"],
    }),
  }),
});

export const { useListProjectsQuery } = projectsApi;
