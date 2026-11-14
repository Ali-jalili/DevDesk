/** @format */

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiBriefcase,
  FiFolder,
  FiGlobe,
  FiSend,
  FiZap,
} from "react-icons/fi";

import useAuth from "@/app/context/useAuth";

const requests = [
  {
    method: "GET",
    endpoint: "/api/products",
    url: "https://api.example.com/products",
    status: "200 OK",
    statusColor: "text-emerald-600",
    methodColor: "text-emerald-600",
  },
];

const features = [
  {
    title: "Workspaces",
    eyebrow: "A clear home for every project",
    description:
      "Give a project a name and optional description, then manage its collections and environments from that workspace.",
    detail: "Workspace name  ·  Optional description",
    icon: FiBriefcase,
  },
  {
    title: "Collections",
    eyebrow: "Structure that makes sense",
    description:
      "Create named collections with descriptions inside a workspace, then add related API requests to each one.",
    detail: "Collection name  ·  Description  ·  Requests",
    icon: FiFolder,
  },
  {
    title: "Requests",
    eyebrow: "Request fields together",
    description:
      "Save a method and URL with headers, query parameters, a JSON body, and request notes or examples.",
    detail: "Method  ·  URL  ·  Headers  ·  Params  ·  JSON body",
    icon: FiSend,
  },
  {
    title: "Environments",
    eyebrow: "Switch context with confidence",
    description:
      "Create named environments with key/value variables, choose one as active, and use its values in supported request fields.",
    detail: "Environment name  ·  Variable key/value pairs",
    icon: FiGlobe,
  },
];

const workflow = [
  {
    number: "01",
    stage: "START WITH CONTEXT",
    title: "Make a home for the project",
    description:
      "Create a workspace with a name and optional description to hold its collections and environments.",
    previewLabel: "EXAMPLE WORKSPACE",
    previewValue: "Store API",
    icon: FiBriefcase,
  },
  {
    number: "02",
    stage: "BRING ORDER",
    title: "Group requests by what they do",
    description:
      "Create collections inside the workspace, then add the related API requests to each one.",
    previewLabel: "EXAMPLE COLLECTION",
    previewValue: "Catalog",
    icon: FiFolder,
  },
  {
    number: "03",
    stage: "MAKE THE CALL",
    title: "Build and send the request",
    description:
      "Save the method, URL, headers, parameters, and JSON body. Send the request from its detail page to see the response.",
    previewLabel: "EXAMPLE REQUEST",
    previewValue: "GET  /api/products",
    icon: FiSend,
  },
  {
    number: "04",
    stage: "OPTIONAL · REUSE VALUES",
    title: "Select an active environment",
    description:
      "Create key/value variables, select the environment in the workspace, and reference values in request fields such as headers, parameters, and bodies.",
    previewLabel: "EXAMPLE HEADER VARIABLE",
    previewValue: "API_TOKEN  →  {{API_TOKEN}}",
    icon: FiGlobe,
  },
];

