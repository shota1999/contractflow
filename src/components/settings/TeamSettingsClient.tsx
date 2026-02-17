"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateInviteMutation,
  useGetOrgQuery,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/lib/api/org-api";
import { membershipRoleValues, type MembershipRole } from "@/types/organization";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { ModalShell } from "@/components/ui/ModalShell";
import { Select } from "@/components/ui/Select";
import { Toast } from "@/components/ui/Toast";

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  role: z.enum(membershipRoleValues),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

type TeamSettingsClientProps = {
  appUrl: string;
};

export function TeamSettingsClient({ appUrl }: TeamSettingsClientProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const canManage = role === "OWNER" || role === "ADMIN";
  const canAssignOwner = role === "OWNER";
  const [toast, setToast] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const { data: orgData, isLoading: isOrgLoading, isError: isOrgError } = useGetOrgQuery();
  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useListMembersQuery();
  const [createInvite, { isLoading: isInviting }] = useCreateInviteMutation();
  const [updateMemberRole, { isLoading: isUpdatingRole }] = useUpdateMemberRoleMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const activeOrg = orgData?.data.activeOrg;
  const members = membersData?.data ?? [];
  const normalizedAppUrl = appUrl.replace(/\/$/, "");

  const roleOptions = useMemo(() => {
    if (canAssignOwner) {
      return membershipRoleValues;
    }
    return membershipRoleValues.filter((value) => value !== "OWNER");
  }, [canAssignOwner]);

  const handleInvite = async (values: InviteFormValues) => {
    if (!canManage) {
      setToast("You do not have permission to invite members.");
      return;
    }
    try {
      const invite = await createInvite(values).unwrap();
      const nextLink = `${normalizedAppUrl}/invite/${invite.data.token}`;
      setInviteLink(nextLink);
      reset();
      setToast("Invite created. Share the link below.");
    } catch {
      setToast("Unable to create invite.");
    }
  };

  const handleCopyInvite = async () => {
    if (!inviteLink) {
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteLink);
      setToast("Invite link copied.");
    } catch {
      setToast("Unable to copy invite link.");
    }
  };

  const handleRoleChange = async (userId: string, nextRole: MembershipRole) => {
    try {
      await updateMemberRole({ userId, role: nextRole }).unwrap();
      setToast("Member role updated.");
    } catch {
      setToast("Unable to update role.");
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) {
      return;
    }
    try {
      await removeMember(memberToRemove).unwrap();
      setMemberToRemove(null);
      setToast("Member removed.");
    } catch {
      setToast("Unable to remove member.");
    }
  };

  if (isOrgLoading) {
    return <LoadingState label="Loading organization..." />;
  }

  if (isOrgError || !activeOrg) {
    return (
      <EmptyState
        title="Organization unavailable"
        description="We could not load your organization details."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {toast ? (
        <Toast>{toast}</Toast>
      ) : null}

      <Card className="p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Team Settings
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              {activeOrg.name}
            </h1>
          </div>
          <div className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs text-[var(--muted-foreground)] shadow-[var(--shadow-min)]">
            <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em]">
              Active Role
            </div>
            <div className="text-xs font-semibold text-[var(--foreground)]">{role ?? "MEMBER"}</div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2.4fr_1fr]">
        <Card className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                Members
              </h2>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Manage roles and access for your organization.
              </p>
            </div>
            <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
              {members.length} total
            </span>
          </div>

          {isMembersLoading ? (
            <div className="mt-6">
              <LoadingState label="Loading team members..." />
            </div>
          ) : isMembersError ? (
            <div className="mt-6">
              <EmptyState
                title="Members unavailable"
                description="We could not load the team list."
              />
            </div>
          ) : members.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No members yet"
                description="Invite teammates to collaborate on contracts."
              />
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="w-[45%] px-5 py-3">Member</th>
                    <th className="w-[20%] px-5 py-3">Role</th>
                    <th className="w-[20%] px-5 py-3">Joined</th>
                    <th className="w-[15%] px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const isOwner = member.role === "OWNER";
                    const isSelf = member.userId === session?.user?.id;
                    const disableRoleChange =
                      !canManage || (isOwner && role !== "OWNER") || isUpdatingRole;
                    const disableRemove =
                      !canManage || (isOwner && role !== "OWNER") || isSelf || isRemoving;

                    return (
                      <tr
                        key={member.userId}
                        className="border-t border-[color:var(--border)] transition-colors hover:bg-[var(--surface-2)]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="text-sm font-semibold text-[var(--foreground)]">
                            {member.name}
                          </div>
                          <div className="text-xs text-[var(--muted-foreground)]">
                            {member.email}
                            {isSelf ? " (You)" : ""}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Select
                            fieldSize="sm"
                            className="bg-[var(--surface)] text-xs font-semibold"
                            value={member.role}
                            onChange={(event) =>
                              handleRoleChange(member.userId, event.target.value as MembershipRole)
                            }
                            disabled={disableRoleChange}
                          >
                            {roleOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </Select>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[var(--muted-foreground)]">
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={disableRemove}
                            onClick={() => setMemberToRemove(member.userId)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            )}
        </Card>

        <Card className="p-5 md:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            Invite member
          </h2>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Share access with teammates and control their permissions.
          </p>
          {!canManage ? (
            <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[color:var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted-foreground)]">
              You have read-only access. Ask an admin to invite new members.
            </div>
          ) : (
            <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit(handleInvite)}>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Email
                </span>
                <Input
                  type="email"
                  className="bg-[var(--surface-2)]"
                  placeholder="alex@company.com"
                  {...register("email")}
                />
                {errors.email ? (
                  <span className="text-xs text-[color:var(--danger)]">{errors.email.message}</span>
                ) : null}
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Role
                </span>
                <Select
                  className="bg-[var(--surface-2)] text-sm"
                  {...register("role")}
                >
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {errors.role ? (
                  <span className="text-xs text-[color:var(--danger)]">{errors.role.message}</span>
                ) : null}
              </label>
              <Button type="submit" size="lg" disabled={isInviting}>
                {isInviting ? "Sending..." : "Send invite"}
              </Button>
            </form>
          )}
          {inviteLink ? (
            <div className="mt-6 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-2)] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Invite link
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <Input
                  className="bg-[var(--surface)] text-xs"
                  value={inviteLink}
                  readOnly
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyInvite}
                >
                  Copy invite link
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      <ModalShell
        title="Remove member"
        description="This action removes the member from your organization."
        open={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setMemberToRemove(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleRemoveMember} disabled={isRemoving}>
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          You can re-invite this person later if needed.
        </p>
      </ModalShell>
    </div>
  );
}
