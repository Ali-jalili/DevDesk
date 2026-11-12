/** @format */

import useAuth from "@/app/context/useAuth";
import AuthShell from "@/components/AuthShell";

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
    <AuthShell
      mode="login"
      title="Welcome back"
      description="Log in to open your workspaces, collections, and requests."
      footer={
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <NavLink
            to="/signup"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Create an account
          </NavLink>
        </p>
      }
    >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
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
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "login-email-error" : undefined}
                className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500 dark:border-white/10"
                }`}
              />

              {errors.email && (
                <p id="login-email-error" role="alert" className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => void sendResetEmail()}
                  className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500 dark:border-white/10"
                }`}
              />

              {errors.password && (
                <p id="login-password-error" role="alert" className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
    </AuthShell>
  );
}
