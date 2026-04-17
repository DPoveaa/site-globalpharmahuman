import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Marketplace`,
  description: SITE_DESCRIPTION
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  let whatsappNumber = process.env.WHATSAPP_NUMBER || "5511999999999";

  try {
    const res = await fetch(`${apiUrl}/catalog/settings/whatsapp_number`, { cache: "no-store" });
    if (res.ok) {
      const setting = await res.json();
      if (setting?.value) whatsappNumber = setting.value;
    }
  } catch (error) {
    console.error("Erro ao buscar configuração de WhatsApp:", error);
  }

  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-180px)]">{children}</main>
          <Footer />
          <WhatsAppButton number={whatsappNumber} />
        </Providers>
      </body>
    </html>
  );
}

