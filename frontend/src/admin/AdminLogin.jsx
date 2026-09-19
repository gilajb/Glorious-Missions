import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { ApiError } from "../api/client";
import { useAuth } from "./AuthContext";

export default function AdminLogin() {
  const { status, login } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated") {
    return <Navigate to={location.state?.from?.pathname || "/admin"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username, password);
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError && err.kind === "validation") {
        setError(err.fieldErrors?.detail?.[0] || "Invalid username or password.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-margin-mobile">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-md p-space-xl flex flex-col gap-space-lg">
        <div className="flex flex-col gap-space-xxs text-center">
          <h1 className="font-headline-sm text-headline-sm text-on-surface">Admin sign in</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Glorious Missions content admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md" noValidate>
          <div className="flex flex-col gap-space-xxs">
            <label htmlFor="admin-username" className="font-label-md text-label-md text-on-surface">
              Username
            </label>
            <input
              id="admin-username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="px-space-md py-space-sm rounded-lg bg-surface border border-outline-variant font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-space-xxs">
            <label htmlFor="admin-password" className="font-label-md text-label-md text-on-surface">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-space-md py-space-sm rounded-lg bg-surface border border-outline-variant font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p role="alert" className="font-body-sm text-body-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center px-space-lg py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
