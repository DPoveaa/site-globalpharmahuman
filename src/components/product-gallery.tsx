"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const closeZoom = useCallback(() => {
    setIsZoomed(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isZoomed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isZoomed, nextImage, prevImage, closeZoom]);

  const modalContent = isZoomed && (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" 
      onClick={closeZoom}
    >
      {/* Contador - Topo Esquerda */}
      <div className="absolute left-6 top-6 text-sm font-black text-white/40 select-none tracking-widest">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Botão Fechar - Topo Direita */}
      <button 
        className="absolute right-6 top-6 z-[1000000] rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 active:scale-90"
        onClick={closeZoom}
        aria-label="Fechar"
      >
        <X size={24} strokeWidth={2.5} />
      </button>
      
      {/* Imagem Central e Navegação */}
      <div className="relative flex h-full w-full max-w-7xl items-center justify-center px-4" onClick={e => e.stopPropagation()}>
        {/* Seta Esquerda */}
        {images.length > 1 && (
          <button 
            onClick={prevImage}
            className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white transition-all hover:bg-black/40 active:scale-90 sm:left-4 sm:h-20 sm:w-20"
          >
            <ChevronLeft size={32} strokeWidth={2} className="sm:hidden" />
            <ChevronLeft size={60} strokeWidth={1} className="hidden sm:block" />
          </button>
        )}

        <div className="relative h-[60vh] w-full sm:h-[80vh] animate-in zoom-in-95 duration-300">
          <Image 
            src={getImageUrl(images[currentIndex])} 
            alt={productName} 
            fill 
            className="object-contain" 
            priority
          />
        </div>

        {/* Seta Direita */}
        {images.length > 1 && (
          <button 
            onClick={nextImage}
            className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white transition-all hover:bg-black/40 active:scale-90 sm:right-4 sm:h-20 sm:w-20"
          >
            <ChevronRight size={32} strokeWidth={2} className="sm:hidden" />
            <ChevronRight size={60} strokeWidth={1} className="hidden sm:block" />
          </button>
        )}
      </div>
    </div>
  );

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Apenas em desktop
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${getImageUrl(images[currentIndex])})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "250%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div 
        className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl bg-white border border-brand-100 shadow-sm transition-all hover:shadow-md"
        onClick={() => setIsZoomed(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image 
          src={getImageUrl(images[currentIndex])} 
          alt={productName} 
          fill 
          className="object-contain transition-opacity duration-200 md:group-hover:opacity-0" 
          priority
        />
        {/* Zoom Overlay (Desktop Only) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none hidden bg-no-repeat bg-white transition-opacity duration-200 md:block"
          style={{ ...zoomStyle, opacity: zoomStyle.display === "none" ? 0 : 1 }}
        />
        <div className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 shadow-lg border border-brand-50">
          <ZoomIn size={20} />
        </div>
        
        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-20 rounded-full bg-brand-900/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700 backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex w-full gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 snap-center overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                currentIndex === index 
                  ? "border-brand-500 ring-4 ring-brand-500/10 scale-95" 
                  : "border-brand-50 opacity-60 hover:opacity-100 bg-white"
              }`}
            >
              <Image 
                src={getImageUrl(image)} 
                alt={`${productName} miniatura ${index + 1}`} 
                fill 
                className="object-contain p-1" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal Estilo Mercado Livre via Portal */}
      {mounted && createPortal(modalContent, document.body)}
    </div>
  );
}

