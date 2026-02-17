import { apiSlice } from "@/lib/api/api-slice";
import type {
  ApprovalStatus,
  DocumentGenerationStatus,
  DocumentStatus,
  DocumentType,
} from "@/types/documents";

export type { ApprovalStatus, DocumentGenerationStatus, DocumentStatus, DocumentType };

export type DocumentSectionDto = {
  id: string;
  documentId: string;
  title: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type CommentDto = {
  id: string;
  documentId: string;
  authorId: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type ApprovalCommentDto = {
  id: string;
  documentId: string;
  actorUserId: string | null;
  status: ApprovalStatus;
  note: string;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type DocumentDto = {
  id: string;
  organizationId: string;
  clientId: string | null;
  projectId: string | null;
  createdById: string | null;
  type: DocumentType;
  status: DocumentStatus;
  approvalStatus: ApprovalStatus;
  generationStatus: DocumentGenerationStatus;
  title: string;
  version: number;
  publicToken: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  sections?: DocumentSectionDto[];
  comments?: CommentDto[];
  approvalComments?: ApprovalCommentDto[];
};

export type DocumentListResponse = {
  ok: true;
  data: DocumentDto[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type DocumentResponse = {
  ok: true;
  data: DocumentDto;
};

export type UpdateDocumentInput = Partial<
  Pick<DocumentDto, "title" | "status" | "type" | "version">
>;

export type CreateDocumentInput = {
  title: string;
  type: DocumentType;
  status?: DocumentStatus;
  version?: number;
  clientId?: string;
  projectId?: string;
  sections?: Array<Pick<DocumentSectionDto, "title" | "content" | "order">>;
};

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listDocuments: builder.query<
      DocumentListResponse,
      {
        page?: number;
        pageSize?: number;
        status?: DocumentStatus;
        type?: DocumentType;
      }
    >({
      query: (params) => ({
        url: "/documents",
        params,
      }),
      providesTags: ["Documents"],
    }),
    getDocument: builder.query<DocumentResponse, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
    }),
    updateDocument: builder.mutation<DocumentResponse, { id: string; data: UpdateDocumentInput }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Documents", id },
        "Documents",
      ],
    }),
    updateDocumentSections: builder.mutation<
      { ok: true; data: { sections: DocumentSectionDto[] } },
      { id: string; sections: Array<Pick<DocumentSectionDto, "title" | "content" | "order">> }
    >({
      query: ({ id, sections }) => ({
        url: `/documents/${id}/sections`,
        method: "PUT",
        body: { sections },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Documents", id },
        "Documents",
      ],
    }),
    createDocument: builder.mutation<DocumentResponse, CreateDocumentInput>({
      query: (data) => ({
        url: "/documents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Documents"],
    }),
    generateDraft: builder.mutation<{ ok: true; data: { jobId: string | number; status: string } }, string>({
      query: (id) => ({
        url: `/documents/${id}/generate-draft`,
        method: "POST",
      }),
    }),
    updateDocumentSharing: builder.mutation<DocumentResponse, { id: string; isPublic: boolean }>({
      query: ({ id, isPublic }) => ({
        url: `/documents/${id}/public`,
        method: "PATCH",
        body: { isPublic },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Documents", id },
        "Documents",
      ],
    }),
    updateDocumentApproval: builder.mutation<
      DocumentResponse,
      { id: string; status: ApprovalStatus; note?: string }
    >({
      query: ({ id, status, note }) => ({
        url: `/documents/${id}/approval`,
        method: "PATCH",
        body: { status, note },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Documents", id },
        "Documents",
      ],
    }),
  }),
});

export const {
  useListDocumentsQuery,
  useGetDocumentQuery,
  useUpdateDocumentMutation,
  useUpdateDocumentSectionsMutation,
  useCreateDocumentMutation,
  useGenerateDraftMutation,
  useUpdateDocumentSharingMutation,
  useUpdateDocumentApprovalMutation,
} = documentsApi;
