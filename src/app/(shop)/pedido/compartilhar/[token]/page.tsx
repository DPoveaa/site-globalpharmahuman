"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import {
  Package,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Truck,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl, translateOrderStatus } from "@/lib/utils";

type Address = {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  reference?: string;
};

type UserDetails = {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
};

type ProductDetails = {
  name: string;
  imageUrl: string | null;
};

type OrderItem = {
  id: string;
  quantity: number;
  product: ProductDetails;
};

type OrderDetail = {
  id: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  shareTokenExpires: string;
  notes?: string;
  user: UserDetails;
  address: Address | null;
  items: OrderItem[];
};

function SharedOrderContent() {
  const params = useParams();
  const token = params.token as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function fetchSharedOrder() {
      try {
        const res = await fetch(`/api/public/orders/share/${token}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          setErrorStatus(res.status);
          const data = await res.json();
          setErrorMessage(data.message || "Erro ao carregar o pedido.");
        }
      } catch (error) {
        console.error("Error fetching shared order:", error);
        setErrorMessage("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchSharedOrder();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
        <p className="mt-4 font-bold text-slate-700">Carregando detalhes do pedido para entrega...</p>
      </div>
    );
  }

  if (errorStatus === 410) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-xl shadow-red-100 mb-6">
          <AlertTriangle size={44} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Link Expirado</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          {errorMessage || "Este link de visualização expirou. Por motivos de segurança, os links de compartilhamento de pedido expiram em até 2 dias úteis."}
        </p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-900 px-6 py-3 font-bold text-white shadow-lg hover:bg-brand-950 transition active:scale-95">
          <ArrowLeft size={16} />
          Ir para a Home
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-xl shadow-amber-100 mb-6">
          <AlertTriangle size={44} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Pedido não encontrado</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Não conseguimos localizar o pedido associado a este link ou ele é inválido.
        </p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-900 px-6 py-3 font-bold text-white shadow-lg hover:bg-brand-950 transition active:scale-95">
          <ArrowLeft size={16} />
          Ir para a Home
        </Link>
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const maskCpf = (cpfStr?: string) => {
    if (!cpfStr) return "Não cadastrado";
    const cleaned = cpfStr.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
    }
    return cpfStr;
  };

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === "DELIVERED") return "bg-green-100 text-green-700 border-green-200";
    if (s === "CANCELED") return "bg-red-100 text-red-700 border-red-200";
    if (s === "PAID" || s === "PROCESSING" || s === "SHIPPED") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Banner Alert (Confidentiality) */}
      <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start shadow-sm text-left">
        <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h2 className="text-sm font-black text-amber-900 uppercase tracking-wider">Modo de Visualização Logística</h2>
          <p className="text-xs text-amber-800 mt-1 font-medium leading-relaxed">
            Esta página é destinada para a verificação de entrega e comprovação de identidade do cliente pela loja. Os valores financeiros do pedido foram ocultados para garantir a privacidade.
          </p>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="overflow-hidden rounded-[32px] border border-brand-100 bg-white shadow-xl mb-8">
        <div className="border-b border-brand-50 bg-brand-50/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Código do Pedido</span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {translateOrderStatus(order.status)}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-1">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
          </div>
          <div className="flex flex-col sm:items-end text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              Criado em: {formatDateTime(order.createdAt)}
            </span>
            <span className="flex items-center gap-1.5 mt-1">
              <Clock size={13} className="text-slate-400" />
              Última atualização: {formatDateTime(order.updatedAt)}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
          {/* Customer / Recipient Data */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="text-brand-600" size={20} />
              <h2 className="text-lg font-black text-slate-900">Dados do Cliente</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Nome Completo</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{order.user.name}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">CPF (Identidade)</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{maskCpf(order.user.cpf)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">WhatsApp / Telefone</p>
                  <a href={`tel:${order.user.phone}`} className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition mt-0.5">
                    <Phone size={13} />
                    {order.user.phone || "Não informado"}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">E-mail</p>
                  <a href={`mailto:${order.user.email}`} className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition mt-0.5 truncate block">
                    <Mail size={13} className="shrink-0" />
                    <span className="truncate">{order.user.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="text-brand-600" size={20} />
              <h2 className="text-lg font-black text-slate-900">Endereço de Entrega</h2>
            </div>

            {order.address ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Logradouro / Rua e Número</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">
                    {order.address.street}, {order.address.number}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bairro</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{order.address.district}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">CEP</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{order.address.zipCode}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Cidade - Estado</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {order.address.city} - {order.address.state}
                  </p>
                </div>

                {order.address.complement && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Complemento</p>
                    <p className="text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg p-2 mt-0.5">
                      {order.address.complement}
                    </p>
                  </div>
                )}

                {order.address.reference && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ponto de Referência</p>
                    <p className="text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg p-2 mt-0.5">
                      {order.address.reference}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-500 italic py-4">Endereço de entrega não selecionado.</p>
            )}
          </section>
        </div>
      </div>

      {/* Items Section */}
      <div className="rounded-[32px] border border-brand-100 bg-white p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
          <Package className="text-brand-600" size={20} />
          <h2 className="text-lg font-black text-slate-900">Produtos no Pedido</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 shadow-sm">
                <Image
                  src={getImageUrl(item.product.imageUrl)}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 truncate text-sm sm:text-base">
                  {item.product.name}
                </h3>
                <p className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wider">
                  Quantidade: {item.quantity} {item.quantity === 1 ? "unidade" : "unidades"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logistics & Payment Method Notes */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50 mb-3">
            <Truck className="text-brand-600" size={18} />
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Informações Logísticas</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold">Método de Envio:</span>
              <span className="font-bold text-slate-800">Entrega Local / GlobalPharma</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Forma de Pagamento:</span>
              <span className="font-bold text-slate-800">
                {order.paymentMethod === "CREDIT_CARD" ? "Cartão de Crédito" : "Pix"}
              </span>
            </div>
            {order.notes && (
              <div className="pt-2 border-t border-slate-50">
                <p className="font-semibold mb-1">Notas do Pedido:</p>
                <p className="font-medium text-slate-700 italic bg-slate-50 p-2 rounded-lg">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Token Expiration Warning */}
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50 mb-3">
              <Clock className="text-brand-600" size={18} />
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Validade da Consulta</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Por motivos de privacidade e segurança, este link é temporário. Ele deixará de funcionar na data indicada abaixo.
            </p>
          </div>
          <div className="mt-4 rounded-2xl bg-amber-50/50 border border-amber-100 p-3 text-center">
            <span className="block text-[10px] font-black text-amber-700 uppercase tracking-widest">Este link expira em:</span>
            <span className="block text-sm font-black text-amber-900 mt-1">{formatDateTime(order.shareTokenExpires)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SharedOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
          <p className="mt-4 font-bold text-slate-700">Carregando...</p>
        </div>
      }
    >
      <SharedOrderContent />
    </Suspense>
  );
}
