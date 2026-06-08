import clsx, { ClassValue } from "clsx";

type PromotionLike = {
  active: boolean;
  type: "PERCENT" | "FIXED";
  value: number;
  startsAt: Date;
  endsAt: Date;
};

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function promotionIsActive(promotion?: PromotionLike | null) {
  if (!promotion?.active) return false;
  const now = new Date();
  return now >= promotion.startsAt && now <= promotion.endsAt;
}

export function calculatePriceWithPromotion(
  basePrice: number,
  promotion?: PromotionLike | null
) {
  if (!promotionIsActive(promotion)) return basePrice;

  if (promotion?.type === "PERCENT") {
    const discounted = basePrice - basePrice * (promotion.value / 100);
    return Math.max(discounted, 0);
  }

  const discounted = basePrice - promotion!.value;
  return Math.max(discounted, 0);
}

export function getWhatsappLink(number: string, message: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function whatsappLink(message: string, number?: string) {
  const fallback = process.env.WHATSAPP_NUMBER ?? "5511999999999";
  return getWhatsappLink(number ?? fallback, message);
}

export function getImageUrl(path: string | null) {
  if (!path) return "/gph_logo.png";
  const cleanPath = path.replace(/\\$/, ""); // Remove trailing backslashes
  if (cleanPath.startsWith("http")) return cleanPath;
  if (cleanPath.startsWith("/uploads")) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    // Remove /api or /backend-api from end of URL if present to get base backend URL
    const baseUrl = apiUrl.replace(/\/api$/, "").replace(/\/backend-api$/, "");
    return `${baseUrl}${cleanPath}`;
  }
  return cleanPath;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function translateOrderStatus(status: string) {
  const map: Record<string, string> = {
    PENDING: "Pendente",
    PROCESSING: "Em Produção",
    PAID: "Pago",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELED: "Cancelado",
    REFUNDED: "Reembolsado"
  };
  return map[status.toUpperCase()] || status;
}

export function playNotificationSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 (pleasant alert tone)
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    
    oscillator.start();
    
    // Play a nice two-tone alert
    oscillator.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
    oscillator.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    console.error("Failed to play notification sound:", e);
  }
}
