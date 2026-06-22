'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { useCart } from '@/providers/cart-provider';
import { useFavorites } from '@/providers/favorites-provider';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'boutique';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const slug = product.slug ?? product.id;
  const image = product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const inStock = product.stock_quantity > 0;
  const isBoutique = variant === 'boutique';

  const handleAdd = () =>
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.sale_price),
      image,
    });

  return (
    <Card
      className={cn(
        'group overflow-hidden border-0 bg-transparent shadow-none',
        !isBoutique && 'border shadow-sm transition-shadow hover:shadow-md',
      )}
    >
      <div className="relative">
        <Link href={PUBLIC_ROUTES.PRODUCT(slug)} className="block">
          <div
            className={cn(
              'relative overflow-hidden bg-muted',
              isBoutique ? 'aspect-[3/4]' : 'aspect-square rounded-xl',
            )}
          >
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sin imagen
              </div>
            )}
            {!inStock && (
              <Badge className="absolute left-3 top-3 bg-foreground text-background">Agotado</Badge>
            )}
            {isBoutique && inStock && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground border-0">
                Nuevo
              </Badge>
            )}
          </div>
        </Link>

        {isBoutique && (
          <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              size="sm"
              className="flex-1 bg-foreground text-background hover:bg-foreground/90"
              disabled={!inStock}
              onClick={handleAdd}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Agregar
            </Button>
            <Link
              href={PUBLIC_ROUTES.PRODUCT(slug)}
              className="inline-flex h-8 items-center justify-center rounded-md bg-white/95 px-3 transition hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95"
              onClick={() => toggle(product.id)}
              aria-label="Favoritos"
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  isFavorite(product.id) && 'fill-accent text-accent',
                )}
              />
            </Button>
          </div>
        )}
      </div>

      <CardContent className={cn('p-0', isBoutique ? 'pt-4' : 'p-4 space-y-3')}>
        <div>
          {product.category && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <Link href={PUBLIC_ROUTES.PRODUCT(slug)}>
            <h3
              className={cn(
                'font-medium transition-colors hover:text-accent',
                isBoutique ? 'font-[family-name:var(--font-heading)] text-lg' : 'line-clamp-2',
              )}
            >
              {product.name}
            </h3>
          </Link>
          <p className={cn('mt-1 font-semibold', isBoutique ? 'text-base' : 'text-lg')}>
            S/ {Number(product.sale_price).toFixed(2)}
          </p>
        </div>

        {!isBoutique && (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" disabled={!inStock} onClick={handleAdd}>
              <ShoppingCart className="mr-1 h-4 w-4" />
              Agregar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggle(product.id)}
              aria-label="Favoritos"
            >
              <Heart
                className={cn('h-4 w-4', isFavorite(product.id) && 'fill-red-500 text-red-500')}
              />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
