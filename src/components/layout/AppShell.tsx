"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth";
import { useListNotificationsQuery, useMarkNotificationReadMutation } from "@/lib/api/notifications-api";

type NavItem = {
  label: string;
  href: string;
  description: string;
};

type SessionOrg = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

type SessionUpdatePayload = {
  orgId: string;
  role: string;
  orgs?: SessionOrg[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", description: "Overview & KPIs" },
  { label: "Documents", href: "/documents", description: "Contracts & proposals" },
  { label: "Templates", href: "/templates", description: "Reusable structures" },
  { label: "Activity", href: "/activity", description: "Audit log" },
  { label: "Settings", href: "/settings/team", description: "Team & billing" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, update } = useSession();
  const sessionUser = session?.user as SessionUser | undefined;
  const orgId = session?.user?.orgId;
  const role = session?.user?.role;
  const isUnverified = Boolean(sessionUser && !sessionUser.emailVerifiedAt);
  const orgs: SessionOrg[] = session?.user?.orgs ?? [];
  const activeOrg = orgs.find((org) => org.id === orgId) ?? orgs[0];
  const [switchingOrg, setSwitchingOrg] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendToken, setResendToken] = useState<string | null>(null);
  const orgMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { data: notifications } = useListNotificationsQuery({ page: 1, pageSize: 5 });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const unreadCount = notifications?.meta?.unreadCount ?? 0;

  const handleOrgChange = async (nextOrgId: string) => {
    if (!nextOrgId || nextOrgId === orgId) {
      return;
    }
    const nextOrg = orgs.find((org) => org.id === nextOrgId);
    if (!nextOrg) {
      return;
    }

    setSwitchingOrg(true);
    setSwitchError(null);
    try {
      const payload: SessionUpdatePayload = {
        orgId: nextOrg.id,
        role: nextOrg.role,
        orgs,
      };
      await update(payload);
      router.refresh();
    } catch {
      setSwitchError("Unable to switch organizations.");
    } finally {
      setSwitchingOrg(false);
    }
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!orgMenuRef.current?.contains(event.target as Node)) {
        setOrgMenuOpen(false);
      }
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleResendVerification = async () => {
    setResendStatus("sending");
    setResendMessage(null);
    setResendToken(null);
    try {
      const response = await fetch("/api/auth/verify/resend", { method: "POST" });
      const payload = (await response.json()) as {
        data?: { verificationToken?: string };
        error?: { message?: string };
      };

      if (!response.ok) {
        setResendStatus("error");
        setResendMessage(payload.error?.message ?? "Unable to resend verification email.");
        return;
      }

      if (payload.data?.verificationToken) {
        setResendToken(payload.data.verificationToken);
      }
      setResendStatus("sent");
      setResendMessage("Verification email sent. Check your inbox.");
    } catch {
      setResendStatus("error");
      setResendMessage("Unable to resend verification email.");
    }
  };

  const buildNotificationLabel = (notification: {
    type: string;
    metadata?: Record<string, unknown>;
  }) => {
    const title = (notification.metadata?.documentTitle as string | undefined) ?? "Document";
    switch (notification.type) {
      case "DOCUMENT_REVIEW_REQUESTED":
        return `${title} sent for review`;
      case "DOCUMENT_APPROVED":
        return `${title} approved`;
      case "DOCUMENT_SENT_BACK":
        return `${title} sent back to draft`;
      default:
        return "Notification";
    }
  };

  const handleNotificationClick = async (notification: {
    id: string;
    metadata?: Record<string, unknown>;
  }) => {
    try {
      await markNotificationRead(notification.id).unwrap();
    } catch {
      // Best-effort mark read.
    }
    const docId = notification.metadata?.documentId as string | undefined;
    if (docId) {
      router.push(`/documents/${docId}`);
      return;
    }
    router.push("/activity");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <nav className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--brand)] text-[0.6rem] font-semibold text-[color:var(--brand-foreground)]">
              CF
            </span>
            ContractFlow AI
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] transition hover:bg-[var(--surface-2)]"
                aria-label="Notifications"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                  <path d="M9 17a3 3 0 0 0 6 0" />
                </svg>
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[color:var(--brand)] px-1 text-[0.6rem] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>
              {notificationsOpen ? (
                <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
                  <div className="border-b border-[color:var(--border)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    Notifications
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {notifications?.data?.length ? (
                      notifications.data.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => handleNotificationClick(notification)}
                          className="w-full border-b border-[color:var(--border)] px-4 py-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                        >
                          <div className="text-xs text-[var(--muted-foreground)]">
                            {notification.actor?.name ??
                              notification.actor?.email ??
                              "System"}
                          </div>
                          <div className="mt-1 font-semibold">
                            {buildNotificationLabel(notification)}
                          </div>
                          <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-[var(--muted-foreground)]">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" href="/activity">
                      View activity
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="hidden items-center gap-2 text-[0.65rem] text-[var(--muted-foreground)] md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
              Secure workspace
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-3 py-1.5 shadow-[var(--shadow-min)]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand)]/10 text-[0.65rem] font-semibold text-[color:var(--brand)]">
                {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "U"}
              </div>
              <div className="text-[0.65rem] leading-tight">
                <div className="font-semibold text-[var(--foreground)]">
                  {session?.user?.name ?? "Workspace User"}
                </div>
                <div className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {role ?? "Member"}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </nav>
      <Container className="grid gap-8 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-min)]">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              ContractFlow AI
            </div>
            <div className="text-base font-semibold text-[var(--foreground)]">Workspace</div>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[var(--radius-md)] border px-4 py-3 transition-all ${
                    active
                      ? "border-[color:var(--brand)]/30 bg-[color:var(--brand)]/10 text-[var(--foreground)]"
                      : "border-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {item.description}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex min-h-[70vh] flex-col gap-6">
          {isUnverified && !bannerDismissed ? (
            <div className="rounded-[var(--radius-lg)] border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/10 px-4 py-3 text-sm text-[var(--foreground)] shadow-[var(--shadow-min)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--warning)]">
                    Email verification required
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                    Verify your email to unlock invites and secure your workspace.
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={resendStatus === "sending"}
                  >
                    {resendStatus === "sending" ? "Resending..." : "Resend verification email"}
                  </Button>
                  <Button variant="secondary" size="sm" href="/verify-email">
                    Open verify page
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--muted-foreground)]"
                    onClick={() => setBannerDismissed(true)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
              {resendMessage ? (
                <div
                  className={`mt-3 rounded-[var(--radius-md)] border px-3 py-2 text-xs ${
                    resendStatus === "sent"
                      ? "border-[color:var(--success)] bg-[color:var(--success)]/10 text-[color:var(--success)]"
                      : "border-[color:var(--danger)] bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
                  }`}
                >
                  <div>{resendMessage}</div>
                  {resendToken ? (
                    <a
                      className="mt-2 inline-flex font-semibold text-[var(--foreground)] underline"
                      href={`/verify-email?token=${resendToken}`}
                    >
                      Open verification link (dev)
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
          <header className="flex min-h-[64px] items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] px-5 py-3 shadow-[var(--shadow-min)]">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  Workspace
                </div>
                <div className="text-base font-semibold text-[var(--foreground)]">
                  Contract Operations
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] sm:flex">
                Enterprise Preview
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="group relative hidden items-center sm:flex">
                <span className="pointer-events-none absolute left-3 text-[var(--muted-foreground)] transition group-focus-within:text-[color:var(--brand)]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2.5 9a6.5 6.5 0 1 1 11.18 4.077l3.622 3.623a.75.75 0 1 1-1.06 1.06l-3.623-3.622A6.5 6.5 0 0 1 2.5 9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  placeholder="Find documents"
                  className="h-10 w-64 rounded-full border border-[color:var(--border)] bg-[var(--surface)] pl-9 pr-14 text-[0.75rem] font-semibold text-[var(--foreground)] transition focus:border-[color:var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15"
                />
                <span className="pointer-events-none absolute right-2 inline-flex items-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)] transition group-focus-within:border-[color:var(--brand)]/30 group-focus-within:text-[color:var(--brand)]">
                  Ctrl K
                </span>
              </label>
              <div
                ref={orgMenuRef}
                className="min-w-[220px] rounded-xl border border-[color:var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted-foreground)] shadow-[var(--shadow-min)]"
              >
                <div className="flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  <span>Active Org</span>
                  <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-[0.55rem] font-semibold text-[var(--muted-foreground)]">
                    {role ?? "role"}
                  </span>
                </div>
                {orgs.length ? (
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={() => setOrgMenuOpen((open) => !open)}
                      disabled={switchingOrg}
                      aria-expanded={orgMenuOpen}
                      className="flex h-9 w-full items-center justify-between rounded-md border border-[color:var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-2)] focus-visible:border-[color:var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/20"
                    >
                      <span>{activeOrg?.name ?? "Select organization"}</span>
                      <svg
                        viewBox="0 0 20 20"
                        className={`h-4 w-4 text-[var(--muted-foreground)] transition ${orgMenuOpen ? "rotate-180" : ""}`}
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M5.5 7.5a.75.75 0 0 1 1.06 0L10 10.94l3.44-3.44a.75.75 0 1 1 1.06 1.06l-3.97 3.97a.75.75 0 0 1-1.06 0L5.5 8.56a.75.75 0 0 1 0-1.06Z" />
                      </svg>
                    </button>
                    {orgMenuOpen ? (
                      <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
                        {orgs.map((org) => {
                          const isActive = org.id === activeOrg?.id;
                          return (
                            <button
                              key={org.id}
                              type="button"
                              onClick={() => {
                                setOrgMenuOpen(false);
                                void handleOrgChange(org.id);
                              }}
                              className={`flex w-full flex-col gap-1 px-3 py-2 text-left text-sm transition ${
                                isActive
                                  ? "bg-[color:var(--brand)]/10 text-[var(--foreground)]"
                                  : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
                              }`}
                            >
                              <span className="font-semibold text-[var(--foreground)]">
                                {org.name}
                              </span>
                              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                                {org.role}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                    {orgId ? `Org ${orgId.slice(0, 6)}` : "Org Pending"}
                  </div>
                )}
                {switchError ? (
                  <div className="mt-1 text-[0.6rem] text-[color:var(--danger)]">{switchError}</div>
                ) : null}
              </div>
            </div>
          </header>
          <div className="flex flex-col gap-8">{children}</div>
        </section>
      </Container>
    </div>
  );
}
