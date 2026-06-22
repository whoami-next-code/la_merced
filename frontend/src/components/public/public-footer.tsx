import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/constants/routes';

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t bg-foreground text-background">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
              La Merced <span className="text-accent">PyK</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-background/60">
              Multiservicios La Merced PyK S.A.C. — calzado, ropa y accesorios con
              calidad y confianza para toda la familia.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">Tienda</h4>
            <ul className="mt-4 space-y-3 text-sm text-background/60">
              <li><Link href={PUBLIC_ROUTES.CATALOG} className="transition hover:text-background">Catálogo</Link></li>
              <li><Link href={PUBLIC_ROUTES.CATEGORIES} className="transition hover:text-background">Categorías</Link></li>
              <li><Link href={PUBLIC_ROUTES.PROMOTIONS} className="transition hover:text-background">Promociones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">Mi cuenta</h4>
            <ul className="mt-4 space-y-3 text-sm text-background/60">
              <li><Link href={PUBLIC_ROUTES.PROFILE} className="transition hover:text-background">Perfil</Link></li>
              <li><Link href={PUBLIC_ROUTES.ORDERS} className="transition hover:text-background">Mis pedidos</Link></li>
              <li><Link href={PUBLIC_ROUTES.ORDER_TRACK} className="transition hover:text-background">Seguimiento</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">Ayuda</h4>
            <ul className="mt-4 space-y-3 text-sm text-background/60">
              <li><Link href={PUBLIC_ROUTES.CONTACT} className="transition hover:text-background">Contacto</Link></li>
              <li><Link href={PUBLIC_ROUTES.CHAT} className="transition hover:text-background">Chat en línea</Link></li>
              <li><Link href={PUBLIC_ROUTES.LOGIN} className="transition hover:text-background">Iniciar sesión</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 text-center text-xs text-background/40 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Multiservicios La Merced PyK S.A.C.</p>
          <p className="uppercase tracking-[0.15em]">Diseño inspirado en experiencia boutique</p>
        </div>
      </div>
    </footer>
  );
}
