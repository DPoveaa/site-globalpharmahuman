"use client";
import toast from "react-hot-toast";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import {
  Trash2,
  ShoppingBag,
  MapPin,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  User,
  Phone,
  X,
  Tags,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/cart-context";

type CartResponse = {
  items: Array<{
    id: string;
    quantity: number;
    subtotal: number;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
      price: number;
      finalPrice: number;
    };
  }>;
  total: number;
};

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

export default function CarrinhoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [whatsappContact, setWhatsappContact] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout">("cart");

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  const [shippingInfo, setShippingInfo] = useState<{ price: number; rule: string } | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD">("PIX");
  const [cardInfo, setCardInfo] = useState({
    holderName: "",
    number: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: ""
  });
  const [holderInfo, setHolderInfo] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
    postalCode: "",
    addressNumber: "",
    phone: ""
  });
  const [installments, setInstallments] = useState(1);
  const [useShippingAddressForBilling, setUseShippingAddressForBilling] = useState(true);

  // Loyalty states
  const [qualifyingProductIds, setQualifyingProductIds] = useState<string[]>([]);
  const [loyaltyRuleMode, setLoyaltyRuleMode] = useState<string>("INCLUSION");
  const [userCoupons, setUserCoupons] = useState<any[]>([]);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // Copy shipping info to billing if toggled
  useEffect(() => {
    if (useShippingAddressForBilling && selectedAddressId) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (addr) {
        setHolderInfo(prev => ({
          ...prev,
          postalCode: addr.zipCode,
          addressNumber: addr.number
        }));
      }
    }
  }, [selectedAddressId, addresses, useShippingAddressForBilling]);

  // Fetch user loyalty coupons
  useEffect(() => {
    async function fetchUserCoupons() {
      if (!session?.user) {
        setUserCoupons([]);
        return;
      }
      try {
        const res = await fetch("/api/user/loyalty");
        if (res.ok) {
          const data = await res.json();
          if (data?.loyaltyCoupons) {
            setUserCoupons(data.loyaltyCoupons.filter((c: any) => !c.isUsed));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar cupons do usuário:", error);
      }
    }
    fetchUserCoupons();
  }, [session]);

  // Calculate loyalty discount reactively
  useEffect(() => {
    if (cart?.items && appliedCoupon) {
      const qualifyingItems = cart.items.filter(item => {
        const productId = item.product.id;
        if (qualifyingProductIds.length === 0) return true;
        if (loyaltyRuleMode === "INCLUSION") {
          return qualifyingProductIds.includes(productId);
        } else {
          return !qualifyingProductIds.includes(productId);
        }
      });

      if (qualifyingItems.length > 0) {
        const highestItem = qualifyingItems.reduce((max, item) => 
          item.product.finalPrice > max.product.finalPrice ? item : max
        , qualifyingItems[0]);
        setLoyaltyDiscount(Math.round(highestItem.product.finalPrice * 0.5 * 100) / 100);
      } else {
        setLoyaltyDiscount(0);
      }
    } else {
      setLoyaltyDiscount(0);
    }
  }, [appliedCoupon, cart, qualifyingProductIds, loyaltyRuleMode]);

  async function handleApplyCoupon(codeToApply?: string) {
    const targetCode = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!targetCode) {
      toast.error("Por favor, digite o código do cupom.");
      return;
    }

    setCheckingCoupon(true);
    try {
      const res = await fetch(`/api/public/coupon-details/${targetCode}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erro ao validar cupom.");
        setAppliedCoupon(null);
      } else {
        if (data.isUsed) {
          toast.error("Este cupom já foi utilizado.");
          setAppliedCoupon(null);
          return;
        }

        const qualifyingItems = (cart?.items || []).filter(item => {
          const productId = item.product.id;
          if (qualifyingProductIds.length === 0) return true;
          if (loyaltyRuleMode === "INCLUSION") {
            return qualifyingProductIds.includes(productId);
          } else {
            return !qualifyingProductIds.includes(productId);
          }
        });

        if (qualifyingItems.length === 0) {
          toast.error("Este cupom de 50% de desconto só pode ser utilizado em fórmulas participantes no seu carrinho.");
          setAppliedCoupon(null);
          return;
        }

        setAppliedCoupon(data);
        toast.success("Cupom de Fidelidade de 50% aplicado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro de conexão ao validar cupom.");
      setAppliedCoupon(null);
    } finally {
      setCheckingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    toast.success("Cupom removido.");
  }

  const calculateInterest = (amount: number, installmentsCount: number) => {
    if (installmentsCount <= 1) {
      return {
        installmentValue: amount,
        totalValue: amount
      };
    }

    const rate = 0.0299; // 2.99% monthly interest
    const factor = Math.pow(1 + rate, installmentsCount);
    const installmentValue = amount * ((rate * factor) / (factor - 1));
    const totalValue = installmentValue * installmentsCount;

    return {
      installmentValue,
      totalValue
    };
  };

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
        await loadData();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Erro ao salvar endereço");
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const [cartRes, addrRes, productsSettingRes, modeSettingRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/user/addresses"),
        fetch("/api/catalog/settings/LOYALTY_QUALIFYING_PRODUCTS").catch(() => null),
        fetch("/api/catalog/settings/LOYALTY_RULE_MODE").catch(() => null)
      ]);

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCart(cartData);
      }

      if (addrRes.ok) {
        const addrData = await addrRes.json();
        setAddresses(addrData);
        if (addrData.length > 0) setSelectedAddressId(addrData[0].id);
      }

      if (productsSettingRes && productsSettingRes.ok) {
        const setting = await productsSettingRes.json();
        if (setting?.value) setQualifyingProductIds(JSON.parse(setting.value));
      }
      if (modeSettingRes && modeSettingRes.ok) {
        const setting = await modeSettingRes.json();
        if (setting?.value) setLoyaltyRuleMode(setting.value);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId: string) {
    await fetch(`/api/cart/items?productId=${productId}`, { method: "DELETE" });
    await loadData();
    await refreshCart();
  }

  async function checkout() {
    if (!selectedAddressId) {
      toast.error("Por favor, selecione um endereço para entrega.");
      return;
    }

    if (!whatsappContact || whatsappContact.replace(/\D/g, "").length < 10) {
      toast.error("Por favor, informe um número de WhatsApp ou telefone de contato válido.");
      return;
    }

    if (paymentMethod === "CREDIT_CARD") {
      if (!cardInfo.number || cardInfo.number.replace(/\D/g, "").length < 15) {
        toast.error("Por favor, insira um número de cartão de crédito válido.");
        return;
      }
      if (!cardInfo.holderName) {
        toast.error("Por favor, insira o nome do titular do cartão.");
        return;
      }
      if (!cardInfo.expiryMonth || !cardInfo.expiryYear) {
        toast.error("Por favor, insira a data de validade do cartão.");
        return;
      }
      if (!cardInfo.ccv || cardInfo.ccv.replace(/\D/g, "").length < 3) {
        toast.error("Por favor, insira o código de segurança (CVV).");
        return;
      }
      if (!holderInfo.cpfCnpj || holderInfo.cpfCnpj.replace(/\D/g, "").length < 11) {
        toast.error("Por favor, insira o CPF do titular do cartão.");
        return;
      }
      if (!holderInfo.postalCode || holderInfo.postalCode.replace(/\D/g, "").length < 8) {
        toast.error("Por favor, insira o CEP do titular do cartão.");
        return;
      }
      if (!holderInfo.addressNumber) {
        toast.error("Por favor, insira o número do endereço do titular.");
        return;
      }
    }

    localStorage.setItem("gph_whatsapp", whatsappContact);

    setCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          whatsappContact,
          notes,
          paymentMethod,
          installments,
          loyaltyCouponCode: appliedCoupon?.code || undefined,
          creditCard: paymentMethod === "CREDIT_CARD" ? cardInfo : undefined,
          creditCardHolderInfo: paymentMethod === "CREDIT_CARD" ? {
            ...holderInfo,
            name: cardInfo.holderName,
            email: session?.user?.email || `${session?.user?.id || "user"}@globalpharma.com`
          } : undefined
        })
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message ?? "Erro ao finalizar compra.");
      } else {
        toast.success("Pedido criado com sucesso!");
        await refreshCart();
        router.push(`/carrinho/sucesso?orderId=${data.orderId}`);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setCheckingOut(false);
    }
  }

  async function handleTestCheckout() {
    setCheckingOut(true);
    try {
      let addressId = selectedAddressId;
      if (!addressId) {
        // Create a dummy address
        const addrRes = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alias: "Teste Sandbox",
            street: "Avenida Paulista",
            number: "1000",
            district: "Bela Vista",
            city: "São Paulo",
            state: "SP",
            zipCode: "01310-100",
            complement: "Apto 10"
          })
        });
        if (addrRes.ok) {
          // Re-load data to get the address ID
          const res = await fetch("/api/user/addresses");
          if (res.ok) {
            const data = await res.json();
            setAddresses(data);
            if (data.length > 0) {
              addressId = data[0].id;
              setSelectedAddressId(addressId);
            }
          }
        }
      }

      if (!addressId) {
        toast.error("Erro ao resolver endereço de teste.");
        setCheckingOut(false);
        return;
      }

      const testPhone = whatsappContact || "(11) 99999-9999";
      setWhatsappContact(testPhone);

      let testCardInfo = { ...cardInfo };
      let testHolderInfo = { ...holderInfo };

      if (paymentMethod === "CREDIT_CARD") {
        testCardInfo = {
          holderName: cardInfo.holderName || "ADMIN TESTER",
          number: cardInfo.number || "5555 5555 5555 5555",
          expiryMonth: cardInfo.expiryMonth || "12",
          expiryYear: cardInfo.expiryYear || "32",
          ccv: cardInfo.ccv || "123"
        };
        setCardInfo(testCardInfo);

        testHolderInfo = {
          name: cardInfo.holderName || "ADMIN TESTER",
          email: session?.user?.email || "admin@globalpharma.com",
          cpfCnpj: holderInfo.cpfCnpj || "999.911.111-40",
          postalCode: holderInfo.postalCode || "01310-100",
          addressNumber: holderInfo.addressNumber || "1000",
          phone: holderInfo.phone || testPhone
        };
        setHolderInfo(testHolderInfo);
      }

      // Format phone logic in storage
      localStorage.setItem("gph_whatsapp", testPhone);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          whatsappContact: testPhone,
          notes: notes || "Pedido de teste sandbox (Admin)",
          paymentMethod,
          installments,
          loyaltyCouponCode: appliedCoupon?.code || undefined,
          creditCard: paymentMethod === "CREDIT_CARD" ? testCardInfo : undefined,
          creditCardHolderInfo: paymentMethod === "CREDIT_CARD" ? {
            ...testHolderInfo,
            name: testCardInfo.holderName,
            email: session?.user?.email || `admin@globalpharma.com`
          } : undefined,
          isTest: true
        })
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message ?? "Erro ao finalizar compra de teste.");
      } else {
        toast.success("Pedido de teste criado no Sandbox!");
        await refreshCart();
        router.push(`/carrinho/sucesso?orderId=${data.orderId}`);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setCheckingOut(false);
    }
  }

  useEffect(() => {
    const savedPhone = localStorage.getItem("gph_whatsapp");
    const sessionPhone = (session?.user as any)?.phone;

    if (sessionPhone) {
      setWhatsappContact(sessionPhone);
    } else if (savedPhone) {
      setWhatsappContact(savedPhone);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      const userCpf = (session.user as any).cpf;
      if (userCpf) {
        const val = userCpf.replace(/\D/g, "");
        let formattedCpf = val;
        if (val.length <= 11) {
          formattedCpf = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else {
          formattedCpf = val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        }
        setHolderInfo(prev => ({
          ...prev,
          cpfCnpj: prev.cpfCnpj || formattedCpf
        }));
      }
    }
  }, [session]);

  useEffect(() => {
    loadData();
  }, []);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const digits = value.replace(/\D/g, "");

    if (value.length < whatsappContact.length) {
      setWhatsappContact(value);
      return;
    }

    if (digits.length > 11) return;

    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 6) {
      if (digits.length <= 10) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      } else {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      }
    }
    setWhatsappContact(formatted);
  }

  useEffect(() => {
    async function calcShipping() {
      if (!selectedAddressId) {
        setShippingInfo(null);
        return;
      }
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (!addr) return;

      setShippingLoading(true);
      try {
        const res = await fetch(`/api/shipping/calculate?zipCode=${addr.zipCode}`);
        if (res.ok) {
          const data = await res.json();
          setShippingInfo(data);
        }
      } catch (error) {
        console.error("Erro ao calcular frete", error);
      } finally {
        setShippingLoading(false);
      }
    }
    calcShipping();
  }, [selectedAddressId, addresses]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-slate-600" />
        <p className="mt-4 font-bold text-slate-900">Carregando seu carrinho...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="rounded-full bg-brand-50 p-6 text-slate-300">
          <ShoppingBag size={64} />
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">Seu carrinho está vazio</h1>
        <p className="mt-2 text-slate-600">Explore nosso catálogo e encontre os melhores produtos para você.</p>
        <Link
          href="/catalogo"
          className="mt-8 rounded-xl bg-brand-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-brand-700 active:scale-95"
        >
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Finalização</p>
        <h1 className="text-4xl font-black text-slate-900 md:text-5xl">Meu Carrinho</h1>
      </div>

      {/* Stepper */}
      <div className="mb-10 flex items-center justify-center gap-4 border-b border-brand-50 pb-6">
        <button
          onClick={() => setStep("cart")}
          className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider transition ${step === "cart" ? "text-brand-900" : "text-slate-400 hover:text-slate-600"}`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-black transition ${step === "cart" ? "border-brand-900 bg-brand-900 text-white" : "border-slate-300 text-slate-500"}`}>1</span>
          Carrinho
        </button>
        <div className="h-0.5 w-12 bg-slate-200" />
        <button
          disabled={!cart || cart.items.length === 0}
          onClick={() => setStep("checkout")}
          className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider transition ${step === "checkout" ? "text-brand-900" : "text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"}`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-black transition ${step === "checkout" ? "border-brand-900 bg-brand-900 text-white" : "border-slate-300 text-slate-500"}`}>2</span>
          Entrega & Pagamento
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
        {/* Itens e Endereço */}
        <div className="space-y-8 lg:space-y-10">
          {step === "cart" ? (
            /* Lista de Itens */
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <ShoppingBag size={22} className="text-slate-600" />
                Itens no Carrinho
              </h2>
              <div className="grid gap-3">
                {cart.items.map((item) => (
                  <article
                    key={item.id}
                    className="group relative flex items-center gap-3 rounded-[24px] border border-brand-100 bg-white p-3 transition hover:border-brand-200 hover:shadow-md md:gap-4 md:rounded-[32px] md:p-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-50 md:h-20 md:w-20">
                      <Image
                        src={getImageUrl(item.product.imageUrl)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized={getImageUrl(item.product.imageUrl).includes("devtunnels.ms")}
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-0.5 md:flex-row md:items-center min-w-0">
                      <div className="flex-1 pr-2 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 md:text-base">{item.product.name}</h3>
                        <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase">Qtd: {item.quantity}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between md:mt-0 md:gap-4">
                        <div className="flex flex-col items-start md:items-end">
                          {item.product.price > item.product.finalPrice && (
                            <div className="flex items-center gap-1.5">
                              <span className="rounded bg-green-100 px-1 py-0.5 text-[9px] font-black text-green-700">
                                -{Math.round(((item.product.price - item.product.finalPrice) / item.product.price) * 100)}%
                              </span>
                              <span className="text-[11px] font-bold text-slate-300 line-through">
                                {formatCurrency(item.product.price * item.quantity)}
                              </span>
                            </div>
                          )}
                          <p className="text-base font-black text-slate-600 md:text-lg">{formatCurrency(item.subtotal)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-400 transition hover:bg-red-500 hover:text-white md:opacity-0 md:group-hover:opacity-100"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <>
              {/* Seleção de Endereço */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <MapPin size={22} className="text-slate-600" />
                    Entrega
                  </h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700 shadow-lg shadow-brand-600/20"
                  >
                    {isAddingAddress ? <X size={16} /> : <Plus size={16} />}
                    {isAddingAddress ? "Cancelar" : "Novo Endereço"}
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="rounded-[24px] border-2 border-dashed border-brand-200 bg-brand-50/30 p-6 animate-in fade-in zoom-in-95 md:rounded-[32px]">
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

                {!isAddingAddress && addresses.length === 0 ? (
                  <div className="rounded-[24px] border-2 border-dashed border-brand-100 p-6 text-center md:rounded-[32px] md:p-8">
                    <p className="text-xs font-medium text-slate-600 md:text-sm">Você ainda não tem endereços salvos.</p>
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-50 px-5 py-2 text-xs font-bold text-slate-600 transition hover:bg-brand-100"
                    >
                      <Plus size={16} />
                      Cadastrar Endereço
                    </button>
                  </div>
                ) : !isAddingAddress && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`relative flex cursor-pointer flex-col rounded-[24px] border-2 p-4 transition md:rounded-[32px] md:p-5 ${selectedAddressId === addr.id
                          ? "border-brand-600 bg-brand-50/30"
                          : "border-brand-100 bg-white hover:border-brand-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="hidden"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {addr.alias && <p className="mb-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-brand-700">{addr.alias}</p>}
                            <p className="text-sm font-black text-slate-900 md:text-base break-words flex-1">{addr.street}, {addr.number}</p>
                          </div>
                          {selectedAddressId === addr.id && <CheckCircle2 className="shrink-0 text-slate-600 mt-1" size={18} />}
                        </div>
                        <p className="mt-1 text-[10px] font-bold text-slate-500 uppercase">
                          {addr.district} - {addr.city}/{addr.state}
                        </p>
                        {(addr.complement || addr.reference) && (
                          <p className="mt-1 text-[10px] text-slate-400 italic">
                            {addr.complement && `Compl: ${addr.complement}`}
                            {addr.complement && addr.reference && " | "}
                            {addr.reference && `Ref: ${addr.reference}`}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400">CEP: {addr.zipCode}</p>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              {/* Contato e Notas */}
              <section className="grid gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <Phone size={12} />
                    WhatsApp ou telefone de contato
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={whatsappContact}
                    onChange={handlePhoneChange}
                    className="w-full rounded-2xl border border-brand-100 bg-white px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <AlertCircle size={12} />
                    Observações
                  </label>
                  <input
                    placeholder="Ex: Deixar na portaria..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full rounded-2xl border border-brand-100 bg-white px-5 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5"
                  />
                </div>
              </section>

              {/* Forma de Pagamento */}
              <section className="space-y-6 rounded-[24px] border border-brand-100 bg-white p-6 shadow-sm md:rounded-[32px] md:p-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <ShoppingBag size={22} className="text-slate-600" />
                  Forma de Pagamento
                </h2>

                {/* Método selector */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label
                    className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition ${paymentMethod === "PIX"
                      ? "border-brand-600 bg-brand-50/20"
                      : "border-brand-100 bg-white hover:border-brand-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PIX"
                      className="hidden"
                      checked={paymentMethod === "PIX"}
                      onChange={() => setPaymentMethod("PIX")}
                    />
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${paymentMethod === "PIX" ? "bg-brand-900 text-white" : "bg-brand-50 text-slate-500"}`}>
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Pix</p>
                      <p className="text-xs text-slate-500">QR Code e Pix Copia e Cola. Desconto imediato.</p>
                    </div>
                  </label>

                  <label
                    className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition ${paymentMethod === "CREDIT_CARD"
                      ? "border-brand-600 bg-brand-50/20"
                      : "border-brand-100 bg-white hover:border-brand-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CREDIT_CARD"
                      className="hidden"
                      checked={paymentMethod === "CREDIT_CARD"}
                      onChange={() => setPaymentMethod("CREDIT_CARD")}
                    />
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${paymentMethod === "CREDIT_CARD" ? "bg-brand-900 text-white" : "bg-brand-50 text-slate-500"}`}>
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Cartão de Crédito</p>
                      <p className="text-xs text-slate-500">Até 12x com juros. Aprovação instantânea.</p>
                    </div>
                  </label>
                </div>

                {/* Cartão de Crédito Form */}
                {paymentMethod === "CREDIT_CARD" && (
                  <div className="mt-6 space-y-5 rounded-2xl border border-brand-50 bg-slate-50/30 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Dados do Cartão</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Número do Cartão</label>
                        <input
                          required
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={cardInfo.number}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                            setCardInfo({ ...cardInfo, number: formatted });
                          }}
                          className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nome no Cartão (igual impresso)</label>
                        <input
                          required
                          placeholder="NOME DO TITULAR"
                          value={cardInfo.holderName}
                          onChange={e => setCardInfo({ ...cardInfo, holderName: e.target.value.toUpperCase() })}
                          className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 uppercase"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Validade</label>
                        <input
                          required
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardInfo.expiryMonth ? (cardInfo.expiryYear ? `${cardInfo.expiryMonth}/${cardInfo.expiryYear}` : cardInfo.expiryMonth) : ""}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            let m = val.slice(0, 2);
                            let y = val.slice(2, 4);
                            if (m.length === 2 && Number(m) > 12) m = "12";
                            setCardInfo({ ...cardInfo, expiryMonth: m, expiryYear: y });
                          }}
                          className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">CVV</label>
                        <input
                          required
                          placeholder="123"
                          maxLength={4}
                          value={cardInfo.ccv}
                          onChange={e => setCardInfo({ ...cardInfo, ccv: e.target.value.replace(/\D/g, "") })}
                          className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                        />
                      </div>

                      {/* Parcelamento */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Opções de Parcelamento</label>
                        <select
                          value={installments}
                          onChange={e => setInstallments(Number(e.target.value))}
                          className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                        >
                          <option value={1}>1x de {formatCurrency(cart.total + (shippingInfo?.price || 0) - loyaltyDiscount)} (Sem juros)</option>
                          {Array.from({ length: 11 }, (_, i) => i + 2).map(n => {
                            const { installmentValue, totalValue } = calculateInterest(cart.total + (shippingInfo?.price || 0) - loyaltyDiscount, n);
                            return (
                              <option key={n} value={n}>
                                {n}x de {formatCurrency(installmentValue)} (Total: {formatCurrency(totalValue)})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="my-4 h-px bg-slate-200" />

                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Titular do Cartão</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">CPF/CNPJ do Titular</label>
                        <input
                          required
                          placeholder="000.000.000-00"
                          value={holderInfo.cpfCnpj}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            let formatted = val;
                            if (val.length <= 11) {
                              formatted = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                            } else {
                              formatted = val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                            }
                            setHolderInfo({ ...holderInfo, cpfCnpj: formatted });
                          }}
                          className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id="useShippingAddress"
                          checked={useShippingAddressForBilling}
                          onChange={e => setUseShippingAddressForBilling(e.target.checked)}
                          className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                        />
                        <label htmlFor="useShippingAddress" className="text-xs text-slate-600 font-bold select-none cursor-pointer">
                          Usar mesmo endereço de entrega para cobrança
                        </label>
                      </div>

                      {!useShippingAddressForBilling && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">CEP do Titular</label>
                            <input
                              required
                              placeholder="00000-000"
                              value={holderInfo.postalCode}
                              onChange={e => {
                                const val = e.target.value.replace(/\D/g, "");
                                const formatted = val.replace(/(\d{5})(\d{3})/, "$1-$2");
                                setHolderInfo({ ...holderInfo, postalCode: formatted });
                              }}
                              className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Número da Residência</label>
                            <input
                              required
                              placeholder="Ex: 100"
                              value={holderInfo.addressNumber}
                              onChange={e => setHolderInfo({ ...holderInfo, addressNumber: e.target.value })}
                              className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Resumo e Checkout */}
        <aside className="min-w-0">
          <div className="sticky top-32 space-y-4 rounded-[32px] border border-brand-100 bg-white p-4 shadow-xl shadow-brand-900/5 md:rounded-[40px] md:p-8">
            <h2 className="text-xl font-black text-slate-900">Resumo</h2>

            {/* Campo Cupom de Fidelidade */}
            {session && (
              <div className="border-b border-brand-50 pb-4 space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tags size={12} className="text-amber-500" />
                  Cupom de Fidelidade (50% OFF)
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-emerald-800 tracking-wider">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5">
                        Fidelidade Ativada
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1.5 hover:bg-emerald-100 text-emerald-500 rounded-lg transition active:scale-95 cursor-pointer"
                      title="Remover cupom"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: SELO-XXXXXX"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 rounded-xl border border-brand-100 bg-white px-3 py-2 text-xs uppercase tracking-wider focus:border-brand-600 outline-none transition"
                      />
                      <button
                        type="button"
                        disabled={checkingCoupon || !couponCodeInput.trim()}
                        onClick={() => handleApplyCoupon()}
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer shrink-0"
                      >
                        {checkingCoupon ? "..." : "Aplicar"}
                      </button>
                    </div>

                    {/* Atalhos rápidos para os cupons do usuário */}
                    {userCoupons.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Seus vales de 50% disponíveis:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {userCoupons.map((c: any) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setCouponCodeInput(c.code);
                                handleApplyCoupon(c.code);
                              }}
                              className="text-[10px] font-black uppercase tracking-wider bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full transition active:scale-95 cursor-pointer"
                            >
                              {c.code}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 py-4">
              <div className="space-y-3 border-b border-brand-50 pb-4">
                {cart.items.map(item => (
                  <div key={item.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-600">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate" title={item.product.name}>{item.product.name}</span>
                        <span className="shrink-0 font-bold text-slate-400">x{item.quantity}</span>
                      </div>
                      <div className="flex shrink-0 flex-col items-end">
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0))}</span>
                </div>

                {cart.items.some(i => i.product.price > i.product.finalPrice) && (
                  <div className="flex justify-between items-center text-sm font-medium text-green-600">
                    <span>Descontos</span>
                    <span>-{formatCurrency(cart.items.reduce((acc, item) => acc + ((item.product.price - item.product.finalPrice) * item.quantity), 0))}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Frete</span>
                  {!selectedAddressId ? (
                    <span className="text-slate-400 text-xs">Selecione o endereço</span>
                  ) : shippingLoading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : shippingInfo?.price === 0 ? (
                    <span className={shippingInfo.rule.toLowerCase().includes("combinar") ? "text-slate-900" : "text-green-600"}>
                      {shippingInfo.rule.toLowerCase().includes("combinar") ? "A Combinar" : "Grátis"}
                    </span>
                  ) : (
                    <span className="text-slate-900">{formatCurrency(shippingInfo?.price || 0)}</span>
                  )}
                </div>
              </div>

              <div className="my-4 h-px bg-brand-50" />

              <div className="flex flex-col gap-1">
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50">
                    <span className="flex items-center gap-1.5">
                      <Tags size={14} className="text-amber-500" />
                      Desconto Fidelidade (50%)
                    </span>
                    <span className="font-extrabold">-{formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-black text-slate-900 md:text-2xl">
                  <span>Total</span>
                  <span className="text-slate-600">
                    {formatCurrency(
                      paymentMethod === "CREDIT_CARD"
                        ? calculateInterest(cart.total + (shippingInfo?.price || 0) - loyaltyDiscount, installments).totalValue
                        : cart.total + (shippingInfo?.price || 0) - loyaltyDiscount
                    )}
                  </span>
                </div>
                {paymentMethod === "CREDIT_CARD" && installments > 1 && (
                  <p className="text-right text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    Parcelado em {installments}x de {formatCurrency(calculateInterest(cart.total + (shippingInfo?.price || 0) - loyaltyDiscount, installments).installmentValue)} (com juros de 2.99% a.m.)
                  </p>
                )}
              </div>
            </div>

            {step === "cart" ? (
              <button
                onClick={() => setStep("checkout")}
                disabled={!session || !cart || cart.items.length === 0}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-900 py-4 font-black text-white transition hover:bg-brand-950 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!session ? (
                  "Faça Login para Comprar"
                ) : (
                  <>
                    <span className="text-center">Avançar</span>
                    <ChevronRight size={20} className="shrink-0 transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={checkout}
                disabled={checkingOut || !session || !selectedAddressId || !whatsappContact || whatsappContact.replace(/\D/g, "").length < 10}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-900 py-4 font-black text-white transition hover:bg-brand-950 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkingOut ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : !session ? (
                  "Faça Login para Comprar"
                ) : (
                  <>
                    {!selectedAddressId || !whatsappContact ? (
                      <span className="text-center text-xs px-2">Preencha os campos obrigatórios</span>
                    ) : (
                      <>
                        <span className="text-center">Finalizar Pedido</span>
                        <ChevronRight size={20} className="shrink-0 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </>
                )}
              </button>
            )}

            {step === "checkout" && session?.user?.role === "ADMIN" && (
              <button
                type="button"
                onClick={handleTestCheckout}
                disabled={checkingOut}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-600 bg-amber-50/50 py-4 font-black text-sm uppercase tracking-wider text-amber-800 transition hover:bg-amber-100 disabled:opacity-50 active:scale-95 shadow-md shadow-amber-600/5"
              >
                {checkingOut ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Pagar Teste (Sandbox)</span>
                  </>
                )}
              </button>
            )}

            {step === "checkout" && (!selectedAddressId || !whatsappContact) && session && (
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-amber-600">
                <AlertCircle size={14} />
                Endereço e Contato são obrigatórios
              </p>
            )}

          </div>
        </aside>
      </div>
    </div>
  );
}

