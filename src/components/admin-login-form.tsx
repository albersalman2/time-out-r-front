"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Login failed.");
      }

      router.push("/admin/orders");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-md border border-[#eadfcb] bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase text-[#f25a1d]">Staff login</p>
      <h1 className="mt-2 text-3xl font-black">Time Out dashboard</h1>
      <div className="mt-6 grid gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="h-11 rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="h-11 rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
        />
      </div>
      {message ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-900">
          {message}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 h-11 w-full rounded-md bg-[#10100f] text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-[#a8a19a]"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
