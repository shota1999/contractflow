import { AppError } from "@/lib/errors";
import type { CreateTemplateInput, UpdateTemplateInput } from "./schemas";
import * as repo from "./repo";

export async function listTemplates(organizationId: string) {
  return repo.listTemplates(organizationId);
}

export async function createTemplate(
  input: CreateTemplateInput,
  organizationId: string,
  createdById: string,
) {
  const name = input.name.trim();
  const description = input.description?.trim() || null;
  const existing = await repo.findTemplateByName(organizationId, name);
  if (existing) {
    throw new AppError("CONFLICT", "A template with this name already exists.", 409);
  }

  return repo.createTemplate({
    name,
    description,
    type: input.type,
    organization: { connect: { id: organizationId } },
    createdBy: { connect: { id: createdById } },
    sections: {
      create: input.sections.map((section) => ({
        title: section.title,
        content: section.content ?? "",
        order: section.order,
      })),
    },
  });
}

export async function updateTemplate(
  templateId: string,
  input: UpdateTemplateInput,
  organizationId: string,
) {
  const template = await repo.findTemplateById(templateId, organizationId);
  if (!template) {
    throw new AppError("NOT_FOUND", "Template not found.", 404);
  }

  const nextName = input.name?.trim();
  if (nextName && nextName !== template.name) {
    const existing = await repo.findTemplateByName(organizationId, nextName);
    if (existing) {
      throw new AppError("CONFLICT", "A template with this name already exists.", 409);
    }
  }

  await repo.updateTemplate(templateId, {
    ...(nextName ? { name: nextName } : {}),
    ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
    ...(input.type ? { type: input.type } : {}),
  });

  if (input.sections) {
    await repo.replaceTemplateSections(
      templateId,
      input.sections.map((section, index) => ({
        title: section.title,
        content: section.content ?? "",
        order: index + 1,
      })),
    );
  }

  const refreshed = await repo.findTemplateById(templateId, organizationId);
  if (!refreshed) {
    throw new AppError("NOT_FOUND", "Template not found.", 404);
  }
  return refreshed;
}

export async function deleteTemplate(templateId: string, organizationId: string) {
  const template = await repo.findTemplateById(templateId, organizationId);
  if (!template) {
    throw new AppError("NOT_FOUND", "Template not found.", 404);
  }
  await repo.deleteTemplate(templateId);
  return { id: templateId };
}
