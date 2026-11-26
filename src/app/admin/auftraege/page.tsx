import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MailImportButton } from "@/components/admin/MailImportButton";
import { buildInvoicePreview, formatEuro } from "@/lib/orders/invoice";
import { listOrders } from "@/lib/orders/server";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/orders/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Aufträge – reset. Admin", robots: { index: false } };

const GROUPS: { status: OrderStatus; title: string; empty: string }[] = [
  { status: "neu", title: "Neu", empty: "Keine neuen Aufträge." },
  { status: "erledigt", title: "Erledigt – Rechnung offen", empty: "Nichts abzurechnen." },
  { status: "gesendet", title: "Rechnung gesendet", empty: "Noch keine Rechnungen gesendet." },
];

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

function OrderRow({ order }: { order: Order }) {
  const preview = buildInvoicePreview(order);
  const date = order.work_date ?? order.mail_received_at ?? order.created_at;
  return (
    <li>
      <Link
        href={`/admin/auftraege/${order.id}`}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">
            {order.object_address || "Ohne Adresse"}
          </p>
          <p className="truncate text-sm text-slate-500">
            {dateFormat.format(new Date(date))}
            {order.hours ? ` · ${String(order.hours).replace(".", ",")} Std.` : ""}
            {order.invoice_number ? ` · ${order.invoice_number}` : ""}
          </p>
        </div>
        {preview.lines.length > 0 && (
          <span className="shrink-0 text-sm font-semibold text-slate-700">
            {formatEuro(preview.totalGross)}
          </span>
        )}
        <ChevronRight size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
      </Link>
    </li>
  );
}

export default async function AuftraegePage() {
  let orders: Order[] = [];
  let loadError = "";
  try {
    orders = await listOrders();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AdminHeader />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight">Aufträge</h1>
          <Link
            href="/admin/auftraege/neu"
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 font-semibold text-white shadow hover:bg-orange-700"
          >
            <Plus size={16} aria-hidden="true" /> Neu
          </Link>
        </div>

        <MailImportButton />

        {loadError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Aufträge konnten nicht geladen werden: {loadError}
          </p>
        )}

        {GROUPS.map((group) => {
          const items = orders.filter((order) => order.status === group.status);
          return (
            <section key={group.status}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                {group.title} <span className="text-slate-400">({items.length})</span>
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {items.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-500">{group.empty}</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {items.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </ul>
                )}
              </div>
            </section>
          );
        })}

        {orders.some((order) => order.status === "storniert") && (
          <p className="text-sm text-slate-500">
            {orders.filter((order) => order.status === "storniert").length} stornierte Aufträge
            ausgeblendet ({ORDER_STATUS_LABELS.storniert}).
          </p>
        )}
      </div>
    </main>
  );
}
