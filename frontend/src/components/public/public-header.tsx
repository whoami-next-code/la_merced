'use client';

import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  MessageCircle,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PublicHeaderProps {
  cartCount?: number;
}

const iconLinkClass =
  'inline-flex size-9 items-center justify-center rounded-full transition hover:bg-secondary';

export function PublicHeader({ cartCount = 0 }: PublicHeaderProps) {
  const { user, profile, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    window.location.href = PUBLIC_ROUTES.HOME;
  }

  const displayName =
    profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Cuenta';

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-foreground text-background">
        <div className="container mx-auto flex h-9 items-center justify-center px-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]">
          Envíos en la ciudad · 10% de descuento en tu primera compra al registrarte
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-[4.5rem]">
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
              className={cn(iconLinkClass, 'hidden sm:inline-flex')}
              aria-label="Buscar"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.CHAT}
              className={iconLinkClass}
              aria-label="Chat"
            >
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.FAVORITES}
              className={iconLinkClass}
              aria-label="Favoritos"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href={PUBLIC_ROUTES.CART}
              className={cn(iconLinkClass, 'relative')}
              aria-label="Carrito"
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={iconLinkClass}
                  aria-label={`Menú de ${displayName}`}
                >
                  <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={PUBLIC_ROUTES.PROFILE} className="w-full">
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={PUBLIC_ROUTES.ORDERS} className="w-full">
                      Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      void handleSignOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href={PUBLIC_ROUTES.LOGIN}
                  className={iconLinkClass}
                  aria-label="Iniciar sesión"
                  title="Iniciar sesión"
                >
                  <LogIn className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </Link>
                <Link
                  href={PUBLIC_ROUTES.REGISTER}
                  className={cn(iconLinkClass, 'text-accent')}
                  aria-label="Crear cuenta"
                  title="Crear cuenta"
                >
                  <UserPlus className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </Link>
                <div className="ml-1 hidden items-center gap-1 md:flex">
                  <Link href={PUBLIC_ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                      Entrar
                    </Button>
                  </Link>
                  <Link href={PUBLIC_ROUTES.REGISTER}>
                    <Button size="sm" className="gap-1.5 text-xs">
                      Registro
                    </Button>
                  </Link>
                </div>
              </>
            )}

            <Link
              href={PUBLIC_ROUTES.CATALOG}
              className={cn(iconLinkClass, 'lg:hidden')}
              aria-label="Menú"
            >
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
