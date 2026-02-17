import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            memberships: {
              include: {
                organization: true,
              },
            },
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        const membership = user.memberships[0];
        if (!membership) {
          return null;
        }

        const orgs = user.memberships.map((item) => ({
          id: item.organization.id,
          name: item.organization.name,
          slug: item.organization.slug,
          role: item.role,
        }));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
          orgId: membership.organizationId,
          role: membership.role,
          orgs,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.orgId = (user as { orgId?: string }).orgId;
        token.role = (user as { role?: string }).role;
        token.orgs = (user as { orgs?: SessionOrganization[] }).orgs;
        token.emailVerifiedAt = (user as { emailVerifiedAt?: string | null }).emailVerifiedAt;
      }

      if (trigger === "update" && session) {
        const next = session as Partial<{
          orgId: string;
          role: string;
          orgs: SessionOrganization[];
          emailVerifiedAt?: string | null;
        }>;
        if (next.orgId) {
          token.orgId = next.orgId;
        }
        if (next.role) {
          token.role = next.role;
        }
        if (next.orgs) {
          token.orgs = next.orgs;
        }
        if (next.emailVerifiedAt !== undefined) {
          token.emailVerifiedAt = next.emailVerifiedAt;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.orgId = token.orgId as string;
        session.user.role = token.role as string;
        session.user.orgs = (token.orgs as SessionOrganization[]) ?? [];
        (session.user as { emailVerifiedAt?: string | null }).emailVerifiedAt = (token
          .emailVerifiedAt ?? null) as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export type SessionOrganization = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  emailVerifiedAt?: string | null;
  orgId: string;
  role: string;
  orgs?: SessionOrganization[];
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.orgId || !session.user.role) {
    return null;
  }

  return session.user as SessionUser;
}

export async function requireAuth(options?: { redirectTo?: string }) {
  const user = await getSessionUser();
  if (!user) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }
    throw new AppError("UNAUTHORIZED", "Authentication required.", 401);
  }
  return user;
}

export async function requireVerifiedAuth(options?: {
  redirectTo?: string;
  unauthenticatedRedirectTo?: string;
}) {
  const user = await requireAuth({
    redirectTo: options?.unauthenticatedRedirectTo ?? options?.redirectTo,
  });
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { emailVerifiedAt: true },
  });

  if (!record) {
    throw new AppError("NOT_FOUND", "User not found.", 404);
  }

  if (!record.emailVerifiedAt) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }
    throw new AppError("FORBIDDEN", "Email verification required.", 403);
  }

  return user;
}

export async function requireRole(allowed: string[], options?: { redirectTo?: string }) {
  const user = await requireAuth(options);
  if (!allowed.includes(user.role)) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }
    throw new AppError("FORBIDDEN", "Access denied.", 403);
  }
  return user;
}
