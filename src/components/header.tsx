"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { SITE_NAME } from "@/lib/constants";
import {
  Search, ShoppingCart, User, HelpCircle, Heart,
  Zap, Flame, Leaf, Baby, Apple, Stethoscope, Package,
  Percent, Tag, Smile, Shield, Truck, CreditCard, Pill,
  Activity, ShoppingBag, Coffee, Dumbbell, Menu, X, LogOut,
  Star, Gift, Sparkles, Sun, Moon,
  Umbrella, Scissors, Syringe, TestTube,
  Droplet, Eye, Thermometer, Wind,
  Brain, Bone, Microscope, MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import { AdminNotifications } from "@/components/admin-notifications";

const AVAILABLE_ICONS: Record<string, any> = {
  Zap, Flame, Heart, Leaf, Baby, Apple, Stethoscope, Package,
  Percent, Tag, Smile, Shield, Truck, CreditCard, Pill,
  Activity, ShoppingBag, Coffee, Dumbbell,
  Star, Gift, Sparkles, Sun, Moon,
  Umbrella, Scissors, Syringe, TestTube,
  Droplet, Eye, Thermometer, Wind,
  Brain, Bone, Microscope, MessageCircle
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type HeaderNavItem = {
  id: string;
  label: string;
  categoryId: string | null;
  customUrl: string | null;
  icon: string | null;
  iconColor: string | null;
  category?: { slug: string };
};

function resolveNavHref(item: HeaderNavItem) {
  if (item.customUrl) return item.customUrl;

  const normalizedLabel = item.label.toLowerCase();
  const looksLikePromotions =
    item.categoryId === "PROMOTIONS" ||
    normalizedLabel.includes("promo") ||
    normalizedLabel.includes("oferta");

  if (looksLikePromotions) return "/catalogo?promocoes=1";
  if (item.category?.slug) return `/catalogo?categoria=${item.category.slug}`;
  return "/catalogo";
}

export function Header({
  initialCategories = [],
  initialNavItems = [],
  initialColors = { navBarColor: "#ffffff", navTextColor: "#00603f", navIconColor: "#00603f" }
}: {
  initialCategories?: Category[];
  initialNavItems?: HeaderNavItem[];
  initialColors?: { navBarColor: string; navTextColor: string; navIconColor: string };
}) {
  const { data: session } = useSession();
  const showQuadro = !!(session?.user && (
    (session.user as any).role === "ADMIN" ||
    ((session.user as any).role === "EMPLOYEE" && (session.user as any).permissions?.includes("quadro_de_avisos"))
  ));
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [navItems, setNavItems] = useState<HeaderNavItem[]>(initialNavItems);
  const [navBarColor, setNavBarColor] = useState(initialColors.navBarColor);
  const [navTextColor, setNavTextColor] = useState(initialColors.navTextColor);
  const [navIconColor, setNavIconColor] = useState(initialColors.navIconColor);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    async function fetchData() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const fetchOptions = { cache: "no-store" as RequestCache };
      try {
        const [catRes, navRes, colorRes, textColorRes, iconColorRes] = await Promise.all([
          fetch(`${apiUrl}/catalog/categories`, fetchOptions),
          fetch(`${apiUrl}/catalog/header-nav`, fetchOptions),
          fetch(`${apiUrl}/catalog/settings/HEADER_NAV_BAR_COLOR`, fetchOptions),
          fetch(`${apiUrl}/catalog/settings/HEADER_NAV_TEXT_COLOR`, fetchOptions),
          fetch(`${apiUrl}/catalog/settings/HEADER_NAV_ICON_COLOR`, fetchOptions)
        ]);

        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(Array.isArray(data) ? data.slice(0, 6) : []);
        }

        if (navRes.ok) {
          setNavItems(await navRes.json());
        }

        if (colorRes.ok) {
          const setting = await colorRes.json();
          if (setting?.value) setNavBarColor(setting.value);
        }

        if (textColorRes.ok) {
          const textSetting = await textColorRes.json();
          if (textSetting?.value) setNavTextColor(textSetting.value);
        }

        if (iconColorRes.ok) {
          const iconSetting = await iconColorRes.json();
          if (iconSetting?.value) setNavIconColor(iconSetting.value);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Header:", error);
      }
    }

    window.addEventListener("settings-updated", fetchData);
    return () => window.removeEventListener("settings-updated", fetchData);
  }, []);

  const displayItems = navItems.length > 0 ? navItems : null;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 md:gap-8 md:px-8 md:py-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-1.5 text-slate-700 md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="shrink-0 transition hover:opacity-80">
          <Image
            src="/gph_logo_extensa.png"
            alt={SITE_NAME}
            width={200}
            height={50}
            className="h-7 w-auto max-w-[140px] md:max-w-none md:h-12"
            priority
            unoptimized
          />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 md:block max-w-2xl">
          <form action="/catalogo" method="GET" className="relative group">
            <input
              type="text"
              name="q"
              placeholder="O que você está buscando?"
              className="w-full rounded-full border border-brand-200 bg-brand-50/50 py-2.5 pl-5 pr-12 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-slate-500 shadow-sm transition hover:bg-brand-500 hover:text-white">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 md:gap-5 text-slate-800">
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            {!session?.user ? (
              <>
                <Link href="/cadastro" className="hover:text-slate-500">Criar conta</Link>
                <span className="text-slate-200">|</span>
                <Link href="/login" className="hover:text-slate-500">Entrar</Link>
              </>
            ) : (
              <span className="text-slate-500 line-clamp-1 max-w-[100px]">Olá, {session.user.name?.split(' ')[0]}</span>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            <Link href="/carrinho" className="relative p-2 transition hover:text-slate-500" title="Carrinho">
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white md:-right-2 md:-top-2">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            </Link>
            <Link href="/conta" className="p-2 transition hover:text-slate-500" title="Minha Conta">
              <User size={22} strokeWidth={1.5} />
            </Link>
            {showQuadro && (
              <AdminNotifications />
            )}
            {(session?.user?.role === "ADMIN" || session?.user?.role === "EMPLOYEE") && (
              <Link href="/admin" className="hidden rounded-lg bg-brand-100 px-3 py-1 text-xs font-bold text-slate-600 transition hover:bg-brand-600 hover:text-white sm:block">
                PAINEL
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <form action="/catalogo" method="GET" className="relative">
          <input
            type="text"
            name="q"
            placeholder="O que você está buscando?"
            className="w-full rounded-xl border border-brand-200 bg-brand-50/50 py-2 pl-4 pr-10 text-sm outline-none"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Navigation Bar - Desktop */}
      <div
        className="hidden border-t md:block border-brand-50"
        style={{ backgroundColor: navBarColor, borderColor: navBarColor !== '#ffffff' ? navBarColor : undefined }}
      >
        <div className="mx-auto max-w-7xl px-8">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: navTextColor }}
          >
            {displayItems ? (
              displayItems.map((item) => {
                const IconComp = item.icon ? AVAILABLE_ICONS[item.icon] : null;
                return (
                  <Link
                    key={item.id}
                    href={resolveNavHref(item)}
                    className="group flex items-center gap-2 transition hover:opacity-70"
                  >
                    {IconComp && (
                      <span
                        className="transition-colors group-hover:opacity-70"
                        style={{ color: navIconColor }}
                      >
                        <IconComp size={16} strokeWidth={2.5} />
                      </span>
                    )}
                    {item.label}
                  </Link>
                );
              })
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="transition hover:opacity-70"
                >
                  {cat.name}
                </Link>
              ))
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed bottom-0 left-0 top-0 z-[60] w-72 transform bg-white transition-transform duration-300 md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col p-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-slate-400">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto min-h-0 pb-4">

            <Link onClick={() => setIsMenuOpen(false)} href="/conta" className="flex items-center gap-3 py-2 text-sm font-bold uppercase text-slate-700">
              <User size={20} />
              Minha Conta
            </Link>

            {(session?.user?.role === "ADMIN" || session?.user?.role === "EMPLOYEE") && (
              <Link onClick={() => setIsMenuOpen(false)} href="/admin" className="flex items-center gap-3 py-2 text-sm font-black uppercase text-slate-600">
                <Shield size={20} />
                Painel Admin
              </Link>
            )}

            <div className="my-2 h-px bg-brand-50" />

            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Categorias</p>

            {displayItems ? (
              displayItems.map((item) => {
                const IconComp = item.icon ? AVAILABLE_ICONS[item.icon] : null;
                return (
                  <Link
                    key={item.id}
                    onClick={() => setIsMenuOpen(false)}
                    href={resolveNavHref(item)}
                    className="group flex items-center gap-3 py-2 text-sm font-bold uppercase text-slate-700 transition hover:text-slate-500"
                  >
                    {IconComp && (
                      <span
                        className="transition-colors group-hover:!text-slate-500"
                        style={{ color: navIconColor }}
                      >
                        <IconComp size={20} strokeWidth={2.5} />
                      </span>
                    )}
                    {item.label}
                  </Link>
                );
              })
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  onClick={() => setIsMenuOpen(false)}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="py-2 text-sm font-bold uppercase text-slate-700"
                >
                  {cat.name}
                </Link>
              ))
            )}

            <div className="my-2 h-px bg-brand-50" />

            <Link onClick={() => setIsMenuOpen(false)} href="/favoritos" className="flex items-center gap-3 py-2 text-sm font-bold uppercase text-slate-700">
              <Heart size={20} />
              Favoritos
            </Link>
            <Link onClick={() => setIsMenuOpen(false)} href="https://api.whatsapp.com/send/?phone=5511949209864&text=Ol%C3%A1%21+Vim+pelo+site+da+Global+Pharma+Human+e+gostaria+de+mais+informações.&type=phone_number&app_absent=0" className="flex items-center gap-3 py-2 text-sm font-bold uppercase text-slate-700">
              <MessageCircle size={20} />
              Ajuda
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            {!session?.user ? (
              <div className="grid gap-3">
                <Link onClick={() => setIsMenuOpen(false)} href="/login" className="flex w-full justify-center rounded-xl border border-brand-200 py-3 text-sm font-bold text-slate-700">
                  Entrar
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} href="/cadastro" className="flex w-full justify-center rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20">
                  Criar Conta
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600"
              >
                Sair da Conta
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

