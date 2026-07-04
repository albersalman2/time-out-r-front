import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#10100f] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminSidebar />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
