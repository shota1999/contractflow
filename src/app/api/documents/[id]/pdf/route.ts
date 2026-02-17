import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { documentIdSchema } from "@/features/documents/schemas";
import * as service from "@/features/documents/service";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const documentId = documentIdSchema.parse(id);
    const user = await requireAuth();
    const pdfBuffer = await service.generateDocumentPdf(documentId, user.orgId);
    const filename = `document-${documentId}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error, request);
  }
}
