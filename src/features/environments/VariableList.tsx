/** @format */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit2, FiEye, FiEyeOff, FiKey } from "react-icons/fi";
import { toast } from "react-hot-toast";

import useUpdateVariable from "./hooks/useUpdateVariable";
import VariableDeleteButton from "./VariableDeleteButton";
import type { EnvironmentVariableRecord } from "@/types/database";

type FormData = {
  key: string;
  value: string;
};

interface VariableListProps {
  data: EnvironmentVariableRecord[];
}

export default function VariableList({ data }: VariableListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [visibleValues, setVisibleValues] = useState<Record<string, boolean>>(
    {},
  );

  const { mutate, isPending } = useUpdateVariable();

  const { register, handleSubmit, reset } = useForm<FormData>();

  function startEdit(item: EnvironmentVariableRecord) {
    setEditingId(item.id);

    reset({
      key: item.key,
      value: item.value,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset();
  }

  function submitEdit(data: FormData) {
    if (!editingId) return;

    mutate(
      {
        variableId: editingId,
        data,
      },
      {
        onSuccess() {
          toast.success("Variable updated");
          setEditingId(null);
          reset();
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  }

  function toggleValue(id: string) {
    setVisibleValues((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FiKey size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900">
            No variables yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add your first environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
        >
          {editingId === item.id ? (
            <form onSubmit={handleSubmit(submitEdit)} className="space-y-4">
              <input
                {...register("key")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />

              <input
                {...register("value")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  disabled={isPending}
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Key
                </p>

                <p className="mt-1 font-semibold text-slate-900">{item.key}</p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Value
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="truncate text-sm text-slate-600">
                    {visibleValues[item.id] ? item.value : "••••••••••"}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleValue(item.id)}
                    aria-label={
                      visibleValues[item.id]
                        ? `Hide value for ${item.key}`
                        : `Show value for ${item.key}`
                    }
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                  >
                    {visibleValues[item.id] ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  <FiEdit2 size={15} />
                  Edit
                </button>

                <VariableDeleteButton variableId={item.id} />
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
}
