'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/public/product-card';
import { PUBLIC_ROUTES } from '@/constants/routes';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'featured', label: 'Destacados' },
  { id: 'new', label: 'Novedades' },
  { id: 'popular', label: 'Más vendidos' },
] as const;

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('featured');

  const displayed =
    activeTab === 'new'
      ? [...products].reverse()
      : activeTab === 'popular'
        ? [...products].sort((a, b) => b.stock_quantity - a.stock_quantity)
        : products;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Colección
            </p>
            <h2 className="section-heading">Nuevos ingresos</h2>
          </div>
          <div className="flex flex-wrap gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors',
                  activeTab === tab.id
                    ? 'border-b-2 border-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {displayed.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayed.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} variant="boutique" />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            Próximamente nuevos productos en el catálogo.
          </p>
        )}

        <div className="mt-12 text-center">
          <Link href={PUBLIC_ROUTES.CATALOG} className="btn-bazu">
            Ver todo el catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
