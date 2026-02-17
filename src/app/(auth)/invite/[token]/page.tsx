import { InviteAcceptClient } from "@/components/auth/InviteAcceptClient";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <InviteAcceptClient token={token} />
    </div>
  );
}
