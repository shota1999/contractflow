"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateDocumentMutation } from "@/lib/api/documents-api";
import { useListClientsQuery } from "@/lib/api/clients-api";
import { useListProjectsQuery } from "@/lib/api/projects-api";
import { useListTemplatesQuery } from "@/lib/api/templates-api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { documentTypeValues } from "@/types/documents";

const sectionTemplates = ["Scope", "Timeline", "Pricing", "Terms"];

const sectionSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  order: z.number().int().min(1),
});

const documentTypeSchema = z.enum(documentTypeValues);
const optionalTemplateSchema = z.string().optional();

const wizardSchema = z.object({
  templateId: optionalTemplateSchema,
  type: documentTypeSchema,
  title: z.string().min(2, "Title is required."),
  clientId: z.string().min(1, "Select a client."),
  projectId: z.string().min(1, "Select a project."),
  sections: z.array(sectionSchema).min(1),
});

type WizardFormValues = z.infer<typeof wizardSchema>;

const steps = [
  { id: 1, title: "Type & title" },
  { id: 2, title: "Client & project" },
  { id: 3, title: "Sections" },
  { id: 4, title: "Review" },
];

export function DocumentCreateWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplateId = searchParams.get("templateId") ?? "";
  const { data: session } = useSession();
  const isViewer = session?.user?.role === "VIEWER";
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const { data: clients, isLoading: isClientsLoading } = useListClientsQuery();
  const { data: templates } = useListTemplatesQuery();
  const [createDocument, { isLoading: isSubmitting }] = useCreateDocumentMutation();

  const defaultSections = useMemo(
    () =>
      sectionTemplates.map((title, index) => ({
        title,
        content: "",
        order: index + 1,
      })),
    [],
  );

  const form = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      templateId: initialTemplateId,
      type: "CONTRACT",
      title: "",
      clientId: "",
      projectId: "",
      sections: defaultSections,
    },
    mode: "onBlur",
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = form;

  const { fields, move, append, replace } = useFieldArray<WizardFormValues, "sections">({
    control,
    name: "sections",
  });

  const templateId = useWatch({ control, name: "templateId" });
  const clientId = useWatch({ control, name: "clientId" });
  const projectId = useWatch({ control, name: "projectId" });
  const titleValue = useWatch({ control, name: "title" });
  const typeValue = useWatch({ control, name: "type" });
  const { data: projects, isLoading: isProjectsLoading } = useListProjectsQuery(
    clientId ? { clientId } : undefined,
  );

  useEffect(() => {
    setValue("projectId", "");
  }, [clientId, setValue]);

  useEffect(() => {
    if (!templateId || !templates?.data) {
      return;
    }
    const selected = templates.data.find((template) => template.id === templateId);
    if (!selected) {
      return;
    }

    replace(
      selected.sections.map((section, index) => ({
        title: section.title,
        content: section.content ?? "",
        order: index + 1,
      })),
    );
    setValue("type", selected.type, { shouldDirty: true });
    if (!titleValue) {
      setValue("title", selected.name, { shouldDirty: true });
    }
  }, [templateId, templates?.data, replace, setValue, titleValue]);

  const nextStep = async () => {
    setFormError(null);
    const stepValid =
      step === 1
        ? await trigger(["type", "title"])
        : step === 2
          ? await trigger(["clientId", "projectId"])
          : step === 3
            ? await trigger(["sections"])
            : true;

    if (stepValid) {
      setStep((current) => Math.min(current + 1, steps.length));
    }
  };

  const previousStep = () => setStep((current) => Math.max(current - 1, 1));

  const onSubmit = async (values: WizardFormValues) => {
    if (isViewer) {
      setFormError("You do not have permission to create documents.");
      return;
    }
    setFormError(null);
    try {
      const result = await createDocument({
        title: values.title,
        type: values.type,
        clientId: values.clientId,
        projectId: values.projectId,
        sections: values.sections.map((section, index) => ({
          title: section.title,
          content: section.content ?? "",
          order: index + 1,
        })),
      }).unwrap();

      router.push(`/documents/${result.data.id}`);
    } catch {
      setFormError("Unable to create document. Please try again.");
    }
  };

  if (isViewer) {
    return (
      <EmptyState
        title="Forbidden"
        description="You have view-only access. Document creation is disabled."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              New document
            </div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Create a document
            </h1>
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            Step {step} of {steps.length}
          </div>
        </div>
        <div className="mt-6 grid gap-2 md:grid-cols-4">
          {steps.map((item) => (
            <div
              key={item.id}
              className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                step === item.id
                  ? "border-[color:var(--brand)]/30 bg-[color:var(--brand)]/10 text-[var(--foreground)]"
                  : "border-[color:var(--border)] text-[var(--muted-foreground)]"
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </Card>

      <form
        className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-min)] md:p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-[var(--foreground)]">Document basics</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Pick the document type and a descriptive title.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Start from template
                </span>
                <Select
                  className="bg-[var(--surface-2)] text-sm"
                  {...register("templateId")}
                >
                  <option value="">No template</option>
                  {templates?.data?.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </Select>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Select a template to prefill sections and structure.
                </span>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Document type
                </span>
                <Select
                  className="bg-[var(--surface-2)] text-sm"
                  {...register("type")}
                >
                  <option value="CONTRACT">Contract</option>
                  <option value="PROPOSAL">Proposal</option>
                </Select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Title
                </span>
                <Input
                  className="bg-[var(--surface-2)]"
                  placeholder="e.g. 2026 Master Services Agreement"
                  {...register("title")}
                />
                {errors.title ? (
                  <span className="text-xs text-[var(--danger)]">{errors.title.message}</span>
                ) : null}
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-[var(--foreground)]">Client alignment</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Choose the client and project this document belongs to.
              </p>
            </div>
            {isClientsLoading ? (
              <p className="text-sm text-[var(--muted-foreground)]">Loading clients...</p>
            ) : clients?.data?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    Client
                  </span>
                  <Select
                    className="bg-[var(--surface-2)] text-sm"
                    {...register("clientId")}
                  >
                    <option value="">Select client</option>
                    {clients.data.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                  {errors.clientId ? (
                    <span className="text-xs text-[var(--danger)]">{errors.clientId.message}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    Project
                  </span>
                  <Select
                    className="bg-[var(--surface-2)] text-sm"
                    {...register("projectId")}
                  >
                    <option value="">
                      {isProjectsLoading ? "Loading..." : "Select project"}
                    </option>
                    {projects?.data?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                  {errors.projectId ? (
                    <span className="text-xs text-[var(--danger)]">{errors.projectId.message}</span>
                  ) : null}
                </label>
              </div>
            ) : (
              <EmptyState
                title="No clients yet"
                description="Seed data should create a client and project. Create one to continue."
              />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-[var(--foreground)]">Section template</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add content placeholders for the first draft.
              </p>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Input
                      className="bg-[var(--surface)] text-sm font-semibold"
                      {...register(`sections.${index}.title`)}
                    />
                    <div className="flex gap-2">
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
                    </div>
                  </div>
                  <Textarea
                    className="mt-3"
                    rows={3}
                    placeholder="Add initial notes or leave empty."
                    {...register(`sections.${index}.content`)}
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
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
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-[var(--foreground)]">Review</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Confirm the details before creating the document.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4 text-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Type
                </div>
                <div className="mt-2 font-semibold text-[var(--foreground)]">
                  {typeValue}
                </div>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4 text-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Title
                </div>
                <div className="mt-2 font-semibold text-[var(--foreground)]">
                  {titleValue || "Untitled"}
                </div>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4 text-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Client
                </div>
                <div className="mt-2 font-semibold text-[var(--foreground)]">
                  {clients?.data?.find((client) => client.id === clientId)?.name ??
                    "Not selected"}
                </div>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4 text-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Project
                </div>
                <div className="mt-2 font-semibold text-[var(--foreground)]">
                  {projects?.data?.find((project) => project.id === projectId)?.name ??
                    "Not selected"}
                </div>
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--muted)] p-4 text-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Sections
              </div>
              <ul className="mt-2 space-y-2 text-[var(--foreground)]">
                {fields.map((field) => (
                  <li key={field.id} className="flex items-center justify-between">
                    <span className="font-medium">{field.title}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {(field.content ?? "").length} chars
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {formError ? <p className="text-sm text-[var(--danger)]">{formError}</p> : null}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="secondary" size="sm" onClick={previousStep} disabled={step === 1}>
            Back
          </Button>
          {step < steps.length ? (
            <Button type="button" size="sm" onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create document"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}


