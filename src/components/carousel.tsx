"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const DEFAULT_SLIDES = [
  {
    id: "default-1",
    title: "Seu aliado para o Verão",
    subtitle: "Reduza medidas de um jeito que refresca",
    image: "/banner1.jpg",
    link: "/catalogo",
    buttonText: "Aproveite agora!"
  },
  {
    id: "default-2",
    title: "Saúde e Imunidade",
    subtitle: "As melhores vitaminas para o seu dia a dia",
    image: "/banner2.jpg",
    link: "/catalogo?categoria=vitaminas",
    buttonText: "Ver produtos"
  }
];

type Slide = {
  id: string;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
  order?: number;
};

export function Carousel({ initialSlides }: { initialSlides?: Slide[] }) {
  const [slides, setSlides] = useState(initialSlides && initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);

  const minSwipeDistance = 50;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    setDragged(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchStart(clientX);
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    
    if (touchStart) {
      setTouchEnd(clientX);
      if (Math.abs(clientX - startX) > 10) {
        setDragged(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        next();
      } else if (isRightSwipe) {
        prev();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full mb-8">
      <div
        className="group relative w-full overflow-hidden bg-brand-50 shadow-sm cursor-grab active:cursor-grabbing touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          setTouchStart(null);
          setTouchEnd(null);
        }}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => {
          setTouchStart(null);
          setTouchEnd(null);
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative min-w-full aspect-[16/9] max-h-[600px] md:max-h-[720px] bg-brand-50 overflow-hidden">
              <Link href={slide.link || "/catalogo"} onClick={handleLinkClick} className="block w-full h-full relative" draggable={false}>
                <Image
                  src={getImageUrl(slide.image)}
                  alt={slide.title || "Banner"}
                  fill
                  draggable={false}
                  className="object-cover transition-opacity duration-500"
                  priority={index === 0}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 opacity-0 backdrop-blur transition group-hover:opacity-100">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${current === i ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
