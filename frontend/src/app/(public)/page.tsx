import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La Merced PyK — Calzado, Ropa y Más',
  description:
    'Tienda online de Multiservicios La Merced PyK S.A.C. Calzado, prendas de vestir y productos para el hogar. Envíos y atención personalizada.',
  openGraph: {
    title: 'La Merced PyK',
    description: 'Calzado, ropa y más al mejor precio',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-blue-300 text-sm font-medium mb-4 tracking-wide uppercase">
              Multiservicios La Merced PyK S.A.C.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Calzado, ropa y estilo para toda la familia
            </h1>
            <p className="text-lg text-blue-100/90 mb-8 leading-relaxed">
              Descubre nuestra colección de calzado y prendas de vestir.
              Próximamente electrodomésticos y productos para el hogar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={PUBLIC_ROUTES.CATALOG} className={cn(buttonVariants({ size: 'lg' }))}>
                Ver catálogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={PUBLIC_ROUTES.PROMOTIONS}
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'border-white/30 text-white hover:bg-white/10')}
              >
                Ver promociones
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Truck, title: 'Delivery disponible', desc: 'Entregas en la ciudad' },
            { icon: Shield, title: 'Compra segura', desc: 'Múltiples métodos de pago' },
            { icon: Headphones, title: 'Atención 24/7', desc: 'Chat bot y soporte humano' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 rounded-xl border p-6">
              <Icon className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Explora por categoría</h2>
          <p className="text-muted-foreground mb-8">Calzado, ropa, accesorios y más</p>
          <Link href={PUBLIC_ROUTES.CATEGORIES} className={cn(buttonVariants())}>
            Ver categorías
          </Link>
        </div>
      </section>
    </>
  );
}
