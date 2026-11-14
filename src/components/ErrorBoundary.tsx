/** @format */

import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Global error boundary used as the router's `errorElement` and as a wrapper
 * so an uncaught render error shows a recoverable screen instead of a blank page.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-semibold text-red-700">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-red-600">
              {this.state.error?.message ||
                "An unexpected error occurred while rendering this page."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Reload
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
