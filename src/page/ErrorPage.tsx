/** @format */

import { Link, useRouteError } from "react-router-dom";

/**
 * Rendered by the router's `errorElement` when a route (or its subtree) throws.
 * Shows the underlying error when available, plus a recovery action.
 */
export default function ErrorPage() {
  const error = useRouteError() as { message?: string; status?: number };

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-xl font-semibold text-red-700">
          {error?.status === 404 ? "Page not found" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-red-600">
          {error?.message ||
            "An unexpected error occurred while loading this page."}
        </p>
        <Link
          to="/app/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
