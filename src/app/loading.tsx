import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-10 animate-spin text-brand-600" />
        <p className="text-sm font-medium text-slate-600 animate-pulse">Carregando...</p>
      </div>
    </div>
  );
}
