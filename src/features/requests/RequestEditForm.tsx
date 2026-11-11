/** @format */

import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

import useUpdateRequest from "./hooks/useUpdateRequest";
import { convertKeyValueArrayToObject } from "@/utils/convertKeyValueArrayToObject";
import type { RequestFormData } from "@/types/database";
import type { RequestRecord } from "@/types/database";

interface RequestEditFormProps {
  data: RequestRecord;

  onSuccess: () => void;
  onCancel: () => void;
}

export default function RequestEditForm({
  data,
  onSuccess,
  onCancel,
}: RequestEditFormProps) {
  const { requestId } = useParams<{
    requestId: string;
  }>();

  const { mutate, isPending } = useUpdateRequest();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>({
    defaultValues: {
      name: data.name ?? "",
      method: data.method ?? "GET",
      url: data.url ?? "",

      headers: Object.entries(data.headers ?? {}).map(([key, value]) => ({
        key,
        value,
      })),

      params: Object.entries(data.params ?? {}).map(([key, value]) => ({
        key,
        value,
      })),

      body: data.body ?? "",
      description: data.description ?? "",
      example_request: data.example_request ?? "",
      example_response: data.example_response ?? "",
      notes: data.notes ?? "",
    },
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: "headers",
  });

  const {
    fields: paramFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    control,
    name: "params",
  });

  function submitForm(formData: RequestFormData) {
    if (!requestId) return;

    mutate(
      {
        requestId,
        data: {
          name: formData.name,
          method: formData.method,
          url: formData.url,

          headers: convertKeyValueArrayToObject(formData.headers),

          params: convertKeyValueArrayToObject(formData.params),

          body: formData.body,
          description: formData.description,
          example_request: formData.example_request,
          example_response: formData.example_response,
          notes: formData.notes,
        },
      },
      {
        onSuccess() {
          toast.success("Request updated successfully");
          onSuccess();
        },

        onError(error) {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="mx-auto max-w-5xl space-y-6"
    >
      {/* Request Information */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Request Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure basic request settings.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Request Name
            </label>

            <input
              {...register("name", {
                required: "Request name is required",
              })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Get Users"
            />

            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Method
              </label>

              <select
                {...register("method")}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="GET">GET</option>

                <option value="POST">POST</option>

                <option value="PUT">PUT</option>

                <option value="PATCH">PATCH</option>

                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                URL
              </label>

              <input
                {...register("url", {
                  required: "URL is required",
                })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                placeholder="https://api.example.com/users"
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Headers</h2>

            <p className="mt-1 text-sm text-slate-500">Add request headers.</p>
          </div>

          <button
            type="button"
            onClick={() =>
              appendHeader({
                key: "",
                value: "",
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50"
          >
            <FiPlus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {headerFields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <input
                {...register(`headers.${index}.key`)}
                placeholder="Key"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              />

              <input
                {...register(`headers.${index}.value`)}
                placeholder="Value"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              />

              <button
                type="button"
                onClick={() => removeHeader(index)}
                className="flex h-10 items-center justify-center rounded-lg px-3 text-red-500 transition hover:bg-red-50"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Params */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Query Params
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure request parameters.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              appendParam({
                key: "",
                value: "",
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50"
          >
            <FiPlus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {paramFields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <input
                {...register(`params.${index}.key`)}
                placeholder="Parameter"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />

              <input
                {...register(`params.${index}.value`)}
                placeholder="Value"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() => removeParam(index)}
                className="flex h-10 items-center justify-center rounded-lg px-3 text-red-500 transition hover:bg-red-50"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Body */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950">Body</h2>

          <p className="mt-1 text-sm text-slate-500">Request payload.</p>
        </div>

        <textarea
          {...register("body")}
          rows={10}
          placeholder={`{
  "username": "arka",
  "password": "123456"
}`}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-sm text-slate-100 outline-none transition focus:ring-4 focus:ring-indigo-500/10"
        />
      </section>

      {/* Documentation */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Documentation
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Help other developers understand this endpoint.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={3}
              placeholder="Explain what this request does..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Example Request
            </label>

            <textarea
              {...register("example_request")}
              rows={7}
              placeholder={`{
  "email": "user@example.com",
  "password": "123456"
}`}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Example Response
            </label>

            <textarea
              {...register("example_response")}
              rows={7}
              placeholder={`{
  "token": "abc123",
  "user": {}
}`}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Add important notes..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Actions */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          disabled={isPending}
          type="submit"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
