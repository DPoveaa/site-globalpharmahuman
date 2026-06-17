import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { unstable_cache } from "next/cache";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Marketplace`,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest"
};

const getCachedWhatsappNumber = unstable_cache(
  async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const fallback = process.env.WHATSAPP_NUMBER || "5511999999999";

    try {
      const res = await fetch(`${apiUrl}/catalog/settings/whatsapp_number`, {
        next: { revalidate: 3600, tags: ["settings:whatsapp_number"] }
      });
      if (!res.ok) return fallback;
      const setting = await res.json();
      return setting?.value || fallback;
    } catch {
      return fallback;
    }
  },
  ["settings:whatsapp_number:cached"],
  { revalidate: 3600, tags: ["settings:whatsapp_number"] }
);

const getCachedHeaderData = unstable_cache(
  async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    try {
      const [catRes, navRes, colorRes, textColorRes, iconColorRes] = await Promise.all([
        fetch(`${apiUrl}/catalog/categories`, { cache: 'no-store' }),
        fetch(`${apiUrl}/catalog/header-nav`, { cache: 'no-store' }),
        fetch(`${apiUrl}/catalog/settings/HEADER_NAV_BAR_COLOR`, { cache: 'no-store' }),
        fetch(`${apiUrl}/catalog/settings/HEADER_NAV_TEXT_COLOR`, { cache: 'no-store' }),
        fetch(`${apiUrl}/catalog/settings/HEADER_NAV_ICON_COLOR`, { cache: 'no-store' })
      ]);

      const categories = catRes.ok ? await catRes.json() : [];
      const navItems = navRes.ok ? await navRes.json() : [];
      const navBarColor = colorRes.ok ? (await colorRes.json())?.value || "#ffffff" : "#ffffff";
      const navTextColor = textColorRes.ok ? (await textColorRes.json())?.value || "#00603f" : "#00603f";
      const navIconColor = iconColorRes.ok ? (await iconColorRes.json())?.value || "#00603f" : "#00603f";

      return {
        initialCategories: Array.isArray(categories) ? categories.slice(0, 6) : [],
        initialNavItems: navItems,
        initialColors: { navBarColor, navTextColor, navIconColor }
      };
    } catch {
      return { initialCategories: [], initialNavItems: [], initialColors: { navBarColor: "#ffffff", navTextColor: "#00603f", navIconColor: "#00603f" } };
    }
  },
  ["header-data"],
  { revalidate: false, tags: ["settings", "categories", "header-nav"] }
);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumber = await getCachedWhatsappNumber();
  const headerData = await getCachedHeaderData();

  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Header {...headerData} />
          <main className="min-h-[calc(100vh-180px)] overflow-x-hidden">{children}</main>
          <Footer />
          <WhatsAppButton number={whatsappNumber} />
        </Providers>
      </body>
    </html>
  );
}

