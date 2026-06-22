import Image from 'next/image';
import Link from 'next/link';
import { BAZU_IMAGES } from '@/lib/theme/images';
import { PUBLIC_ROUTES } from '@/constants/routes';
import type { Promotion } from '@/types';

interface EditorialBannerProps {
  promotions: Promotion[];
}

export function EditorialBanner({ promotions }: EditorialBannerProps) {
  const promo = promotions[0];

  return (
    <section className="overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={BAZU_IMAGES.editorial.primary}
                alt="Colección La Merced"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden w-48 overflow-hidden border-8 border-background shadow-2xl md:block lg:-right-8 lg:w-56">
              <Image
                src={BAZU_IMAGES.editorial.secondary}
                alt="Detalle de producto"
                width={224}
                height={280}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:pl-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              La Merced PyK
            </p>
            <blockquote className="section-heading text-balance leading-tight">
              Los detalles no son detalles. Hacen el diseño.
            </blockquote>
            <p className="mt-4 font-[family-name:var(--font-heading)] text-lg italic text-muted-foreground">
              — Calidad que se nota en cada paso
            </p>
            <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">
              Desde calzado urbano hasta ropa para toda la familia. En La Merced
              encontrarás productos seleccionados con atención personalizada y
              precios justos.
            </p>
            {promo && (
              <div className="mt-8 inline-block border-l-4 border-accent pl-4">
                <p className="text-sm font-semibold uppercase tracking-wide">{promo.name}</p>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              </div>
            )}
            <Link href={PUBLIC_ROUTES.CATALOG} className="btn-bazu-fill mt-10 inline-flex">
              Explorar ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
