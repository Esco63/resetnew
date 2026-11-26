import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderEditor } from "@/components/admin/OrderEditor";
import { getOrder } from "@/lib/orders/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Auftrag – reset. Admin", robots: { index: false } };

export default async function AuftragPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <AdminHeader />
      <OrderEditor initialOrder={order} />
    </main>
  );
}