/** Fade + slide-up an element when it scrolls into view. */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // When reduced motion is preferred, skip the reveal entirely so content is
  // visible from the first paint (no synchronous setState inside an effect).
  const [visible, setVisible] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    // No reveal animation when the user prefers reduced motion — already shown.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const request = requests[0];

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ================= HERO ================= */}

      <section className="relative isolate overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/40 via-violet-300/30 to-transparent blur-3xl motion-safe:animate-pulse" />
          <div className="absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-fuchsia-300/20 to-indigo-300/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 py-14 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:min-h-[calc(100vh-64px)]">
          {/* Hero content */}

          <div className="max-w-2xl motion-safe:[animation:fade-in-up_0.8s_ease-out_both]">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-indigo-600 shadow-sm backdrop-blur dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
              <FiZap className="h-3.5 w-3.5" />
              Developer workflow, simplified
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Your API workflow,
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
                beautifully organized.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Keep your API requests, collections, environments, and request
              notes organized in one workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to={user ? "/app/dashboard" : "/signup"}
                className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/30"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </NavLink>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Explore DevDesk
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Built for developers who want their API context in one place.
            </p>
          </div>

          {/* ================= PRODUCT PREVIEW ================= */}

          <div className="relative motion-safe:[animation:fade-in-up_0.9s_ease-out_0.15s_both]">
            <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-indigo-300/40 via-violet-300/30 to-transparent blur-3xl dark:from-indigo-500/20 dark:via-violet-500/20" />

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur motion-safe:[animation:float-slow_7s_ease-in-out_infinite] dark:border-white/10 dark:bg-slate-900/60">
              {/* Window Header */}

              <div className="flex h-11 items-center justify-between border-b border-slate-200/80 bg-slate-50/50 px-3 sm:px-4 dark:border-white/5 dark:bg-white/5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <span className="text-[10px] font-medium text-slate-400">
                  Illustrative UI · sample values
                </span>

                <div className="w-8" />
              </div>

              <div className="grid min-h-[280px] grid-cols-1 sm:min-h-[400px] sm:grid-cols-[145px_minmax(0,1fr)]">
                {/* Sidebar */}

                <aside className="hidden border-r border-slate-200/80 bg-slate-50/60 p-3 dark:border-white/5 dark:bg-white/5 sm:block">
                  <div className="mb-7 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25">
                    D
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="rounded-md bg-indigo-100/70 px-2.5 py-2 font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                      Dashboard
                    </div>

                    <div className="px-2.5 py-2 text-slate-500 dark:text-slate-400">
                      Workspaces
                    </div>
                  </div>

                  <div className="mt-8 border-t border-slate-200/80 pt-4 dark:border-white/5">
                    <div className="px-2.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      Workspace · Store API
                    </div>

                    <div className="mt-2 space-y-1 text-[10px]">
                      <div className="px-2.5 py-1.5 text-slate-500 dark:text-slate-400">
                        Overview
                      </div>
                      <div className="rounded-md bg-indigo-100/70 px-2.5 py-2 font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                        Collections
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-500 dark:text-slate-400">
                        Environments
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Preview Content */}

                <div className="min-w-0 p-3 sm:p-5">
                  <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">
                        SAMPLE WORKSPACE · COLLECTIONS
                      </p>

                      <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        Catalog
                      </h3>
                    </div>

                    <div className="w-fit rounded-md border border-slate-200 px-2.5 py-1.5 text-[9px] font-medium text-slate-500 dark:border-white/10 dark:text-slate-400">
                      Active environment: Development
                    </div>
                  </div>

                  {/* Collection detail and the request creation entry point */}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[9px] font-semibold tracking-wide text-slate-400">
                      REQUESTS IN CATALOG
                    </p>
                    <span className="rounded-md bg-indigo-600 px-2 py-1 text-[9px] font-semibold text-white">
                      + New Request
                    </span>
                  </div>

                  {/* Animated Request */}

                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/70 dark:border-white/5 dark:bg-white/5">
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 bg-white/70 px-3 py-3 sm:px-4 dark:border-white/5 dark:bg-white/5">
                      <span
                        className={`rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold dark:bg-white/10 ${request.methodColor}`}
                      >
                        {request.method}
                      </span>

                      <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        {request.endpoint}
                      </span>

                      <span
                        className={`ml-auto whitespace-nowrap text-[9px] ${request.statusColor}`}
                      >
                        Example: {request.status}
                      </span>
                    </div>

                    <div className="space-y-2 p-3 font-mono text-[9px] sm:p-4">
                      <div className="flex min-w-0 gap-3">
                        <span className="text-slate-300">01</span>

                        <span className="truncate text-slate-500">
                          {request.url}
                        </span>
                      </div>

                      <div className="flex min-w-0 gap-3">
                        <span className="text-slate-300">02</span>

                        <span className="min-w-0 flex-1 truncate text-slate-500">
                          Authorization: Bearer {`{{API_TOKEN}}`}
                        </span>
                      </div>

                      <div className="flex min-w-0 gap-3">
                        <span className="text-slate-300">03</span>

                        <span className="truncate text-indigo-500">
                          Content-Type: application/json · sample request
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/80 px-3 py-2.5 text-[9px] leading-4 text-slate-400 dark:border-white/5 sm:px-4">
                      Sample only · no request is sent from this preview
                    </div>
                  </div>

                  {/* Request documentation fields */}

                  <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-white/5 dark:bg-white/5">
                    <div>
                      <p className="text-[9px] text-slate-400">
                        Saved with the request
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                        Description · examples · notes
                      </p>
                    </div>

                    <FiCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card */}

            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/90 sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20">
                  <FiCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-slate-800 dark:text-white">
                    Request details
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    Description, examples, notes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="relative isolate overflow-hidden border-t border-slate-200/60 bg-[#f7f8fc] dark:border-white/5 dark:bg-slate-950"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/70 via-violet-50/30 to-transparent dark:from-indigo-950/60 dark:via-slate-950/20" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700 shadow-sm dark:border-indigo-400/20 dark:bg-white/5 dark:text-indigo-300">
                <FiZap className="h-3.5 w-3.5" />
                Workspaces · Collections · Requests · Environments
              </div>
              <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Keep API work
                <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
                  in context.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                Your requests make more sense when the project, structure, and
                environment around them stay close. DevDesk keeps that context
                together.
              </p>
            </Reveal>

            <Reveal delay={120} className="hidden pb-2 lg:block">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <FiCheck className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                    Manage a workspace
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                    Open a workspace to manage its collections and environments
                  </span>
                </span>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, featureIndex) => (
              <Reveal
                key={feature.title}
                delay={featureIndex * 90}
                className={
                  featureIndex === 0
                    ? "md:col-span-2 xl:col-span-2"
                    : featureIndex === 3
                      ? "xl:col-span-2"
                      : ""
                }
              >
                <article className="group relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300/80 hover:shadow-xl hover:shadow-indigo-950/5 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-indigo-400/30 sm:p-7">
                  <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-200/50 to-fuchsia-200/20 blur-3xl transition duration-500 group-hover:scale-125 dark:from-indigo-500/15 dark:to-fuchsia-500/10" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 ring-1 ring-indigo-100 transition group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white group-hover:ring-transparent dark:from-indigo-400/15 dark:to-violet-400/10 dark:text-indigo-300 dark:ring-indigo-400/10">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-widest text-slate-300 dark:text-slate-600">
                      0{featureIndex + 1}
                    </span>
                  </div>

                  <div className="relative mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.13em] text-indigo-600 dark:text-indigo-400">
                      {feature.eyebrow}
                    </p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>

                  <div className="relative mt-auto pt-7">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-3 font-mono text-[11px] text-slate-600 dark:border-white/5 dark:bg-white/[0.035] dark:text-slate-300">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />
                      <span className="truncate">{feature.detail}</span>
                      <FiArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-indigo-500 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}

      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                <span className="h-px w-7 bg-indigo-500" />
                The paths available in the app
              </span>
              <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
                From a blank workspace
                <span className="block text-slate-400 dark:text-slate-500">
                  to a real response.
                </span>
              </h2>
            </div>
            <p className="max-w-md pb-1 text-base leading-7 text-slate-600 dark:text-slate-400">
              Create a workspace, add a collection and request, then select an
              active environment if the request uses environment variables.
            </p>
          </Reveal>

          <div className="relative mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-indigo-200 via-violet-300 to-indigo-200 xl:block dark:from-indigo-500/10 dark:via-violet-400/40 dark:to-indigo-500/10" />
            {workflow.map((step, stepIndex) => (
              <Reveal key={step.number} delay={stepIndex * 100}>
                <article className="group relative h-full rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-indigo-400/30 sm:p-6">
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-600 shadow-[0_8px_24px_-12px_rgba(79,70,229,0.45)] transition group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white dark:border-indigo-400/20 dark:bg-slate-900 dark:text-indigo-300 dark:group-hover:bg-indigo-500">
                      <step.icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-3xl font-bold tracking-tight text-slate-200 transition group-hover:text-indigo-200 dark:text-slate-800 dark:group-hover:text-indigo-400/40">
                      {step.number}
                    </span>
                  </div>

                  <p className="mt-8 text-[10px] font-bold tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                    {step.stage}
                  </p>
                  <h3 className="mt-2 min-h-[3.5rem] text-lg font-bold leading-snug text-slate-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 min-h-[5rem] text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>

                  <div className="mt-6 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-slate-950/60">
                    <p className="text-[9px] font-bold tracking-[0.14em] text-slate-400">
                      {step.previewLabel}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <p className="truncate font-mono text-[10px] font-medium text-slate-700 dark:text-slate-300">
                        {step.previewValue}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 flex flex-col gap-4 rounded-2xl bg-slate-950 px-6 py-5 text-white dark:bg-indigo-500/10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
                <FiCheck className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium text-slate-100 dark:text-slate-200">
                Each step keeps the context you need for the next one.
              </p>
            </div>
            <span className="font-mono text-xs text-indigo-300">
              workspace → collection → request → response
            </span>
          </Reveal>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            Requests are sent from your browser. The target API must allow
            browser access through CORS.
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-8 py-14 text-center shadow-2xl shadow-indigo-500/25 sm:px-16">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />

            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to organize your API workflow?
            </h2>

            <p className="relative mx-auto mt-4 max-w-xl text-base leading-7 text-indigo-100">
              Create an account, make a workspace, add requests to collections,
              and optionally use an active environment for variable values.
            </p>

            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <NavLink
                to={user ? "/app/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {user ? "Open your dashboard" : "Create your workspace"}
                <FiArrowRight className="h-4 w-4" />
              </NavLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
