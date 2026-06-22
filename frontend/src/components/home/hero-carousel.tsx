'use client';

import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BAZU_IMAGES } from '@/lib/theme/images';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-foreground">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {BAZU_IMAGES.hero.map((slide, index) => (
            <div key={slide.src} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative min-h-[70vh] md:min-h-[85vh]">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover opacity-70"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-2xl text-white">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                        {slide.eyebrow}
                      </p>
                      <h1 className="text-4xl font-semibold leading-[1.05] md:text-6xl lg:text-7xl">
                        {slide.title}
                        <br />
                        <span className="italic text-accent">{slide.highlight}</span>
                      </h1>
                      <p className="mt-6 text-lg text-white/80">{slide.price}</p>
                      <div className="mt-10 flex flex-wrap gap-4">
                        <Link href={PUBLIC_ROUTES.CATALOG} className="btn-bazu-fill border-0">
                          Ver catálogo
                        </Link>
                        <Link
                          href={PUBLIC_ROUTES.PROMOTIONS}
                          className="btn-bazu border-white text-white hover:bg-white hover:text-foreground"
                        >
                          Promociones
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur transition hover:bg-white hover:text-foreground md:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur transition hover:bg-white hover:text-foreground md:flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {BAZU_IMAGES.hero.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              selected === i ? 'w-10 bg-accent' : 'w-4 bg-white/40',
            )}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
