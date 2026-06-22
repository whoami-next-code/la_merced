import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu, MessageCircle } from 'lucide-react';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface PublicHeaderProps {
  cartCount?: number;
}

export function PublicHeader({ cartCount = 0 }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-foreground text-background">
        <div className="container mx-auto flex h-9 items-center justify-center px-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]">
          Envíos en la ciudad · Hasta 10% en tu primera compra
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4 md:h-[4.5rem]">
          <Link
            href={PUBLIC_ROUTES.HOME}
            className="shrink-0 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight md:text-2xl"
          >
            La Merced <span className="text-accent">PyK</span>
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] lg:flex">
            {[
              { href: PUBLIC_ROUTES.CATALOG, label: 'Catálogo' },
              { href: PUBLIC_ROUTES.CATEGORIES, label: 'Categorías' },
              { href: PUBLIC_ROUTES.PROMOTIONS, label: 'Promociones' },
              { href: PUBLIC_ROUTES.CONTACT, label: 'Contacto' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-foreground/80 transition hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link
              href={PUBLIC_ROUTES.CATALOG}
              className="hidden rounded-full p-2.5 transition hover:bg-secondary sm:inline-flex"
              aria-label="Buscar"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.CHAT}
              className="rounded-full p-2.5 transition hover:bg-secondary"
              aria-label="Chat"
            >
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.FAVORITES}
              className="rounded-full p-2.5 transition hover:bg-secondary"
              aria-label="Favoritos"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.CART}
              className="relative rounded-full p-2.5 transition hover:bg-secondary"
              aria-label="Carrito"
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <Link
              href={PUBLIC_ROUTES.PROFILE}
              className="rounded-full p-2.5 transition hover:bg-secondary"
              aria-label="Perfil"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.CATALOG}
              className={cn('rounded-full p-2.5 transition hover:bg-secondary lg:hidden')}
            >
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
