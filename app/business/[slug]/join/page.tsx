"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  name: string;
  slug: string;
};

export default function JoinBusinessPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [business, setBusiness] =
    useState<Business | null>(null);

  const [loading, setLoading] = useState(true);

  const [joining, setJoining] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      const { data } = await supabase
        .from("businesses")
        .select("id, name, slug")
        .eq("slug", slug)
        .single();

      setBusiness(data ?? null);
      setLoading(false);
    }

    loadBusiness();
  }, [slug]);

  async function handleJoin() {
    if (!business) return;

    setJoining(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in first.");
      setJoining(false);
      return;
    }

    const response = await fetch(
      "/api/business/join",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: business.id,
          authUserId: user.id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(
        data.error || "Unable to join business."
      );

      setJoining(false);
      return;
    }

    if (data.alreadyJoined) {
      setMessage(
        "You are already linked to this business."
      );
    } else {
      setMessage(
        "Successfully linked to business."
      );
    }

    setJoining(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">
          Loading business...
        </p>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">
          Business not found.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-teal-700 via-sky-800 to-blue-950 px-6 py-8 text-center text-white">
          <p className="text-sm font-semibold text-sky-100">
            Join Business
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {business.name}
          </h1>

          <p className="mt-3 text-sm text-slate-100">
            Link your Thankly worker profile to this business for team reporting and operational visibility.
          </p>
        </div>

        <div className="p-6">
          <button
            type="button"
            onClick={handleJoin}
            disabled={joining}
            className="w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {joining
              ? "Joining..."
              : "Join business"}
          </button>

          {message ? (
            <p className="mt-4 text-center text-sm text-slate-600">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
