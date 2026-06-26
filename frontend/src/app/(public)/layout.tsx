'use client';

import { PublicHeaderWrapper } from '@/components/public/public-header-wrapper';
import { PublicFooter } from '@/components/public/public-footer';
import { CartProvider } from '@/providers/cart-provider';
import { FavoritesProvider } from '@/providers/favorites-provider';
import { AuthProvider } from '@/providers/auth-provider';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <div className="flex min-h-screen flex-col">
            <PublicHeaderWrapper />
            <main className="flex-1">{children}</main>
            <PublicFooter />
          </div>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
