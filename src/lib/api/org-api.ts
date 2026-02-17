import { apiSlice } from "@/lib/api/api-slice";
import type { MembershipRole } from "@/types/organization";

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  role: MembershipRole;
};

export type OrgResponse = {
  ok: true;
  data: {
    activeOrgId: string;
    activeOrg: OrganizationSummary;
    organizations: OrganizationSummary[];
  };
};

export type OrgMember = {
  userId: string;
  name: string;
  email: string;
  role: MembershipRole;
  joinedAt: string;
};

export type OrgMembersResponse = {
  ok: true;
  data: OrgMember[];
};

export type InviteDto = {
  id: string;
  email: string;
  role: MembershipRole;
  token: string;
  expiresAt: string;
  acceptedAt?: string | null;
  createdAt: string;
};

export type InviteResponse = {
  ok: true;
  data: InviteDto;
};

export const orgApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrg: builder.query<OrgResponse, void>({
      query: () => "/org",
      providesTags: ["Org"],
    }),
    listMembers: builder.query<OrgMembersResponse, void>({
      query: () => "/org/members",
      providesTags: ["OrgMembers"],
    }),
    createInvite: builder.mutation<InviteResponse, { email: string; role: MembershipRole }>({
      query: (body) => ({
        url: "/org/invites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OrgMembers"],
    }),
    updateMemberRole: builder.mutation<
      { ok: true; data: { id: string; organizationId: string; userId: string; role: MembershipRole } },
      { userId: string; role: MembershipRole }
    >({
      query: ({ userId, role }) => ({
        url: `/org/members/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["OrgMembers"],
    }),
    removeMember: builder.mutation<{ ok: true; data: { id: string } }, string>({
      query: (userId) => ({
        url: `/org/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrgMembers"],
    }),
    acceptInvite: builder.mutation<
      { ok: true; data: { id: string; organizationId: string; userId: string; role: MembershipRole } },
      { token: string }
    >({
      query: (body) => ({
        url: "/org/invites/accept",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Org", "OrgMembers"],
    }),
  }),
});

export const {
  useGetOrgQuery,
  useListMembersQuery,
  useCreateInviteMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useAcceptInviteMutation,
} = orgApi;
