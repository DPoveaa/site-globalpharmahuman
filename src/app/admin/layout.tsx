import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  Truck,
  Layout,
  Star
} from "lucide-react";
import ForcePasswordChange from "./ForcePasswordChange";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminNotifications } from "@/components/admin-notifications";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    redirect("/login");
  }

  const role = session.user.role;
  const permissions = session.user.permissions || [];
  const mustChangePassword = session.user.mustChangePassword;

  if (mustChangePassword) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ForcePasswordChange />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* Admin Top Header Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-brand-50 pb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Painel de Controle</p>
          <h2 className="text-2xl font-black text-slate-900">Administração</h2>
        </div>
        <div>
          <AdminNotifications />
        </div>
      </div>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-[260px_1fr]">
        <AdminSidebar role={role} permissions={permissions} />
        <section className="w-full min-w-0 overflow-hidden">{children}</section>
      </div>
    </div>
  );
}

