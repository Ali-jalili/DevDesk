/** @format */

import useAuth from "@/app/context/useAuth";
import AuthShell from "@/components/AuthShell";
import { getAuthErrorMessage } from "@/utils/authError";

import React, { useState } from "react";

import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Signup() {
  const { handleSignUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();

  function validateForm() {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
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

      const user = await handleSignUp(name, email, password);

      if (user) {
        toast.success("Account created successfully!");

        setErrors({});

        setName("");
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
      mode="signup"
      title="Create your account"
      description="Set up your account, then create a workspace from your dashboard."
      footer={
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Log in
          </NavLink>
        </p>
      }
    >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Name
              </label>

              <input
                id="signup-name"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;

                  setName(value);

                  if (value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      name: undefined,
                    }));
                  }
                }}
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "signup-name-error" : undefined}
                className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500 dark:border-white/10"
                }`}
              />

              {errors.name && (
                <p
                  id="signup-name-error"
                  role="alert"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>

              <input
                id="signup-email"
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
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={
                  errors.email ? "signup-email-error" : undefined
                }
                className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500 dark:border-white/10"
                }`}
              />

              {errors.email && (
                <p
                  id="signup-email-error"
                  role="alert"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>

                <span className="text-xs text-slate-400 dark:text-slate-500">
                  At least 8 characters
                </span>
              </div>

              <input
                id="signup-password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;

                  setPassword(value);

                  if (value.length >= 8) {
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? "signup-password-error" : undefined
                }
                className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500 dark:border-white/10"
                }`}
              />

              {errors.password && (
                <p
                  id="signup-password-error"
                  role="alert"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
    </AuthShell>
  );
}
