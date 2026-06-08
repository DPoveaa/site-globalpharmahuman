"use client";
import toast from "react-hot-toast";
import { confirmAction } from "@/lib/toast";

import { useMemo, useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Layout,
  Palette,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  Flame,
  Heart,
  Leaf,
  Baby,
  Apple,
  Stethoscope,
  Package,
  Percent,
  Tag,
  Smile,
  Shield,
  Truck,
  CreditCard,
  Pill,
  Activity,
  ShoppingBag,
  Coffee,
  Dumbbell,
  FolderPlus,
  Upload,
  Image as ImageIcon,
  Save,
  Star,
  Gift,
  Sparkles,
  Sun,
  Moon,
  Umbrella,
  Scissors,
  Syringe,
  TestTube,
  Droplet,
  Eye,
  Thermometer,
  Wind,
  Brain,
  Bone,
  Microscope,
  Power,
  PowerOff,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

const AVAILABLE_ICONS: Record<string, { icon: any; label: string }> = {
  Zap: { icon: Zap, label: "Energia" },
  Flame: { icon: Flame, label: "Ofertas Fogo" },
  Heart: { icon: Heart, label: "Favoritos" },
  Leaf: { icon: Leaf, label: "Natural" },
  Baby: { icon: Baby, label: "Infantil" },
  Apple: { icon: Apple, label: "Saúde" },
  Stethoscope: { icon: Stethoscope, label: "Médico" },
  Package: { icon: Package, label: "Produtos" },
  Percent: { icon: Percent, label: "Promoção" },
  Tag: { icon: Tag, label: "Etiqueta" },
  Smile: { icon: Smile, label: "Bem-estar" },
  Shield: { icon: Shield, label: "Proteção" },
  Truck: { icon: Truck, label: "Entrega" },
  CreditCard: { icon: CreditCard, label: "Pagamento" },
  Pill: { icon: Pill, label: "Medicamentos" },
  Activity: { icon: Activity, label: "Atividade" },
  ShoppingBag: { icon: ShoppingBag, label: "Compras" },
  Coffee: { icon: Coffee, label: "Café/Foco" },
  Dumbbell: { icon: Dumbbell, label: "Fitness" },
  Star: { icon: Star, label: "Estrela" },
  Gift: { icon: Gift, label: "Presente" },
  Sparkles: { icon: Sparkles, label: "Destaque" },
  Sun: { icon: Sun, label: "Verão/Dia" },
  Moon: { icon: Moon, label: "Noite/Sono" },
  Umbrella: { icon: Umbrella, label: "Proteção/Sol" },
  Scissors: { icon: Scissors, label: "Corte de Preço" },
  Syringe: { icon: Syringe, label: "Injeção/Vacina" },
  TestTube: { icon: TestTube, label: "Laboratório" },
  Droplet: { icon: Droplet, label: "Hidratação" },
  Eye: { icon: Eye, label: "Visão/Olhos" },
  Thermometer: { icon: Thermometer, label: "Temperatura" },
  Wind: { icon: Wind, label: "Respiração" },
  Brain: { icon: Brain, label: "Cérebro/Memória" },
  Bone: { icon: Bone, label: "Articulação" },
  Microscope: { icon: Microscope, label: "Pesquisa" },
  MessageCircle: { icon: MessageCircle, label: "WhatsApp" }
};

type Category = {
  id: string;
  name: string;
  slug: string;
  showOnHome: boolean;
  homeTitle: string | null;
  order: number;
  _count?: { products: number };
  isVirtual?: boolean;
  settingKey?: string;
};

type HeaderNavItem = {
  id: string;
  label: string;
  categoryId: string | null;
  customUrl: string | null;
  icon: string | null;
  iconColor: string | null;
  order: number;
  active: boolean;
  category?: Category;
};

type Banner = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
  order?: number;
};

type BannerDestination = "CUSTOM" | "CATEGORY" | "PROMOTIONS";

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function isPromotionLabel(label: string) {
  const normalized = normalizeText(label);
  return normalized.includes("promo") || normalized.includes("oferta");
}

function inferBannerDestination(link: string): BannerDestination {
  if (link === "/catalogo?promocoes=1") return "PROMOTIONS";
  if (link.startsWith("/catalogo?categoria=")) return "CATEGORY";
  return "CUSTOM";
}

function slugFromBannerLink(link: string) {
  if (!link.startsWith("/catalogo?categoria=")) return "";
  return decodeURIComponent(link.replace("/catalogo?categoria=", ""));
}

function OptimizedColorPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [localColor, setLocalColor] = useState(value);

  useEffect(() => {
    setLocalColor(value);
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (localColor !== value) onChange(localColor);
    }, 150);
    return () => clearTimeout(t);
  }, [localColor, value, onChange]);

  return (
    <input
      type="color"
      value={localColor}
      onChange={(e) => setLocalColor(e.target.value)}
      className="h-10 w-20 cursor-pointer rounded-lg border border-brand-200 p-1"
    />
  );
}

export default function AdminHeaderNavPage() {
  const [items, setItems] = useState<HeaderNavItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [navBarColor, setNavBarColor] = useState("#ffffff");
  const [navTextColor, setNavTextColor] = useState("#1e293b"); // slate-800
  const [navIconColor, setNavIconColor] = useState("#3b82f6"); // blue-500
  const [editingItem, setEditingItem] = useState<HeaderNavItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [navCategoryId, setNavCategoryId] = useState<string>("");
  const [isHomeCategoriesExpanded, setIsHomeCategoriesExpanded] = useState(false);
  const [isColorsExpanded, setIsColorsExpanded] = useState(false);
  const [isNavItemsExpanded, setIsNavItemsExpanded] = useState(false);
  const [isBannersExpanded, setIsBannersExpanded] = useState(false);
  const [categoryToAdd, setCategoryToAdd] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalTarget, setCategoryModalTarget] = useState<"menu" | "banner" | null>(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState(false);
  const [bannerDestination, setBannerDestination] = useState<BannerDestination>("CUSTOM");
  const [bannerCategorySlug, setBannerCategorySlug] = useState("");

  const [previewIcon, setPreviewIcon] = useState("");
  const [previewLabel, setPreviewLabel] = useState("");

  useEffect(() => {
    fetchData();
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const res = await fetch("/api/catalog/settings/HOME_BANNERS");
      if (res.ok) {
        const data = await res.json();
        if (data?.value) {
          setBanners(JSON.parse(data.value));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar banners:", error);
    }
  }

  async function handleBannerUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (editingBanner) {
          setEditingBanner({ ...editingBanner, image: data.url });
        } else {
          setEditingBanner({
            id: crypto.randomUUID(),
            image: data.url,
            title: "",
            subtitle: "",
            link: "/catalogo",
            order: banners.length
          });
        }
      }
    } catch (error) {
      toast.error("Erro no upload.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleItemActive(item: HeaderNavItem) {
    const action = item.active ? "desativar" : "ativar";
    if (!await confirmAction(`Tem certeza que deseja ${action} este item do menu?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/header-nav?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active })
      });

      if (!response.ok) {
        toast.error("Erro ao alterar status.");
      } else {
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }


  async function saveBanners(newBanners: Banner[]) {
    setLoading(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "HOME_BANNERS", value: JSON.stringify(newBanners) })
      });
      setBanners(newBanners);
      setBannerForm(false);
      setEditingBanner(null);
    } catch (error) {
      toast.error("Erro ao salvar banners.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (editingItem) {
      setPreviewLabel(editingItem.label);
      setPreviewIcon(editingItem.icon || "");
      if (editingItem.customUrl) {
        setNavCategoryId("CUSTOM_LINK");
      } else if (editingItem.categoryId) {
        setNavCategoryId(editingItem.categoryId);
      } else if (isPromotionLabel(editingItem.label)) {
        setNavCategoryId("PROMOTIONS");
      } else {
        setNavCategoryId("");
      }
    } else {
      setPreviewLabel("");
      setPreviewIcon("");
      setNavCategoryId("");
    }
  }, [editingItem, showForm]);

  useEffect(() => {
    if (!editingBanner) {
      setBannerDestination("CUSTOM");
      setBannerCategorySlug("");
      return;
    }

    const destination = inferBannerDestination(editingBanner.link || "");
    setBannerDestination(destination);
    setBannerCategorySlug(destination === "CATEGORY" ? slugFromBannerLink(editingBanner.link) : "");
  }, [editingBanner, bannerForm]);

  async function fetchData() {
    setLoading(true);
    try {
      const [navRes, catRes, settingsRes, textColorRes, iconColorRes, featuredRes, latestRes] = await Promise.all([
        fetch("/api/admin/header-nav"),
        fetch("/api/admin/categories"),
        fetch("/api/catalog/settings/HEADER_NAV_BAR_COLOR"),
        fetch("/api/catalog/settings/HEADER_NAV_TEXT_COLOR"),
        fetch("/api/catalog/settings/HEADER_NAV_ICON_COLOR"),
        fetch("/api/catalog/settings/HOME_FEATURED_CONFIG"),
        fetch("/api/catalog/settings/HOME_LATEST_CONFIG")
      ]);

      if (navRes.ok) setItems(await navRes.json());

      let fetchedCategories: Category[] = [];
      if (catRes.ok) fetchedCategories = await catRes.json();

      let featuredConfig = { showOnHome: true, order: -10, homeTitle: "Ofertas Imperdíveis" };
      let latestConfig = { showOnHome: true, order: 1000, homeTitle: "Novidades Fresquinhas" };

      if (featuredRes.ok) {
        const data = await featuredRes.json();
        if (data?.value) featuredConfig = JSON.parse(data.value);
      }

      if (latestRes.ok) {
        const data = await latestRes.json();
        if (data?.value) latestConfig = JSON.parse(data.value);
      }

      const virtualFeatured: Category = {
        id: "VIRTUAL_FEATURED",
        name: "Em Destaque",
        slug: "featured",
        showOnHome: featuredConfig.showOnHome,
        homeTitle: featuredConfig.homeTitle,
        order: featuredConfig.order,
        isVirtual: true,
        settingKey: "HOME_FEATURED_CONFIG"
      };

      const virtualLatest: Category = {
        id: "VIRTUAL_LATEST",
        name: "Lançamentos",
        slug: "latest",
        showOnHome: latestConfig.showOnHome,
        homeTitle: latestConfig.homeTitle,
        order: latestConfig.order,
        isVirtual: true,
        settingKey: "HOME_LATEST_CONFIG"
      };

      setCategories([virtualFeatured, virtualLatest, ...fetchedCategories]);

      if (settingsRes.ok) {
        const setting = await settingsRes.json();
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
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      label: String(formData.get("label")),
      categoryId: (navCategoryId && navCategoryId !== "PROMOTIONS" && navCategoryId !== "CUSTOM_LINK") ? navCategoryId : null,
      customUrl: navCategoryId === "CUSTOM_LINK" ? String(formData.get("customUrl") || "") : null,
      icon: formData.get("icon") || null,
      active: true,
      order: editingItem ? editingItem.order : items.length
    };
    
    if (navCategoryId === "PROMOTIONS") {
      payload.categoryId = "PROMOTIONS";
    }

    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/admin/header-nav/${editingItem.id}` : "/api/admin/header-nav";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowForm(false);
        setEditingItem(null);
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!await confirmAction("Excluir este item da navegação?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/header-nav/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      toast.error("Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveColor() {
    setLoading(true);
    try {
      const res1 = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "HEADER_NAV_BAR_COLOR", value: navBarColor })
      });
      const res2 = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "HEADER_NAV_TEXT_COLOR", value: navTextColor })
      });
      const res3 = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "HEADER_NAV_ICON_COLOR", value: navIconColor })
      });
      if (res1.ok && res2.ok && res3.ok) {
        toast.success("Cores salvas com sucesso!");
        window.dispatchEvent(new Event("settings-updated"));
      }
    } catch {
      toast.error("Erro ao salvar cor.");
    } finally {
      setLoading(false);
    }
  }

  async function importDefaultCategories() {
    if (!await confirmAction("Isso irá criar itens de navegação baseados nas suas categorias atuais. Deseja continuar?")) return;

    setLoading(true);
    try {
      const catsToImport = categories.slice(0, 6);

      for (const cat of catsToImport) {
        await fetch("/api/admin/header-nav", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: cat.name,
            categoryId: cat.id,
            active: true,
            order: items.length + catsToImport.indexOf(cat)
          })
        });
      }

      fetchData();
      toast.success("Categorias importadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao importar categorias.");
    } finally {
      setLoading(false);
    }
  }

  async function moveItem(index: number, direction: 'up' | 'down') {
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    const currentItem = sortedItems[index];
    const otherIndex = direction === 'up' ? index - 1 : index + 1;

    if (otherIndex < 0 || otherIndex >= sortedItems.length) return;

    const otherItem = sortedItems[otherIndex];

    // Se as ordens forem iguais ou inconsistentes, forçamos valores baseados no índice
    let currentOrder = currentItem.order;
    let otherOrder = otherItem.order;

    if (currentOrder === otherOrder) {
      // Normalização forçada: garantimos que o que vai subir tenha ordem menor
      if (direction === 'up') {
        currentOrder = index - 1;
        otherOrder = index;
      } else {
        currentOrder = index + 1;
        otherOrder = index;
      }
    } else {
      // Swap simples se as ordens forem diferentes
      const temp = currentOrder;
      currentOrder = otherOrder;
      otherOrder = temp;
    }

    setLoading(true);
    try {
      await Promise.all([
        fetch(`/api/admin/header-nav/${currentItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentOrder })
        }),
        fetch(`/api/admin/header-nav/${otherItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: otherOrder })
        })
      ]);
      fetchData();
    } catch (error) {
      toast.error("Erro ao reordenar.");
    } finally {
      setLoading(false);
    }
  }

  async function moveCategoryHome(index: number, direction: 'up' | 'down') {
    const homeCats = [...categories.filter(c => c.showOnHome).sort((a, b) => a.order - b.order)];

    if (direction === 'up' && index > 0) {
      const temp = homeCats[index];
      homeCats[index] = homeCats[index - 1];
      homeCats[index - 1] = temp;
    } else if (direction === 'down' && index < homeCats.length - 1) {
      const temp = homeCats[index];
      homeCats[index] = homeCats[index + 1];
      homeCats[index + 1] = temp;
    } else {
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        homeCats.map((cat, i) => {
          if (cat.isVirtual && cat.settingKey) {
            return fetch("/api/admin/settings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: cat.settingKey, value: JSON.stringify({ showOnHome: cat.showOnHome, order: i + 1, homeTitle: cat.homeTitle }) })
            });
          }
          return fetch(`/api/admin/categories?id=${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: i + 1 })
          });
        })
      );
      fetchData();
    } catch {
      toast.error("Erro ao reordenar categorias.");
      setLoading(false);
    }
  }

  async function handleToggleCategoryHome(categoryId: string, currentStatus: boolean) {
    setLoading(true);
    try {
      const cat = categories.find(c => c.id === categoryId);
      if (cat?.isVirtual && cat.settingKey) {
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: cat.settingKey, value: JSON.stringify({ showOnHome: !currentStatus, order: cat.order, homeTitle: cat.homeTitle }) })
        });
      } else {
        await fetch(`/api/admin/categories?id=${categoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ showOnHome: !currentStatus })
        });
      }
      toast.success(currentStatus ? "Categoria removida da Página Inicial." : "Categoria adicionada à Página Inicial!");
      fetchData();
    } catch {
      toast.error("Erro ao atualizar categoria.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateCategoryHome(categoryId: string, order: number, homeTitle: string) {
    setLoading(true);
    try {
      const cat = categories.find(c => c.id === categoryId);
      if (cat?.isVirtual && cat.settingKey) {
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: cat.settingKey, value: JSON.stringify({ showOnHome: cat.showOnHome, order, homeTitle: homeTitle || null }) })
        });
      } else {
        await fetch(`/api/admin/categories?id=${categoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order, homeTitle: homeTitle || null })
        });
      }
      toast.success("Configurações da categoria atualizadas!");
      fetchData();
    } catch {
      toast.error("Erro ao atualizar categoria.");
    } finally {
      setLoading(false);
    }
  }

  const linkedCategoryNameById = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat.name])),
    [categories]
  );

  const linkedCategorySlugByName = useMemo(
    () => new Map(categories.map((cat) => [cat.slug, cat.name])),
    [categories]
  );

  const sortedCategories = useMemo(() => {
    return [...categories]
      .filter(c => !c.isVirtual)
      .filter(c => normalizeText(c.name).includes(normalizeText(categorySearchQuery)))
      .sort((a, b) => (b._count?.products || 0) - (a._count?.products || 0));
  }, [categories, categorySearchQuery]);

  if (loading && items.length === 0) return <div>Carregando...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-100 p-2 text-slate-600">
            <Layout size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Menu</h1>
        </div>
        <div className="flex gap-2">
          {items.length === 0 && categories.length > 0 && (
            <button
              onClick={importDefaultCategories}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-brand-50 disabled:opacity-50"
            >
              <FolderPlus size={18} />
              Importar Categorias
            </button>
          )}
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancelar" : "Novo Item"}
          </button>
        </div>
      </div>

      {showForm && (
        <section className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/30 p-6">
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Preview em tempo real</p>
          <div
            className="flex items-center justify-center rounded-xl p-4 shadow-sm"
            style={{ backgroundColor: navBarColor, color: navTextColor }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: navTextColor }}>
              {previewIcon && AVAILABLE_ICONS[previewIcon] && (
                <div style={{ color: navIconColor }}>
                  {(() => {
                    const Icon = AVAILABLE_ICONS[previewIcon].icon;
                    return <Icon size={16} />;
                  })()}
                </div>
              )}
              <span>{previewLabel || "Nome do Item"}</span>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setIsColorsExpanded(!isColorsExpanded)}
          className="flex w-full items-center justify-between border-b border-brand-100 px-6 py-4 bg-brand-50 hover:bg-brand-100 transition"
        >
          <div className="flex items-center gap-2">
            <Palette className="text-slate-500" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Personalização de Cores</h2>
          </div>
          <div className="rounded-full bg-white p-2 shadow-sm">
            {isColorsExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
          </div>
        </button>

        {isColorsExpanded && (
          <div className="p-6 flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Cor do Fundo da Barra</label>
              <div className="flex gap-2">
                <OptimizedColorPicker value={navBarColor} onChange={setNavBarColor} />
                <input
                  type="text"
                  value={navBarColor}
                  onChange={(e) => setNavBarColor(e.target.value)}
                  className="w-28 rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Cor do Texto</label>
              <div className="flex gap-2">
                <OptimizedColorPicker value={navTextColor} onChange={setNavTextColor} />
                <input
                  type="text"
                  value={navTextColor}
                  onChange={(e) => setNavTextColor(e.target.value)}
                  className="w-28 rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Cor dos Ícones</label>
              <div className="flex gap-2">
                <OptimizedColorPicker value={navIconColor} onChange={setNavIconColor} />
                <input
                  type="text"
                  value={navIconColor}
                  onChange={(e) => setNavIconColor(e.target.value)}
                  className="w-28 rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <button
              onClick={handleSaveColor}
              disabled={loading}
              className="rounded-lg bg-brand-50 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-brand-100 transition"
            >
              Salvar Cores
            </button>
          </div>
        )}
      </section>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-lg animate-in fade-in slide-in-from-top-4">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {editingItem ? "Editar Item" : "Novo Item de Navegação"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Rótulo (O que aparece no menu)</label>
              <input
                name="label"
                required
                value={previewLabel}
                onChange={(e) => setPreviewLabel(e.target.value)}
                placeholder="Ex: Ofertas, Emagreça, Vitaminas..."
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Destino</label>
              <select
                name="categoryId"
                value={navCategoryId}
                onChange={(e) => setNavCategoryId(e.target.value)}
                className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition"
              >
                <option value="">Sem destino</option>
                <optgroup label="Especial">
                  <option value="PROMOTIONS">🔥 Todos os Produtos em Promoção</option>
                  <option value="CUSTOM_LINK">🔗 Link Personalizado (WhatsApp, Externo, etc)</option>
                </optgroup>
                <optgroup label="Categorias">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </optgroup>
              </select>
              {navCategoryId !== "CUSTOM_LINK" && navCategoryId !== "PROMOTIONS" && (
                <button
                  type="button"
                  onClick={() => {
                    setCategoryModalTarget("menu");
                    setIsCategoryModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 mt-2 transition hover:underline"
                >
                  <Sparkles size={14} className="text-brand-500 animate-pulse" />
                  Comparar produtos por categoria
                </button>
              )}
            </div>

            {navCategoryId === "CUSTOM_LINK" && (
              <div className="space-y-1 animate-in fade-in slide-in-from-left-2 transition-all">
                <label className="text-xs font-bold uppercase text-slate-500">URL do Link</label>
                <input
                  name="customUrl"
                  required
                  defaultValue={editingItem?.customUrl || ""}
                  placeholder="Ex: https://wa.me/..., /contato, etc"
                  className="w-full rounded-xl border border-brand-500 bg-brand-50/50 px-4 py-2.5 text-sm outline-none focus:border-brand-600 transition shadow-sm"
                />
                <p className="text-[10px] text-brand-600 font-medium">Insira a URL completa para links externos.</p>
              </div>
            )}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-500">Ícone</label>
              <div className="grid grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-brand-200 bg-brand-50/50 p-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 max-h-64">
                <button
                  type="button"
                  onClick={() => setPreviewIcon("")}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 transition ${previewIcon === "" ? "border-brand-500 bg-brand-100" : "border-transparent hover:bg-brand-100"
                    }`}
                >
                  <X size={20} className="mb-1 text-gray-400" />
                  <span className="text-center text-[10px] leading-tight">Sem ícone</span>
                </button>
                {Object.entries(AVAILABLE_ICONS).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPreviewIcon(key)}
                    className={`flex flex-col items-center justify-center rounded-lg border p-2 transition ${previewIcon === key ? "border-brand-500 bg-brand-100 text-slate-700" : "border-transparent text-slate-600 hover:bg-brand-100"
                      }`}
                  >
                    <Icon size={20} className="mb-1" style={{ color: previewIcon === key ? navIconColor : "currentColor" }} />
                    <span className="line-clamp-2 text-center text-[10px] leading-tight" title={label}>{label}</span>
                  </button>
                ))}
              </div>
              <input type="hidden" name="icon" value={previewIcon} />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {editingItem ? "Atualizar Item" : "Criar Item"}
          </button>
        </form>
      )}

      <div className="rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setIsNavItemsExpanded(!isNavItemsExpanded)}
          className="flex w-full items-center justify-between border-b border-brand-100 px-6 py-4 bg-brand-50 hover:bg-brand-100 transition"
        >
          <div className="flex items-center gap-2">
            <Layout className="text-slate-500" size={24} />
            <div className="text-left">
              <h2 className="text-xl font-bold text-slate-900">Itens do Menu</h2>
            </div>
          </div>
          <div className="rounded-full bg-white p-2 shadow-sm">
            {isNavItemsExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
          </div>
        </button>

        {isNavItemsExpanded && (
          <div>
            <div className="flex items-center justify-between border-b border-brand-100 px-6 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Reordene usando as setas
              </p>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-xs font-bold uppercase text-slate-600">
                <tr>
                  <th className="px-6 py-4">Ordem</th>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Destino</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {[...items].sort((a, b) => a.order - b.order).map((item, index, sortedItems) => {
                  const IconComp = item.icon ? AVAILABLE_ICONS[item.icon] : null;
                  return (
                    <tr key={item.id} className="hover:bg-brand-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveItem(index, 'up')}
                            disabled={index === 0 || loading}
                            className="rounded p-1 text-slate-400 hover:bg-brand-100 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronUp size={20} />
                          </button>
                          <button
                            onClick={() => moveItem(index, 'down')}
                            disabled={index === sortedItems.length - 1 || loading}
                            className="rounded p-1 text-slate-400 hover:bg-brand-100 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronDown size={20} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {IconComp && (
                            <div style={{ color: navIconColor || 'inherit' }}>
                              <IconComp.icon size={18} />
                            </div>
                          )}
                          <span className="font-bold text-slate-900">{item.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-[300px]">
                        {item.customUrl ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-black uppercase text-brand-600">Link Personalizado:</span>
                            <span className="break-all text-xs font-mono text-blue-600 leading-tight">
                              {item.customUrl}
                            </span>
                          </div>
                        ) : item.categoryId ? (
                          linkedCategoryNameById.get(item.categoryId) || "Categoria removida"
                        ) : isPromotionLabel(item.label) ? (
                          "🔥 Produtos em Promoção"
                        ) : (
                          "Sem destino"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleItemActive(item)}
                          disabled={loading}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${item.active
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                        >
                          {item.active ? <Power size={12} /> : <PowerOff size={12} />}
                          {item.active ? "ATIVO" : "INATIVO"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowForm(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="rounded-lg p-2 text-slate-600 hover:bg-brand-50"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                Nenhum item configurado. A navegação padrão será exibida.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden mt-8">
        <button
          onClick={() => setIsHomeCategoriesExpanded(!isHomeCategoriesExpanded)}
          className="flex w-full items-center justify-between border-b border-brand-100 px-6 py-4 bg-brand-50 hover:bg-brand-100 transition"
        >
          <div className="flex items-center gap-2">
            <Layout className="text-slate-500" size={24} />
            <div className="text-left">
              <h2 className="text-xl font-bold text-slate-900">Categorias na Página Inicial</h2>
              <p className="text-xs font-bold text-slate-500 hidden sm:block">
                Controle quais categorias aparecem na inicial do site
              </p>
            </div>
          </div>
          <div className="rounded-full bg-white p-2 shadow-sm">
            {isHomeCategoriesExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
          </div>
        </button>

        {isHomeCategoriesExpanded && (
          <div className="p-6">
            <div className="mb-6 flex gap-2">
              <select
                value={categoryToAdd}
                onChange={(e) => setCategoryToAdd(e.target.value)}
                className="w-full md:w-1/2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              >
                <option value="">Selecione uma categoria para adicionar...</option>
                {categories.filter(c => !c.showOnHome).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                disabled={!categoryToAdd || loading}
                onClick={() => {
                  handleToggleCategoryHome(categoryToAdd, false);
                  setCategoryToAdd("");
                }}
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-50 text-xs font-bold uppercase text-slate-600">
                  <tr>
                    <th className="px-6 py-4">Ordem</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Subtítulo Customizado</th>
                    <th className="px-6 py-4 text-center">Produtos</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">
                  {categories.filter(c => c.showOnHome).sort((a, b) => a.order - b.order).map((cat, index, homeCats) => (
                    <tr key={cat.id} className="hover:bg-brand-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveCategoryHome(index, 'up')}
                            disabled={index === 0 || loading}
                            className="rounded p-1 text-slate-400 hover:bg-brand-100 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronUp size={20} />
                          </button>
                          <button
                            onClick={() => moveCategoryHome(index, 'down')}
                            disabled={index === homeCats.length - 1 || loading}
                            className="rounded p-1 text-slate-400 hover:bg-brand-100 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronDown size={20} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{cat.name}</span>
                          {cat.isVirtual && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                              <Sparkles size={12} /> Automático
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          defaultValue={cat.homeTitle || ""}
                          placeholder="Ex: Pensou em saúde:"
                          onBlur={(e) => handleUpdateCategoryHome(cat.id, cat.order, e.target.value)}
                          className="w-full rounded-lg border border-brand-200 px-3 py-1 text-sm outline-none focus:border-brand-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cat.isVirtual ? (
                          <span className="inline-flex items-center justify-center rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-slate-400 italic">
                            Dinâmico
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {cat._count?.products || 0}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if (await confirmAction("Deseja realmente remover esta categoria da página inicial?")) {
                              handleToggleCategoryHome(cat.id, true);
                            }
                          }}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Remover da Página Inicial"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.filter(c => c.showOnHome).length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Nenhuma categoria sendo exibida na Página Inicial.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white shadow-sm overflow-hidden mt-8">
        <button
          onClick={() => setIsBannersExpanded(!isBannersExpanded)}
          className="flex w-full items-center justify-between border-b border-brand-100 px-6 py-4 bg-brand-50 hover:bg-brand-100 transition"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="text-slate-500" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Banners do Carrossel</h2>
          </div>
          <div className="rounded-full bg-white p-2 shadow-sm">
            {isBannersExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
          </div>
        </button>

        {isBannersExpanded && (
          <div className="p-6 space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (bannerForm) {
                    setEditingBanner(null);
                    setBannerForm(false);
                    return;
                  }

                  setEditingBanner({
                    id: crypto.randomUUID(),
                    image: "",
                    title: "",
                    subtitle: "",
                    link: "/catalogo"
                  });
                  setBannerForm(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-black"
              >
                {bannerForm ? <X size={18} /> : <Plus size={18} />}
                {bannerForm ? "Cancelar" : "Novo Banner"}
              </button>
            </div>

            {bannerForm && (
              <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-lg animate-in fade-in slide-in-from-top-4">
                <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Imagem do Banner</label>
                    <div
                      onClick={() => document.getElementById('banner-file')?.click()}
                      className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 transition hover:border-brand-500"
                    >
                      {editingBanner?.image ? (
                        <Image src={getImageUrl(editingBanner.image)} alt="Preview" fill className="object-contain" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-slate-400">
                          <Upload size={32} />
                          <span className="mt-2 text-[10px] font-bold uppercase">Upload</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <Upload className="text-white" size={24} />
                      </div>
                    </div>
                    <input
                      id="banner-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleBannerUpload}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Tipo de Destino</label>
                      <select
                        value={bannerDestination}
                        onChange={(e) => {
                          const value = e.target.value as BannerDestination;
                          setBannerDestination(value);
                          if (!editingBanner) return;

                          if (value === "PROMOTIONS") {
                            setEditingBanner({ ...editingBanner, link: "/catalogo?promocoes=1" });
                            setBannerCategorySlug("");
                          } else if (value === "CATEGORY") {
                            const firstSlug = categories[0]?.slug || "";
                            setBannerCategorySlug(firstSlug);
                            setEditingBanner({
                              ...editingBanner,
                              link: firstSlug ? `/catalogo?categoria=${encodeURIComponent(firstSlug)}` : "/catalogo"
                            });
                          } else {
                            setBannerCategorySlug("");
                            setEditingBanner({ ...editingBanner, link: "/catalogo" });
                          }
                        }}
                        className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                      >
                        <option value="CUSTOM">Link personalizado</option>
                        <option value="CATEGORY">Categoria</option>
                        <option value="PROMOTIONS">Promoções</option>
                      </select>
                    </div>
                    {bannerDestination === "CATEGORY" ? (
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500">Categoria do Banner</label>
                        <select
                          value={bannerCategorySlug}
                          onChange={(e) => {
                            const slug = e.target.value;
                            setBannerCategorySlug(slug);
                            if (!editingBanner) return;
                            setEditingBanner({
                              ...editingBanner,
                              link: slug ? `/catalogo?categoria=${encodeURIComponent(slug)}` : "/catalogo"
                            });
                          }}
                          className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                        >
                          <option value="">Selecione uma categoria</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryModalTarget("banner");
                            setIsCategoryModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 mt-2 transition hover:underline animate-fade-in"
                        >
                          <Sparkles size={14} className="text-brand-500 animate-pulse" />
                          Comparar produtos por categoria
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500">Link de Destino</label>
                        <input
                          value={editingBanner?.link || ""}
                          onChange={(e) => setEditingBanner({ ...editingBanner!, link: e.target.value })}
                          disabled={bannerDestination !== "CUSTOM"}
                          placeholder="Ex: /catalogo ou /promocoes"
                          className="w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                        />
                      </div>
                    )}
                    <div className="flex items-end sm:col-span-2">
                      <button
                        onClick={() => {
                          if (!editingBanner?.image) return toast.error("Selecione uma imagem.");
                          if (bannerDestination === "CATEGORY" && !bannerCategorySlug) {
                            return toast.error("Selecione uma categoria para o banner.");
                          }

                          const bannerExists = banners.some((b) => b.id === editingBanner.id);
                          const newBanners = bannerExists
                            ? banners.map((b) => (b.id === editingBanner.id ? editingBanner : b))
                            : [...banners, editingBanner];
                          saveBanners(newBanners);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-700"
                      >
                        <Save size={18} />
                        Salvar Banner
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const orderedBanners = banners.map((b, i) => ({ ...b, order: b.order ?? i })).sort((a, b) => a.order - b.order);
                return orderedBanners.map((banner, index) => (
                  <article key={banner.id} className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
                    <div className="relative aspect-[21/9] bg-brand-50">
                      <Image src={getImageUrl(banner.image)} alt="Banner" fill className="object-cover" />
                      <div className="absolute right-2 top-2 flex gap-1 rounded-lg bg-white/80 p-1 opacity-0 backdrop-blur transition group-hover:opacity-100 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newBanners = orderedBanners.map(b => ({ ...b }));
                            if (index > 0) {
                              const temp = newBanners[index].order;
                              newBanners[index].order = newBanners[index - 1].order;
                              newBanners[index - 1].order = temp;
                              saveBanners(newBanners);
                            }
                          }}
                          disabled={index === 0 || loading}
                          className="rounded p-1 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newBanners = orderedBanners.map(b => ({ ...b }));
                            if (index < newBanners.length - 1) {
                              const temp = newBanners[index].order;
                              newBanners[index].order = newBanners[index + 1].order;
                              newBanners[index + 1].order = temp;
                              saveBanners(newBanners);
                            }
                          }}
                          disabled={index === orderedBanners.length - 1 || loading}
                          className="rounded p-1 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-1 text-[11px] font-bold text-slate-500">
                        {banner.link === "/catalogo?promocoes=1"
                          ? "Destino: Promoções"
                          : banner.link.startsWith("/catalogo?categoria=")
                            ? `Destino: ${linkedCategorySlugByName.get(slugFromBannerLink(banner.link)) || "Categoria"}`
                            : `Destino: ${banner.link || "/catalogo"}`}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBanner(banner);
                            setBannerForm(true);
                          }}
                          className="flex-1 rounded-lg bg-brand-50 py-2 text-xs font-bold text-slate-600 hover:bg-brand-100 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            if (await confirmAction("Remover este banner?")) {
                              saveBanners(banners.filter(b => b.id !== banner.id));
                            }
                          }}
                          className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ));
              })()}
            </div>
            {banners.length === 0 && !bannerForm && (
              <div className="rounded-2xl border-2 border-dashed border-brand-100 p-12 text-center text-slate-400">
                Nenhum banner configurado. O site usará os banners padrão.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Comparador de Categorias */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsCategoryModalOpen(false)}
          />

          {/* Modal Body */}
          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-2xl animate-scale-in flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-50 bg-slate-50/50 px-6 py-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>📊 Comparador de Categorias</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ordens decrescentes de produtos. Clique para selecionar como destino.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="rounded-full bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 shadow-sm border border-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar categoria..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm outline-none focus:border-brand-500 transition"
              />
              {categorySearchQuery && (
                <button
                  type="button"
                  onClick={() => setCategorySearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30 max-h-[50vh]">
              {sortedCategories.length > 0 ? (
                sortedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (categoryModalTarget === "menu") {
                        setNavCategoryId(cat.id);
                      } else if (categoryModalTarget === "banner") {
                        setBannerCategorySlug(cat.slug);
                        if (editingBanner) {
                          setEditingBanner({
                            ...editingBanner,
                            link: `/catalogo?categoria=${encodeURIComponent(cat.slug)}`
                          });
                        }
                      }
                      setIsCategoryModalOpen(false);
                      setCategorySearchQuery("");
                      toast.success(`Categoria "${cat.name}" selecionada!`);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">
                        slug: {cat.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
                        {cat._count?.products || 0} {cat._count?.products === 1 ? "produto" : "produtos"}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  Nenhuma categoria correspondente encontrada.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
