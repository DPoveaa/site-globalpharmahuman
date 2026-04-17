"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "Seu aliado para o Verão",
    subtitle: "Reduza medidas de um jeito que refresca",
    image: "/banner1.jpg", // You'll need to add these images to public folder
    link: "/catalogo",
    buttonText: "Aproveite agora!"
  },
  {
    id: 2,
    title: "Saúde e Imunidade",
    subtitle: "As melhores vitaminas para o seu dia a dia",
    image: "/banner2.jpg",
    link: "/catalogo?categoria=vitaminas",
    buttonText: "Ver produtos"
  }
];

export function Carousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="group relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-brand-900 px-4 md:px-8">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="relative min-w-full aspect-[21/9] md:aspect-[25/9]">
            <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-24 text-white">
              <div className="max-w-xl space-y-4 md:space-y-6">
                <h2 className="text-3xl font-extrabold md:text-5xl lg:text-6xl">{slide.title}</h2>
                <p className="text-lg md:text-xl text-white/80">{slide.subtitle}</p>
                <Link 
                  href={slide.link}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-brand-900 transition hover:bg-brand-50"
                >
                  {slide.buttonText}
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
            {/* Fallback color if image is missing */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-brand-700" />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-60"
              priority={slide.id === 1}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
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

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              current === i ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
