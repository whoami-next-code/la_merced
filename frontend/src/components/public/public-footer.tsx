import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/constants/routes';

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-bold text-lg mb-3">La Merced PyK</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calzado, ropa y más. Multiservicios La Merced PyK S.A.C. — calidad y confianza.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Tienda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={PUBLIC_ROUTES.CATALOG} className="hover:text-foreground">Catálogo</Link></li>
              <li><Link href={PUBLIC_ROUTES.CATEGORIES} className="hover:text-foreground">Categorías</Link></li>
              <li><Link href={PUBLIC_ROUTES.PROMOTIONS} className="hover:text-foreground">Promociones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Mi cuenta</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={PUBLIC_ROUTES.PROFILE} className="hover:text-foreground">Perfil</Link></li>
              <li><Link href={PUBLIC_ROUTES.ORDERS} className="hover:text-foreground">Mis pedidos</Link></li>
              <li><Link href={PUBLIC_ROUTES.ORDER_TRACK} className="hover:text-foreground">Seguimiento</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Ayuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={PUBLIC_ROUTES.CONTACT} className="hover:text-foreground">Contacto</Link></li>
              <li><Link href={PUBLIC_ROUTES.CHAT} className="hover:text-foreground">Chat en línea</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Multiservicios La Merced PyK S.A.C. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
