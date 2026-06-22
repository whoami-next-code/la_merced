import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PedidosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Mis pedidos</h1>
      <p className="text-muted-foreground mb-8">Historial de compras y pedidos en línea</p>
      <p className="text-sm text-muted-foreground mb-4">Aún no tienes pedidos registrados.</p>
      <Link href={PUBLIC_ROUTES.ORDER_TRACK} className={cn(buttonVariants({ variant: 'outline' }))}>
        Rastrear un pedido
      </Link>
    </div>
  );
}
