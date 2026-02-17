import type { Prisma } from "@prisma/client";
import { ApprovalStatus, DocumentGenerationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ListDocumentsQuery, UpdateDocumentInput } from "./schemas";

export type DocumentListResult = {
  items: Prisma.DocumentGetPayload<Record<string, never>>[];
  total: number;
};

export async function listDocuments(
  organizationId: string,
  query: ListDocumentsQuery,
): Promise<DocumentListResult> {
  const where: Prisma.DocumentWhereInput = {
    organizationId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.type ? { type: query.type } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.document.count({ where }),
  ]);

  return { items, total };
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id } });
}

export async function getDocumentByIdForOrg(id: string, organizationId: string) {
  return prisma.document.findFirst({
    where: { id, organizationId },
    include: {
      sections: { orderBy: { order: "asc" } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      },
      approvalComments: {
        orderBy: { createdAt: "desc" },
        include: {
          actor: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
}

export async function getDocumentByPublicToken(publicToken: string) {
  return prisma.document.findFirst({
    where: { publicToken, isPublic: true },
    include: {
      sections: { orderBy: { order: "asc" } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
}

export async function updateDocumentPublicSharing(id: string, isPublic: boolean) {
  return prisma.document.update({
    where: { id },
    data: { isPublic },
  });
}

export async function createDocument(data: Prisma.DocumentUncheckedCreateInput) {
  return prisma.document.create({
    data,
  });
}

export async function updateDocument(id: string, data: UpdateDocumentInput) {
  return prisma.document.update({
    where: { id },
    data,
  });
}

export async function updateDocumentGenerationStatus(id: string, status: DocumentGenerationStatus) {
  return prisma.document.update({
    where: { id },
    data: { generationStatus: status },
  });
}

export async function updateDocumentApprovalStatus(id: string, status: ApprovalStatus) {
  return prisma.document.update({
    where: { id },
    data: { approvalStatus: status },
  });
}

export async function createApprovalComment(input: {
  documentId: string;
  actorUserId?: string | null;
  status: ApprovalStatus;
  note: string;
}) {
  return prisma.approvalComment.create({
    data: {
      documentId: input.documentId,
      actorUserId: input.actorUserId ?? null,
      status: input.status,
      note: input.note,
    },
  });
}

export async function getLatestSectionOrder(documentId: string) {
  const section = await prisma.documentSection.findFirst({
    where: { documentId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return section?.order ?? null;
}

export async function createDocumentSection(data: {
  documentId: string;
  title: string;
  content: string;
  order: number;
}) {
  return prisma.documentSection.create({ data });
}

export async function createDocumentSections(
  documentId: string,
  sections: { title: string; content: string; order: number }[],
) {
  if (sections.length === 0) {
    return { count: 0 };
  }

  return prisma.documentSection.createMany({
    data: sections.map((section) => ({
      documentId,
      title: section.title,
      content: section.content,
      order: section.order,
    })),
  });
}

export async function replaceDocumentSections(
  documentId: string,
  sections: { title: string; content: string; order: number }[],
) {
  return prisma.$transaction([
    prisma.documentSection.deleteMany({ where: { documentId } }),
    prisma.documentSection.createMany({
      data: sections.map((section) => ({
        documentId,
        title: section.title,
        content: section.content,
        order: section.order,
      })),
    }),
  ]);
}

export async function listDocumentSections(documentId: string) {
  return prisma.documentSection.findMany({
    where: { documentId },
    orderBy: { order: "asc" },
  });
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({
    where: { id },
  });
}
