import { ApprovalStatus, DocumentGenerationStatus, DocumentStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import { AppError } from "@/lib/errors";
import type {
  CreateDocumentInput,
  ListDocumentsQuery,
  UpdateDocumentInput,
  DocumentSectionInput,
} from "./schemas";
import * as repo from "./repo";
import { buildDocumentPdf } from "./pdf";
import { env } from "@/lib/env";

export async function listDocuments(organizationId: string, query: ListDocumentsQuery) {
  const { items, total } = await repo.listDocuments(organizationId, query);
  const totalPages = Math.ceil(total / query.pageSize) || 1;

  return {
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages,
    },
  };
}

export async function getDocument(id: string, organizationId: string) {
  const document = await repo.getDocumentByIdForOrg(id, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }
  return document;
}

export async function getDocumentByPublicToken(publicToken: string) {
  const document = await repo.getDocumentByPublicToken(publicToken);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }
  return document;
}

export async function updateDocumentPublicSharing(
  id: string,
  organizationId: string,
  isPublic: boolean,
) {
  const document = await repo.getDocumentByIdForOrg(id, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  return repo.updateDocumentPublicSharing(id, isPublic);
}

export async function createDocument(
  input: CreateDocumentInput,
  organizationId: string,
  createdById: string,
) {
  const publicToken = randomUUID();
  const { sections, ...documentInput } = input;

  const document = await repo.createDocument({
    ...documentInput,
    organizationId,
    createdById,
    status: input.status ?? DocumentStatus.DRAFT,
    version: input.version ?? 1,
    publicToken,
  });

  if (sections?.length) {
    await repo.createDocumentSections(
      document.id,
      sections.map((section) => ({
        title: section.title,
        content: section.content ?? "",
        order: section.order,
      })),
    );
  }

  return document;
}

export async function updateDocument(id: string, input: UpdateDocumentInput, organizationId: string) {
  const document = await repo.getDocumentByIdForOrg(id, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  return repo.updateDocument(id, input);
}

export async function deleteDocument(id: string, organizationId: string) {
  const document = await repo.getDocumentByIdForOrg(id, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  return repo.deleteDocument(id);
}

export async function updateGenerationStatus(
  documentId: string,
  organizationId: string,
  status: DocumentGenerationStatus,
) {
  const document = await repo.getDocumentByIdForOrg(documentId, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  return repo.updateDocumentGenerationStatus(documentId, status);
}

export async function replaceDocumentSections(
  documentId: string,
  organizationId: string,
  sections: DocumentSectionInput[],
) {
  const document = await repo.getDocumentByIdForOrg(documentId, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  await repo.replaceDocumentSections(
    documentId,
    sections.map((section) => ({
      title: section.title,
      content: section.content ?? "",
      order: section.order,
    })),
  );

  return repo.listDocumentSections(documentId);
}

export async function generateDocumentPdf(documentId: string, organizationId: string) {
  const document = await repo.getDocumentByIdForOrg(documentId, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  return buildDocumentPdf({
    title: document.title,
    status: document.status,
    type: document.type,
    version: document.version,
    sections: document.sections ?? [],
    brandName: env.BRAND_NAME ?? "ContractFlow AI",
  });
}

export async function updateApprovalStatus(
  documentId: string,
  organizationId: string,
  nextStatus: ApprovalStatus,
  options?: { actorUserId?: string; note?: string | null },
) {
  const document = await repo.getDocumentByIdForOrg(documentId, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  const currentStatus = (document.approvalStatus ?? ApprovalStatus.DRAFT) as ApprovalStatus;
  if (currentStatus === nextStatus) {
    return { document, previousStatus: currentStatus };
  }

  const allowed: Record<ApprovalStatus, ApprovalStatus[]> = {
    DRAFT: [ApprovalStatus.REVIEW],
    REVIEW: [ApprovalStatus.APPROVED, ApprovalStatus.DRAFT],
    APPROVED: [],
  };

  if (!allowed[currentStatus].includes(nextStatus)) {
    throw new AppError("CONFLICT", "Invalid approval status transition.", 409);
  }

  const updated = await repo.updateDocumentApprovalStatus(documentId, nextStatus);

  const note = options?.note?.trim();
  if (note) {
    await repo.createApprovalComment({
      documentId,
      actorUserId: options?.actorUserId ?? null,
      status: nextStatus,
      note,
    });
  }

  return { document: updated, previousStatus: currentStatus };
}
export async function generateDraft(documentId: string, organizationId: string) {
  const document = await repo.getDocumentByIdForOrg(documentId, organizationId);
  if (!document) {
    throw new AppError("NOT_FOUND", "Document not found.", 404);
  }

  await repo.updateDocumentGenerationStatus(documentId, DocumentGenerationStatus.PROCESSING);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const latestOrder = (await repo.getLatestSectionOrder(documentId)) ?? 0;
  const section = await repo.createDocumentSection({
    documentId,
    title: "AI Generated Draft Section",
    content:
      "Generated summary of key terms and obligations based on the latest client requirements.",
    order: latestOrder + 1,
  });

  const updated = await repo.updateDocument(documentId, {
    version: document.version + 1,
    status: DocumentStatus.REVIEW,
  });

  await repo.updateDocumentGenerationStatus(documentId, DocumentGenerationStatus.SUCCEEDED);

  return { document: updated, section };
}
