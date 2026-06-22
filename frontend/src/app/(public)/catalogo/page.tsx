'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/public/product-card';
import { Input } from '@/components/ui/input';
import { useProducts, useCategories, useBrands } from '@/features/productos/hooks/use-products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function CatalogoPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>();
  const [brandId, setBrandId] = useState<string>();

  const { data, isLoading } = useProducts({ search: search || undefined, categoryId, brandId });
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <p className="text-muted-foreground mt-1">Encuentra calzado, ropa y accesorios</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={categoryId ?? 'all'} onValueChange={(v) => setCategoryId(v && v !== 'all' ? v : undefined)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={brandId ?? 'all'} onValueChange={(v) => setBrandId(v && v !== 'all' ? v : undefined)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands?.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : data?.data?.length ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">{data.total} productos encontrados</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground py-16">
          No se encontraron productos. Conecta la API para ver el catálogo.
        </p>
      )}
    </div>
  );
}
