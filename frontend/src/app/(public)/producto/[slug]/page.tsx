'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/catalog.service';
import { useCart } from '@/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';

export default function ProductoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsService.getById(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full max-w-lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Producto no encontrado</p>
      </div>
    );
  }

  const inStock = product.stock_quantity > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Imagen del producto</span>
        </div>
        <div className="space-y-6">
          {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-3xl font-bold text-primary">S/ {Number(product.sale_price).toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description ?? 'Sin descripción'}</p>
          <div className="flex items-center gap-4 text-sm">
            <span>SKU: {product.sku}</span>
            <span className={inStock ? 'text-green-600' : 'text-red-600'}>
              {inStock ? `${product.stock_quantity} disponibles` : 'Agotado'}
            </span>
          </div>
          <Button
            size="lg"
            disabled={!inStock}
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: Number(product.sale_price),
              })
            }
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
