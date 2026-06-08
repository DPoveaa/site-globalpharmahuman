"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Bell, ShoppingBag, Clock, AlertTriangle } from "lucide-react";
import { playNotificationSound } from "@/lib/utils";

type NotificationItem = {
  id: string;
  type: "PAID_PENDING" | "PROCESSING_STUCK";
  title: string;
  message: string;
  date: string;
  orderId: string;
};

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const prevCountRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/orders/notifications-check");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        
        const newCount = data.count || 0;
        setCount(newCount);

        // If count has increased, play notification sound
        if (newCount > prevCountRef.current) {
          playNotificationSound();
        }
        prevCountRef.current = newCount;
      }
    } catch (error) {
      console.error("Erro ao buscar notificações do admin:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    // Refresh immediately when order status updates
    window.addEventListener("order-status-updated", fetchNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener("order-status-updated", fetchNotifications);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-40" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-white text-slate-600 transition hover:bg-brand-50 hover:text-slate-900 active:scale-95 shadow-sm"
        title="Quadro de Avisos"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md shadow-red-500/20">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-[24px] border border-brand-100 bg-white p-4 shadow-xl shadow-slate-900/10">
          <div className="mb-3 flex items-center justify-between border-b border-brand-50 pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Quadro de Avisos</h3>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700">
              {count} pendentes
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 min-h-0">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Nenhum aviso no momento. Bom trabalho!
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={`/admin/pedidos?q=${notif.orderId}`}
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 rounded-2xl p-3 hover:bg-brand-50 transition border border-transparent hover:border-brand-100/50"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    notif.type === "PAID_PENDING" 
                      ? "bg-blue-50 text-blue-600" 
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    {notif.type === "PAID_PENDING" ? <ShoppingBag size={18} /> : <AlertTriangle size={18} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 leading-normal">{notif.message}</p>
                    <p className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                      <Clock size={10} />
                      {new Date(notif.date).toLocaleDateString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
