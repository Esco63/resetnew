import { AdminHeader } from "@/components/admin/AdminHeader";
import { SasInbox } from "@/components/admin/SasInbox";

export const dynamic = "force-dynamic";
export const metadata = { title: "SAS-Belege – reset. Admin", robots: { index: false } };

export default function BelegePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AdminHeader />
      <SasInbox />
    </main>
  );
}
