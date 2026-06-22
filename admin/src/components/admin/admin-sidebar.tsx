'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Tag, Warehouse, ShoppingCart,
  Users, ClipboardList, BarChart3, Settings, LogOut, MessageCircle,
  Percent, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ADMIN_ROUTES, STORE_URL } from '@/constants/routes';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: ADMIN_ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ADMIN_ROUTES.PRODUCTS, label: 'Productos', icon: Package },
  { href: ADMIN_ROUTES.CATEGORIES, label: 'Categorías', icon: FolderTree },
  { href: ADMIN_ROUTES.BRANDS, label: 'Marcas', icon: Tag },
  { href: ADMIN_ROUTES.INVENTORY, label: 'Inventario', icon: Warehouse },
  { href: ADMIN_ROUTES.SALES, label: 'Ventas POS', icon: ShoppingCart },
  { href: ADMIN_ROUTES.CUSTOMERS, label: 'Clientes', icon: Users },
  { href: ADMIN_ROUTES.ORDERS, label: 'Pedidos', icon: ClipboardList },
  { href: ADMIN_ROUTES.PROMOTIONS, label: 'Promociones', icon: Percent },
  { href: ADMIN_ROUTES.USERS, label: 'Usuarios', icon: Shield },
  { href: ADMIN_ROUTES.REPORTS, label: 'Reportes', icon: BarChart3 },
  { href: ADMIN_ROUTES.CHATBOT, label: 'Chat Bot', icon: MessageCircle },
  { href: ADMIN_ROUTES.SETTINGS, label: 'Configuración', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push(ADMIN_ROUTES.LOGIN);
    router.refresh();
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-slate-950 text-slate-100">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
        <Package className="h-5 w-5 text-blue-400" />
        <div>
          <span className="font-bold text-sm">La Merced PyK</span>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Panel Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-800 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
        <a href={STORE_URL} className="block mt-2 text-center text-xs text-slate-500 hover:text-slate-300">
          ← Ir al portal público
        </a>
      </div>
    </aside>
  );
}
