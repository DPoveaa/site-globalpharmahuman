import { MapPin, Phone, MapPinned, ChevronRight, Store } from "lucide-react";
import Link from "next/link";
import { UnitStatus } from "./unit-status";

type Unit = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  mapsUrl: string;
  imageUrl: string | null;
  openTime: string | null;
  closeTime: string | null;
  active: boolean;
};

async function getUnits() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  try {
    const res = await fetch(`${apiUrl}/units`, { next: { revalidate: 300, tags: ["units"] } });
    if (!res.ok) return [];
    return await res.json() as Unit[];
  } catch {
    return [];
  }
}

export async function PharmacyUnits() {
  const units = await getUnits();

  if (!units || units.length === 0) return null;

  return (
    <section className="py-12 bg-slate-50 border-t border-slate-100">
      <div className="container px-4 md:px-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 flex items-center justify-center md:justify-start gap-2">
              <Store className="text-brand-600" size={24} /> Nossas Unidades
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Prefere atendimento presencial? Visite uma de nossas farmácias.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {units.map((unit) => {
            const cleanPhone = unit.phone ? unit.phone.replace(/\D/g, "") : null;
            const wppLink = cleanPhone ? `https://wa.me/55${cleanPhone}` : null;

            return (
              <div
                key={unit.id}
                className="group flex flex-col p-5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-brand-200 h-full"
              >
                {/* Header do Card (Foto + Título + Status) */}
                <div className="flex items-start gap-3 mb-4">
                  <a
                    href={unit.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 group/img"
                  >
                    {unit.imageUrl ? (
                      <img
                        src={process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") + unit.imageUrl}
                        alt={`Fachada ${unit.name}`}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <MapPin size={20} className="text-slate-300" />
                    )}
                    {/* Overlay de hover na imagem */}
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <MapPinned size={20} className="text-white animate-in zoom-in-50 duration-300" />
                    </div>
                  </a>

                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {unit.name}
                    </h3>
                    {(unit.openTime && unit.closeTime) && (
                      <div className="flex flex-col gap-1">
                        <UnitStatus openTime={unit.openTime} closeTime={unit.closeTime} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {unit.openTime} às {unit.closeTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <p className="text-slate-500 text-[11px] leading-relaxed mb-4 flex-grow line-clamp-2">
                  {unit.address || "Endereço não informado"}
                </p>

                {/* Botões */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
                  {wppLink && (
                    <a
                      href={wppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chamar no WhatsApp"
                      className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-600 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider"
                    >
                      <Phone size={14} /> WhatsApp
                    </a>
                  )}
                  <a
                    href={unit.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver no Mapa"
                    className={`${wppLink ? 'w-10 px-0' : 'flex-1 px-4'} flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-slate-900 hover:text-white transition-colors`}
                  >
                    <MapPinned size={14} /> {!wppLink && "Ver no Mapa"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
