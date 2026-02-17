import { prisma } from "@/lib/prisma";

export async function listProjects(organizationId: string, clientId?: string) {
  return prisma.project.findMany({
    where: {
      organizationId,
      ...(clientId ? { clientId } : {}),
    },
    orderBy: { name: "asc" },
  });
}
