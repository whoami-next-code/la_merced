import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu, MessageCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PUBLIC_ROUTES } from '@/constants/routes';

interface PublicHeaderProps {
  cartCount?: number;
}

export function PublicHeader({ cartCount = 0 }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold tracking-tight text-primary">La Merced PyK</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href={PUBLIC_ROUTES.CATALOG} className="hover:text-primary transition-colors">
            Catálogo
          </Link>
          <Link href={PUBLIC_ROUTES.CATEGORIES} className="hover:text-primary transition-colors">
            Categorías
          </Link>
          <Link href={PUBLIC_ROUTES.PROMOTIONS} className="hover:text-primary transition-colors">
            Promociones
          </Link>
          <Link href={PUBLIC_ROUTES.CONTACT} className="hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href={PUBLIC_ROUTES.CATALOG}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'hidden sm:inline-flex')}
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href={PUBLIC_ROUTES.CHAT}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
            aria-label="Chat de atención"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link
            href={PUBLIC_ROUTES.FAVORITES}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href={PUBLIC_ROUTES.CART}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative')}
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          <Link
            href={PUBLIC_ROUTES.PROFILE}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
            aria-label="Mi perfil"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link href={PUBLIC_ROUTES.CATALOG} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'lg:hidden')}>
            <Menu className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
