import { apiSlice } from "@/lib/api/api-slice";

export type ClientDto = {
  id: string;
  organizationId: string;
  name: string;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientsResponse = {
  ok: true;
  data: ClientDto[];
};

export const clientsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listClients: builder.query<ClientsResponse, void>({
      query: () => ({
        url: "/clients",
      }),
      providesTags: ["Clients"],
    }),
  }),
});

export const { useListClientsQuery } = clientsApi;
