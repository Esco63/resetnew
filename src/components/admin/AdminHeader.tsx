"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, LogOut, Receipt, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin/auftraege", label: "Aufträge", icon: ClipboardList },
  { href: "/admin/belege", label: "Belege", icon: Receipt },
  { href: "/admin/preise", label: "Preise", icon: Settings },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 md:px-8">
        <Link href="/admin/auftraege" className="mr-2 text-xl font-black tracking-tight">
          res<span className="text-orange-600">et.</span>
        </Link>
        <nav className="flex flex-1 gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold sm:px-3",
                pathname.startsWith(href)
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Icon size={15} className="hidden sm:block" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          aria-label="Logout"
        >
          <LogOut size={15} aria-hidden="true" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
