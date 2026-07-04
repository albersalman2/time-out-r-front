"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logout() {
    setIsSubmitting(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isSubmitting}
      className="mt-4 h-10 w-full rounded-md border border-white/15 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/45"
    >
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  );
}
