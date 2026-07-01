"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  variant?: "public" | "app";
  backLabel?: string;
  backHref?: string;
};

export default function AppNav({
  variant = "public",
  backLabel = "← Back to home",
  backHref = "/",
}: Props) {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <nav className="bg-[#0F2347] h-16 flex items-center justify-between px-[5%]">
      <Link
        href="/"
        className="flex items-center gap-2 text-white font-black text-xl tracking-tight"
      >
        <img
          src="/images/app-iconfade.png"
          alt="Thankly"
          width={32}
          height={32}
          className="rounded-lg"
        />
        Thankly
      </Link>

      {variant === "public" ? (
        <Link
          href={backHref}
          className="text-white/65 text-sm font-medium hover:text-white transition-colors"
        >
          {backLabel}
        </Link>
      ) : (
        <button
          onClick={handleSignOut}
          className="text-white/65 text-sm font-medium hover:text-white transition-colors"
        >
          Sign out
        </button>
      )}
    </nav>
  );
}