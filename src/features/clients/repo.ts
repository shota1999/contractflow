import { prisma } from "@/lib/prisma";

export async function listClients(organizationId: string) {
  return prisma.client.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
  });
}
