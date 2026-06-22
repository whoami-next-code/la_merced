'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { useCart } from '@/providers/cart-provider';
import { useFavorites } from '@/providers/favorites-provider';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const slug = product.slug ?? product.id;
  const image = product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const inStock = product.stock_quantity > 0;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={PUBLIC_ROUTES.PRODUCT(slug)} className="block">
        <div className="aspect-square bg-muted relative overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}
          {!inStock && (
            <Badge variant="secondary" className="absolute top-2 left-2">Agotado</Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <div>
          {product.category && (
            <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
          )}
          <Link href={PUBLIC_ROUTES.PRODUCT(slug)}>
            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <p className="text-lg font-bold mt-1">S/ {Number(product.sale_price).toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            disabled={!inStock}
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: Number(product.sale_price),
                image,
              })
            }
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Agregar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggle(product.id)}
            aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
