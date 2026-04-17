import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getWhatsappLink } from "@/lib/utils";

type Props = {
  number: string;
  message?: string;
};

export function WhatsAppButton({ 
  number,
  message = "Olá! Vim pelo site da Global Pharma Human e quero atendimento para comprar com segurança."
}: Props) {
  return (
    <Link
      href={getWhatsappLink(number, message)}
      target="_blank"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all hover:scale-110 hover:bg-[#20ba5a] active:scale-95"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={32} fill="white" className="relative z-10" />
    </Link>
  );
}
