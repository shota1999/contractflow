import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      orgId?: string;
      role?: string;
      orgs?: Array<{
        id: string;
        name: string;
        slug: string;
        role: string;
      }>;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    orgId?: string;
    role?: string;
    orgs?: Array<{
      id: string;
      name: string;
      slug: string;
      role: string;
    }>;
  }
}
