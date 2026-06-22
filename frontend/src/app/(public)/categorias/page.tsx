'use client';

import Link from 'next/link';
import { useCategories } from '@/features/productos/hooks/use-products';
import { Card, CardContent } from '@/components/ui/card';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriasPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Categorías</h1>
      <p className="text-muted-foreground mb-8">Explora nuestro catálogo por categoría</p>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((cat) => (
            <Link key={cat.id} href={`${PUBLIC_ROUTES.CATALOG}?category=${cat.slug}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{cat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
