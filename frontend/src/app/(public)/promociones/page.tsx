'use client';

import { useQuery } from '@tanstack/react-query';
import { promotionsService } from '@/services/catalog.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Percent } from 'lucide-react';

export default function PromocionesPage() {
  const { data: promotions, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: promotionsService.listActive,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Promociones</h1>
      <p className="text-muted-foreground mb-8">Ofertas y descuentos vigentes</p>
      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : promotions?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{p.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                <Badge>
                  {p.discount_type === 'percentage'
                    ? `${p.discount_value}% OFF`
                    : `S/ ${p.discount_value} OFF`}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No hay promociones activas en este momento.</p>
      )}
    </div>
  );
}
