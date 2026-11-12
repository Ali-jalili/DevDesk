/** @format */

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <p className="text-6xl font-bold text-slate-950">404</p>
        <h1 className="mt-4 text-xl font-semibold text-slate-950">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
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
