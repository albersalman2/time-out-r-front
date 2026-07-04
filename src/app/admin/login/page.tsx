import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Login | Time Out",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/orders");
  }

  return (
    <section className="flex min-h-screen items-center bg-[#f7f2e8] px-4 py-10 text-[#10100f]">
      <AdminLoginForm />
    </section>
  );
}
