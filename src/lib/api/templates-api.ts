import { apiSlice } from "@/lib/api/api-slice";
import type { DocumentType } from "@/types/documents";

export type TemplateSectionDto = {
  id: string;
  title: string;
  content: string;
  order: number;
};

export type TemplateSectionInput = {
  title: string;
  content: string;
  order: number;
};

export type TemplateDto = {
  id: string;
  name: string;
  description?: string | null;
  type: DocumentType;
  createdAt: string;
  updatedAt: string;
  sections: TemplateSectionDto[];
};

export type TemplateListResponse = {
  ok: true;
  data: TemplateDto[];
};

export type TemplateCreateResponse = {
  ok: true;
  data: TemplateDto;
};

export type TemplateUpdateResponse = {
  ok: true;
  data: TemplateDto;
};

export const templatesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listTemplates: builder.query<TemplateListResponse, void>({
      query: () => "/templates",
      providesTags: ["Templates"],
    }),
    createTemplate: builder.mutation<
      TemplateCreateResponse,
      { name: string; description?: string; type: DocumentType; sections: TemplateSectionInput[] }
    >({
      query: (body) => ({
        url: "/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Templates"],
    }),
    updateTemplate: builder.mutation<
      TemplateUpdateResponse,
      {
        id: string;
        name?: string;
        description?: string;
        type?: DocumentType;
        sections?: TemplateSectionInput[];
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/templates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Templates"],
    }),
    deleteTemplate: builder.mutation<{ ok: true; data: { id: string } }, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Templates"],
    }),
  }),
});

export const {
  useListTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templatesApi;
