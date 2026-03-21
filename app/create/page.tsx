"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CreatePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    setErrorMessage("");
    setCopied(false);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    const baseSlug = slugify(trimmedName);

    setLoading(true);

    let finalSlug = baseSlug;
    let created = false;
    let attempt = 1;

    while (!created) {
      const { error } = await supabase.from("servers").insert({
        name: trimmedName,
        slug: finalSlug,
      });

      if (!error) {
        created = true;
        break;
      }

      const message = error.message.toLowerCase();

      if (message.includes("duplicate") || message.includes("unique")) {
        attempt += 1;
        finalSlug = `${baseSlug}-${attempt}`;
      } else {
        setLoading(false);
        setErrorMessage(error.message);
        return;
      }
    }

    setLoading(false);
    setCreatedSlug(finalSlug);
  }

  async function handleCopy() {
    const url = `https://thankly-jade.vercel.app/${createdSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  const createdUrl = createdSlug
    ? `https://thankly-jade.vercel.app/${createdSlug}`
    : "";

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <div className="bg-gradient-to-b from-sky-600 to-sky-700 px-6 py-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
            Thankly
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-white">
            Create your page
          </h1>

          <p className="mt-1 text-xs text-white/80">
            Get your personal Thankly link
          </p>
        </div>

        <div className="bg-white px-6 py-6">
          {!createdSlug ? (
            <>
              <input
                type="text"
                placeholder="Your name (e.g. Maria)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              {errorMessage ? (
                <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
              ) : null}

              <button
                onClick={handleCreate}
                disabled={loading}
                className="mt-4 w-full rounded-2xl bg-sky-600 py-3 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create my page"}
              </button>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  Your page is ready
                </h2>

                <p className="mt-2 break-all text-sm text-slate-600">
                  {createdUrl}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-white py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                {copied ? "Copied" : "Copy link"}
              </button>

              <a
                href={createdUrl}
                className="mt-3 block w-full rounded-2xl bg-sky-600 py-3 text-center font-semibold text-white hover:bg-sky-700 transition"
              >
                Visit my page
              </a>

              <button
                onClick={() => {
                  setName("");
                  setCreatedSlug("");
                  setCopied(false);
                  setErrorMessage("");
                }}
                className="mt-3 w-full rounded-2xl border border-dashed border-slate-200 bg-white py-3 font-semibold text-slate-500 hover:bg-slate-50 transition"
              >
                Create another
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}