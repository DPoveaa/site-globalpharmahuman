"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Facebook, Play, Layers } from "lucide-react";

// Type for Instagram posts from Graph API
type InstagramPost = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

// Type for Facebook posts from Graph API
type FacebookPost = {
  id: string;
  message?: string;
  full_picture?: string;
  permalink_url: string;
  created_time: string;
};


function MediaTypeIcon({ type }: { type: string }) {
  if (type === "VIDEO") return <Play size={12} fill="currentColor" className="text-white drop-shadow-md" />;
  if (type === "CAROUSEL_ALBUM") return <Layers size={12} className="text-white drop-shadow-md" />;
  return null;
}

function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return `${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? "es" : ""}`;
  if (diffDays > 0) return `${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  if (diffHours > 0) return `${diffHours}h`;
  return "agora";
}

// URL hardcoded do widget Instagram (LightWidget) — igual ao Facebook que tem iframe hardcoded
const INSTAGRAM_WIDGET_URL = "/api/instagram-widget";

export function SocialFeed() {
  const [activeTab, setActiveTab] = useState<"instagram" | "facebook">("instagram");
  const [fbLoading, setFbLoading] = useState(true);
  const [fbPostsLoading, setFbPostsLoading] = useState(true);
  const [fbPosts, setFbPosts] = useState<FacebookPost[]>([]);
  const [fbConfigured, setFbConfigured] = useState(false);
  const [igPosts, setIgPosts] = useState<InstagramPost[]>([]);
  const [igConfigured, setIgConfigured] = useState(false);
  const [igLoading, setIgLoading] = useState(true);
  const [igIframeLoading, setIgIframeLoading] = useState(true);

  // Fetch Instagram and Facebook posts from our API Routes
  useEffect(() => {
    async function fetchInstagram() {
      try {
        const res = await fetch("/api/instagram", { next: { revalidate: 3600 } } as any);
        if (res.ok) {
          const data = await res.json();
          setIgPosts(data.posts || []);
          setIgConfigured(data.configured || false);
        }
      } catch (error) {
        console.warn("Failed to fetch Instagram feed:", error);
      } finally {
        setIgLoading(false);
      }
    }

    async function fetchFacebook() {
      try {
        const res = await fetch("/api/facebook", { next: { revalidate: 3600 } } as any);
        if (res.ok) {
          const data = await res.json();
          setFbPosts(data.posts || []);
          setFbConfigured(data.configured || false);
        }
      } catch (error) {
        console.warn("Failed to fetch Facebook feed:", error);
      } finally {
        setFbPostsLoading(false);
      }
    }

    // Load LightWidget script (for Instagram iframe) — same approach as Facebook plugin
    const scriptId = "lightwidget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
      script.async = true;
      document.body.appendChild(script);
    }

    fetchInstagram();
    fetchFacebook();
  }, []);

  // Determine which Instagram view to show
  const hasLiveFeed = igConfigured && igPosts.length > 0;

  // Instagram Column/Aba Content
  const renderInstagramFeed = () => {
    return (
      <div className="space-y-4">
        {/* Instagram Profile Badge */}
        <Link
          href="https://www.instagram.com/globalpharmahuman/"
          target="_blank"
          className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-pink-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white transition-transform duration-300 group-hover:scale-105">
              <Instagram size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Instagram</p>
              <h3 className="text-sm font-bold text-slate-800">@globalpharmahuman</h3>
              <p className="text-[10px] font-medium text-slate-500">
                {hasLiveFeed ? "Feed atualizado automaticamente" : "Siga-nos no Instagram"}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-pink-50 px-4 py-2 text-xs font-bold text-pink-600 transition duration-300 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 group-hover:text-white">
            Seguir
          </div>
        </Link>

        {/* Instagram Feed Content */}
        {igLoading ? (
          /* === LOADING SKELETON === */
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
        ) : hasLiveFeed ? (
          /* === LIVE FEED FROM INSTAGRAM GRAPH API (Auto-atualiza, 100% grátis) === */
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
              {igPosts.map((post) => {
                const imageUrl = post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url;
                return (
                  <Link
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    className="group relative aspect-square overflow-hidden bg-slate-50 transition-all duration-300"
                  >
                    {/* Post Image */}
                    <img
                      src={imageUrl}
                      alt={post.caption?.slice(0, 80) || "Post do Instagram"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Media Type Badge (Video/Carousel) */}
                    {post.media_type !== "IMAGE" && (
                      <div className="absolute top-2 right-2 z-20">
                        <MediaTypeIcon type={post.media_type} />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/50 p-3 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 flex flex-col justify-between">
                      {post.caption && (
                        <p className="text-[9px] sm:text-[10px] font-medium leading-relaxed text-white/90 line-clamp-4">
                          {post.caption}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[9px] font-bold text-white/80 border-t border-white/20 pt-1.5 mt-1">
                        <span className="flex items-center gap-1">
                          <Instagram size={10} /> Ver no Instagram
                        </span>
                        <span className="text-white/60">{timeAgo(post.timestamp)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* "Ver mais no Instagram" footer */}
            <Link
              href="https://www.instagram.com/globalpharmahuman/"
              target="_blank"
              className="group flex items-center justify-center gap-2 border-t border-slate-100 py-3 text-xs font-bold text-pink-500 transition hover:bg-pink-50 hover:text-pink-600"
            >
              <Instagram size={14} />
              Ver mais no Instagram
            </Link>
          </div>
        ) : (
          /* === LIGHTWIDGET IFRAME (hardcoded, igual ao iframe do Facebook) === */
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {igIframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-3 w-28 animate-pulse rounded-md bg-slate-100" />
                    <div className="h-2 w-16 animate-pulse rounded-md bg-slate-100" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              </div>
            )}
            <iframe
              src={INSTAGRAM_WIDGET_URL}
              width="100%"
              height="500"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              onLoad={() => setIgIframeLoading(false)}
              className="w-full lightwidget-widget"
            />
          </div>
        )}
      </div>
    );
  };

  // Facebook Column/Aba Content
  const renderFacebookFeed = () => {
    const hasFbLiveFeed = fbConfigured && fbPosts.length > 0;

    return (
      <div className="space-y-4">
        {/* Facebook Profile Badge */}
        <Link
          href="https://www.facebook.com/globalhumanmanipulacao"
          target="_blank"
          className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2] text-white transition-transform duration-300 group-hover:scale-105">
              <Facebook size={24} fill="currentColor" strokeWidth={0} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Facebook</p>
              <h3 className="text-sm font-bold text-slate-800">Global Human Manipulação</h3>
              <p className="text-[10px] font-medium text-slate-500">
                {hasFbLiveFeed ? "Feed atualizado automaticamente" : "2.1k seguidores • Feed atualizado"}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition duration-300 group-hover:bg-[#1877F2] group-hover:text-white">
            Seguir
          </div>
        </Link>

        {/* Facebook Live Feed Container */}
        {fbPostsLoading ? (
          /* === LOADING SKELETON === */
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
        ) : hasFbLiveFeed ? (
          /* === LIVE FEED FROM FACEBOOK API (100% grátis e customizável) === */
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
              {fbPosts.map((post) => (
                <Link
                  key={post.id}
                  href={post.permalink_url}
                  target="_blank"
                  className="group relative aspect-square overflow-hidden bg-slate-50 transition-all duration-300"
                >
                  {post.full_picture ? (
                    <img
                      src={post.full_picture}
                      alt={post.message?.slice(0, 80) || "Post do Facebook"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col justify-between bg-slate-50 p-4 transition-transform duration-500 group-hover:scale-105">
                      <Facebook className="text-[#1877F2]/20" size={32} fill="currentColor" strokeWidth={0} />
                      <p className="text-[10px] font-medium text-slate-600 line-clamp-4">{post.message}</p>
                      <span className="text-[9px] font-bold text-slate-400">{timeAgo(post.created_time)}</span>
                    </div>
                  )}

                  {post.full_picture && (
                    <div className="absolute inset-0 z-10 bg-black/50 p-3 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 flex flex-col justify-between">
                      {post.message && (
                        <p className="text-[9px] sm:text-[10px] font-medium leading-relaxed text-white/90 line-clamp-4">
                          {post.message}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[9px] font-bold text-white/80 border-t border-white/20 pt-1.5 mt-1">
                        <span className="flex items-center gap-1">
                          <Facebook size={10} fill="currentColor" strokeWidth={0} /> Ver no Facebook
                        </span>
                        <span className="text-white/60">{timeAgo(post.created_time)}</span>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
            
            <Link
              href="https://www.facebook.com/globalhumanmanipulacao"
              target="_blank"
              className="group flex items-center justify-center gap-2 border-t border-slate-100 py-3 text-xs font-bold text-[#1877F2] transition hover:bg-blue-50 hover:text-[#1877F2]"
            >
              <Facebook size={14} fill="currentColor" strokeWidth={0} />
              Ver mais no Facebook
            </Link>
          </div>
        ) : (
          /* === DEFAULT IFRAME FALLBACK === */
          <div className="relative w-full h-[500px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {fbLoading && (
              <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-3 w-28 animate-pulse rounded-md bg-slate-100" />
                    <div className="h-2 w-16 animate-pulse rounded-md bg-slate-100" />
                  </div>
                </div>
                <div className="h-full w-full animate-pulse rounded-xl bg-slate-50" />
              </div>
            )}
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fglobalhumanmanipulacao&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="100%"
              height="100%"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              onLoad={() => setFbLoading(false)}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      {/* Aligned Heading */}
      <div className="mb-6 border-b border-brand-50 pb-4 md:mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Redes Sociais Oficiais
        </p>
        <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
          Nossa Comunidade Ativa
        </h2>
        <p className="text-xs text-slate-500 md:text-sm mt-1">
          Acompanhe nossas novidades em tempo real e junte-se a milhares de clientes saudáveis.
        </p>
      </div>

      {/* Tabs Selector (Mobile only) */}
      <div className="flex gap-2 rounded-2xl bg-slate-50 p-1 lg:hidden mb-6">
        <button
          onClick={() => setActiveTab("instagram")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition ${
            activeTab === "instagram"
              ? "bg-white text-pink-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Instagram size={14} /> Instagram
        </button>
        <button
          onClick={() => setActiveTab("facebook")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition ${
            activeTab === "facebook"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Facebook size={14} fill="currentColor" strokeWidth={0} /> Facebook
        </button>
      </div>

      {/* Responsive Content Display */}
      {/* 1. Mobile & Tablet Layout (Tabbed) */}
      <div className="block lg:hidden">
        {activeTab === "instagram" ? renderInstagramFeed() : renderFacebookFeed()}
      </div>

      {/* 2. Desktop Layout (Split columns side-by-side) */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
        <div>{renderInstagramFeed()}</div>
        <div>{renderFacebookFeed()}</div>
      </div>
    </section>
  );
}
