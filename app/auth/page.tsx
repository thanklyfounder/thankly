"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Account created. You can now sign in.");
    setLoading(false);
  }

  async function handleSignIn() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") ?? "/create";
    setLoading(false);
    router.push(next);
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 text-center">
          Thankly Auth
        </h1>

        <p className="text-sm text-slate-500 text-center mt-1">
          Sign up or sign in to continue
        </p>

        <div className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          {message ? (
            <p className="text-sm text-center text-slate-600">{message}</p>
          ) : null}

          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full rounded-2xl bg-sky-600 py-3 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Sign up"}
          </button>

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}