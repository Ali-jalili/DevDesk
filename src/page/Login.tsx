/** @format */

import useAuth from "@/app/context/useAuth";

import { getAuthErrorMessage } from "@/utils/authError";

import React, { useState } from "react";

import toast from "react-hot-toast";

import { FaSpinner } from "react-icons/fa6";

import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
  const { handleSignIn, handlePasswordReset } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();

  async function sendResetEmail() {
    if (!email.trim() || !email.includes("@")) {
      setErrors({ email: "Enter your email above, then tap Forgot password." });
      return;
    }

    try {
      await handlePasswordReset(email);
      toast.success("Reset link sent. Check your inbox.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  }

  function validateForm() {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const user = await handleSignIn(email, password);

      if (user) {
        toast.success("Logged in successfully!");

        setErrors({});

        setEmail("");

        setPassword("");

        navigate("/app/dashboard");
      }
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-600/20">
            D
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Log in to continue working with your API workflow.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                value={email}
                onChange={(e) => {
                  const value = e.target.value;

                  setEmail(value);

                  if (value.includes("@")) {
                    setErrors((prev) => ({
                      ...prev,
                      email: undefined,
                    }));
                  }
                }}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500"
                }`}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => void sendResetEmail()}
                  className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Forgot password?
                </button>
              </div>

              <input
                value={password}
                onChange={(e) => {
                  const value = e.target.value;

                  setPassword(value);

                  if (value) {
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500"
                }`}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Create an account
              </NavLink>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Your API workflow, organized in one focused workspace.
        </p>
      </div>
    </main>
  );
}
