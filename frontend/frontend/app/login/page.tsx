'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!name.trim()) return;

    // temporary login storage
    localStorage.setItem("username", name);

    // go to dashboard (or any page you want)
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

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded-lg bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500 transition"
        >
          Continue
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          Temporary login. OAuth coming later.
        </p>

      </div>
    </div>
  );
}
