'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setError("");
    setLoading(true);

    // TODO: replace with real auth (NextAuth, Clerk, etc.)
    // WARNING: this is not secure — username can be spoofed via DevTools.
    const safeName = name.trim().slice(0, 100);
    localStorage.setItem("username", safeName);

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-white">
      <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-lg">

        <h1 className="mb-2 text-center text-2xl font-bold">
          Sign in
        </h1>

        <p className="mb-6 text-center text-sm text-slate-400">
          Enter your name to continue
        </p>

        {/* Wrap in a form so Enter key submits naturally */}
        <form onSubmit={handleLogin} noValidate>

          {/* Visually hidden label for screen readers */}
          <label htmlFor="name" className="sr-only">
            Your name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            className="mb-1 w-full rounded-lg bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby={error ? "name-error" : undefined}
            autoComplete="name"
          />

          {/* Inline error message */}
          {error && (
            <p id="name-error" className="mb-3 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          {!error && <div className="mb-3" />}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Continue"}
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Temporary login. OAuth coming later.
        </p>

      </div>
    </div>
  );
}
