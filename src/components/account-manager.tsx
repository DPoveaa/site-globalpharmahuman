"use client";
import toast from "react-hot-toast";
import { confirmAction } from "@/lib/toast";

import { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCog,
  Lock,
  ChevronRight,
  Menu,
  Shield,
  Copy
} from "lucide-react";
import { signOut } from "next-auth/react";
import { formatCurrency, getImageUrl, translateOrderStatus } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { LoyaltyInfo } from "./loyalty-info";

type Address = {
  id: string;
  alias?: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  reference?: string;
};

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  whatsappContact?: string;
  notes?: string;
  address?: Address;
  paymentMethod?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  installmentCount?: number | null;
  installmentValue?: number | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: {
      name: string;
      imageUrl: string | null;
    };
  }>;
};

type Favorite = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
};

export function AccountManager({ initialUser }: { initialUser: any }) {
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "favorites" | "profile" | "loyalty">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Estados para novo endereço
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  // Estados para perfil
  const [profileData, setProfileData] = useState({
    name: initialUser.name || "",
    phone: initialUser.phone || "",
    cpf: initialUser.cpf ? (initialUser.cpf.length <= 11
      ? initialUser.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : initialUser.cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"))
      : "",
    password: "",
    confirmPassword: ""
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [ordersRes, addressesRes, favoritesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/user/addresses"),
        fetch("/api/user/favorites")
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (addressesRes.ok) setAddresses(await addressesRes.json());
      if (favoritesRes.ok) setFavorites(await favoritesRes.json());
    } catch (error) {
      console.error("Erro ao carregar dados da conta:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });
      if (res.ok) {
        setIsAddingAddress(false);
        setNewAddress({});
        await fetchData();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Erro ao salvar endereço");
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!await confirmAction("Excluir este endereço?")) return;
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      toast.error("Erro ao excluir endereço");
    }
  }

  async function handleToggleFavorite(productId: string) {
    try {
      const res = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setUpdatingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          cpf: profileData.cpf.replace(/\D/g, ""),
          ...(profileData.password ? { password: profileData.password } : {})
        })
      });

      if (res.ok) {
        toast.success("Perfil updated com sucesso!");
        setProfileData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        // Idealmente aqui daríamos um refresh na página ou sessão
      } else {
        const data = await res.json();
        toast.error(data.message || "Erro ao atualizar perfil");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setUpdatingProfile(false);
    }
  }

  const tabs = [
    { id: "orders", label: "Meus Pedidos", icon: Package },
    { id: "addresses", label: "Endereços", icon: MapPin },
    { id: "favorites", label: "Favoritos", icon: Heart },
    { id: "loyalty", label: "Fidelidade", icon: Star },
    { id: "profile", label: "Meus Dados", icon: UserCog },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Mobile Nav Toggle */}
      <div className="mb-6 flex items-center justify-between rounded-[32px] border border-brand-100 bg-white p-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
            {initialUser.name?.[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bem-vindo,</p>
            <p className="truncate text-base font-black text-slate-900">{initialUser.name.split(' ')[0]}</p>
          </div>
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-slate-600 transition hover:bg-brand-100 active:scale-95"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md transition-opacity duration-300 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Desktop and Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-[85%] max-w-sm transform bg-white shadow-2xl transition-transform duration-500 ease-out lg:relative lg:inset-0 lg:z-0 lg:w-auto lg:translate-x-0 lg:shadow-none ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col p-8 lg:sticky lg:top-24 lg:h-auto lg:p-0">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Navegação</p>
              <h2 className="text-2xl font-black text-slate-900">Minha Conta</h2>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="rounded-full bg-brand-50 p-2 text-slate-400 transition hover:bg-brand-100">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto lg:overflow-visible">
            {/* Perfil Simplificado */}
            <div className="rounded-[32px] border border-brand-100 bg-white p-6 shadow-sm lg:p-8">
              <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-brand-600 text-2xl font-black text-white shadow-xl shadow-brand-600/30 lg:h-20 lg:w-20">
                  {initialUser.name?.[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black text-slate-900">{initialUser.name}</h2>
                  <p className="truncate text-sm font-medium text-slate-500">{initialUser.email}</p>
                  {initialUser.role === "ADMIN" && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-700 ring-1 ring-brand-100">
                      <Shield size={10} />
                      Administrador
                    </span>
                  )}
                </div>
              </div>

              <nav className="mt-10 flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id
                      ? "bg-brand-900 text-white shadow-xl shadow-brand-900/20"
                      : "text-slate-600 hover:bg-brand-50 hover:pl-6"
                      }`}
                  >
                    <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                    {tab.label}
                  </button>
                ))}
                <div className="my-4 h-px bg-brand-50" />
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider text-rose-500 transition-all hover:bg-rose-50 hover:pl-6"
                >
                  <LogOut size={22} />
                  Sair da Conta
                </button>
              </nav>
            </div>

            {(initialUser.role === "ADMIN" || initialUser.role === "EMPLOYEE") && (
              <Link
                href="/admin"
                className="group flex w-full items-center justify-center gap-3 rounded-[24px] bg-brand-50 p-5 text-xs font-black uppercase tracking-widest text-slate-700 transition hover:bg-brand-100 active:scale-95"
              >
                <Shield size={18} className="transition group-hover:rotate-12" />
                Painel Administrativo
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm md:p-8">
          {activeTab === "orders" && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-slate-600">
                  <Package size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Meus Pedidos</h2>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-brand-50/50" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-slate-200">
                    <Package size={40} />
                  </div>
                  <p className="font-bold text-slate-900">Nenhum pedido encontrado</p>
                  <p className="mt-1 text-sm text-slate-500">Você ainda não realizou compras em nossa loja.</p>
                  <Link href="/catalogo" className="mt-6 rounded-xl bg-brand-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-brand-700 shadow-lg shadow-brand-600/20">
                    Ir para o Catálogo
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <article key={order.id} className="group overflow-hidden rounded-[32px] border border-brand-100 bg-white transition hover:border-brand-300 hover:shadow-xl">
                      {/* Order Header */}
                      <div className="flex flex-col gap-4 border-b border-brand-50 bg-brand-50/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="rounded-xl bg-white px-3 py-1.5 text-xs font-black tracking-wider text-slate-900 shadow-sm ring-1 ring-brand-100">
                            #{order.id.slice(-8).toUpperCase()}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <Clock size={12} />
                            {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <span className={`flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                          order.status === "CANCELED" ? "bg-red-100 text-red-700" :
                            order.status === "PAID" ? "bg-blue-100 text-blue-700" :
                              "bg-amber-100 text-amber-700"
                          }`}>
                          {order.status === "DELIVERED" && <CheckCircle2 size={12} />}
                          {order.status === "CANCELED" && <AlertCircle size={12} />}
                          {(order.status === "PENDING" || order.status === "PROCESSING") && <Clock size={12} />}
                          {translateOrderStatus(order.status)}
                        </span>
                      </div>

                      {/* Order Content */}
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="flex -space-x-3 overflow-hidden">
                              {order.items.slice(0, 3).map(item => (
                                <div key={item.id} className="relative h-14 w-14 shrink-0 rounded-2xl border-4 border-white bg-brand-50 shadow-sm ring-1 ring-brand-100">
                                  <Image src={getImageUrl(item.product.imageUrl)} alt="" fill className="object-cover" />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-brand-50 text-[10px] font-black text-slate-600 shadow-sm ring-1 ring-brand-100">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-black text-slate-900 sm:text-base">
                                {order.items[0].product.name}
                                {order.items.length > 1 && <span className="font-bold text-slate-400"> + {order.items.length - 1} {order.items.length - 1 === 1 ? 'item' : 'itens'}</span>}
                              </p>
                              {order.address && (
                                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                  <MapPin size={13} className="text-brand-600" />
                                  <span className="truncate">{order.address.street}, {order.address.number}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Order Summary/Actions */}
                          <div className="flex items-center justify-between gap-6 border-t border-brand-50 pt-5 lg:border-none lg:pt-0">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Pago</p>
                              <p className="text-xl font-black text-slate-900 sm:text-2xl">{formatCurrency(order.total)}</p>
                            </div>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-2 rounded-2xl bg-brand-50 px-5 py-3 text-xs font-black uppercase tracking-widest text-brand-700 transition hover:bg-brand-600 hover:text-white active:scale-95"
                            >
                              Detalhes
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "addresses" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-slate-600">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Endereços</h2>
                </div>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700 shadow-lg shadow-brand-600/20"
                >
                  {isAddingAddress ? <X size={16} /> : <Plus size={16} />}
                  {isAddingAddress ? "Cancelar" : "Novo Endereço"}
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/30 p-6 animate-in fade-in zoom-in-95">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Apelido (Ex: Casa, Trabalho)</label>
                      <input
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={e => setNewAddress({ ...newAddress, alias: e.target.value })}
                        value={newAddress.alias || ""}
                        placeholder="Ex: Minha Casa"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">CEP</label>
                      <input
                        required
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={async e => {
                          const cep = e.target.value.replace(/\D/g, "");
                          setNewAddress({ ...newAddress, zipCode: e.target.value });
                          if (cep.length === 8) {
                            try {
                              const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                              const data = await res.json();
                              if (!data.erro) {
                                setNewAddress(prev => ({
                                  ...prev,
                                  zipCode: e.target.value,
                                  street: data.logradouro,
                                  district: data.bairro,
                                  city: data.localidade,
                                  state: data.uf
                                }));
                              }
                            } catch (err) {
                              console.error("Erro ao buscar CEP", err);
                            }
                          }
                        }}
                        value={newAddress.zipCode || ""}
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Número</label>
                      <input
                        required
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={e => setNewAddress({ ...newAddress, number: e.target.value })}
                        value={newAddress.number || ""}
                        placeholder="Ex: 1000"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Rua / Logradouro</label>
                      <input
                        required
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                        value={newAddress.street || ""}
                        placeholder="Ex: Av. Paulista"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Bairro</label>
                      <input
                        required
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={e => setNewAddress({ ...newAddress, district: e.target.value })}
                        value={newAddress.district || ""}
                        placeholder="Ex: Centro"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Cidade</label>
                      <input
                        required
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        value={newAddress.city || ""}
                        placeholder="Ex: São Paulo"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Estado (UF)</label>
                      <input
                        required
                        maxLength={2}
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white uppercase placeholder:normal-case"
                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value.toUpperCase() })}
                        value={newAddress.state || ""}
                        placeholder="Ex: SP"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Complemento (Opcional)</label>
                      <input
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={e => setNewAddress({ ...newAddress, complement: e.target.value })}
                        value={newAddress.complement || ""}
                        placeholder="Ex: Apto 42, Bloco B"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Ponto de Referência (Opcional)</label>
                      <input
                        className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 outline-none transition bg-white"
                        onChange={e => setNewAddress({ ...newAddress, reference: e.target.value })}
                        value={newAddress.reference || ""}
                        placeholder="Ex: Próximo à padaria"
                      />
                    </div>
                  </div>
                  <button type="submit" className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-700 shadow-lg shadow-brand-600/20">
                    Salvar Endereço
                  </button>
                </form>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <article key={addr.id} className="group relative overflow-hidden rounded-[32px] border border-brand-100 bg-white p-6 transition hover:border-brand-500 hover:shadow-xl">
                    <div className="flex gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-slate-600 transition duration-300 group-hover:bg-brand-900 group-hover:text-white group-hover:rotate-6">
                        <MapPin size={28} />
                      </div>
                      <div className="min-w-0 flex-1 pr-6">
                        {addr.alias && <p className="mb-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-700">{addr.alias}</p>}
                        <p className="truncate text-lg font-black text-slate-900">{addr.street}, {addr.number}</p>
                        <p className="truncate text-[10px] font-black uppercase tracking-[0.1em] text-brand-600 mb-1">{addr.district}</p>
                        <p className="truncate text-sm font-bold text-slate-500">{addr.city} - {addr.state}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase">CEP: {addr.zipCode}</p>
                        {(addr.complement || addr.reference) && (
                          <div className="mt-3 rounded-xl bg-slate-50 p-2.5">
                            <p className="text-[10px] text-slate-500 italic leading-tight">
                              {addr.complement && <span className="block mb-0.5">Complemento: {addr.complement}</span>}
                              {addr.reference && <span className="block">Referência: {addr.reference}</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-rose-300 transition hover:bg-rose-50 hover:text-rose-600 active:scale-90"
                      title="Excluir Endereço"
                    >
                      <Trash2 size={20} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "favorites" && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-slate-600">
                  <Heart size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Meus Favoritos</h2>
              </div>

              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-slate-200">
                    <Heart size={40} />
                  </div>
                  <p className="font-bold text-slate-900">Sua lista está vazia</p>
                  <p className="mt-1 text-sm text-slate-500">Favorite produtos para encontrá-los facilmente depois.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {favorites.map((fav) => (
                    <article key={fav.id} className="group overflow-hidden rounded-[32px] border border-brand-100 bg-white transition hover:border-brand-300 hover:shadow-xl">
                      <div className="relative aspect-square overflow-hidden bg-brand-50">
                        <Image src={getImageUrl(fav.imageUrl)} alt={fav.name} fill className="object-cover transition duration-500 group-hover:scale-110" />
                        <button
                          onClick={() => handleToggleFavorite(fav.id)}
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-lg backdrop-blur-sm transition hover:bg-rose-500 hover:text-white"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="p-5">
                        <Link href={`/produto/${fav.slug}`} className="line-clamp-1 block text-base font-black text-slate-900 hover:text-brand-600 transition">
                          {fav.name}
                        </Link>
                        <p className="mt-1 text-lg font-black text-brand-600">{formatCurrency(fav.price)}</p>
                        <Link href={`/produto/${fav.slug}`} className="mt-5 block w-full rounded-2xl bg-brand-50 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 transition hover:bg-brand-900 hover:text-white">
                          Detalhes do Produto
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "profile" && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-slate-600">
                  <UserCog size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Meus Dados</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nome Completo</label>
                    <input
                      required
                      value={profileData.name}
                      onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
                    />
                  </div>
                  <div className="space-y-1.5 opacity-60">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">E-mail (Não alterável)</label>
                    <input
                      disabled
                      value={initialUser.email}
                      className="w-full cursor-not-allowed rounded-2xl border border-brand-100 bg-slate-100 px-5 py-3 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">WhatsApp / Telefone</label>
                    <input
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="w-full rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">CPF</label>
                    <input
                      value={profileData.cpf}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        let formatted = val;
                        if (val.length <= 11) {
                          formatted = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                        } else {
                          formatted = val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                        }
                        setProfileData({ ...profileData, cpf: formatted });
                      }}
                      placeholder="000.000.000-00"
                      className="w-full rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/5"
                    />
                  </div>
                </div>

                <div className="rounded-[32px] border border-amber-100 bg-amber-50/20 p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Lock size={16} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-amber-700">Alterar Senha</h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nova Senha</label>
                      <input
                        type="password"
                        placeholder="Deixe em branco para não alterar"
                        value={profileData.password}
                        onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                        className="w-full rounded-2xl border border-brand-100 bg-white px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        placeholder="Repita a nova senha"
                        value={profileData.confirmPassword}
                        onChange={e => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        className="w-full rounded-2xl border border-brand-100 bg-white px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="flex items-center gap-2 rounded-2xl bg-brand-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-950 active:scale-95 disabled:opacity-50"
                  >
                    {updatingProfile ? "Salvando..." : "Salvar Alterações"}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "loyalty" && (
            <LoyaltyInfo />
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-50 bg-brand-50/10 p-6 sm:p-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Detalhes do Pedido</p>
                <h2 className="text-2xl font-black text-slate-900">#{selectedOrder.id.slice(-8).toUpperCase()}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-2xl bg-white p-3 text-slate-400 shadow-sm transition hover:bg-brand-50 hover:text-slate-600 active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
              {/* Status and Info */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status do Pedido</p>
                  <div className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${selectedOrder.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                    selectedOrder.status === "CANCELED" ? "bg-red-100 text-red-700" :
                      selectedOrder.status === "PAID" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                    }`}>
                    {selectedOrder.status === "DELIVERED" && <CheckCircle2 size={14} />}
                    {selectedOrder.status === "CANCELED" && <AlertCircle size={14} />}
                    {(selectedOrder.status === "PENDING" || selectedOrder.status === "PROCESSING") && <Clock size={14} />}
                    {translateOrderStatus(selectedOrder.status)}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Data da Compra</p>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Package size={16} className="text-brand-600" />
                  Itens do Pedido
                </h3>
                <div className="divide-y divide-brand-50 rounded-3xl border border-brand-50 bg-white overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-brand-50 ring-1 ring-brand-100">
                        <Image src={getImageUrl(item.product.imageUrl)} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-900">{item.product.name}</p>
                        <p className="text-xs font-bold text-slate-400">Qtd: {item.quantity} x {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              {selectedOrder.address && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-600" />
                    Endereço de Entrega
                  </h3>
                  <div className="rounded-[24px] bg-brand-50/30 p-5 border border-brand-100">
                    <p className="text-sm font-black text-slate-900">{selectedOrder.address.street}, {selectedOrder.address.number}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">{selectedOrder.address.district} - {selectedOrder.address.city}/{selectedOrder.address.state}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">CEP: {selectedOrder.address.zipCode}</p>
                    {(selectedOrder.address.complement || selectedOrder.address.reference) && (
                      <div className="mt-3 text-[11px] text-slate-500 italic">
                        {selectedOrder.address.complement && <p>Compl: {selectedOrder.address.complement}</p>}
                        {selectedOrder.address.reference && <p>Ref: {selectedOrder.address.reference}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              {selectedOrder.paymentMethod && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <Package size={16} className="text-brand-600" />
                    Detalhes do Pagamento
                  </h3>
                  <div className="rounded-[24px] bg-brand-50/30 p-5 border border-brand-100 space-y-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Método de Pagamento</span>
                      <span className="text-slate-900 uppercase">{selectedOrder.paymentMethod === "PIX" ? "Pix" : "Cartão de Crédito"}</span>
                    </div>

                    {selectedOrder.paymentMethod === "CREDIT_CARD" && selectedOrder.installmentCount && selectedOrder.installmentCount > 1 && (
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Parcelamento</span>
                        <span className="text-slate-900">
                          {selectedOrder.installmentCount}x de {formatCurrency(Number(selectedOrder.installmentValue || 0))}
                        </span>
                      </div>
                    )}

                    {selectedOrder.paymentMethod === "PIX" && selectedOrder.status === "PENDING" && (
                      <div className="mt-4 p-4 border border-brand-100 rounded-2xl bg-white flex flex-col items-center text-center">
                        <p className="text-xs font-black text-amber-600 uppercase mb-2">Aguardando Pagamento do Pix</p>
                        {selectedOrder.pixQrCode && (
                          <div className="relative h-48 w-48 overflow-hidden rounded-xl border border-slate-100 p-1">
                            <img
                              src={`data:image/png;base64,${selectedOrder.pixQrCode}`}
                              alt="Pix QR Code"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        )}
                        {selectedOrder.pixCopyPaste && (
                          <div className="mt-3 w-full flex items-center gap-2 rounded-xl border border-brand-100 bg-slate-50 p-2">
                            <input
                              readOnly
                              value={selectedOrder.pixCopyPaste}
                              className="w-full bg-transparent text-[10px] text-slate-600 outline-none select-all"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedOrder.pixCopyPaste || "");
                                toast.success("Código Pix copiado!");
                              }}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-900 text-white transition hover:bg-brand-950 active:scale-90"
                              title="Copiar Código"
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact and Notes */}
              <div className="grid gap-6 sm:grid-cols-2">
                {selectedOrder.whatsappContact && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Contato Informado</p>
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-brand-600" />
                      {selectedOrder.whatsappContact}
                    </p>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Observações</p>
                    <p className="text-sm font-medium text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Summary */}
            <div className="border-t border-brand-50 bg-slate-900 p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Pago no Pedido</p>
                  <p className="text-3xl font-black">{formatCurrency(selectedOrder.total)}</p>
                </div>
                <div className="hidden sm:block text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Obrigado por comprar<br />na Global Pharma Human!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
