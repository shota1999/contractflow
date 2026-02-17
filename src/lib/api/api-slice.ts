import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: [
    "Documents",
    "Clients",
    "Projects",
    "Org",
    "OrgMembers",
    "AuditEvents",
    "DraftJobs",
    "Templates",
    "Notifications",
  ],
  endpoints: () => ({}),
});
