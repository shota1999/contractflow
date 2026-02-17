"use client";

import { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTemplateSchema } from "@/features/templates/schemas";
import {
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useListTemplatesQuery,
  useUpdateTemplateMutation,
} from "@/lib/api/templates-api";
import type { TemplateDto } from "@/lib/api/templates-api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ModalShell } from "@/components/ui/ModalShell";
import type { DocumentType } from "@/types/documents";

type TemplateFormValues = z.infer<typeof createTemplateSchema>;

const defaultSections = [
  { title: "Scope", content: "", order: 1 },
  { title: "Timeline", content: "", order: 2 },
  { title: "Pricing", content: "", order: 3 },
  { title: "Terms", content: "", order: 4 },
];

export function TemplateLibraryClient() {
  const { data, isLoading } = useListTemplatesQuery();
  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TemplateDto | null>(null);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "CONTRACT",
      sections: defaultSections,
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const editForm = useForm<TemplateFormValues>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "CONTRACT",
      sections: defaultSections,
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: editControl,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = editForm;

  const {
    fields: editFields,
    append: appendEdit,
    move: moveEdit,
    remove: removeEdit,
  } = useFieldArray({
    control: editControl,
    name: "sections",
  });

  const templates = data?.data ?? [];

  const onSubmit = async (values: TemplateFormValues) => {
    setFormError(null);
    setSuccessMessage(null);
    try {
      const payload = {
        ...values,
        sections: values.sections.map((section, index) => ({
          title: section.title,
          content: section.content ?? "",
          order: index + 1,
        })),
      };
      await createTemplate(payload).unwrap();
      setSuccessMessage("Template created.");
      reset({
        name: "",
        description: "",
        type: "CONTRACT",
        sections: defaultSections,
      });
    } catch {
      setFormError("Unable to create template. Try again.");
    }
  };

  const onEditSubmit = async (values: TemplateFormValues) => {
    if (!editingTemplate) {
      return;
    }
    setEditError(null);
    try {
      await updateTemplate({
        id: editingTemplate.id,
        name: values.name,
        description: values.description,
        type: values.type,
        sections: values.sections.map((section, index) => ({
          title: section.title,
          content: section.content ?? "",
          order: index + 1,
        })),
      }).unwrap();
      setEditingTemplate(null);
      setSuccessMessage("Template updated.");
    } catch {
      setEditError("Unable to update template. Try again.");
    }
  };

  const openEdit = (template: TemplateDto) => {
    setEditingTemplate(template);
    resetEdit({
      name: template.name,
      description: template.description ?? "",
      type: template.type,
      sections: template.sections.map((section) => ({
        title: section.title,
        content: section.content ?? "",
        order: section.order,
      })),
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleteError(null);
    try {
      await deleteTemplate(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      setSuccessMessage("Template deleted.");
    } catch {
      setDeleteError("Unable to delete template.");
    }
  };

  const templateCountLabel = useMemo(
    () => `${templates.length} template${templates.length === 1 ? "" : "s"}`,
    [templates.length],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Templates"
        description="Create reusable templates for faster document setup."
        action={
          <Button size="sm" href="/documents/new">
            New document
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Template library
              </div>
              <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                {templateCountLabel}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 text-sm text-[var(--muted-foreground)]">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No templates yet"
                description="Create your first template to standardize document creation."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        {template.name}
                      </div>
                      <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {template.description ?? "No description provided."}
                      </div>
                    </div>
                    <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      {template.type}
                    </span>
                  </div>
                  <div className="mt-4 text-xs text-[var(--muted-foreground)]">
                    {template.sections.length} sections · Updated{" "}
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        href={`/documents/new?templateId=${template.id}`}
                      >
                        Use template
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(template)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(template)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 md:p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Create template
          </div>
          <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            Build a reusable structure
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Define reusable sections and placeholders for consistent drafting.
          </p>

          <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Template name
              </span>
              <Input className="bg-[var(--surface-2)]" {...register("name")} />
              {errors.name ? (
                <span className="text-xs text-[var(--danger)]">{errors.name.message}</span>
              ) : null}
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Description
              </span>
              <Textarea
                rows={3}
                className="bg-[var(--surface-2)]"
                {...register("description")}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Type
              </span>
              <Select className="bg-[var(--surface-2)]" {...register("type")}>
                {(["CONTRACT", "PROPOSAL"] as DocumentType[]).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </label>

            <div className="mt-2 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Sections
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      className="bg-[var(--surface)] text-sm font-semibold"
                      {...register(`sections.${index}.title`)}
                    />
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => index > 0 && move(index, index - 1)}
                      >
                        Up
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => index < fields.length - 1 && move(index, index + 1)}
                      >
                        Down
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    rows={3}
                    className="mt-2"
                    placeholder="Add placeholder notes or clauses."
                    {...register(`sections.${index}.content`)}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  append({
                    title: `Section ${fields.length + 1}`,
                    content: "",
                    order: fields.length + 1,
                  })
                }
              >
                Add section
              </Button>
            </div>

            {formError ? (
              <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color:var(--danger)]/10 px-3 py-2 text-xs text-[color:var(--danger)]">
                {formError}
              </div>
            ) : null}
            {successMessage ? (
              <div className="rounded-[var(--radius-md)] border border-[color:var(--success)] bg-[color:var(--success)]/10 px-3 py-2 text-xs text-[color:var(--success)]">
                {successMessage}
              </div>
            ) : null}
            <Button type="submit" disabled={isCreating} size="lg">
              {isCreating ? "Creating..." : "Create template"}
            </Button>
          </form>
        </Card>
      </div>

      <ModalShell
        title="Edit template"
        description="Update template structure and content."
        open={Boolean(editingTemplate)}
        onClose={() => setEditingTemplate(null)}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmitEdit(onEditSubmit)} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 text-sm">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Template name
            </span>
            <Input className="bg-[var(--surface-2)]" {...registerEdit("name")} />
            {editErrors.name ? (
              <span className="text-xs text-[var(--danger)]">{editErrors.name.message}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Description
            </span>
            <Textarea rows={3} className="bg-[var(--surface-2)]" {...registerEdit("description")} />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Type
            </span>
            <Select className="bg-[var(--surface-2)]" {...registerEdit("type")}>
              {(["CONTRACT", "PROPOSAL"] as DocumentType[]).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </label>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Sections
            </div>
            {editFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Input
                    className="bg-[var(--surface)] text-sm font-semibold"
                    {...registerEdit(`sections.${index}.title`)}
                  />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => index > 0 && moveEdit(index, index - 1)}
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => index < editFields.length - 1 && moveEdit(index, index + 1)}
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEdit(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <Textarea
                  rows={3}
                  className="mt-2"
                  placeholder="Add placeholder notes or clauses."
                  {...registerEdit(`sections.${index}.content`)}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                appendEdit({
                  title: `Section ${editFields.length + 1}`,
                  content: "",
                  order: editFields.length + 1,
                })
              }
            >
              Add section
            </Button>
          </div>
          {editError ? (
            <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color:var(--danger)]/10 px-3 py-2 text-xs text-[color:var(--danger)]">
              {editError}
            </div>
          ) : null}
        </div>
      </ModalShell>

      <ModalShell
        title="Delete template"
        description={`Delete "${deleteTarget?.name ?? "template"}"? This cannot be undone.`}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete template"}
            </Button>
          </>
        }
      >
        <div className="text-sm text-[var(--muted-foreground)]">
          This removes the template from your library but does not affect existing documents.
        </div>
        {deleteError ? (
          <div className="mt-3 rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color:var(--danger)]/10 px-3 py-2 text-xs text-[color:var(--danger)]">
            {deleteError}
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}
