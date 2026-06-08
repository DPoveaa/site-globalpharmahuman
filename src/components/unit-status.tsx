"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Props = {
  openTime: string | null;
  closeTime: string | null;
};

export function UnitStatus({ openTime, closeTime }: Props) {
  const [status, setStatus] = useState<{ text: string; color: string; dot: string } | null>(null);

  useEffect(() => {
    if (!openTime || !closeTime) return;

    const checkStatus = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [openH, openM] = openTime.split(':').map(Number);
      const openTotal = openH * 60 + openM;

      const [closeH, closeM] = closeTime.split(':').map(Number);
      let closeTotal = closeH * 60 + closeM;
      if (closeTotal < openTotal) closeTotal += 24 * 60; // Handles midnight crossing like 08:00 to 02:00

      let currentAdj = currentMinutes;
      if (currentMinutes < openTotal && closeTotal > 24 * 60) {
          currentAdj += 24 * 60;
      }

      if (currentAdj >= openTotal && currentAdj < closeTotal) {
        if (closeTotal - currentAdj <= 60) {
          setStatus({ text: "Fecha em breve", color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-500" });
        } else {
          setStatus({ text: "Aberto agora", color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" });
        }
      } else {
        if (openTotal > currentMinutes && openTotal - currentMinutes <= 60) {
          setStatus({ text: "Abre em breve", color: "text-blue-600 bg-blue-50 border-blue-200", dot: "bg-blue-500" });
        } else {
          setStatus({ text: "Fechado", color: "text-rose-600 bg-rose-50 border-rose-200", dot: "bg-rose-500" });
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [openTime, closeTime]);

  if (!status) {
    return (
      <div className="w-fit flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Clock size={12} />
        {openTime} às {closeTime}
      </div>
    );
  }

  return (
    <div className={`w-fit flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border ${status.color} text-[10px] font-black uppercase tracking-wider shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status.dot}`} />
      {status.text}
    </div>
  );
}
