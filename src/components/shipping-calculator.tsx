"use client";

import { useState, useEffect, useRef } from "react";
import { Truck, Search, Loader2, MapPin, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "next-auth/react";

type Address = {
  id: string;
  alias?: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
};

type Result = {
  price: number;
  rule: string;
  calculatedZip: string;
};

export function ShippingCalculator() {
  const { data: session } = useSession();
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("OTHER");
  
  const hasFetchedAddresses = useRef(false);

  useEffect(() => {
    if (session?.user && !hasFetchedAddresses.current) {
      hasFetchedAddresses.current = true;
      fetch("/api/user/addresses")
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Address[]) => {
          if (data && data.length > 0) {
            setAddresses(data);
            setSelectedAddressId(data[0].id);
            setZipCode(data[0].zipCode);
            calculateZip(data[0].zipCode);
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const calculateZip = async (zip: string) => {
    const cleanZip = zip.replace(/\D/g, "");
    if (cleanZip.length !== 8) {
      setError("CEP inválido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/shipping/calculate?zipCode=${cleanZip}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao calcular frete");
        setResult(null);
      } else {
        setResult({ ...data, calculatedZip: zip });
      }
    } catch (err) {
      setError("Erro de conexão");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => calculateZip(zipCode);

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAddressId(val);
    
    if (val !== "OTHER") {
      const addr = addresses.find(a => a.id === val);
      if (addr) {
        setZipCode(addr.zipCode);
        calculateZip(addr.zipCode);
      }
    } else {
      setZipCode("");
      // Mantemos o result anterior até que uma nova busca ocorra, 
      // conforme solicitado pelo usuário.
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Truck className="w-5 h-5 text-brand-600" />
          <span>Opções de Entrega</span>
        </div>
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
        )}
      </div>

      {addresses.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Enviar para
          </label>
          <div className="relative">
            <select
              value={selectedAddressId}
              onChange={handleAddressChange}
              disabled={loading}
              className="w-full appearance-none pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-700 font-medium cursor-pointer disabled:opacity-70 disabled:cursor-wait"
            >
              {addresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.alias ? `${addr.alias} - ` : ""}{addr.street}, {addr.number} - {addr.city}/{addr.state}
                </option>
              ))}
              <option value="OTHER">Outro CEP...</option>
            </select>
            <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      )}

      {(selectedAddressId === "OTHER" || addresses.length === 0) && (
        <div className="flex flex-col gap-1.5">
          {addresses.length === 0 && (
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Calcular Frete
            </label>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite seu CEP"
              value={zipCode}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 5) {
                  val = val.substring(0, 5) + "-" + val.substring(5, 8);
                }
                setZipCode(val);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-700 font-medium placeholder:font-normal"
              maxLength={9}
            />
            <button
              onClick={handleCalculate}
              disabled={loading || zipCode.replace(/\D/g, "").length !== 8}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Calcular
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5 mt-2 font-medium bg-red-50 p-2 rounded-lg">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {(result || loading) && !error && (
        <div className={`mt-4 p-4 rounded-xl flex items-center justify-between border transition-all duration-300 ${
          loading 
            ? "bg-slate-50 border-slate-100 opacity-70" 
            : "bg-emerald-50 border-emerald-100 animate-in fade-in slide-in-from-top-2"
        }`}>
          <div className="flex flex-col">
            <span className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${
              loading ? "text-slate-400" : "text-emerald-700"
            }`}>
              {loading ? "Calculando..." : "Valor do Frete"}
            </span>
            <div className="flex items-center gap-1.5">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
              <span className={`text-sm font-medium ${
                loading ? "text-slate-500" : "text-emerald-800"
              }`}>
                CEP {loading ? (zipCode || "...") : result?.calculatedZip}
              </span>
            </div>
          </div>
          {!loading && result && (
            <span className="text-xl font-black text-emerald-600">
              {result.price === 0 ? "Grátis" : formatCurrency(result.price)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
