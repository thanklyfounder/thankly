"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Store intent and redirect to auth
    sessionStorage.setItem("authView", "signin");
    router.replace("/auth");
  }, []);
  return null;
}