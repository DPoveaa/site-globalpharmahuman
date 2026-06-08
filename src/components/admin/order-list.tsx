"use client";

import { useState, useEffect } from "react";
import { formatCurrency, translateOrderStatus } from "@/lib/utils";
import { Package, User, Phone, MapPin, Calendar, Download, Search, X, Settings, Plus, Trash2, ShieldAlert } from "lucide-react";
import * as XLSX from "xlsx";
import { useSearchParams } from "next/navigation";

type AdminOrder = {
  id: string;
  status: string;
  total: number;
  whatsappContact: string | null;
  notes: string | null;
  createdAt: string;
  user: { name: string; email: string };
  address: {
    street: string;
    number: string;
    district: string;
    zipCode: string;
    city: string;
    state: string;
    complement?: string | null;
    reference?: string | null
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: { name: string };
  }>;
};

export function OrderList({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showIgnored, setShowIgnored] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ignoredEmails, setIgnoredEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const searchParams = useSearchParams();

  // Load ignored users settings on mount
  useEffect(() => {
    async function loadIgnoredEmails() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const settings = await res.json();
          const ignored = settings.find((s: any) => s.key === "IGNORED_USER_EMAILS");
          if (ignored?.value) {
            setIgnoredEmails(
              ignored.value
                .split(",")
                .map((e: string) => e.trim().toLowerCase())
                .filter(Boolean)
            );
          }
        }
      } catch (err) {
        console.error("Erro ao carregar e-mails ignorados:", err);
      }
    }
    loadIgnoredEmails();
  }, []);

  // Listen for search parameters (?q=xxx)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearch(q);
      const autoFilter = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/orders?q=${encodeURIComponent(q)}&showIgnored=true`);
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch (error) {
          console.error("Erro ao filtrar automaticamente:", error);
        } finally {
          setLoading(false);
        }
      };
      autoFilter();
    }
  }, [searchParams]);

  const handleFilter = async (overrides?: { showIgnored?: boolean }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (startDate) params.append("start", startDate);
      if (endDate) params.append("end", endDate);
      if (search) params.append("q", search);

      const currentShowIgnored = overrides && overrides.showIgnored !== undefined
        ? overrides.showIgnored
        : showIgnored;
      if (currentShowIgnored) {
        params.append("showIgnored", "true");
      }

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Erro ao filtrar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setStatusFilter("ALL");
    setStartDate("");
    setEndDate("");
    setSearch("");
    setShowIgnored(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (trimmed && !ignoredEmails.includes(trimmed)) {
      setIgnoredEmails([...ignoredEmails, trimmed]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setIgnoredEmails(ignoredEmails.filter((e) => e !== emailToRemove));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "IGNORED_USER_EMAILS",
          value: ignoredEmails.join(",")
        })
      });
      if (res.ok) {
        await handleFilter();
        setShowSettings(false);
      } else {
        alert("Erro ao salvar configurações.");
      }
    } catch (err) {
      console.error("Erro ao salvar e-mails ignorados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
        window.dispatchEvent(new Event("order-status-updated"));
      } else {
        alert("Erro ao atualizar status do pedido.");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const exportToExcel = () => {
    const exportData = orders.map(order => ({
      ID: order.id,
      Data: new Date(order.createdAt).toLocaleDateString("pt-BR"),
      Status: translateOrderStatus(order.status),
      Cliente: order.user.name,
      Email: order.user.email,
      WhatsApp: order.whatsappContact || "N/I",
      Total: order.total,
      Rua: order.address?.street || "N/I",
      Número: order.address?.number || "N/I",
      Bairro: order.address?.district || "N/I",
      Cidade: order.address?.city || "N/I",
      Estado: order.address?.state || "N/I",
      CEP: order.address?.zipCode || "N/I",
      Complemento: order.address?.complement || "",
      Referência: order.address?.reference || "",
      Produtos: order.items.map(i => `${i.quantity}x ${i.product.name}`).join(", "),
      Observações: order.notes || ""
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

    const fileName = `pedidos_globalpharma_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const hasActiveFilters = statusFilter !== "ALL" || startDate !== "" || endDate !== "" || search !== "";

  return (
    <div className="space-y-6">
      {/* Compact Filters Bar - Single Line */}
      <div className="rounded-[24px] border border-brand-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome, ID, E-mail..."
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
              className="h-11 w-full rounded-xl border border-brand-50 bg-slate-50 pl-10 pr-4 text-xs font-bold text-slate-700 outline-none focus:border-brand-500 focus:bg-white transition-all"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status Filter */}
          <div className="hidden sm:block">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-brand-50 bg-slate-50 px-3 text-xs font-bold text-slate-600 outline-none focus:border-brand-500 focus:bg-white transition"
            >
              <option value="ALL">Status</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELED">Cancelado</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="hidden items-center gap-2 lg:flex">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11 rounded-xl border border-brand-50 bg-slate-50 px-3 text-[10px] font-bold text-slate-600 outline-none focus:border-brand-500 focus:bg-white transition"
            />
            <span className="text-slate-300 font-bold">/</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-11 rounded-xl border border-brand-50 bg-slate-50 px-3 text-[10px] font-bold text-slate-600 outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                title="Limpar Filtros"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 active:scale-95"
              >
                <X size={18} />
              </button>
            )}

            <button
              onClick={() => handleFilter()}
              disabled={loading}
              title="Pesquisar (Enter)"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 active:scale-95 disabled:opacity-50 shadow-lg shadow-slate-900/10"
            >
              {loading ? <Search size={18} className="animate-pulse" /> : <Search size={18} />}
            </button>

            <button
              onClick={exportToExcel}
              title="Exportar Excel"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white transition hover:bg-green-700 active:scale-95 shadow-lg shadow-green-600/10"
            >
              <Download size={18} />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              title="Configurar E-mails Ignorados"
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition active:scale-95 ${showSettings
                  ? "border-brand-500 bg-brand-50 text-brand-600"
                  : "border-brand-100 bg-white text-slate-600 hover:bg-brand-50"
                }`}
            >
              <Settings size={18} />
            </button>
          </div>

          <div className="ml-auto hidden xl:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="text-slate-900">{orders.length}</span> Pedidos
            </p>
          </div>
        </div>
      </div>

      {/* Settings Section for Ignored Test Users */}
      {showSettings && (
        <div className="rounded-[24px] border border-brand-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings size={20} className="text-slate-500" />
            <h3 className="text-sm font-black uppercase tracking-wider">Definir Usuários de Teste / Ignorados</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Os pedidos dos usuários com os e-mails configurados abaixo ficarão ocultos na listagem principal por padrão para evitar poluição com clientes reais.
          </p>

          <div className="flex gap-2 max-w-md">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="exemplo@teste.com"
              className="h-10 flex-1 rounded-xl border border-brand-50 bg-slate-50 px-3 text-xs outline-none focus:border-brand-500 focus:bg-white transition"
              onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
            />
            <button
              onClick={handleAddEmail}
              className="h-10 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95"
            >
              Adicionar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 py-1">
            {ignoredEmails.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum e-mail configurado na lista de ignorados.</p>
            ) : (
              ignoredEmails.map((email) => (
                <span key={email} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 pl-3 pr-1.5 py-1 text-xs font-medium text-slate-700">
                  {email}
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="rounded-full p-0.5 hover:bg-slate-200 text-slate-400 hover:text-red-500 transition"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="flex gap-2 border-t border-brand-50 pt-4">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="rounded-xl bg-brand-900 px-4 py-2 text-xs font-black text-white hover:bg-brand-800 transition active:scale-95 shadow-lg shadow-brand-900/10 disabled:opacity-50"
            >
              Salvar Configurações
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="rounded-xl border border-brand-100 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-brand-100 bg-white p-8 text-center">
            <Package size={48} className="mb-4 text-slate-200" />
            <h3 className="text-xl font-bold text-slate-900">Nenhum pedido encontrado</h3>
            <p className="mt-1 text-slate-500">Tente ajustar seus filtros para encontrar o que procura.</p>
          </div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="overflow-hidden rounded-[32px] border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
              <div className="flex flex-wrap items-center justify-between border-b border-brand-50 bg-slate-50/50 px-6 py-4 md:px-8">
                <div className="flex items-center gap-3">
                  <p className="font-black text-slate-900">#{order.id.slice(-8).toUpperCase()}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1 text-[10px] font-black uppercase tracking-wider cursor-pointer outline-none focus:ring-2 focus:ring-slate-400 transition ${order.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                        order.status === "PAID" ? "bg-blue-100 text-blue-700" :
                          order.status === "PROCESSING" ? "bg-purple-100 text-purple-700" :
                            order.status === "SHIPPED" ? "bg-indigo-100 text-indigo-700" :
                              order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                order.status === "CANCELED" ? "bg-red-100 text-red-700" :
                                  "bg-slate-100 text-slate-700"
                      }`}
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PAID">Pago</option>
                    <option value="PROCESSING">Em Produção</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregue</option>
                    <option value="CANCELED">Cancelado</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Calendar size={14} />
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <User size={12} /> Cliente
                    </h3>
                    <p className="text-sm font-bold text-slate-900">{order.user.name}</p>
                    <p className="text-xs text-slate-500">{order.user.email}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Phone size={12} /> Contato
                    </h3>
                    <p className="text-sm font-bold text-slate-900">{order.whatsappContact || "Não informado"}</p>
                  </div>

                  {order.address && (
                    <div>
                      <h3 className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <MapPin size={12} /> Endereço de Entrega
                      </h3>
                      <p className="text-sm text-slate-700">
                        {order.address.street}, {order.address.number}
                        {order.address.complement && ` - ${order.address.complement}`}
                      </p>
                      {order.address.reference && (
                        <p className="text-xs text-amber-600 font-bold italic">
                          Ref: {order.address.reference}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        {order.address.city} / {order.address.state}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-brand-50/50 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Package size={12} /> Itens do Pedido
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <p className="font-medium text-slate-700">
                            <span className="font-bold text-slate-900">{item.quantity}x</span> {item.product.name}
                          </p>
                          <p className="font-bold text-slate-900">{formatCurrency(item.subtotal)}</p>
                        </div>
                      ))}
                      <div className="mt-3 border-t border-brand-100 pt-3 flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pago</p>
                        <p className="text-lg font-black text-slate-900">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4">
                      <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-600">Observações</h3>
                      <p className="text-xs text-amber-800">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
