/** @format */

import { useForm, useFieldArray } from "react-hook-form";
import type { UseFormRegister, FieldPath } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import { convertKeyValueArrayToObject } from "@/utils/convertKeyValueArrayToObject";
import type { RequestRecord, RequestFormData } from "@/types/database";

type KeyValueItem = { key: string; value: string };

function toKeyValueItems(
  map: Record<string, string> | null | undefined,
): KeyValueItem[] {
  return Object.entries(map || {}).map(([key, value]) => ({ key, value }));
}

interface RequestFormProps {
  /** In create mode leave undefined; in edit mode pass the record to prefill. */
  initialValues?: RequestRecord;
  /** "create" renders creation affordances, "edit" renders save/cancel. */
  mode: "create" | "edit";
  onSubmit: (values: {
    name: string;
    method: string;
    url: string;
    headers: Record<string, string>;
    params: Record<string, string>;
    body: string;
    description: string;
    example_request: string;
    example_response: string;
    notes: string;
  }) => void;
  isPending: boolean;
  onCancel?: () => void;
}

export default function RequestForm({
  initialValues,
  mode,
  onSubmit,
  isPending,
  onCancel,
}: RequestFormProps) {
  const isEdit = mode === "edit";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>({
    defaultValues: {
      name: initialValues?.name ?? "",
      method: initialValues?.method ?? "GET",
      url: initialValues?.url ?? "",
      headers: toKeyValueItems(initialValues?.headers),
      params: toKeyValueItems(initialValues?.params),
      body: initialValues?.body ?? "",
      description: initialValues?.description ?? "",
      example_request: initialValues?.example_request ?? "",
      example_response: initialValues?.example_response ?? "",
      notes: initialValues?.notes ?? "",
    },
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({ control, name: "headers" });

  const {
    fields: paramFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({ control, name: "params" });

  function submitForm(data: RequestFormData) {
    onSubmit({
      name: data.name,
      method: data.method,
      url: data.url,
      headers: convertKeyValueArrayToObject(data.headers),
      params: convertKeyValueArrayToObject(data.params),
      body: data.body,
      description: data.description,
      example_request: data.example_request,
      example_response: data.example_response,
      notes: data.notes,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="mx-auto max-w-3xl space-y-6"
    >
      {/* Request Information */}
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            Request Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure basic request settings.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="request-name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Request Name
            </label>
            <input
              id="request-name"
              {...register("name", { required: "Request name is required" })}
              placeholder="Get Users"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div>
              <label
                htmlFor="request-method"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Method
              </label>
              <select
                id="request-method"
                {...register("method")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="request-url"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                URL
              </label>
              <input
                id="request-url"
                {...register("url", { required: "URL is required" })}
                placeholder="https://api.example.com/users"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.url && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.url.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Headers */}
      <KeyValueSection
        title="Headers"
        subtitle="Add request headers."
        keyPlaceholder="Key"
        valuePlaceholder="Value"
        fields={headerFields}
        onAdd={() => appendHeader({ key: "", value: "" })}
        onRemove={removeHeader}
        register={register}
        prefix="headers"
        addLabel="Add header"
      />

      {/* Params */}
      <KeyValueSection
        title="Query Params"
        subtitle="Configure request parameters."
        keyPlaceholder="Parameter"
        valuePlaceholder="Value"
        fields={paramFields}
        onAdd={() => appendParam({ key: "", value: "" })}
        onRemove={removeParam}
        register={register}
        prefix="params"
        addLabel="Add parameter"
      />

      {/* Body */}
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Body</h2>
          <p className="mt-1 text-sm text-muted-foreground">Request payload.</p>
        </div>
        <textarea
          {...register("body")}
          rows={10}
          placeholder={`{
  "username": "devdesk",
  "password": "123456"
}`}
          className="w-full resize-none rounded-lg border border-border bg-slate-950 px-4 py-4 font-mono text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-primary/20"
        />
      </section>

      {/* Documentation */}
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Documentation
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Help other developers understand this endpoint.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <TextAreaField
            id="request-description"
            label="Description"
            placeholder="Explain what this request does..."
            rows={3}
            register={register}
            name="description"
          />
          <TextAreaField
            id="request-example-request"
            label="Example Request"
            placeholder={`{
  "email": "user@example.com"
}`}
            rows={6}
            mono
            register={register}
            name="example_request"
          />
          <TextAreaField
            id="request-example-response"
            label="Example Response"
            placeholder={`{
  "token": "abc123"
}`}
            rows={6}
            mono
            register={register}
            name="example_response"
          />
          <TextAreaField
            id="request-notes"
            label="Notes"
            placeholder="Add important notes about this endpoint..."
            rows={3}
            register={register}
            name="notes"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {isPending
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Request"}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reusable sub-components                                                  */
/* -------------------------------------------------------------------------- */

interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder: string;
  rows: number;
  mono?: boolean;
  name: "description" | "example_request" | "example_response" | "notes";
  register: UseFormRegister<RequestFormData>;
}

function TextAreaField({
  id,
  label,
  placeholder,
  rows,
  mono,
  name,
  register,
}: TextAreaFieldProps) {
  const monoClass = mono ? " font-mono" : "";
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <textarea
        id={id}
        {...register(name)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20${mono ? " resize-none" : " resize-none"}${monoClass}`}
      />
    </div>
  );
}

interface KeyValueSectionProps {
  title: string;
  subtitle: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  prefix: "headers" | "params";
  addLabel: string;
  fields: { id: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  register: UseFormRegister<RequestFormData>;
}

function KeyValueSection({
  title,
  subtitle,
  keyPlaceholder,
  valuePlaceholder,
  prefix,
  addLabel,
  fields,
  onAdd,
  onRemove,
  register,
}: KeyValueSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <FiPlus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>

      <div className="space-y-3">
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">No items yet.</p>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input
              {...register(
                `${prefix}.${index}.key` as FieldPath<RequestFormData>,
              )}
              placeholder={keyPlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              {...register(
                `${prefix}.${index}.value` as FieldPath<RequestFormData>,
              )}
              placeholder={valuePlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${prefix} item ${index + 1}`}
              className="flex h-10 items-center justify-center rounded-lg px-3 text-red-500 transition hover:bg-red-50"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
