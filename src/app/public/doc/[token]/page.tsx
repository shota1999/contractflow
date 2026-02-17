import { Badge } from "@/components/ui/Badge";

import { headers } from "next/headers";

type PublicDocPageProps = {
  params: Promise<{ token: string }>;
};

type PublicDocResponse = {
  ok: boolean;
  data?: {
    title: string;
    status: string;
    generationStatus?: string;
    sections?: { id: string; title: string; content: string; order: number }[];
    comments?: {
      id: string;
      body: string;
      createdAt: string;
      author?: { name?: string | null } | null;
    }[];
  };
  error?: { code: string; message: string };
};

export default async function PublicDocPage({ params }: PublicDocPageProps) {
  const { token } = await params;
  const headerStore = await headers();
  const host = headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";
  const res = await fetch(new URL(`/api/public/doc/${token}`, baseUrl), {
    cache: "no-store",
  });

  const payload = (await res.json()) as PublicDocResponse;

  if (res.status === 429) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Rate limit reached</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Too many requests. Please wait a moment and try again.
        </p>
      </div>
    );
  }

  if (!payload.ok || !payload.data) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Document not found</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          This shared document is unavailable or the link has expired.
        </p>
      </div>
    );
  }

  const document = payload.data;

  const statusTone =
    document.status === "REVIEW"
      ? "review"
      : document.status === "SENT"
        ? "sent"
        : document.status === "SIGNED"
          ? "signed"
          : document.status === "PAID"
            ? "paid"
            : "draft";

  const generationTone =
    document.generationStatus === "FAILED"
      ? "review"
      : document.generationStatus === "QUEUED" || document.generationStatus === "PROCESSING"
        ? "sent"
        : document.generationStatus === "SUCCEEDED"
          ? "paid"
          : "draft";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
      <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--background)] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Shared document
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              {document.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge label={document.status} tone={statusTone} />
            {document.generationStatus ? (
              <Badge label={document.generationStatus} tone={generationTone} />
            ) : null}
          </div>
        </div>
      </div>

      <section className="space-y-4">
        {(document.sections ?? []).map((section) => (
          <div
            key={section.id}
            className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--background)] p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{section.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {section.content || "No content provided."}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--background)] p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Comments
        </h2>
        <div className="mt-4 space-y-3">
          {(document.comments ?? []).length ? (
            document.comments?.map((comment) => (
              <div key={comment.id} className="rounded-[var(--radius-md)] bg-[var(--muted)] p-3">
                <p className="text-sm text-[var(--foreground)]">{comment.body}</p>
                <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                  {comment.author?.name ?? "Unknown"} &middot;{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">No comments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}



