import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categoryImage } from '@/lib/theme/images';
import { PUBLIC_ROUTES } from '@/constants/routes';
import type { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const items = categories.length
    ? categories
    : [
        { id: '1', name: 'Calzado', slug: 'calzado', description: 'Zapatos y zapatillas' },
        { id: '2', name: 'Ropa', slug: 'ropa', description: 'Prendas para todos' },
        { id: '3', name: 'Accesorios', slug: 'accesorios', description: 'Complementa tu estilo' },
      ];

  return (
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Explora
          </p>
          <h2 className="section-heading">Compra por categoría</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((cat, index) => (
            <Link
              key={cat.id}
              href={`${PUBLIC_ROUTES.CATALOG}?categoria=${cat.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-foreground"
            >
              <Image
                src={categoryImage(cat.slug)}
                alt={cat.name}
                fill
                className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  0{index + 1}
                </span>
                <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{cat.name}</h3>
                {'description' in cat && cat.description && (
                  <p className="mt-2 text-sm text-white/70 line-clamp-2">{cat.description}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-0 transition group-hover:opacity-100">
                  Descubrir <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
