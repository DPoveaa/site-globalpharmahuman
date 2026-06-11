"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  MessageCircle,
  Truck,
  Layout,
  Star,
  Menu,
  X,
  Shield,
  ChevronRight,
  MapPin
} from "lucide-react";

type Props = {
  role: string;
  permissions: string[];
};

export function AdminSidebar({ role, permissions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Bloquear scroll do corpo quando o menu estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const hasPermission = (perm: string) => role === "ADMIN" || permissions.includes(perm);

  const navItems = [
    {
      group: "Gestão",
      items: [
        { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "view_dashboard" },
        { id: "products", label: "Produtos", href: "/admin/produtos", icon: Package, permission: "manage_products" },
        { id: "promotions", label: "Promoções", href: "/admin/promocoes", icon: Tag, permission: "manage_promotions" },
        { id: "orders", label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag, permission: "manage_orders" },
        { id: "users", label: "Contas", href: "/admin/usuarios", icon: Users, role: "ADMIN" },
        { id: "loyalty", label: "Fidelidade", href: "/admin/fidelidade", icon: Star, permission: "manage_loyalty" },
      ]
    },
    {
      group: "Configurações",
      items: [
        { id: "settings", label: "Gerais", href: "/admin/configuracoes", icon: Settings, permission: "manage_settings" },
        { id: "whatsapp", label: "WhatsApp", href: "/admin/whatsapp", icon: MessageCircle, permission: "manage_whatsapp" },
        { id: "shipping", label: "Frete", href: "/admin/frete", icon: Truck, permission: "manage_shipping" },
        { id: "menu", label: "Menu", href: "/admin/menu", icon: Layout, permission: "manage_settings" },
        { id: "units", label: "Unidades", href: "/admin/unidades", icon: MapPin, permission: "manage_settings" },
      ]
    }
  ];

  const filteredGroups = navItems.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.role && role !== item.role) return false;
      if (item.permission && !hasPermission(item.permission)) return false;
      return true;
    })
  })).filter(group => group.items.length > 0);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8 hidden md:block">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
          Painel Administrativo
        </p>
      </div>

      <div className="space-y-8 flex-1">
        {filteredGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ${isActive
                      ? "bg-brand-900 text-white shadow-lg shadow-brand-900/20"
                      : "text-slate-600 hover:bg-brand-50 hover:pl-6"
                    }`}
                  >
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8 border-t border-brand-50 md:hidden">
        <Link 
          href="/conta" 
          className="flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-bold text-slate-700"
        >
          <Shield size={20} />
          Minha Conta
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="mb-6 flex items-center justify-between rounded-[32px] border border-brand-100 bg-white p-4 shadow-sm md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg shadow-brand-900/20">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin</p>
            <p className="text-base font-black text-slate-900">Gerenciamento</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-slate-600 transition hover:bg-brand-100 active:scale-95"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-[85%] max-w-sm transform bg-white shadow-2xl transition-transform duration-500 ease-out md:relative md:inset-0 md:z-0 md:w-full md:translate-x-0 md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col p-8 md:p-6 md:rounded-[32px] md:border md:border-brand-100 md:bg-white md:shadow-sm">
          <div className="mb-10 flex items-center justify-between md:hidden">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Administração</p>
              <h2 className="text-2xl font-black text-slate-900">Menu Principal</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full bg-brand-50 p-2 text-slate-400 transition hover:bg-brand-100">
              <X size={24} />
            </button>
          </div>

          <NavContent />
        </div>
      </aside>
    </>
  );
}
