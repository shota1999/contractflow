import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type PdfSection = {
  title: string;
  content: string | null;
  order: number;
};

type PdfDocumentInput = {
  title: string;
  status: string;
  type: string;
  version: number;
  sections: PdfSection[];
  brandName: string;
};

type DrawContext = {
  pdf: PDFDocument;
  page: ReturnType<PDFDocument["addPage"]>;
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  boldFont: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  fontSize: number;
  lineHeight: number;
  margin: number;
  headerHeight: number;
  footerHeight: number;
  maxWidth: number;
  y: number;
};

const wrapText = (text: string, font: DrawContext["font"], size: number, maxWidth: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(next, size);
    if (width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
};

const ensureSpace = (ctx: DrawContext) => {
  if (ctx.y > ctx.margin + ctx.footerHeight) {
    return ctx;
  }

  const page = ctx.pdf.addPage();
  const { height, width } = page.getSize();
  return {
    ...ctx,
    page,
    y: height - ctx.margin - ctx.headerHeight,
    maxWidth: width - ctx.margin * 2,
  };
};

const drawLines = (
  ctx: DrawContext,
  lines: string[],
  options: { font: DrawContext["font"]; size: number; color?: [number, number, number] },
) => {
  let next = ctx;
  const color = options.color ? rgb(...options.color) : rgb(0.1, 0.1, 0.1);

  for (const line of lines) {
    next = ensureSpace(next);
    next.page.drawText(line, {
      x: next.margin,
      y: next.y,
      size: options.size,
      font: options.font,
      color,
    });
    next = { ...next, y: next.y - next.lineHeight };
  }

  return next;
};

export async function buildDocumentPdf(input: PdfDocumentInput) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const margin = 48;
  const headerHeight = 36;
  const footerHeight = 28;
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;

  const createPage = () => {
    const page = pdf.addPage();
    const { height, width } = page.getSize();
    return {
      page,
      maxWidth: width - margin * 2,
      y: height - margin - headerHeight,
    };
  };

  const firstPage = createPage();

  let ctx: DrawContext = {
    pdf,
    page: firstPage.page,
    font,
    boldFont,
    fontSize,
    lineHeight,
    margin,
    headerHeight,
    footerHeight,
    maxWidth: firstPage.maxWidth,
    y: firstPage.y,
  };

  ctx = drawLines(ctx, wrapText(input.title, boldFont, 20, ctx.maxWidth), {
    font: boldFont,
    size: 20,
    color: [0.05, 0.1, 0.2],
  });
  ctx = { ...ctx, y: ctx.y - 8 };

  const meta = `Type: ${input.type}  •  Status: ${input.status}  •  Version: v${input.version}`;
  ctx = drawLines(ctx, wrapText(meta, font, 11, ctx.maxWidth), {
    font,
    size: 11,
    color: [0.35, 0.4, 0.5],
  });
  ctx = { ...ctx, y: ctx.y - 12 };

  const orderedSections = [...input.sections].sort((a, b) => a.order - b.order);
  for (const section of orderedSections) {
    ctx = drawLines(ctx, wrapText(section.title, boldFont, 14, ctx.maxWidth), {
      font: boldFont,
      size: 14,
      color: [0.1, 0.1, 0.1],
    });
    ctx = { ...ctx, y: ctx.y - 4 };
    const content = (section.content ?? "").trim();
    ctx = drawLines(ctx, wrapText(content || "—", font, 11, ctx.maxWidth), {
      font,
      size: 11,
      color: [0.15, 0.2, 0.3],
    });
    ctx = { ...ctx, y: ctx.y - 10 };
  }

  const pages = pdf.getPages();
  pages.forEach((page, index) => {
    const { height, width } = page.getSize();
    const topY = height - margin;
    page.drawText(input.brandName, {
      x: margin,
      y: topY,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.3),
    });
    page.drawText(input.title, {
      x: margin + 160,
      y: topY,
      size: 10,
      font,
      color: rgb(0.35, 0.4, 0.5),
      maxWidth: width - margin * 2 - 160,
    });
    page.drawLine({
      start: { x: margin, y: topY - 10 },
      end: { x: width - margin, y: topY - 10 },
      thickness: 0.5,
      color: rgb(0.85, 0.87, 0.92),
    });

    const footerY = margin - 10;
    page.drawLine({
      start: { x: margin, y: footerY + 14 },
      end: { x: width - margin, y: footerY + 14 },
      thickness: 0.5,
      color: rgb(0.85, 0.87, 0.92),
    });
    page.drawText(
      `Page ${index + 1} of ${pages.length}`,
      {
        x: width - margin - 80,
        y: footerY,
        size: 9,
        font,
        color: rgb(0.5, 0.55, 0.6),
      },
    );
  });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
