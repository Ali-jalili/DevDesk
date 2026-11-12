/** @format */

import useAuth from "@/app/context/useAuth";
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
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-600/20">
            D
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Start organizing your API workflow with DevDesk.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-sm font-medium text-slate-700"
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
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500"
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
                className="mb-2 block text-sm font-medium text-slate-700"
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
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500"
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
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <span className="text-xs text-slate-400">
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
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? "signup-password-error" : undefined
                }
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Log in
              </NavLink>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          By creating an account, you can start organizing your API workflow in
          DevDesk.
        </p>
      </div>
    </main>
  );
}
