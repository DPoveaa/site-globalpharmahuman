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
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:grid md:grid-cols-[260px_1fr] md:px-8">
      <AdminSidebar role={role} permissions={permissions} />
      <section className="w-full min-w-0 overflow-hidden">{children}</section>
    </div>
  );
}

