/** @format */

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { FiArrowLeft, FiPlus } from "react-icons/fi";

import { createWorkspace } from "./WorkspaceService";

type FormData = {
  workspaceName: string;
  workspaceDescription?: string;
};

export default function CreateWorkspace() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      workspaceName: "",
      workspaceDescription: "",
    },
  });

  async function handleSubmitForm(data: FormData) {
    try {
      const result = await createWorkspace(
        data.workspaceName,
        data.workspaceDescription || "",
      );

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success("Workspace created successfully.");

      reset();

      navigate("/app/workspaces");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  return (
    <main
      className="
        min-h-[calc(100vh-4rem)]
        bg-slate-50
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          mx-auto
          max-w-2xl
        "
      >
        {/* Header */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/app/workspaces")}
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-slate-950
            "
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to workspaces
          </button>

          <p
            className="
              text-sm
              font-semibold
              text-indigo-600
            "
          >
            New workspace
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            Create your workspace
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            Organize your API projects, collections, requests, and environments
            in one place.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:p-7
          "
        >
          <div className="space-y-6">
            {/* Name */}

            <div>
              <label
                htmlFor="workspace-name"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-800
                "
              >
                Workspace name
              </label>

              <input
                id="workspace-name"
                {...register("workspaceName", {
                  required: "Workspace name is required.",

                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required.",
                  },
                })}
                placeholder="e.g. Payment API"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-indigo-500
                  focus:ring-4
                  focus:ring-indigo-500/10
                "
              />

              {errors.workspaceName && (
                <p
                  className="
                    mt-2
                    text-sm
                    text-red-500
                  "
                >
                  {errors.workspaceName.message}
                </p>
              )}
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="workspace-description"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-800
                "
              >
                Description
                <span className="ml-1 text-slate-400">(optional)</span>
              </label>

              <textarea
                id="workspace-description"
                rows={4}
                {...register("workspaceDescription")}
                placeholder="What is this workspace for?"
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-indigo-500
                  focus:ring-4
                  focus:ring-indigo-500/10
                "
              />
            </div>

            {/* Actions */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-100
                pt-6
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() => navigate("/app/workspaces")}
                className="
                  rounded-xl
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-100
                  hover:text-slate-950
                "
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                type="submit"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <FiPlus className="h-4 w-4" />

                {isSubmitting ? "Creating..." : "Create Workspace"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
