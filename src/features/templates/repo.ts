import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function listTemplates(organizationId: string) {
  return prisma.template.findMany({
    where: { organizationId },
    include: { sections: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function findTemplateByName(organizationId: string, name: string) {
  return prisma.template.findFirst({
    where: { organizationId, name },
  });
}

export async function findTemplateById(id: string, organizationId: string) {
  return prisma.template.findFirst({
    where: { id, organizationId },
    include: { sections: { orderBy: { order: "asc" } } },
  });
}

export async function createTemplate(data: Prisma.TemplateCreateInput) {
  return prisma.template.create({
    data,
    include: { sections: { orderBy: { order: "asc" } } },
  });
}

export async function updateTemplate(id: string, data: Prisma.TemplateUpdateInput) {
  return prisma.template.update({
    where: { id },
    data,
    include: { sections: { orderBy: { order: "asc" } } },
  });
}

export async function replaceTemplateSections(
  templateId: string,
  sections: { title: string; content: string; order: number }[],
) {
  return prisma.$transaction([
    prisma.templateSection.deleteMany({ where: { templateId } }),
    prisma.templateSection.createMany({
      data: sections.map((section) => ({
        templateId,
        title: section.title,
        content: section.content,
        order: section.order,
      })),
    }),
  ]);
}

export async function deleteTemplate(id: string) {
  return prisma.template.delete({ where: { id } });
}
